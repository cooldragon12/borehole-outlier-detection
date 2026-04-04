import { useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Badge from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Statistics Grid Component
function StatisticsGrid({ results }: { results?: any }) {
  const displayStats = useMemo(() => {
    if (results) {
      return {
        outlier_count: results.outlier_count || 0,
        outlier_percentage: results.outlier_percentage || 0,
        normal_count: results.normal_count || 0,
      }
    }
    return {
      outlier_count: 0,
      outlier_percentage: 0,
      normal_count: 0,
    }
  }, [results])

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Outlier Count */}
      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Outlier Count
          </p>
          <Badge variant="destructive">
            {displayStats.outlier_count}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-chart-2">
          {displayStats.outlier_count}
        </p>
        <Progress
          value={displayStats.outlier_percentage}
          className="mt-2 h-2"
        />
      </div>

      {/* Outlier Percentage */}
      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Percentage
          </p>
          <Badge variant="secondary">
            {displayStats.outlier_percentage.toFixed(2)}%
          </Badge>
        </div>
        <p className="text-2xl font-bold text-chart-2">
          {displayStats.outlier_percentage.toFixed(2)}%
        </p>
      </div>

      {/* Normal Count */}
      <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">
            Normal Points
          </p>
          <Badge variant="secondary">
            {displayStats.normal_count}
          </Badge>
        </div>
        <p className="text-2xl font-bold text-chart-1">
          {displayStats.normal_count}
        </p>
      </div>
    </div>
  )
}

// Preprocessing Report Component
function PreprocessingReport({ results }: { results?: any }) {
  const preprocessReport = useMemo(() => {
    return results?.preprocessing_report || null
  }, [results])

  if (!preprocessReport) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Preprocessing Report</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-chart-1" />
            <div>
              <p className="font-medium text-sm">Numeric Features</p>
              <p className="text-xs text-muted-foreground">
                {preprocessReport.numeric_cols?.length || 0} columns (RobustScaler)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-chart-2" />
            <div>
              <p className="font-medium text-sm">Binary Features</p>
              <p className="text-xs text-muted-foreground">
                {preprocessReport.binary_cols?.length || 0} columns (preserved)
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-1 h-2 w-2 rounded-full bg-chart-4" />
            <div>
              <p className="font-medium text-sm">Missing Values</p>
              <p className="text-xs text-muted-foreground">
                {preprocessReport.missing_values_count || 0} cells
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main DBSCAN Results Component
function DBScanResultsSection({
  results,
}: {
  results?: any
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>DBSCAN Detection Results</CardTitle>
        <CardDescription>
          Cluster-based outlier detection with RobustScaler preprocessing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Grid */}
        <StatisticsGrid results={results} />

        <Separator />

        {/* Preprocessing Info */}
        <PreprocessingReport results={results} />
      </CardContent>
    </Card>
  )
}

export default DBScanResultsSection