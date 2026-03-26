import asyncio
import math
import logging
from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app.models.price import BtcDaily, Base
from app.services import coingecko

logger = logging.getLogger(__name__)


async def backfill_data(days: int = 365):
    """Fetch historical data and populate the database."""
    db = SessionLocal()
    try:
        existing = db.query(BtcDaily).count()
        if existing > 100:
            logger.info(f"DB already has {existing} rows, skipping backfill")
            return

        logger.info(f"Backfilling {days} days of data...")
        chart = await coingecko.get_market_chart(days=days)
        fng_map = await coingecko.get_fng_history(days=days)

        # Deduplicate by date (CoinGecko can return duplicates)
        seen = set()
        unique_chart = []
        for item in chart:
            d = item["date"]
            if d not in seen:
                seen.add(d)
                unique_chart.append(item)

        prev_close = None
        for item in unique_chart:
            d = item["date"]
            existing_row = db.query(BtcDaily).filter(BtcDaily.date == d).first()
            if existing_row:
                prev_close = existing_row.close
                continue

            row = BtcDaily(
                date=d,
                close=item["close"],
                volume=item["volume"],
                fng=fng_map.get(d),
            )
            if prev_close:
                row.compute_log_return(prev_close)
            prev_close = item["close"]

            db.add(row)

        db.commit()
        logger.info(f"Backfilled {db.query(BtcDaily).count()} total rows")
    except Exception as e:
        logger.error(f"Backfill error: {e}")
        db.rollback()
    finally:
        db.close()


async def daily_fetch():
    """Fetch yesterday's data."""
    db = SessionLocal()
    try:
        chart = await coingecko.get_market_chart(days=2)
        fng_list = await coingecko.get_fng(limit=2)
        fng_map = {f["date"]: f["value"] for f in fng_list}

        last_row = db.query(BtcDaily).order_by(BtcDaily.date.desc()).first()
        prev_close = last_row.close if last_row else None

        for item in chart:
            d = item["date"]
            if db.query(BtcDaily).filter(BtcDaily.date == d).first():
                continue

            row = BtcDaily(
                date=d,
                close=item["close"],
                volume=item["volume"],
                fng=fng_map.get(d),
            )
            if prev_close:
                row.compute_log_return(prev_close)
            prev_close = item["close"]
            db.add(row)

        db.commit()
        logger.info("Daily fetch complete")
    except Exception as e:
        logger.error(f"Daily fetch error: {e}")
        db.rollback()
    finally:
        db.close()


def init_db():
    """Create tables if not exist."""
    Base.metadata.create_all(bind=engine)
