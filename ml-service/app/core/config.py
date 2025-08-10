from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Model Configuration
    MODEL_CACHE_DIR: str = "./models"
    HUGGINGFACE_API_KEY: str = ""
    
    # Sentiment Analysis Models
    SENTIMENT_MODEL: str = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    EMOTION_MODEL: str = "j-hartmann/emotion-english-distilroberta-base"
    
    # Topic Modeling Configuration
    MIN_TOPIC_SIZE: int = 10
    MAX_TOPICS: int = 50
    
    # Database Configuration (optional for caching)
    MONGODB_URI: str = "mongodb://localhost:27017/sentiment-tracker"
    REDIS_URL: str = "redis://localhost:6379"
    
    # Performance Settings
    BATCH_SIZE: int = 32
    MAX_LENGTH: int = 512
    NUM_WORKERS: int = 4
    
    # API Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    # Monitoring
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 8001
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
