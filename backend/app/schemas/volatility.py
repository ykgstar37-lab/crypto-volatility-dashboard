from datetime import date
from pydantic import BaseModel


class PriceCurrent(BaseModel):
    price: float
    change_24h: float
    volume_24h: float
    fng: int | None = None
    fng_label: str | None = None
    timestamp: int


class PriceHistory(BaseModel):
    date: date
    close: float
    volume: float
    fng: int | None = None
    log_return: float | None = None


class ModelPrediction(BaseModel):
    model: str
    sigma: float
    annualized_vol: float


class VolatilityPredict(BaseModel):
    predictions: list[ModelPrediction]
    risk_score: float
    risk_label: str


class VolatilityCompareRow(BaseModel):
    date: date
    realized: float | None = None
    garch: float | None = None
    tgarch: float | None = None
    har_garch: float | None = None
    har_tgarch: float | None = None
    har_tgarch_x: float | None = None


class BacktestMetric(BaseModel):
    model: str
    mse: float
    rmse: float
    mape: float
    mae: float
    r2: float


class BacktestResult(BaseModel):
    start: date
    end: date
    models: list[BacktestMetric]
