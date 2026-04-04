import type { MockResults } from "./types/data"
export const mockResults: MockResults = {
  isolation_forest: {
    outlier_count: 45,
    outlier_percentage: 4.5,
    predictions: Array.from({ length: 1000 }, () =>
      Math.random() > 0.955 ? -1 : 1
    ),
  },
  dbscan: {
    outlier_count: 67,
    outlier_percentage: 6.7,
    predictions: Array.from({ length: 1000 }, () =>
      Math.random() > 0.933 ? -1 : 1
    ),
  },
  lof: {
    outlier_count: 52,
    outlier_percentage: 5.2,
    predictions: Array.from({ length: 1000 }, () =>
      Math.random() > 0.948 ? -1 : 1
    ),
  },
  one_class_svm: {
    outlier_count: 38,
    outlier_percentage: 3.8,
    predictions: Array.from({ length: 1000 }, () =>
      Math.random() > 0.962 ? -1 : 1
    ),
  },
}

const mockDataInfo = {
  shape: [1000, 8],
  columns: [
    "Depth",
    "SPT_N",
    "Friction_Ratio",
    "Cohesion",
    "Angle_of_Internal_Friction",
    "Unit_Weight",
    "Void_Ratio",
    "Water_Content",
  ],
  total_records: 1000,
}

// Mock data for visualizations
const algorithmComparisonData = [
  { name: "Isolation Forest", outliers: 45, normal: 955 },
  { name: "DBSCAN", outliers: 67, normal: 933 },
  { name: "LOF", outliers: 52, normal: 948 },
  { name: "One-Class SVM", outliers: 38, normal: 962 },
]

const pieData = [
  { name: "Normal Points", value: 955, color: "hsl(var(--chart-1))" },
  { name: "Outliers", value: 45, color: "hsl(var(--chart-2))" },
]
const correlationData = [
  [1.0, 0.3, 0.2, 0.1, 0.4, 0.6, 0.3, 0.2],
  [0.3, 1.0, 0.5, 0.7, 0.2, 0.4, 0.6, 0.8],
  [0.2, 0.5, 1.0, 0.3, 0.1, 0.2, 0.4, 0.3],
  [0.1, 0.7, 0.3, 1.0, 0.5, 0.3, 0.2, 0.4],
  [0.4, 0.2, 0.1, 0.5, 1.0, 0.7, 0.3, 0.1],
  [0.6, 0.4, 0.2, 0.3, 0.7, 1.0, 0.5, 0.2],
  [0.3, 0.6, 0.4, 0.2, 0.3, 0.5, 1.0, 0.6],
  [0.2, 0.8, 0.3, 0.4, 0.1, 0.2, 0.6, 1.0],
]
export { mockDataInfo, algorithmComparisonData, pieData, correlationData }
