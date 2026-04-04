import { useState } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface CsvUploadProps {
  onFileSelect?: (file: File) => void
  loading?: boolean
  error?: string | null
}

export function CsvUpload({ onFileSelect, loading = false, error = null }: CsvUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        setFileName(file.name)
        onFileSelect?.(file)
      } else {
        alert("Please drop a CSV file")
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      const file = files[0]
      setFileName(file.name)
      onFileSelect?.(file)
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-lg border-2 border-dashed transition-colors duration-200",
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/2"
      )}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInputChange}
        className="sr-only"
        id="csv-upload-input"
      />
      <label
        htmlFor="csv-upload-input"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 px-6 py-8 text-center"
      >
        <Upload className="h-8 w-8 text-primary" />
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            {loading 
              ? "Uploading..." 
              : fileName 
              ? `Loaded: ${fileName}` 
              : "Drag and drop your CSV file here"}
          </p>
          <p className="text-sm text-muted-foreground">
            or click to select a file
          </p>
        </div>
      </label>
      {error && (
        <div className="px-6 pb-4">
          <div className="rounded-md bg-destructive/10 border border-destructive p-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}
    </div>
  )
}
