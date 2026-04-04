export interface AlgorithmResult {
  outlier_count: number
  outlier_percentage: number
  predictions: number[]
}

export interface MockResults {
  isolation_forest: AlgorithmResult
  dbscan: AlgorithmResult
  lof: AlgorithmResult
  one_class_svm: AlgorithmResult
}
