import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { DashboardData, GraphState } from '@/lib/types'

interface DashboardState {
  // Data state
  data: DashboardData | null
  loading: boolean
  error: string | null
  
  // Graph state
  graphState: GraphState
  
  // Actions
  uploadCsv: (file: File) => Promise<void>
  setGraphState: (state: GraphState) => void
  clearData: () => void
  setError: (error: string | null) => void
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set) => ({
        data: null,
        loading: false,
        error: null,
        graphState: {},

        uploadCsv: async (file: File) => {
          set({ loading: true, error: null })
          
          try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/import/upload-data', {
              method: 'POST',
              body: formData,
            })

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.statusText}`)
            }

            const result = await response.json()
            
            const csvData: DashboardData = {
              columns: result.columns || [],
              rows: result.data || [],
              fileName: file.name,
            }
            
            set({ data: csvData, graphState: {} })
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload CSV'
            set({ error: errorMessage })
            console.error('CSV upload error:', err)
          } finally {
            set({ loading: false })
          }
        },

        setGraphState: (newState: GraphState) => {
          set((state) => ({
            graphState: { ...state.graphState, ...newState }
          }))
        },

        clearData: () => {
          set({ data: null, graphState: {}, error: null })
        },

        setError: (error: string | null) => {
          set({ error })
        },
      }),
      {
        name: 'dashboard-store',
        partialize: (state) => ({
          data: state.data,
          graphState: state.graphState,
        }),
      }
    ),
    { name: 'DashboardStore' }
  )
)
