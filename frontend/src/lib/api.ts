const API_BASE_URL = "http://localhost:8000/api"

export interface DataInfo {
  shape: number[]
  columns: string[]
  dtypes: Record<string, string>
  missing_values: Record<string, number>
  statistics: Record<string, Record<string, number>>
}

export interface PreprocessingReport {
  numeric_cols: string[]
  binary_cols: string[]
  categorical_cols: string[]
  missing_values_count: number
}

export interface DetectionStats {
  outlier_count: number
  outlier_percentage: number
  normal_count: number
}

export interface DBSCANResult {
  outliers: number[]
  normal: number[]
  stats: DetectionStats
  report: string
}



// Upload CSV file
export async function uploadDataFile(file: File): Promise<DataInfo> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/upload-data`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}

// Get data info
export async function getDataInfo(): Promise<DataInfo> {
  const response = await fetch(`${API_BASE_URL}/import/data-info`)

  if (!response.ok) {
    throw new Error(`Failed to get data info: ${response.statusText}`)
  }

  return await response.json()
}

// Preprocess data
export async function preprocessData(handleMissing: string = "drop", normalize: boolean = true): Promise<PreprocessingReport> {
  const response = await fetch(`${API_BASE_URL}/preprocess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      handle_missing: handleMissing,
      normalize,
    }),
  })

  if (!response.ok) {
    throw new Error(`Preprocessing failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.preprocessing_report
}

// DBSCAN Pipeline: Step 1 - Analyze data
export async function dbscanAnalyzeData(file: File): Promise<{ data_analysis: Record<string, unknown> }> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch(`${API_BASE_URL}/predict/dbscan/analyze-data`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Data analysis failed: ${response.statusText}`)
  }

  return await response.json()
}

// DBSCAN Pipeline: Step 2 - Preprocess
export async function dbscanPreprocess(
  handleMissing: string = "drop",
  scaleMethod: string = "robust"
): Promise<{ preprocessing_report: PreprocessingReport }> {
  const response = await fetch(`${API_BASE_URL}/preprocess/dbscan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      handle_missing: handleMissing,
      scale_method: scaleMethod,
    }),
  })

  if (!response.ok) {
    throw new Error(`Preprocessing failed: ${response.statusText}`)
  }

  return await response.json()
}

// DBSCAN Pipeline: Step 3 - Detect
export async function dbscanDetect(
  eps?: number,
  minSamples?: number
): Promise<{ detection_results: DetectionStats }> {
  const params = new URLSearchParams()
  if (eps !== undefined) params.append("eps", eps.toString())
  if (minSamples !== undefined) params.append("min_samples", minSamples.toString())

  const response = await fetch(`${API_BASE_URL}/predict/dbscan/detect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  })

  if (!response.ok) {
    throw new Error(`Detection failed: ${response.statusText}`)
  }

  return await response.json()
}

// DBSCAN Pipeline: Step 4 - Get results
export async function dbscanGetResults(): Promise<{
  detection_report: Record<string, unknown>
  outlier_count: number
  normal_count: number
  outlier_indices: number[]
  normal_preview: Record<string, unknown>[]
  outlier_records: Record<string, unknown>[]
  total_records: number
  preprocessing_report: PreprocessingReport
}> {
  const response = await fetch(`${API_BASE_URL}/predict/dbscan/results`)

  if (!response.ok) {
    throw new Error(`Failed to get DBSCAN results: ${response.statusText}`)
  }

  return await response.json()
}

// Reset state
export async function resetPipeline(): Promise<{ status: string; message: string }> {
  const response = await fetch(`${API_BASE_URL}/import/reset`)

  if (!response.ok) {
    throw new Error(`Failed to reset: ${response.statusText}`)
  }

  return await response.json()
}
