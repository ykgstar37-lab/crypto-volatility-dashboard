import math

from sqlalchemy import Column, Date, Float, Integer

from app.database import Base


class BtcDaily(Base):
    __tablename__ = "btc_daily"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(Date, unique=True, nullable=False, index=True)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float, nullable=False)
    volume = Column(Float)
    fng = Column(Integer)
    log_return = Column(Float)

    def compute_log_return(self, prev_close: float):
        if prev_close and prev_close > 0 and self.close and self.close > 0:
            self.log_return = math.log(self.close / prev_close)
