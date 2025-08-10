import asyncio
import time
import psutil
from typing import Dict, Any
from datetime import datetime

from app.services.sentiment_analyzer import SentimentAnalyzer
from app.services.emotion_analyzer import EmotionAnalyzer
from app.services.topic_modeler import TopicModeler
from app.core.logging import logger

class ModelManager:
    def __init__(self):
        self.sentiment_analyzer = SentimentAnalyzer()
        self.emotion_analyzer = EmotionAnalyzer()
        self.topic_modeler = TopicModeler()
        self.start_time = time.time()
        self.models_loaded = 0
        self.total_models = 3
        
    async def load_models(self):
        """Load all ML models"""
        try:
            logger.info("Starting model loading process...")
            
            # Load models concurrently for faster startup
            tasks = [
                self.sentiment_analyzer.load_model(),
                self.emotion_analyzer.load_model(),
                self.topic_modeler.load_model()
            ]
            
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Check results and count successful loads
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    logger.error(f"Failed to load model {i}: {result}")
                else:
                    self.models_loaded += 1
            
            logger.info(f"Model loading complete: {self.models_loaded}/{self.total_models} models loaded")
            
        except Exception as e:
            logger.error(f"Model loading failed: {e}")
            raise
    
    async def get_model_status(self) -> Dict[str, Any]:
        """Get status of all models and system resources"""
        try:
            # Get memory usage
            memory = psutil.virtual_memory()
            
            return {
                "loaded": self.models_loaded,
                "total": self.total_models,
                "memory_usage": {
                    "total": f"{memory.total / (1024**3):.2f}GB",
                    "available": f"{memory.available / (1024**3):.2f}GB",
                    "percent": memory.percent
                },
                "uptime": time.time() - self.start_time,
                "models": {
                    "sentiment_analyzer": self.sentiment_analyzer.pipeline is not None,
                    "emotion_analyzer": self.emotion_analyzer.pipeline is not None,
                    "topic_modeler": self.topic_modeler.model is not None
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to get model status: {e}")
            return {
                "loaded": 0,
                "total": self.total_models,
                "memory_usage": {"error": str(e)},
                "uptime": time.time() - self.start_time,
                "models": {}
            }
    
    async def retrain_models(self):
        """Retrain models with new data (placeholder for future implementation)"""
        try:
            logger.info("Starting model retraining process...")
            
            # Placeholder for retraining logic
            # In production, this would:
            # 1. Fetch new training data
            # 2. Retrain models
            # 3. Validate performance
            # 4. Replace old models if performance is better
            
            await asyncio.sleep(5)  # Simulate training time
            
            logger.info("Model retraining completed successfully")
            
        except Exception as e:
            logger.error(f"Model retraining failed: {e}")
            raise
    
    async def cleanup(self):
        """Cleanup resources on shutdown"""
        try:
            logger.info("Cleaning up model resources...")
            
            # Clear model references to free memory
            if hasattr(self.sentiment_analyzer, 'model'):
                del self.sentiment_analyzer.model
                del self.sentiment_analyzer.tokenizer
                del self.sentiment_analyzer.pipeline
            
            if hasattr(self.emotion_analyzer, 'model'):
                del self.emotion_analyzer.model
                del self.emotion_analyzer.tokenizer
                del self.emotion_analyzer.pipeline
            
            if hasattr(self.topic_modeler, 'model'):
                del self.topic_modeler.model
            
            logger.info("Model cleanup completed")
            
        except Exception as e:
            logger.error(f"Model cleanup failed: {e}")
