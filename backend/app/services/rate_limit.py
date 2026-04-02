"""
Simple in-memory rate limiter per client IP.
No external dependencies — uses a sliding window counter.
"""
import time
from collections import defaultdict

from fastapi import HTTPException, Request


class RateLimiter:
    """Sliding window rate limiter."""

    def __init__(self, max_requests: int, window_seconds: int):
        self.max_requests = max_requests
        self.window = window_seconds
        self._hits: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str):
        now = time.time()
        cutoff = now - self.window
        # Remove expired timestamps
        self._hits[key] = [t for t in self._hits[key] if t > cutoff]

        if len(self._hits[key]) >= self.max_requests:
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Max {self.max_requests} requests per {self.window}s.",
            )
        self._hits[key].append(now)


# Shared limiters for expensive endpoints
briefing_limiter = RateLimiter(max_requests=5, window_seconds=60)
portfolio_limiter = RateLimiter(max_requests=10, window_seconds=60)


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"
