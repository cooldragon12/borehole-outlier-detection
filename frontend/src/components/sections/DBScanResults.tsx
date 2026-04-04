import { useMemo, useState } from "react"
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
import { ChevronDown } from "lucide-react"

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

// Expandable Feature Section Component
function FeatureSection({
  title,
  count,
  features,
  color,
  description,
}: {
  title: string
  count: number
  features: string[]
  icon: string
  color: string
  description: string
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left transition-colors hover:bg-muted/40 rounded-md p-2 -m-2"
      >
        <div className="flex items-center gap-3">
          <div className="mt-0.5 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-foreground">{title}</p>
              <Badge variant="outline" className="text-xs">
                {count}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform text-muted-foreground ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && count > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="space-y-1">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1.5 bg-background/50 rounded"
              >
                <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                <span className="font-mono text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isExpanded && count === 0 && (
        <div className="mt-3 pt-3 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">No features in this category</p>
        </div>
      )}
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

  const numericCount = preprocessReport.numeric_cols?.length || 0
  const binaryCount = preprocessReport.binary_cols?.length || 0
  const categoricalCount = preprocessReport.categorical_cols?.length || 0

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-foreground">Feature Details</h3>
      <div className="space-y-3">
        <FeatureSection
          title="Numeric Features"
          count={numericCount}
          features={preprocessReport.numeric_cols || []}
          icon="📊"
          color="hsl(var(--chart-1))"
          description="Scaled with RobustScaler"
        />

        <FeatureSection
          title="Binary Features"
          count={binaryCount}
          features={preprocessReport.binary_cols || []}
          icon="🔲"
          color="hsl(var(--chart-2))"
          description="Preserved as-is (0/1 values)"
        />

        <FeatureSection
          title="Categorical Features"
          count={categoricalCount}
          features={preprocessReport.categorical_cols || []}
          icon="🏷️"
          color="hsl(var(--chart-4))"
          description="One-hot encoded"
        />

        {preprocessReport.missing_values_count > 0 && (
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-yellow-500/20 p-1.5">
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
              </div>
              <div>
                <p className="font-medium text-sm text-yellow-900 dark:text-yellow-100">
                  Missing Values
                </p>
                <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-0.5">
                  {preprocessReport.missing_values_count} cells removed during preprocessing
                </p>
              </div>
            </div>
          </div>
        )}
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