export interface DashboardData {
  columns: string[]
  rows: Array<Record<string, unknown>>
  fileName?: string
}

export interface GraphState {
  [key: string]: unknown
}
