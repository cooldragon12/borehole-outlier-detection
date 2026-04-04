import { useMemo, useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Badge from "@/components/ui/badge"
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

// Feature Analysis Component
function FeatureAnalysis({ dataInfo }: { dataInfo?: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Information</CardTitle>
        <CardDescription>
          Columns and data types from uploaded dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Columns */}
          {dataInfo?.columns && (
            <>
              <div>
                <p className="mb-2 text-sm font-medium text-card-foreground">
                  Total Features: {dataInfo.columns.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {dataInfo.columns.map((col: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {col}
                    </Badge>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Data Types */}
          {dataInfo?.dtypes && (
            <div>
              <p className="mb-3 text-sm font-medium text-card-foreground">
                Data Types
              </p>
              <div className="space-y-2 text-xs">
                {Object.entries(dataInfo.dtypes).map(([col, dtype]: [string, any], idx) => (
                  <div key={idx} className="flex justify-between rounded bg-muted/50 p-2">
                    <span className="font-medium">{col}</span>
                    <Badge variant="outline">{String(dtype)}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Values */}
          {dataInfo?.missing_values && (
            <>
              <Separator />
              <div>
                <p className="mb-3 text-sm font-medium text-card-foreground">
                  Missing Values
                </p>
                <div className="space-y-2 text-xs">
                  {Object.entries(dataInfo.missing_values).map(
                    ([col, count]: [string, any], idx) =>
                      count > 0 && (
                        <div
                          key={idx}
                          className="flex justify-between rounded bg-muted/50 p-2"
                        >
                          <span className="font-medium">{col}</span>
                          <Badge variant="destructive">{count}</Badge>
                        </div>
                      )
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Outlier Records Component
function OutlierRecordsSample({ results }: { results?: any }) {
  if (!results?.outlier_records || results.outlier_records.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Outlier Sample</CardTitle>
        <CardDescription>
          First 10 detected outliers from the dataset
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {Object.keys(results.outlier_records[0] || {})
                  .slice(0, 6)
                  .map((col) => (
                    <th
                      key={col}
                      className="px-3 py-2 text-left font-medium text-muted-foreground"
                    >
                      {col}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {results.outlier_records.slice(0, 10).map((row: any, idx: number) => (
                <tr key={idx} className="border-b border-border hover:bg-muted/50">
                  {Object.entries(row)
                    .slice(0, 6)
                    .map(([, val]: [string, any]) => (
                      <td key={String(val)} className="px-3 py-2 text-muted-foreground">
                        {typeof val === "number" ? val.toFixed(2) : String(val)}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Visualization Component
export default function VisualizationSection({
  results,
  dataInfo,
}: {
  results?: any
  dataInfo?: any
}) {
  return (
    <>
      <DetectionSummary results={results} />
      <FeatureAnalysis dataInfo={dataInfo} />
      <OutlierRecordsSample results={results} />
    </>
  )
}
