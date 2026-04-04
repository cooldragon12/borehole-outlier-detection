# DBSCAN Outlier Detection Frontend

A modern React + TypeScript + Vite frontend for the DBSCAN outlier detection system. Provides an interactive dashboard for uploading data, monitoring the detection pipeline, and visualizing results.

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The frontend will open at **http://localhost:3000**

### 3. Build for Production

```bash
npm run build
```

Output is generated in the `dist/` directory.

## Features

- ✅ **CSV File Upload** - Drag-and-drop or click to upload
- ✅ **4-Step Pipeline Tracking** - Visual progress indicators for each stage
- ✅ **Real-time Data Analysis** - View dataset statistics and feature information
- ✅ **Interactive Charts** - Bar and pie charts using Recharts
- ✅ **DBSCAN Results Display** - Outlier count, percentage, normal points
- ✅ **Preprocessing Report** - Feature types, scaling method, missing values
- ✅ **Outlier Sample Table** - View first 10 detected outliers
- ✅ **Dark/Light Theme** - Adaptive color scheme with CSS variables
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx                          # Main app component
│   ├── main.tsx                         # React entry point
│   ├── index.css                        # Global styles & theme variables
│   ├── components/
│   │   ├── Dashboard.tsx                # Main dashboard orchestrator
│   │   ├── theme-provider.tsx           # Theme context provider
│   │   └── sections/
│   │       ├── Visualization.tsx        # Charts & data analysis
│   │       │   ├── DetectionSummary     # Sub-component: bar & pie charts
│   │       │   ├── FeatureAnalysis      # Sub-component: feature information
│   │       │   └── OutlierRecordsSample # Sub-component: outlier table
│   │       └── DBScanResults.tsx        # DBSCAN results display
│   │           ├── StatisticsGrid       # Sub-component: stat cards
│   │           └── PreprocessingReport  # Sub-component: preprocessing info
│   ├── lib/
│   │   ├── api.ts                       # DBSCAN pipeline API client
│   │   ├── mockData.ts                  # Mock data for testing
│   │   └── utils.ts                     # Utility functions
│   └── components/ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── separator.tsx
│       └── ... (shadcn/ui components)
├── public/                              # Static assets
├── package.json                         # NPM dependencies
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite configuration
├── tailwind.config.js                   # Tailwind CSS configuration
└── README.md                            # This file
```

## Dashboard Components

### Main Dashboard
**Path**: `src/components/Dashboard.tsx`

Orchestrates the complete pipeline workflow:
1. **Data Upload** - File input and validation
2. **Pipeline Progress** - 4-step status indicators
3. **Data Overview** - Dataset summary (records, features, shape)
4. **DBSCAN Results** - Outlier statistics and preprocessing report
5. **Visualizations** - Charts and data analysis

### DBSCAN Results Section
**Path**: `src/components/sections/DBScanResults.tsx`

Displays DBSCAN-specific detection results:
- **StatisticsGrid** - Outlier count, percentage, normal points
- **PreprocessingReport** - Numeric/binary/categorical features, missing values

### Visualization Section
**Path**: `src/components/sections/Visualization.tsx`

Shows data analysis visualizations:
- **DetectionSummary** - Bar chart (data distribution) + Pie chart (ratio)
- **FeatureAnalysis** - Feature types, data types, missing values
- **OutlierRecordsSample** - Table of first 10 detected outliers

## Theme & Styling

### Color Scheme (from `index.css`)

**Light Mode**:
- Background: `oklch(0.95 0 0)` (off-white)
- Foreground: `oklch(0.147 0.004 49.25)` (dark)
- Chart-1 to Chart-5: Color variables for visualizations

**Dark Mode**:
- Background: `oklch(0.147 0.004 49.25)` (dark)
- Foreground: `oklch(0.985 0.001 106.423)` (light)
- Chart colors adapt automatically

### CSS Variables

All colors are defined as CSS variables and support both light and dark modes:
```css
--chart-1: 211.589 60% 45%;    /* Blue */
--chart-2: 191.8 50% 65%;       /* Cyan */
--chart-3: 264.5 35% 60%;       /* Purple */
--chart-4: 340.8 55% 55%;       /* Pink */
--chart-5: 356.7 65% 48%;       /* Red */
```

## API Integration

### API Client
**File**: `src/lib/api.ts`

Implements the DBSCAN pipeline API:

```typescript
// Step 1: Analyze data
dbscanAnalyzeData(file)

// Step 2: Preprocess
dbscanPreprocess(handleMissing, scaleMethod)

// Step 3: Detect outliers
dbscanDetect(eps, minSamples)

// Step 4: Get results
dbscanGetResults()

// Utilities
suggestEpsValue(k, quantile)
resetPipeline()
```

### Backend URL Configuration

The API base URL is configured at the top of `src/lib/api.ts`:
```typescript
const API_BASE_URL = "http://localhost:8000/api"
```

To change it, modify this constant or set an environment variable:
```bash
VITE_API_URL=http://your-backend-url/api
```

## Available Scripts

### Development
```bash
# Start dev server with hot reload
npm run dev

# Run type checking
npm run type-check

# Run linter (if configured)
npm run lint
```

### Production
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Component Reusability

All sections are modular and can be used independently:

```tsx
import DBScanResultsSection from "@/components/sections/DBScanResults"
import Visualization from "@/components/sections/Visualization"

// Use in any component
<DBScanResultsSection results={detectionResults} />
<Visualization results={dbscanResults} dataInfo={dataInfo} />
```

## Dark Mode Detection Hook

The `useDarkMode()` hook automatically detects theme changes:

```tsx
import { useDarkMode } from "@/components/sections/Visualization"

function MyComponent() {
  const isDark = useDarkMode()
  
  const color = isDark ? '#b3b3b3' : '#666666'
  return <div style={{ color }}>Adaptive text</div>
}
```

## TypeScript Interfaces

Key types in `src/lib/api.ts`:

```typescript
interface DataInfo {
  shape: number[]
  columns: string[]
  dtypes: Record<string, string>
  missing_values: Record<string, number>
  statistics: Record<string, Record<string, number>>
}

interface PreprocessingReport {
  numeric_cols: string[]
  binary_cols: string[]
  categorical_cols: string[]
  missing_values_count: number
}

interface DetectionStats {
  outlier_count: number
  outlier_percentage: number
  normal_count: number
}
```

## Performance Notes

- **Vite**: Fast bundling and hot module replacement
- **React 18**: Latest features and performance improvements
- **Tailwind v4**: JIT CSS generation, optimized bundle size
- **Charts**: Recharts with custom stroke colors for dark mode

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Backend not responding

```bash
# Check if backend is running on port 8000
curl http://localhost:8000/docs

# Check browser console (F12) for CORS errors
# Look for: "Access to XMLHttpRequest blocked by CORS"
```

**Solution**: Ensure backend is running with correct CORS settings:
```python
# backend/src/core/config.py
allow_origins = ["http://localhost:3000"]
```

### Charts not rendering

```bash
# Check if Recharts is installed
npm list recharts

# Or reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type errors in development

```bash
# Run type checking
npm run type-check

# Or check tsconfig.json for errors
```

### CSS not loading or theme broken

```bash
# Clear Tailwind cache
rm -rf node_modules/.cache

# Reinstall packages
npm install

# Restart dev server
npm run dev
```

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api

# Debug logging
VITE_DEBUG=true
```

## Deployment

### Docker

```bash
# Build Docker image
docker build -t outlier-frontend .

# Run container
docker run -p 3000:3000 outlier-frontend
```

### Vercel/Netlify

```bash
# Build static site
npm run build

# Deploy dist/ folder
```

## Contributing

When adding new features:
1. Keep components focused and modular
2. Use TypeScript for type safety
3. Follow the existing component structure
4. Update this README for significant changes

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite 5** - Fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - UI component library
- **Recharts** - Interactive charts
- **Axios** (via api.ts) - HTTP requests

## References

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)

## License

Part of a civil engineering thesis on automated outlier detection.
