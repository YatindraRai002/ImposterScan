import axios from 'axios'
import {
  AnalysisJob,
  AnalysisResult,
  UploadResponse,
  SystemHealth,
  Statistics,
  ApiError
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError: ApiError = {
      error: error.response?.data?.error || error.message || 'Unknown error',
      message: error.response?.data?.message,
      details: error.response?.data?.details,
    }
    return Promise.reject(apiError)
  }
)

export class DeepFakeAPI {
  /**
   * Check system health
   */
  static async getHealth(): Promise<SystemHealth> {
    const response = await api.get('/api/health')
    return response.data
  }

  /**
   * Get model status
   */
  static async getModelStatus() {
    const response = await api.get('/api/models/status')
    return response.data
  }

  /**
   * Upload file for analysis
   */
  static async uploadFile(file: File, onUploadProgress?: (progress: number) => void): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onUploadProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onUploadProgress(progress)
        }
      },
    })

    return response.data
  }

  /**
   * Start analysis for uploaded file
   */
  static async startAnalysis(jobId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/api/analyze', { job_id: jobId })
    return response.data
  }

  /**
   * Get analysis job details
   */
  static async getJob(jobId: string): Promise<AnalysisJob> {
    const response = await api.get(`/api/jobs/${jobId}`)
    return response.data
  }

  /**
   * Get all analysis jobs
   */
  static async getAllJobs(): Promise<AnalysisJob[]> {
    const response = await api.get('/api/jobs')
    return response.data.jobs || []
  }

  /**
   * Upload and analyze multiple files
   */
  static async bulkAnalyze(
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<{
    success: boolean
    results: Array<{
      filename: string
      job_id: string
      result?: AnalysisResult
      error?: string
    }>
  }> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post('/api/analyze/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(0, progress) // For now, treat as single progress
        }
      },
    })

    return response.data
  }

  /**
   * Get system statistics
   */
  static async getStatistics(): Promise<Statistics> {
    const response = await api.get('/api/statistics')
    return response.data
  }

  /**
   * Poll job status until completion
   */
  static async pollJobStatus(
    jobId: string,
    onStatusUpdate?: (job: AnalysisJob) => void,
    pollInterval = 1000
  ): Promise<AnalysisJob> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const job = await this.getJob(jobId)
          
          if (onStatusUpdate) {
            onStatusUpdate(job)
          }

          if (job.status === 'completed') {
            resolve(job)
          } else if (job.status === 'failed') {
            reject(new Error(job.error || 'Analysis failed'))
          } else {
            setTimeout(poll, pollInterval)
          }
        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  }

  /**
   * Upload file and wait for analysis completion
   */
  static async uploadAndAnalyze(
    file: File,
    onUploadProgress?: (progress: number) => void,
    onStatusUpdate?: (job: AnalysisJob) => void
  ): Promise<AnalysisJob> {
    // Upload file
    const uploadResult = await this.uploadFile(file, onUploadProgress)
    
    // Start analysis
    await this.startAnalysis(uploadResult.job_id)
    
    // Poll for completion
    return this.pollJobStatus(uploadResult.job_id, onStatusUpdate)
  }

  /**
   * Download analysis results as CSV
   */
  static async downloadResults(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await api.get(`/api/export/${format}`, {
      responseType: 'blob',
    })
    return response.data
  }
}

export default DeepFakeAPI