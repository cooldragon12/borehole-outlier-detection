import { useState } from "react"
import Button from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Badge from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { mockDataInfo } from "@/lib/mockData"
import VisualizationSection from "./sections/Visualization"
import {
  dbscanAnalyzeData,
  dbscanPreprocess,
  dbscanDetect,
  dbscanGetResults,
  resetPipeline,
  type DataInfo,
  type DetectionStats,
} from "@/lib/api"
import DBScanResultsSection from "./sections/DBScanResults";

export function Dashboard() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dataInfo, setDataInfo] = useState<DataInfo | null>(null)
  const [detectionStats, setDetectionStats] = useState<DetectionStats | null>(null)
  const [dbscanResults, setDbscanResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [pipeline, setPipeline] = useState({
    step1_analyzed: false,
    step2_preprocessed: false,
    step3_detected: false,
    step4_results: false,
  })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleRunPipeline = async () => {
    if (!uploadedFile) {
      setError("Please select a file to upload")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Step 1: Analyze data
      console.log("Step 1: Analyzing data...")
      const analysisResult = await dbscanAnalyzeData(uploadedFile)
      setDataInfo(analysisResult.data_analysis as any)
      setPipeline((p) => ({ ...p, step1_analyzed: true }))

      // Step 2: Preprocess
      console.log("Step 2: Preprocessing data...")
      await dbscanPreprocess("ffill", "robust")
      setPipeline((p) => ({ ...p, step2_preprocessed: true }))

      // Step 3: Detect outliers
      console.log("Step 3: Detecting outliers with DBSCAN...")
      const detectionResult = await dbscanDetect(5.193866452787452, 5)
      setDetectionStats(detectionResult.detection_results)
      setPipeline((p) => ({ ...p, step3_detected: true }))

      // Step 4: Get detailed results
      console.log("Step 4: Getting results...")
      const results = await dbscanGetResults()
      setDbscanResults(results)
      setPipeline((p) => ({ ...p, step4_results: true }))

      console.log("Pipeline completed successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Pipeline error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = async () => {
    try {
      await resetPipeline()
      setUploadedFile(null)
      setDataInfo(null)
      setDetectionStats(null)
      setDbscanResults(null)
      setError(null)
      setPipeline({
        step1_analyzed: false,
        step2_preprocessed: false,
        step3_detected: false,
        step4_results: false,
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Reset failed"
      setError(errorMessage)
    }
  }

  // Use real data if available, otherwise fall back to mock data
  const currentDataInfo = dataInfo || (mockDataInfo as any)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Pipeline Status */}
        <Card>
          <CardHeader>
            <CardTitle>DBSCAN Pipeline</CardTitle>
            <CardDescription>
              Step-by-step outlier detection process with RobustScaler preprocessing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                { step: 1, label: "Analyze", done: pipeline.step1_analyzed },
                { step: 2, label: "Preprocess", done: pipeline.step2_preprocessed },
                { step: 3, label: "Detect", done: pipeline.step3_detected },
                { step: 4, label: "Results", done: pipeline.step4_results },
              ].map(({ step, label, done }) => (
                <div
                  key={step}
                  className={`rounded-lg border-2 p-4 text-center transition-all ${
                    done
                      ? "border-chart-1 bg-chart-1/10"
                      : isProcessing
                        ? "border-muted bg-muted/30"
                        : "border-border bg-muted/20"
                  }`}
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    Step {step}
                  </p>
                  <p className="text-lg font-bold text-foreground">{label}</p>
                  {done && <Badge className="mt-2 bg-chart-1">✓ Done</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Data Upload</CardTitle>
            <CardDescription>Upload a CSV file to analyze</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="flex-1"
                  disabled={isProcessing}
                />
                {uploadedFile && (
                  <Badge variant="secondary">{uploadedFile.name}</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleRunPipeline}
                  disabled={isProcessing || !uploadedFile}
                  className="px-6"
                >
                  {isProcessing ? "Processing..." : "Run Pipeline"}
                </Button>
                <Button
                  onClick={handleReset}
                  disabled={isProcessing}
                  variant="outline"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Visualizations */}
        {pipeline.step4_results && (
          <VisualizationSection
            results={dbscanResults}
          />
        )}


        {/* DBSCAN Detection Results */}
        {pipeline.step3_detected && dbscanResults && (
          <DBScanResultsSection
            results={{
              outlier_count: detectionStats?.outlier_count || 0,
              outlier_percentage: detectionStats?.outlier_percentage || 0,
              normal_count: detectionStats?.normal_count || 0,
              preprocessing_report: dbscanResults?.preprocessing_report,
            }}
          />
        )}

        

        {/* Data Overview */}
        {pipeline.step1_analyzed && (
          <Card>
            <CardHeader>
              <CardTitle>Dataset Overview</CardTitle>
              <CardDescription>Summary of uploaded data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="border-chart-1/20 bg-chart-1/5">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-chart-1">
                      Total Records
                    </p>
                    <p className="text-2xl font-bold text-chart-1">
                      {currentDataInfo.shape?.[0] || "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-chart-2/20 bg-chart-2/5">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-chart-2">
                      Features
                    </p>
                    <p className="text-2xl font-bold text-chart-2">
                      {currentDataInfo.shape?.[1] || "N/A"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-chart-3/20 bg-chart-3/5">
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-chart-3">
                      Data Shape
                    </p>
                    <p className="text-lg font-bold text-chart-3">
                      {currentDataInfo.shape?.[0]} × {currentDataInfo.shape?.[1]}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="mb-2 text-sm font-medium text-card-foreground">
                  Features:
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentDataInfo.columns?.map((col: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {col}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        

      </div>
    </div>
  )
}
