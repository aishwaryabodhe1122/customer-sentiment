from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class EmotionScores(BaseModel):
    joy: float = Field(..., ge=0, le=1, description="Joy emotion score")
    anger: float = Field(..., ge=0, le=1, description="Anger emotion score")
    sadness: float = Field(..., ge=0, le=1, description="Sadness emotion score")
    surprise: float = Field(..., ge=0, le=1, description="Surprise emotion score")
    fear: float = Field(..., ge=0, le=1, description="Fear emotion score")
    disgust: float = Field(..., ge=0, le=1, description="Disgust emotion score")

class SentimentResponse(BaseModel):
    text: str = Field(..., description="Original text analyzed")
    sentiment: str = Field(..., description="Predicted sentiment (positive, negative, neutral)")
    confidence: float = Field(..., ge=0, le=1, description="Confidence score")
    emotions: Optional[EmotionScores] = Field(None, description="Emotion scores if requested")
    topics: Optional[List[str]] = Field(None, description="Extracted topics if requested")
    processing_time: float = Field(..., description="Processing time in seconds")
    model_version: str = Field(..., description="Model version used")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Analysis timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "I love this product! It's amazing.",
                "sentiment": "positive",
                "confidence": 0.95,
                "emotions": {
                    "joy": 0.8,
                    "anger": 0.1,
                    "sadness": 0.05,
                    "surprise": 0.3,
                    "fear": 0.02,
                    "disgust": 0.01
                },
                "topics": ["product", "quality"],
                "processing_time": 0.15,
                "model_version": "1.0.0",
                "timestamp": "2024-01-10T15:30:00Z"
            }
        }

class BatchSentimentResponse(BaseModel):
    results: List[SentimentResponse] = Field(..., description="List of sentiment analysis results")
    total_processed: int = Field(..., description="Total number of texts processed")
    average_confidence: float = Field(..., description="Average confidence across all results")
    processing_time: float = Field(..., description="Total processing time in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "results": [
                    {
                        "text": "I love this!",
                        "sentiment": "positive",
                        "confidence": 0.95,
                        "processing_time": 0.1,
                        "model_version": "1.0.0",
                        "timestamp": "2024-01-10T15:30:00Z"
                    }
                ],
                "total_processed": 1,
                "average_confidence": 0.95,
                "processing_time": 0.1
            }
        }

class EmotionAnalysisResponse(BaseModel):
    text: str = Field(..., description="Original text analyzed")
    emotions: EmotionScores = Field(..., description="Emotion scores")
    dominant_emotion: str = Field(..., description="Most prominent emotion")
    processing_time: float = Field(..., description="Processing time in seconds")
    model_version: str = Field(..., description="Model version used")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Analysis timestamp")

class Topic(BaseModel):
    id: int = Field(..., description="Topic ID")
    name: str = Field(..., description="Topic name/label")
    keywords: List[str] = Field(..., description="Top keywords for this topic")
    size: int = Field(..., description="Number of documents in this topic")
    coherence_score: float = Field(..., description="Topic coherence score")

class TopicModelingResponse(BaseModel):
    topics: List[Topic] = Field(..., description="Extracted topics")
    num_topics: int = Field(..., description="Number of topics found")
    total_documents: int = Field(..., description="Total documents processed")
    processing_time: float = Field(..., description="Processing time in seconds")
    model_version: str = Field(..., description="Model version used")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Analysis timestamp")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service health status")
    models_loaded: int = Field(..., description="Number of models loaded")
    total_models: int = Field(..., description="Total number of models")
    memory_usage: Dict[str, Any] = Field(..., description="Memory usage statistics")
    uptime: float = Field(..., description="Service uptime in seconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Health check timestamp")
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "models_loaded": 3,
                "total_models": 3,
                "memory_usage": {
                    "total": "2.5GB",
                    "available": "1.2GB",
                    "percent": 67.5
                },
                "uptime": 3600.0,
                "timestamp": "2024-01-10T15:30:00Z"
            }
        }
