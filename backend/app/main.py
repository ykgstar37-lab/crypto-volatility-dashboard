import asyncio
import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import price, volatility, backtest, signal, briefing
from app.scheduler import backfill_data, daily_fetch, init_db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    logger.info("Database initialized")

    # Backfill on first run
    await backfill_data(days=365)

    # Schedule daily fetch
    scheduler.add_job(
        lambda: asyncio.ensure_future(daily_fetch()),
        "cron",
        hour=0,
        minute=5,
        id="daily_fetch",
    )
    scheduler.start()
    logger.info("Scheduler started")

    yield

    # Shutdown
    scheduler.shutdown()


app = FastAPI(
    title="CryptoVol Dashboard API",
    description="Real-time Bitcoin volatility prediction using 5 GARCH models",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(price.router)
app.include_router(volatility.router)
app.include_router(backtest.router)
app.include_router(signal.router)
app.include_router(briefing.router)


@app.get("/api/health")
def health():
    return {"status": "ok"}
