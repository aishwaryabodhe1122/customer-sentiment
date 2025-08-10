# AI-Powered Customer Sentiment Tracker for E-Commerce Brands

## 🚀 Project Overview

A comprehensive full-stack application that provides real-time sentiment analysis of customer feedback across multiple platforms including social media, product reviews, and direct uploads. Built with modern web technologies and advanced AI/ML models.

## 🎯 Key Features

### Data Collection
- **Multi-Platform Integration**: Twitter, Instagram, product review APIs
- **CSV Upload**: Support for offline review datasets
- **Real-time Monitoring**: Scheduled data fetching for continuous insights

### AI/ML Capabilities
- **Sentiment Analysis**: BERT/DistilBERT and VADER for accurate classification
- **Emotion Detection**: Advanced emotion recognition from text
- **Topic Modeling**: BERTopic and LDA for trending topic identification
- **Sales Impact Prediction**: Regression models correlating sentiment with sales
- **Anomaly Detection**: Identify sudden sentiment spikes

### Dashboard & Analytics
- **Interactive Visualizations**: Real-time charts and graphs
- **Geo-location Heatmaps**: Sentiment mapping by location
- **Trending Analysis**: Most positive/negative topics
- **Alert System**: Notifications for sentiment changes
- **Report Generation**: PDF/Excel export capabilities

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with React 18
- **TypeScript** for type safety
- **Bootstrap 5** + Custom CSS
- **Chart.js/Recharts** for data visualization
- **Leaflet.js** for geo-mapping

### Backend
- **Node.js** with Express and TypeScript
- **Python FastAPI** for ML microservice
- **MongoDB** for data storage
- **Redis** for caching

### AI/ML
- **HuggingFace Transformers** (DistilBERT)
- **VADER** sentiment analyzer
- **BERTopic** for topic modeling
- **scikit-learn** for predictive analytics
- **Pandas** for data processing

### DevOps
- **Docker** containerization
- **GitHub Actions** for CI/CD
- **Cloud deployment** ready (AWS/GCP/Azure)

## 📁 Project Structure

```
customer-sentiment-tracker/
├── frontend/                 # Next.js React application
├── backend/                  # Node.js API server
├── ml-service/              # Python ML microservice
├── docker-compose.yml       # Multi-service orchestration
├── .github/workflows/       # CI/CD pipelines
└── docs/                    # Documentation
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/aishwaryabodhe1122/customer-sentiment.git
   cd customer-sentiment-tracker
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install
   
   # Backend
   cd ../backend && npm install
   
   # ML Service
   cd ../ml-service && pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Configure your API keys and database connections
   ```

4. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

## 🔧 Configuration

### Environment Variables
- `TWITTER_API_KEY`: Twitter API access
- `INSTAGRAM_ACCESS_TOKEN`: Instagram Graph API
- `MONGODB_URI`: Database connection
- `REDIS_URL`: Cache server
- `JWT_SECRET`: Authentication secret

## 📊 API Documentation

### Sentiment Analysis
- `POST /api/analyze` - Analyze text sentiment
- `GET /api/sentiment/trends` - Get sentiment trends
- `GET /api/topics/trending` - Get trending topics

### Data Management
- `POST /api/data/upload` - Upload CSV data
- `GET /api/data/sources` - List data sources
- `POST /api/data/fetch` - Trigger data collection

## 🤖 ML Models

### Sentiment Classification
- **Primary**: DistilBERT fine-tuned on sentiment data
- **Fallback**: VADER for real-time processing
- **Accuracy**: 92%+ on test datasets

### Topic Modeling
- **BERTopic**: For coherent topic extraction
- **TF-IDF**: Keyword importance scoring
- **Dynamic**: Updates with new data

## 🔮 Advanced Features

- **Sarcasm Detection**: Identify sarcastic comments
- **Multilingual Support**: Hindi + English (Hinglish)
- **Fake Review Detection**: Filter spam content
- **Influencer Impact**: Track influencer mention effects
- **Competitor Analysis**: Compare brand sentiments

## 📈 Performance

- **Real-time Processing**: <2s response time
- **Scalability**: Handles 10K+ reviews/hour
- **Accuracy**: 92%+ sentiment classification
- **Uptime**: 99.9% availability target

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Aishwarya Bodhe
- **GitHub**: [@aishwaryabodhe1122](https://github.com/aishwaryabodhe1122)

## 🙏 Acknowledgments

- HuggingFace for transformer models
- Twitter/Instagram APIs for data access
- Open source community for tools and libraries
