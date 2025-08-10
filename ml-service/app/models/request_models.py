from pydantic import BaseModel, Field
from typing import List, Optional

class SentimentRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to analyze")
    include_emotions: bool = Field(default=False, description="Include emotion analysis")
    include_topics: bool = Field(default=False, description="Include topic extraction")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "I love this product! It's amazing and works perfectly.",
                "include_emotions": True,
                "include_topics": False
            }
        }

class BatchSentimentRequest(BaseModel):
    texts: List[str] = Field(..., min_items=1, max_items=100, description="List of texts to analyze")
    include_emotions: bool = Field(default=False, description="Include emotion analysis")
    include_topics: bool = Field(default=False, description="Include topic extraction")
    
    class Config:
        json_schema_extra = {
            "example": {
                "texts": [
                    "I love this product!",
                    "This is terrible quality.",
                    "It's okay, nothing special."
                ],
                "include_emotions": True,
                "include_topics": True
            }
        }

class EmotionAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000, description="Text to analyze for emotions")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "I'm so excited about this new feature! It makes me really happy."
            }
        }

class TopicModelingRequest(BaseModel):
    texts: List[str] = Field(..., min_items=5, max_items=1000, description="List of texts for topic modeling")
    num_topics: Optional[int] = Field(default=10, ge=2, le=50, description="Number of topics to extract")
    min_topic_size: Optional[int] = Field(default=10, ge=5, le=100, description="Minimum topic size")
    
    class Config:
        json_schema_extra = {
            "example": {
                "texts": [
                    "The battery life is excellent",
                    "Great camera quality",
                    "Fast shipping and delivery",
                    "Customer service was helpful",
                    "Product quality is outstanding"
                ],
                "num_topics": 5,
                "min_topic_size": 10
            }
        }
