from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/crypto.db"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    coingecko_base_url: str = "https://api.coingecko.com/api/v3"
    fng_base_url: str = "https://api.alternative.me/fng/"
    openai_api_key: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
