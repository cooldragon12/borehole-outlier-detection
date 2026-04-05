import { useMemo, useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Expand, X } from "lucide-react"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
} from "recharts"

// Color scheme from index.css using CSS variables
const CHART_COLORS = {
  chart1: "hsl(var(--chart-1))",
  chart2: "hsl(var(--chart-2))",
  chart3: "hsl(var(--chart-3))",
  chart4: "hsl(var(--chart-4))",
  chart5: "hsl(var(--chart-5))",
}

// Dark mode detection hook
function useDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }

    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  return isDark
}

// Detection Summary Component
function DetectionSummary({ results }: { results?: any }) {
  const isDark = useDarkMode()

  const axisStrokeColor = isDark ? '#b3b3b3' : '#666666'

  const barChartData = useMemo(() => {
    if (results?.detection_report) {
      return [
        {
          name: "Data Distribution",
          normal: results.normal_count || 0,
          outliers: results.outlier_count || 0,
        },
      ]
    }
    return [{ name: "Sample", normal: 933, outliers: 67 }]
  }, [results])

  const pieChartData = useMemo(() => {
    if (results?.outlier_count !== undefined) {
      return [
        { name: "Normal Points", value: results.normal_count || 0 },
        { name: "Outliers", value: results.outlier_count || 0 },
      ]
    }
    return [
      { name: "Normal Points", value: 933 },
      { name: "Outliers", value: 67 },
    ]
  }, [results])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detection Summary</CardTitle>
        <CardDescription>
          Outlier detection results visualization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Bar Chart */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Data Distribution</h3>
            <ResponsiveContainer height={400}>
              <BarChart data={barChartData} className="text-primary">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke={axisStrokeColor} className="text-primary" />
                <YAxis stroke={axisStrokeColor} className="text-primary" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Legend />
                <Bar dataKey="normal" fill={CHART_COLORS.chart1} name="Normal Points" />
                <Bar dataKey="outliers" fill={CHART_COLORS.chart2} name="Outliers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Distribution Ratio</h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  <Cell fill={CHART_COLORS.chart1} />
                  <Cell fill={CHART_COLORS.chart2} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Outlier Records Component
function OutlierRecordsSample({ results }: { results?: any }) {
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({})
  const [isExpanded, setIsExpanded] = useState(false)
  const [rowsToShow, setRowsToShow] = useState(10)

  if (!results?.outlier_records || results.outlier_records.length === 0) {
    return null
  }

  // Define the expected column order from the dataset
  const COLUMN_ORDER = [
    "COORDINATES",
    "borehole log",
    "unit weight",
    "moisture content",
    "liquid limit",
    "plastic limit",
    "plasticity index",
    "percent passing sieve 4",
    "percent passing sieve 10",
    "percent passing sieve 40",
    "percent passing sieve 200",
    "depth of soil (m)",
    "USCS classification",
    "soil bearing capacity",
    "N - Values (raw)",
    "Soil Condition based on GWT",
    "GWT found",
    "EH",
    "CB",
    "CS",
    "CR",
    "N60",
    "Friction Angle",
    "Cohesion",
    "Surcharge",
  ]

  // Get all unique columns, excluding internal ones
  const getAllColumns = () => {
    const allCols = new Set<string>()
    results.outlier_records.forEach((row: any) => {
      Object.keys(row).forEach((col) => {
        if (!["dbscan_outlier", "dbscan_label"].includes(col)) {
          allCols.add(col)
        }
      })
    })

    // Sort columns based on COLUMN_ORDER, then append any additional columns
    const sortedCols = Array.from(allCols)
    return sortedCols.sort((a, b) => {
      const indexA = COLUMN_ORDER.indexOf(a)
      const indexB = COLUMN_ORDER.indexOf(b)

      // If both are in the predefined order, use that order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      // If only one is in the predefined order, it comes first
      if (indexA !== -1) return -1
      if (indexB !== -1) return 1
      // Otherwise, sort alphabetically
      return a.localeCompare(b)
    })
  }

  const allColumns = getAllColumns()

  // Initialize visibility state on first render
  if (Object.keys(columnVisibility).length === 0 && allColumns.length > 0) {
    const initialVisibility: Record<string, boolean> = {}
    allColumns.forEach((col) => {
      initialVisibility[col] = true
    })
    setColumnVisibility(initialVisibility)
  }

  // Get visible columns
  const visibleColumns = allColumns.filter((col) => columnVisibility[col] !== false)

  // Toggle column visibility
  const toggleColumn = (col: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [col]: !prev[col],
    }))
  }

  // Toggle all columns
  const toggleAllColumns = () => {
    const allVisible = Object.values(columnVisibility).every((v) => v === true)
    const newVisibility: Record<string, boolean> = {}
    allColumns.forEach((col) => {
      newVisibility[col] = !allVisible
    })
    setColumnVisibility(newVisibility)
  }

  // Table render function (reusable for both normal and expanded views)
  const renderTable = (maxHeight?: string) => (
    <>
      <div className="rounded-lg bg-blue-500/10 border border-blue-500/30 p-3">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          ℹ️ <span className="font-medium">Note:</span> Values displayed are from the original dataset, not scaled. Outliers were detected using scaled features for fair comparison.
        </p>
      </div>

      {/* Column Selector */}
      <div className="rounded-lg border border-border bg-muted/20 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Select Columns to Display</p>
            <button
              onClick={toggleAllColumns}
              className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors"
            >
              {Object.values(columnVisibility).every((v) => v === true)
                ? "Deselect All"
                : "Select All"}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allColumns.map((col) => (
              <label
                key={col}
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={columnVisibility[col] !== false}
                  onChange={() => toggleColumn(col)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{
                    accentColor: "hsl(var(--chart-3))",
                    borderColor: "hsl(var(--chart-3))",
                  }}
                />
                <span className="text-xs text-muted-foreground truncate">
                  {col}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {visibleColumns.length > 0 ? (
        <div className={`overflow-x-auto ${maxHeight ? maxHeight : ""}`}>
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 py-2 text-left font-medium text-muted-foreground w-12">
                  #
                </th>
                {visibleColumns.map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.outlier_records.slice(0, rowsToShow).map((row: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-3 py-2 text-muted-foreground font-mono">
                    {idx + 1}
                  </td>
                  {visibleColumns.map((col) => {
                    const val = row[col]
                    return (
                      <td
                        key={`${idx}-${col}`}
                        className="px-3 py-2 text-muted-foreground font-mono"
                      >
                        {typeof val === "number"
                          ? val.toFixed(3)
                          : String(val).substring(0, 30)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xs text-muted-foreground">
            No columns selected. Use the column selector above to display data.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Showing {Math.min(rowsToShow, results.outlier_records.length)} of{" "}
          {results.outlier_records.length} outliers ({visibleColumns.length} of{" "}
          {allColumns.length} columns visible)
        </p>

        {rowsToShow < results.outlier_records.length && (
          <button
            onClick={() => setRowsToShow((prev) => prev + 10)}
            className="w-full px-4 py-2 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 text-sm font-medium transition-colors"
          >
            Load More
          </button>
        )}
      </div>
    </>
  )

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Outlier Sample</CardTitle>
            <CardDescription>
              First 10 detected outliers - showing original (unscaled) values
            </CardDescription>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="Expand"
          >
            <Expand className="h-5 w-5 text-muted-foreground" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          {renderTable()}
        </CardContent>
      </Card>

      {/* Expanded Modal View */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full h-full max-w-7xl max-h-[90vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
              <div>
                <CardTitle>Outlier Sample - Expanded View</CardTitle>
                <CardDescription>
                  First 10 detected outliers - showing original (unscaled) values
                </CardDescription>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-y-auto">
              {renderTable("max-h-full")}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}

// Main Visualization Component
export default function VisualizationSection({
  results,
}: {
  results?: any
}) {
  return (
    <>
      <DetectionSummary results={results} />
      {/* <ScatterPlot results={results} /> */}
      <OutlierRecordsSample results={results} />
    </>
  )
}

