import time
from typing import Dict, Any
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import torch
from datetime import datetime

from app.core.config import settings
from app.core.logging import logger

class EmotionAnalyzer:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.pipeline = None
        self.model_version = "1.0.0"
        
    async def load_model(self):
        """Load the emotion analysis model"""
        try:
            logger.info(f"Loading emotion model: {settings.EMOTION_MODEL}")
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(
                settings.EMOTION_MODEL,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            
            self.model = AutoModelForSequenceClassification.from_pretrained(
                settings.EMOTION_MODEL,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            
            # Create pipeline
            self.pipeline = pipeline(
                "text-classification",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if torch.cuda.is_available() else -1,
                return_all_scores=True
            )
            
            logger.info("Emotion model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load emotion model: {e}")
            raise
    
    def _normalize_emotions(self, results) -> Dict[str, float]:
        """Normalize emotion scores"""
        emotion_mapping = {
            'joy': 'joy',
            'anger': 'anger', 
            'sadness': 'sadness',
            'surprise': 'surprise',
            'fear': 'fear',
            'disgust': 'disgust'
        }
        
        emotions = {
            'joy': 0.0,
            'anger': 0.0,
            'sadness': 0.0,
            'surprise': 0.0,
            'fear': 0.0,
            'disgust': 0.0
        }
        
        # Map model outputs to our emotion categories
        for result in results:
            label = result['label'].lower()
            score = result['score']
            
            if label in emotion_mapping:
                emotions[emotion_mapping[label]] = score
            elif 'joy' in label or 'happy' in label:
                emotions['joy'] = score
            elif 'anger' in label or 'angry' in label:
                emotions['anger'] = score
            elif 'sad' in label:
                emotions['sadness'] = score
            elif 'surprise' in label:
                emotions['surprise'] = score
            elif 'fear' in label:
                emotions['fear'] = score
            elif 'disgust' in label:
                emotions['disgust'] = score
        
        return emotions
    
    def _get_dominant_emotion(self, emotions: Dict[str, float]) -> str:
        """Get the dominant emotion"""
        return max(emotions.items(), key=lambda x: x[1])[0]
    
    async def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze emotions in text"""
        start_time = time.time()
        
        try:
            if self.pipeline:
                # Use transformer model
                results = self.pipeline(text)[0]  # Get first (and only) result
                emotions = self._normalize_emotions(results)
            else:
                # Fallback: simple rule-based emotion detection
                emotions = self._simple_emotion_detection(text)
            
            dominant_emotion = self._get_dominant_emotion(emotions)
            
            return {
                "text": text,
                "emotions": emotions,
                "dominant_emotion": dominant_emotion,
                "processing_time": time.time() - start_time,
                "model_version": self.model_version,
                "timestamp": datetime.utcnow()
            }
            
        except Exception as e:
            logger.error(f"Emotion analysis failed: {e}")
            # Fallback to simple detection
            emotions = self._simple_emotion_detection(text)
            dominant_emotion = self._get_dominant_emotion(emotions)
            
            return {
                "text": text,
                "emotions": emotions,
                "dominant_emotion": dominant_emotion,
                "processing_time": time.time() - start_time,
                "model_version": f"{self.model_version}-fallback",
                "timestamp": datetime.utcnow()
            }
    
    def _simple_emotion_detection(self, text: str) -> Dict[str, float]:
        """Simple rule-based emotion detection as fallback"""
        text_lower = text.lower()
        
        # Emotion keywords
        joy_words = ['happy', 'joy', 'excited', 'love', 'amazing', 'great', 'wonderful', 'fantastic']
        anger_words = ['angry', 'mad', 'furious', 'hate', 'terrible', 'awful', 'worst']
        sadness_words = ['sad', 'depressed', 'disappointed', 'unhappy', 'crying', 'heartbroken']
        surprise_words = ['surprised', 'shocked', 'amazed', 'unexpected', 'wow', 'incredible']
        fear_words = ['scared', 'afraid', 'terrified', 'worried', 'anxious', 'nervous']
        disgust_words = ['disgusting', 'gross', 'revolting', 'sick', 'nasty', 'repulsive']
        
        emotions = {
            'joy': sum(1 for word in joy_words if word in text_lower) / len(joy_words),
            'anger': sum(1 for word in anger_words if word in text_lower) / len(anger_words),
            'sadness': sum(1 for word in sadness_words if word in text_lower) / len(sadness_words),
            'surprise': sum(1 for word in surprise_words if word in text_lower) / len(surprise_words),
            'fear': sum(1 for word in fear_words if word in text_lower) / len(fear_words),
            'disgust': sum(1 for word in disgust_words if word in text_lower) / len(disgust_words)
        }
        
        # Normalize scores
        max_score = max(emotions.values()) if max(emotions.values()) > 0 else 1
        emotions = {k: v / max_score for k, v in emotions.items()}
        
        return emotions
