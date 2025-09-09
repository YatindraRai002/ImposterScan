export interface AnalysisResult {
  prediction: 'authentic' | 'deepfake'
  confidence: number
  is_authentic: boolean
  models_used: string[]
  processing_time: number
  evidence: {
    facial_inconsistencies: number
    temporal_artifacts: number
    compression_anomalies: number
  }
}

export interface AnalysisJob {
  id: string
  filename: string
  file_path: string
  file_type: 'image' | 'video' | 'audio'
  file_size: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  created_at: string
  started_at?: string
  completed_at?: string
  result?: AnalysisResult
  error?: string
  progress?: number
}

export interface UploadResponse {
  success: boolean
  job_id: string
  filename: string
  file_size: number
  file_type: string
  message: string
}

export interface ApiError {
  error: string
  message?: string
  details?: any
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  model_status: 'available' | 'loading' | 'unavailable'
  api_version: string
  timestamp: string
  uptime: number
  memory_usage?: {
    used: number
    total: number
    percentage: number
  }
}

export interface Statistics {
  total_files: number
  authentic_count: number
  deepfake_count: number
  processing_time_total: number
  average_processing_time: number
  success_rate: number
  model_accuracy: number
}

export interface FileWithProgress extends File {
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  result?: AnalysisResult
  error?: string
}