from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from app.models.request_models import (
    SentimentRequest,
    BatchSentimentRequest,
    TopicModelingRequest,
    EmotionAnalysisRequest
)
from app.models.response_models import (
    SentimentResponse,
    BatchSentimentResponse,
    TopicModelingResponse,
    EmotionAnalysisResponse,
    HealthResponse
)
from app.services.sentiment_analyzer import SentimentAnalyzer
from app.services.emotion_analyzer import EmotionAnalyzer
from app.services.topic_modeler import TopicModeler
from app.services.model_manager import ModelManager
from app.core.config import settings
from app.core.logging import logger

# Load environment variables
load_dotenv()

# Initialize model manager
model_manager = ModelManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    logger.info("Starting ML Service...")
    await model_manager.load_models()
    logger.info("Models loaded successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down ML Service...")
    await model_manager.cleanup()

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Sentiment Tracker - ML Service",
    description="Machine Learning microservice for sentiment analysis, emotion detection, and topic modeling",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure based on environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

# Initialize services
sentiment_analyzer = SentimentAnalyzer()
emotion_analyzer = EmotionAnalyzer()
topic_modeler = TopicModeler()

@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "AI-Powered Sentiment Tracker - ML Service",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        model_status = await model_manager.get_model_status()
        return HealthResponse(
            status="healthy",
            models_loaded=model_status["loaded"],
            total_models=model_status["total"],
            memory_usage=model_status["memory_usage"],
            uptime=model_status["uptime"]
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")

@app.post("/analyze", response_model=SentimentResponse)
async def analyze_sentiment(request: SentimentRequest):
    """Analyze sentiment of a single text"""
    try:
        logger.info(f"Analyzing sentiment for text: {request.text[:50]}...")
        
        result = await sentiment_analyzer.analyze(
            text=request.text,
            include_emotions=request.include_emotions,
            include_topics=request.include_topics
        )
        
        return SentimentResponse(**result)
    
    except Exception as e:
        logger.error(f"Sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze/batch", response_model=BatchSentimentResponse)
async def analyze_batch_sentiment(request: BatchSentimentRequest):
    """Analyze sentiment of multiple texts"""
    try:
        logger.info(f"Analyzing batch sentiment for {len(request.texts)} texts")
        
        results = await sentiment_analyzer.analyze_batch(
            texts=request.texts,
            include_emotions=request.include_emotions,
            include_topics=request.include_topics
        )
        
        return BatchSentimentResponse(results=results)
    
    except Exception as e:
        logger.error(f"Batch sentiment analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")

@app.post("/emotions", response_model=EmotionAnalysisResponse)
async def analyze_emotions(request: EmotionAnalysisRequest):
    """Analyze emotions in text"""
    try:
        logger.info(f"Analyzing emotions for text: {request.text[:50]}...")
        
        result = await emotion_analyzer.analyze(request.text)
        
        return EmotionAnalysisResponse(**result)
    
    except Exception as e:
        logger.error(f"Emotion analysis failed: {e}")
        raise HTTPException(status_code=500, detail=f"Emotion analysis failed: {str(e)}")

@app.post("/topics", response_model=TopicModelingResponse)
async def extract_topics(request: TopicModelingRequest):
    """Extract topics from texts"""
    try:
        logger.info(f"Extracting topics from {len(request.texts)} texts")
        
        result = await topic_modeler.extract_topics(
            texts=request.texts,
            num_topics=request.num_topics,
            min_topic_size=request.min_topic_size
        )
        
        return TopicModelingResponse(**result)
    
    except Exception as e:
        logger.error(f"Topic modeling failed: {e}")
        raise HTTPException(status_code=500, detail=f"Topic modeling failed: {str(e)}")

@app.post("/retrain")
async def retrain_models(background_tasks: BackgroundTasks):
    """Trigger model retraining (admin only)"""
    try:
        background_tasks.add_task(model_manager.retrain_models)
        return {"message": "Model retraining started in background"}
    
    except Exception as e:
        logger.error(f"Model retraining failed: {e}")
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

@app.get("/models/status")
async def get_model_status():
    """Get status of all loaded models"""
    try:
        status = await model_manager.get_model_status()
        return status
    
    except Exception as e:
        logger.error(f"Failed to get model status: {e}")
        raise HTTPException(status_code=500, detail=f"Status check failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
