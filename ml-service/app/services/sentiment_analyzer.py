import asyncio
import time
from typing import List, Dict, Any, Optional
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import torch
from datetime import datetime

from app.core.config import settings
from app.core.logging import logger

class SentimentAnalyzer:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.pipeline = None
        self.vader_analyzer = SentimentIntensityAnalyzer()
        self.model_version = "1.0.0"
        
    async def load_model(self):
        """Load the sentiment analysis model"""
        try:
            logger.info(f"Loading sentiment model: {settings.SENTIMENT_MODEL}")
            
            # Load tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(
                settings.SENTIMENT_MODEL,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            
            self.model = AutoModelForSequenceClassification.from_pretrained(
                settings.SENTIMENT_MODEL,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            
            # Create pipeline
            self.pipeline = pipeline(
                "sentiment-analysis",
                model=self.model,
                tokenizer=self.tokenizer,
                device=0 if torch.cuda.is_available() else -1,
                batch_size=settings.BATCH_SIZE
            )
            
            logger.info("Sentiment model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {e}")
            raise
    
    def _normalize_sentiment(self, label: str, score: float) -> tuple[str, float]:
        """Normalize sentiment labels and scores"""
        label_mapping = {
            'LABEL_0': 'negative',
            'LABEL_1': 'neutral', 
            'LABEL_2': 'positive',
            'NEGATIVE': 'negative',
            'NEUTRAL': 'neutral',
            'POSITIVE': 'positive'
        }
        
        normalized_label = label_mapping.get(label.upper(), label.lower())
        return normalized_label, float(score)
    
    def _get_vader_sentiment(self, text: str) -> tuple[str, float]:
        """Get sentiment using VADER (fallback method)"""
        scores = self.vader_analyzer.polarity_scores(text)
        compound = scores['compound']
        
        if compound >= 0.05:
            return 'positive', abs(compound)
        elif compound <= -0.05:
            return 'negative', abs(compound)
        else:
            return 'neutral', 1 - abs(compound)
    
    async def analyze(
        self, 
        text: str, 
        include_emotions: bool = False,
        include_topics: bool = False
    ) -> Dict[str, Any]:
        """Analyze sentiment of a single text"""
        start_time = time.time()
        
        try:
            # Primary analysis with transformer model
            if self.pipeline:
                result = self.pipeline(text)[0]
                sentiment, confidence = self._normalize_sentiment(
                    result['label'], 
                    result['score']
                )
            else:
                # Fallback to VADER
                sentiment, confidence = self._get_vader_sentiment(text)
            
            response = {
                "text": text,
                "sentiment": sentiment,
                "confidence": confidence,
                "processing_time": time.time() - start_time,
                "model_version": self.model_version,
                "timestamp": datetime.utcnow()
            }
            
            # Add emotions if requested (placeholder for now)
            if include_emotions:
                response["emotions"] = {
                    "joy": 0.8 if sentiment == 'positive' else 0.2,
                    "anger": 0.7 if sentiment == 'negative' else 0.1,
                    "sadness": 0.6 if sentiment == 'negative' else 0.1,
                    "surprise": 0.3,
                    "fear": 0.2 if sentiment == 'negative' else 0.05,
                    "disgust": 0.4 if sentiment == 'negative' else 0.05
                }
            
            # Add topics if requested (placeholder for now)
            if include_topics:
                # Simple keyword extraction as placeholder
                words = text.lower().split()
                topics = [word for word in words if len(word) > 4][:5]
                response["topics"] = topics
            
            return response
            
        except Exception as e:
            logger.error(f"Sentiment analysis failed: {e}")
            # Fallback to VADER
            sentiment, confidence = self._get_vader_sentiment(text)
            return {
                "text": text,
                "sentiment": sentiment,
                "confidence": confidence,
                "processing_time": time.time() - start_time,
                "model_version": f"{self.model_version}-fallback",
                "timestamp": datetime.utcnow()
            }
    
    async def analyze_batch(
        self, 
        texts: List[str], 
        include_emotions: bool = False,
        include_topics: bool = False
    ) -> List[Dict[str, Any]]:
        """Analyze sentiment of multiple texts"""
        start_time = time.time()
        
        try:
            # Process in batches for efficiency
            results = []
            batch_size = settings.BATCH_SIZE
            
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                
                if self.pipeline:
                    # Use transformer pipeline for batch processing
                    batch_results = self.pipeline(batch)
                    
                    for text, result in zip(batch, batch_results):
                        sentiment, confidence = self._normalize_sentiment(
                            result['label'], 
                            result['score']
                        )
                        
                        response = {
                            "text": text,
                            "sentiment": sentiment,
                            "confidence": confidence,
                            "processing_time": (time.time() - start_time) / len(texts),
                            "model_version": self.model_version,
                            "timestamp": datetime.utcnow()
                        }
                        
                        if include_emotions:
                            response["emotions"] = {
                                "joy": 0.8 if sentiment == 'positive' else 0.2,
                                "anger": 0.7 if sentiment == 'negative' else 0.1,
                                "sadness": 0.6 if sentiment == 'negative' else 0.1,
                                "surprise": 0.3,
                                "fear": 0.2 if sentiment == 'negative' else 0.05,
                                "disgust": 0.4 if sentiment == 'negative' else 0.05
                            }
                        
                        if include_topics:
                            words = text.lower().split()
                            topics = [word for word in words if len(word) > 4][:5]
                            response["topics"] = topics
                        
                        results.append(response)
                else:
                    # Fallback to VADER for each text
                    for text in batch:
                        sentiment, confidence = self._get_vader_sentiment(text)
                        results.append({
                            "text": text,
                            "sentiment": sentiment,
                            "confidence": confidence,
                            "processing_time": (time.time() - start_time) / len(texts),
                            "model_version": f"{self.model_version}-fallback",
                            "timestamp": datetime.utcnow()
                        })
            
            return results
            
        except Exception as e:
            logger.error(f"Batch sentiment analysis failed: {e}")
            # Fallback processing
            results = []
            for text in texts:
                sentiment, confidence = self._get_vader_sentiment(text)
                results.append({
                    "text": text,
                    "sentiment": sentiment,
                    "confidence": confidence,
                    "processing_time": (time.time() - start_time) / len(texts),
                    "model_version": f"{self.model_version}-fallback",
                    "timestamp": datetime.utcnow()
                })
            return results
