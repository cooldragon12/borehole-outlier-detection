---
license: apache-2.0
title: Borehole Outlier Detector
sdk: docker
emoji: 👁
colorFrom: pink
colorTo: purple
short_description: A borehole outlier detection model/pipeline
app_port: 7860
---


# Automated Outlier Detection System - DBSCAN Pipeline

A specialized Python + React system for detecting outliers in geotechnical borehole data using **DBSCAN clustering** with **RobustScaler preprocessing**. Features an interactive React dashboard for data upload, pipeline monitoring, and visualization.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend (Port 3000)                  │
│  - CSV Data Upload & Validation                             │
│  - 4-Step Pipeline Progress Tracking                        │
│  - Real-time Results Visualization                          │
│  - Dark/Light Theme Support                                 │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/JSON
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Backend (Port 8000)                 │
│  - File Upload Handler                                      │
│  - RobustScaler Preprocessing (Median-centered, IQR)        │
│  - DBSCAN Clustering & Outlier Detection                    │
│  - Automatic Binary Feature Preservation                    │
│  - Comprehensive Results Aggregation                        │
└─────────────────────────────────────────────────────────────┘
```

## DBSCAN Configuration (Optimal)

- **eps**: 5.193866452787452 (from k-distance quantiles, k=5)
- **min_samples**: 5 (minimum cluster density)
- **metric**: euclidean
- **preprocessing**: RobustScaler (25 numeric features, 3 binary features preserved)

## Project Structure

```
Automated-Outlier-Detection/
├── backend/                    # FastAPI Backend
│   ├── src/
│   │   ├── main.py            # Application entry point
│   │   ├── api/
│   │   │   ├── preprocess.py  # Generic preprocessing endpoints
│   │   │   └── predict.py     # DBSCAN pipeline (4 endpoints)
│   │   ├── services/
│   │   │   ├── preprocess_service.py   # RobustScaler service
│   │   │   └── dbscan_service.py       # DBSCAN detection service
│   │   ├── core/
│   │   │   ├── config.py      # Configuration (CORS, etc.)
│   │   │   ├── models.py      # Pydantic models
│   │   │   ├── security.py    # Security utilities
│   │   │   └── middleware.py  # Custom middleware
│   │   └── __init__.py
│   ├── Dockerfile             # Docker configuration
│   ├── requirements.txt        # Python dependencies
│   └── README.md              # Backend setup guide
├── frontend/                   # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx            # Main app component
│   │   ├── components/
│   │   │   ├── Dashboard.tsx  # Main dashboard
│   │   │   └── sections/
│   │   │       ├── Visualization.tsx    # Charts & data analysis
│   │   │       └── DBScanResults.tsx    # DBSCAN results display
│   │   ├── lib/
│   │   │   ├── api.ts         # DBSCAN pipeline API client
│   │   │   └── mockData.ts    # Mock data for testing
│   │   ├── index.css          # Theme & CSS variables
│   │   └── main.tsx           # Entry point
│   ├── package.json           # NPM dependencies
│   ├── tsconfig.json          # TypeScript config
│   ├── vite.config.ts         # Vite config
│   └── README.md              # Frontend setup guide
├── docker-compose.yml         # Docker compose for both services
├── analysis.ipynb             # Jupyter notebook for DBSCAN analysis
├── dataset.csv                # Sample dataset
└── README.md                  # This file
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Docker & Docker Compose (optional)
- pip (Python package manager)
- npm (Node package manager)

### Option 1: Docker Compose (Recommended)

```bash
# Start both backend and frontend
docker-compose up -d --build

# Access:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
python -m uvicorn src.main:app --reload --port 8000
```

Backend will start on `http://localhost:8000`

**API Documentation:**
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

#### Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```

Frontend will open at `http://localhost:3000`

## DBSCAN Pipeline Workflow

The system implements a 4-step DBSCAN-specific pipeline:

### Step 1: Analyze Data
- **Endpoint**: `POST /api/dbscan/analyze-data`
- **Input**: CSV file upload
- **Output**: Data shape, column types, statistics, missing values

### Step 2: Preprocess
- **Endpoint**: `POST /api/dbscan/preprocess`
- **Processing**:
  - Handles missing values (drop/mean/median)
  - Identifies numeric, binary, categorical features
  - Applies RobustScaler to numeric columns only
  - Preserves binary features (0/1 values) unscaled
- **Output**: Preprocessing report with scaling statistics

### Step 3: Detect Outliers
- **Endpoint**: `POST /api/dbscan/detect`
- **Processing**: DBSCAN clustering with optimal params (eps=5.194, min_samples=5)
- **Output**: Detection statistics (outlier count, percentage, normal count)

### Step 4: Get Results
- **Endpoint**: `GET /api/dbscan/results`
- **Output**: Complete results with:
  - Outlier records (first 20)
  - Normal points preview
  - Detection report
  - Preprocessing report

## API Endpoints

### DBSCAN Pipeline (Recommended)
```
POST   /api/dbscan/analyze-data      # Step 1: Analyze
POST   /api/dbscan/preprocess        # Step 2: Preprocess
POST   /api/dbscan/detect            # Step 3: Detect
GET    /api/dbscan/results           # Step 4: Get results
POST   /api/dbscan/suggest-eps       # Suggest optimal eps
GET    /api/reset                    # Reset state
```

## Technologies Used

### Backend
- **FastAPI 0.104+**: Modern, fast web framework
- **Scikit-learn**: DBSCAN clustering & RobustScaler
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Uvicorn**: ASGI web server

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Tailwind CSS v4**: Utility-first styling
- **shadcn/ui**: Component library
- **Recharts**: Interactive charts (BarChart, PieChart)

## Data Requirements

Input CSV files should contain:
- **Numeric columns**: Continuous features (automatically scaled with RobustScaler)
- **Binary columns**: Features with only 0/1 values (preserved unscaled)
- **Format**: Comma-separated values with headers
- **Missing values**: Handled automatically (drop strategy by default)

## Features

✅ **Streamlined DBSCAN Pipeline** - Dedicated 4-step workflow
✅ **RobustScaler Preprocessing** - Median-centered, IQR-normalized scaling
✅ **Binary Feature Preservation** - Automatic detection and exclusion from scaling
✅ **Real-time Progress Tracking** - Visual pipeline step indicators
✅ **Interactive Visualizations** - Bar charts, pie charts, distribution analysis
✅ **Dark/Light Theme** - Adaptive color scheme using CSS variables
✅ **Outlier Sample Display** - View first 10 detected outliers
✅ **Preprocessing Report** - Detailed feature analysis and statistics

## Troubleshooting

### Backend Issues

```bash
# Check if backend is running
curl http://localhost:8000/docs

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Issues

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev

# Check if frontend can reach backend
# Look at browser console (F12) for CORS or connection errors
```

### CORS Errors
- Ensure backend is running on port 8000
- Check `src/core/config.py` for `allow_origins` settings
- Frontend should be on localhost:3000

## Docker Deployment

```bash
# Build custom images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

## Configuration

### Environment Variables

**Backend** (`backend/.env` or `docker-compose.yml`):
```
FASTAPI_ENV=development
DEBUG=true
ORIGIN=http://localhost:3000
```

**Frontend** (`.env.local`):
```
VITE_API_URL=http://localhost:8000/api
```

## Performance Notes

- **RobustScaler**: Median-centered, IQR-normalized - robust to outliers
- **DBSCAN**: O(n log n) time complexity with spatial indexing
- **Optimal eps**: Derived from k-distance graph analysis (default: 5.194)
- **Scalability**: Tested with 1000+ records

## Research & References

This implementation is based on:
- k-distance graph analysis for optimal eps selection
- RobustScaler for handling skewed distributions
- DBSCAN's density-based clustering for arbitrary shapes

See `analysis.ipynb` for detailed algorithm analysis and tuning.

## License

This project is part of a civil engineering thesis on automated outlier detection in geotechnical data.

## Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review backend logs: `docker-compose logs backend`
3. Check browser console (F12) for frontend errors
4. Verify both services are running on correct ports