import math
from datetime import date

import httpx
import numpy as np
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.price import CoinDaily
from app.services.rate_limit import briefing_limiter, get_client_ip

router = APIRouter(prefix="/api/briefing", tags=["briefing"])

# Daily cache: key = (date, lang) → response
_briefing_cache: dict[tuple, dict] = {}


def _build_market_context(db: Session) -> dict:
    """Gather current market data for the AI prompt."""
    rows = (
        db.query(CoinDaily)
        .filter(CoinDaily.symbol == "BTC")
        .order_by(desc(CoinDaily.date))
        .limit(30)
        .all()
    )
    rows.reverse()
    if len(rows) < 7:
        return {}

    latest = rows[-1]
    prev = rows[-2] if len(rows) >= 2 else latest
    week_ago = rows[-8] if len(rows) >= 8 else rows[0]

    returns = np.array([r.log_return or 0 for r in rows])
    vol_7d = float(np.std(returns[-7:])) * math.sqrt(365) * 100
    vol_30d = float(np.std(returns)) * math.sqrt(365) * 100

    fng_recent = [r.fng for r in rows[-7:] if r.fng is not None]
    fng_avg = sum(fng_recent) / len(fng_recent) if fng_recent else 50

    price_24h = ((latest.close / prev.close) - 1) * 100 if prev.close else 0
    price_7d = ((latest.close / week_ago.close) - 1) * 100 if week_ago.close else 0

    return {
        "price": latest.close,
        "price_24h_change": round(price_24h, 2),
        "price_7d_change": round(price_7d, 2),
        "fng": latest.fng,
        "fng_7d_avg": round(fng_avg, 1),
        "vol_7d": round(vol_7d, 1),
        "vol_30d": round(vol_30d, 1),
        "date": latest.date.isoformat(),
    }


@router.get("")
async def get_briefing(request: Request, lang: str = Query(default="ko"), db: Session = Depends(get_db)):
    """AI-powered daily BTC market briefing (cached per day + language)."""
    briefing_limiter.check(get_client_ip(request))

    if not settings.openai_api_key:
        return {"briefing": "OpenAI API key not configured.", "disclaimer": ""}

    # Return cached briefing if already generated today
    cache_key = (date.today(), lang)
    if cache_key in _briefing_cache:
        return _briefing_cache[cache_key]

    ctx = _build_market_context(db)
    if not ctx:
        return {"briefing": "Not enough data for briefing.", "disclaimer": ""}

    if lang == "ko":
        system_prompt = """당신은 비트코인 시장 전문 분석가입니다.
날씨 예보처럼 친근하고 이해하기 쉽게 오늘의 비트코인 시장을 브리핑해주세요.
반드시 다음 구조로 답변하세요:
1. 오늘의 시장 날씨 (한줄 요약, 날씨 비유)
2. 가격 동향 분석 (24h, 7d 변화)
3. 공포탐욕지수 해석
4. 변동성 상황
5. 추천 행동 (매수/매도/관망 중 하나, 간단한 이유)
답변은 300자 이내로 간결하게."""

        user_prompt = f"""오늘({ctx['date']}) 비트코인 시장 데이터:
- 현재 가격: ${ctx['price']:,.0f}
- 24시간 변동: {ctx['price_24h_change']:+.2f}%
- 7일 변동: {ctx['price_7d_change']:+.2f}%
- 공포탐욕지수: {ctx['fng']} (7일 평균: {ctx['fng_7d_avg']})
- 7일 변동성: {ctx['vol_7d']:.1f}% (30일: {ctx['vol_30d']:.1f}%)

위 데이터를 바탕으로 오늘의 비트코인 시장 브리핑을 해주세요."""

        disclaimer = "⚠️ AI 분석은 참고용이며, 투자 권유가 아닙니다. AI가 부정확한 정보를 생성할 수 있으니 반드시 본인의 판단으로 투자 결정을 내리세요."
    else:
        system_prompt = """You are a Bitcoin market analyst.
Give a friendly, weather-report style daily BTC market briefing.
Structure your response:
1. Today's Market Weather (one-line summary with weather analogy)
2. Price Trend (24h, 7d changes)
3. Fear & Greed Index interpretation
4. Volatility situation
5. Recommended action (Buy/Sell/Hold with brief reason)
Keep it under 300 characters, concise and clear."""

        user_prompt = f"""Today's ({ctx['date']}) Bitcoin market data:
- Current Price: ${ctx['price']:,.0f}
- 24h Change: {ctx['price_24h_change']:+.2f}%
- 7d Change: {ctx['price_7d_change']:+.2f}%
- Fear & Greed Index: {ctx['fng']} (7d avg: {ctx['fng_7d_avg']})
- 7d Volatility: {ctx['vol_7d']:.1f}% (30d: {ctx['vol_30d']:.1f}%)

Please provide today's BTC market briefing based on the data above."""

        disclaimer = "⚠️ AI analysis is for reference only, not financial advice. AI may generate inaccurate information. Always make investment decisions based on your own judgment."

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.openai_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-4o-mini",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt},
                    ],
                    "max_tokens": 500,
                    "temperature": 0.7,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            briefing = data["choices"][0]["message"]["content"]
    except Exception as e:
        briefing = f"AI briefing unavailable: {str(e)}"

    result = {
        "briefing": briefing,
        "disclaimer": disclaimer,
        "context": ctx,
    }

    # Cache successful briefings for the rest of the day
    if "unavailable" not in briefing:
        _briefing_cache[cache_key] = result

    return result
