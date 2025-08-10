# AI-Powered Customer Sentiment Tracker - Setup Instructions

## 🚀 Quick Start Commands

### 1. Initial Setup

```bash
# Navigate to project directory
cd C:\Users\Lenovo\CascadeProjects\windsurf-project

# Initialize Git repository
git init
git add .
git commit -m "Initial commit: AI-Powered Customer Sentiment Tracker"

# Add remote repository
git remote add origin https://github.com/aishwaryabodhe1122/customer-sentiment.git
git branch -M main
git push -u origin main
```

### 2. Environment Setup

```bash
# Copy environment file
copy .env.example .env

# Edit .env file with your actual API keys and configuration
# You'll need to add:
# - Twitter API credentials
# - Instagram API credentials
# - MongoDB URI
# - Redis URL
# - JWT Secret
# - HuggingFace API key (optional)
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Install additional dependencies for Tailwind CSS
npm install -D @tailwindcss/forms @tailwindcss/typography

# Start development server
npm run dev
```

The frontend will be available at: http://localhost:3000

### 4. Backend Setup (Node.js/Express)

```bash
# Navigate to backend directory (from project root)
cd backend

# Install dependencies
npm install

# Install additional development dependencies
npm install -D tsconfig-paths

# Build TypeScript
npm run build

# Start development server
npm run dev
```

The backend API will be available at: http://localhost:3001

### 5. ML Service Setup (Python FastAPI)

```bash
# Navigate to ML service directory (from project root)
cd ml-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start ML service
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The ML service will be available at: http://localhost:8000

### 6. Database Setup

#### MongoDB
```bash
# Install MongoDB locally or use MongoDB Atlas
# Local installation (Windows):
# Download from https://www.mongodb.com/try/download/community
# Or use Docker:
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

#### Redis
```bash
# Install Redis locally or use Redis Cloud
# Local installation (Windows):
# Download from https://redis.io/download
# Or use Docker:
docker run -d -p 6379:6379 --name redis redis:7-alpine
```

### 7. Docker Setup (Alternative)

```bash
# Build and run all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔧 Development Commands

### Frontend Commands
```bash
cd frontend

# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Backend Commands
```bash
cd backend

# Development
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

### ML Service Commands
```bash
cd ml-service

# Development
uvicorn main:app --reload                    # Start with auto-reload
python -m pytest                            # Run tests
black .                                      # Format code
flake8 .                                     # Lint code
mypy .                                       # Type checking
```

## 📊 API Endpoints

### Backend API (Port 3001)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `GET /api/sentiment/trends` - Get sentiment trends
- `POST /api/data/upload` - Upload CSV data
- `GET /api/alerts` - Get user alerts

### ML Service API (Port 8000)
- `POST /analyze` - Analyze single text sentiment
- `POST /analyze/batch` - Batch sentiment analysis
- `POST /emotions` - Emotion analysis
- `POST /topics` - Topic modeling
- `GET /health` - Health check

## 🔑 Required API Keys

### Twitter API
1. Go to https://developer.twitter.com/
2. Create a new app
3. Get API Key, API Secret, Access Token, Access Token Secret, Bearer Token

### Instagram Basic Display API
1. Go to https://developers.facebook.com/
2. Create a new app
3. Add Instagram Basic Display product
4. Get Access Token

### HuggingFace (Optional)
1. Go to https://huggingface.co/
2. Create account and get API token
3. Used for better ML model performance

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port
   npx kill-port 3000
   npx kill-port 3001
   npx kill-port 8000
   ```

2. **MongoDB connection issues**
   ```bash
   # Check MongoDB status
   mongosh --eval "db.runCommand('ping')"
   ```

3. **Redis connection issues**
   ```bash
   # Test Redis connection
   redis-cli ping
   ```

4. **Python dependencies issues**
   ```bash
   # Clear pip cache
   pip cache purge
   pip install --no-cache-dir -r requirements.txt
   ```

5. **Node modules issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🚀 Production Deployment

### Using Docker
```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment
1. Set up production servers (AWS/GCP/Azure)
2. Configure environment variables
3. Set up reverse proxy (Nginx)
4. Configure SSL certificates
5. Set up monitoring and logging

## 📈 Performance Optimization

### Frontend
- Enable Next.js image optimization
- Use CDN for static assets
- Implement code splitting
- Enable service worker for caching

### Backend
- Use Redis for caching
- Implement database indexing
- Use connection pooling
- Enable gzip compression

### ML Service
- Use GPU acceleration if available
- Implement model caching
- Use batch processing for multiple requests
- Consider model quantization for faster inference

## 🔒 Security Considerations

1. **Environment Variables**: Never commit .env files
2. **API Keys**: Use secure key management
3. **CORS**: Configure proper CORS settings
4. **Rate Limiting**: Implement API rate limiting
5. **Input Validation**: Validate all user inputs
6. **HTTPS**: Use HTTPS in production
7. **Database**: Secure MongoDB with authentication

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [HuggingFace Transformers](https://huggingface.co/docs/transformers)
