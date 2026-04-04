# Outlier Detection Dashboard

A React-based dashboard for visualizing and analyzing outlier detection results from geotechnical borehole data.

## Features

### Dataset Overview
- Displays total number of records and features
- Shows data shape and column names
- Provides a quick overview of the dataset structure

### Outlier Detection
- Supports multiple algorithms:
  - **Isolation Forest**: Tree-based anomaly detection
  - **DBSCAN**: Density-based clustering for outlier detection
  - **Local Outlier Factor (LOF)**: Distance-based outlier detection
  - **One-Class SVM**: Support Vector Machine for novelty detection

### Results Visualization
- Real-time outlier counts and percentages
- Algorithm comparison table
- Mock data visualization placeholder (ready for chart integration)

### Data Visualizations
- **Bar Chart**: Algorithm performance comparison showing outliers vs normal points
- **Pie Chart**: Distribution of normal vs outlier data points
- **Heatmap**: Feature correlation matrix with color-coded relationships

## Color Scheme

The dashboard uses the shadcn/ui design system with semantic colors:

- **Chart Colors**: `chart-1`, `chart-2`, `chart-3`, `chart-4`, `chart-5` for data visualizations
- **Semantic Colors**: `primary`, `secondary`, `accent`, `muted`, `destructive` for UI elements
- **Theme Variables**: All colors use CSS custom properties for easy theming

### Color Usage:
- **Data Overview Cards**: `chart-1`, `chart-2`, `chart-3` backgrounds
- **Charts**: `chart-1` (normal points), `chart-2` (outliers) 
- **Results Cards**: `chart-2` (outliers), `chart-4` (percentages)
- **UI Elements**: Standard semantic colors for buttons, borders, text
- Sample correlation data for feature relationships

## Backend Integration

The dashboard is designed to work with the FastAPI backend that provides:

- `/api/upload-data`: Upload CSV files
- `/api/preprocess`: Data preprocessing (missing values, normalization)
- `/api/detect-outliers`: Run outlier detection algorithms
- `/api/results`: Get detailed detection results
- `/api/compare-algorithms`: Compare algorithm performance

## Next Steps

### 1. Add Real API Integration
Replace mock data with actual API calls to the backend:

```typescript
const fetchResults = async () => {
  const response = await fetch('/api/results');
  const data = await response.json();
  // Update state with real data
};
```

### 2. Add Data Visualization
Integrate a charting library like Chart.js, D3.js, or Recharts to visualize:
- Scatter plots of features with outliers highlighted
- Distribution histograms
- Algorithm comparison charts

### 3. File Upload Component
Add a file upload interface to allow users to upload their own CSV files:

```typescript
const handleFileUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  await fetch('/api/upload-data', {
    method: 'POST',
    body: formData
  });
};
```

### 4. Configuration Panel
Add UI controls for algorithm parameters:
- Contamination rate sliders
- DBSCAN eps and min_samples inputs
- LOF n_neighbors selector

### 5. Export Results
Add functionality to export results as CSV or JSON files.

## Running the Dashboard

1. Start the backend server:
```bash
cd backend
uvicorn src.main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend
bun run dev
```

3. Open http://localhost:5173 in your browser

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling with **semantic color system** (primary, secondary, accent, etc.)
- **shadcn/ui** components (Card, Badge, Button, Separator, Progress)
- **Recharts** for data visualization (bar charts, pie charts, etc.)
- **Vite** for build tooling
- **FastAPI** backend (planned integration)