import time
from typing import List, Dict, Any
from bertopic import BERTopic
from sklearn.feature_extraction.text import TfidfVectorizer
from datetime import datetime
import re

from app.core.config import settings
from app.core.logging import logger

class TopicModeler:
    def __init__(self):
        self.model = None
        self.model_version = "1.0.0"
        
    async def load_model(self):
        """Load the topic modeling components"""
        try:
            logger.info("Initializing BERTopic model")
            
            # Initialize BERTopic with custom settings
            self.model = BERTopic(
                min_topic_size=settings.MIN_TOPIC_SIZE,
                nr_topics=settings.MAX_TOPICS,
                calculate_probabilities=True,
                verbose=True
            )
            
            logger.info("Topic modeling components loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load topic modeling components: {e}")
            raise
    
    def _preprocess_texts(self, texts: List[str]) -> List[str]:
        """Preprocess texts for topic modeling"""
        processed_texts = []
        
        for text in texts:
            # Remove URLs, mentions, hashtags
            text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
            text = re.sub(r'@\w+|#\w+', '', text)
            
            # Remove extra whitespace
            text = ' '.join(text.split())
            
            # Filter out very short texts
            if len(text.split()) >= 3:
                processed_texts.append(text)
        
        return processed_texts
    
    def _extract_topic_keywords(self, topic_words: List[tuple]) -> List[str]:
        """Extract keywords from topic word tuples"""
        return [word for word, _ in topic_words[:10]]  # Top 10 keywords
    
    def _calculate_coherence_score(self, topic_id: int) -> float:
        """Calculate a simple coherence score for a topic"""
        # Placeholder implementation - in production, use proper coherence metrics
        return 0.5 + (topic_id % 5) * 0.1  # Mock coherence between 0.5-0.9
    
    async def extract_topics(
        self, 
        texts: List[str], 
        num_topics: int = 10,
        min_topic_size: int = 10
    ) -> Dict[str, Any]:
        """Extract topics from a collection of texts"""
        start_time = time.time()
        
        try:
            # Preprocess texts
            processed_texts = self._preprocess_texts(texts)
            
            if len(processed_texts) < min_topic_size:
                raise ValueError(f"Need at least {min_topic_size} valid texts for topic modeling")
            
            if self.model:
                # Use BERTopic for topic extraction
                topics, probabilities = self.model.fit_transform(processed_texts)
                topic_info = self.model.get_topic_info()
                
                # Extract topic details
                extracted_topics = []
                for idx, row in topic_info.iterrows():
                    if row['Topic'] != -1:  # Skip outlier topic
                        topic_words = self.model.get_topic(row['Topic'])
                        keywords = self._extract_topic_keywords(topic_words)
                        
                        extracted_topics.append({
                            "id": int(row['Topic']),
                            "name": f"Topic {row['Topic']}: {keywords[0] if keywords else 'Unknown'}",
                            "keywords": keywords,
                            "size": int(row['Count']),
                            "coherence_score": self._calculate_coherence_score(row['Topic'])
                        })
                
                # Sort by size (most common topics first)
                extracted_topics.sort(key=lambda x: x['size'], reverse=True)
                
                # Limit to requested number of topics
                extracted_topics = extracted_topics[:num_topics]
                
            else:
                # Fallback: simple TF-IDF based topic extraction
                extracted_topics = self._simple_topic_extraction(processed_texts, num_topics)
            
            return {
                "topics": extracted_topics,
                "num_topics": len(extracted_topics),
                "total_documents": len(processed_texts),
                "processing_time": time.time() - start_time,
                "model_version": self.model_version,
                "timestamp": datetime.utcnow()
            }
            
        except Exception as e:
            logger.error(f"Topic modeling failed: {e}")
            # Fallback to simple extraction
            processed_texts = self._preprocess_texts(texts)
            extracted_topics = self._simple_topic_extraction(processed_texts, num_topics)
            
            return {
                "topics": extracted_topics,
                "num_topics": len(extracted_topics),
                "total_documents": len(processed_texts),
                "processing_time": time.time() - start_time,
                "model_version": f"{self.model_version}-fallback",
                "timestamp": datetime.utcnow()
            }
    
    def _simple_topic_extraction(self, texts: List[str], num_topics: int) -> List[Dict[str, Any]]:
        """Simple TF-IDF based topic extraction as fallback"""
        try:
            # Use TF-IDF to find important terms
            vectorizer = TfidfVectorizer(
                max_features=100,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=2
            )
            
            tfidf_matrix = vectorizer.fit_transform(texts)
            feature_names = vectorizer.get_feature_names_out()
            
            # Get top terms
            scores = tfidf_matrix.sum(axis=0).A1
            term_scores = list(zip(feature_names, scores))
            term_scores.sort(key=lambda x: x[1], reverse=True)
            
            # Create simple topics based on top terms
            topics = []
            terms_per_topic = len(term_scores) // num_topics if len(term_scores) >= num_topics else len(term_scores)
            
            for i in range(min(num_topics, len(term_scores) // 5)):
                start_idx = i * terms_per_topic
                end_idx = start_idx + terms_per_topic
                topic_terms = term_scores[start_idx:end_idx]
                
                keywords = [term for term, _ in topic_terms[:10]]
                
                topics.append({
                    "id": i,
                    "name": f"Topic {i}: {keywords[0] if keywords else 'Unknown'}",
                    "keywords": keywords,
                    "size": len(texts) // num_topics,  # Rough estimate
                    "coherence_score": 0.6  # Default coherence
                })
            
            return topics
            
        except Exception as e:
            logger.error(f"Simple topic extraction failed: {e}")
            # Return empty topics if everything fails
            return []
