'use client'

import React from 'react'
import { CheckCircle, XCircle, Download, Share, Clock, FileIcon, Image, Video, Music } from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { 
  formatPercentage, 
  formatFileSize, 
  formatDuration, 
  getFileType,
  formatRelativeTime,
  getConfidenceBadgeColor,
  downloadFile
} from '@/lib/utils'
import { AnalysisJob } from '@/types'
import toast from 'react-hot-toast'
import DeepFakeAPI from '@/lib/api'

interface AnalysisResultsProps {
  results: AnalysisJob[]
  onExport?: () => void
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onExport }) => {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <Image className="h-6 w-6 text-blue-500" />
      case 'video':
        return <Video className="h-6 w-6 text-purple-500" />
      case 'audio':
        return <Music className="h-6 w-6 text-green-500" />
      default:
        return <FileIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const handleExportResults = async () => {
    try {
      const blob = await DeepFakeAPI.downloadResults('csv')
      const filename = `deepfake_analysis_${new Date().toISOString().split('T')[0]}.csv`
      downloadFile(blob, filename)
      toast.success('Results exported successfully!')
    } catch (error) {
      toast.error('Failed to export results')
    }
  }

  const handleShareResult = (result: AnalysisJob) => {
    const shareData = {
      filename: result.filename,
      prediction: result.result?.prediction || 'unknown',
      confidence: result.result ? formatPercentage(result.result.confidence) : '0%',
      timestamp: formatRelativeTime(result.created_at)
    }
    
    const shareText = `DeepFake Analysis Result:\n\nFile: ${shareData.filename}\nPrediction: ${shareData.prediction}\nConfidence: ${shareData.confidence}\nAnalyzed: ${shareData.timestamp}\n\nAnalyzed with DeepFake Detection System`
    
    if (navigator.share) {
      navigator.share({
        title: 'DeepFake Analysis Result',
        text: shareText,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
        toast.success('Result copied to clipboard!')
      })
    } else {
      navigator.clipboard.writeText(shareText)
      toast.success('Result copied to clipboard!')
    }
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent padding="lg">
          <div className="text-center py-8">
            <FileIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No analysis results yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Upload files to see analysis results here
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
        <div className="flex space-x-3">
          {onExport && (
            <Button
              variant="outline"
              leftIcon={<Download className="h-4 w-4" />}
              onClick={onExport}
            >
              Export All
            </Button>
          )}
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExportResults}
          >
            Download CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {results.map((result) => (
          <Card key={result.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(result.file_type)}
                  <div>
                    <CardTitle className="text-lg">{result.filename}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatFileSize(result.file_size)} • {result.file_type.toUpperCase()} • {formatRelativeTime(result.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {result.status === 'completed' && result.result && (
                    <>
                      {result.result.is_authentic ? (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          <span>Authentic</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          <XCircle className="h-4 w-4" />
                          <span>DeepFake</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {result.status === 'processing' && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4 animate-spin" />
                      <span>Processing</span>
                    </div>
                  )}
                  
                  {result.status === 'failed' && (
                    <div className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      <XCircle className="h-4 w-4" />
                      <span>Failed</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {result.status === 'completed' && result.result && (
                <div className="space-y-6">
                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Confidence Score</span>
                      <span className={`text-2xl font-bold ${getConfidenceBadgeColor(result.result.confidence).split(' ')[1]}`}>
                        {formatPercentage(result.result.confidence)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          result.result.is_authentic 
                            ? 'bg-gradient-to-r from-green-500 to-green-600' 
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`}
                        style={{ width: `${result.result.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Analysis Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Analysis Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processing Time:</span>
                          <span className="font-medium">{formatDuration(result.result.processing_time)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Models Used:</span>
                          <span className="font-medium">{result.result.models_used.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Scores */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Evidence Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Facial Inconsistencies</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${result.result.evidence.facial_inconsistencies * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">
                              {formatPercentage(result.result.evidence.facial_inconsistencies, 0)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Temporal Artifacts</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${result.result.evidence.temporal_artifacts * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">
                              {formatPercentage(result.result.evidence.temporal_artifacts, 0)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Compression Anomalies</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${result.result.evidence.compression_anomalies * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-10 text-right">
                              {formatPercentage(result.result.evidence.compression_anomalies, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Share className="h-4 w-4" />}
                      onClick={() => handleShareResult(result)}
                    >
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="h-4 w-4" />}
                      onClick={() => {
                        // Generate individual result export
                        const csvData = `Filename,File Type,Prediction,Confidence,Facial Inconsistencies,Temporal Artifacts,Compression Anomalies,Processing Time,Timestamp\n"${result.filename}",${result.file_type},${result.result.prediction},${formatPercentage(result.result.confidence)},${formatPercentage(result.result.evidence.facial_inconsistencies)},${formatPercentage(result.result.evidence.temporal_artifacts)},${formatPercentage(result.result.evidence.compression_anomalies)},${result.result.processing_time.toFixed(2)}s,${result.created_at}`
                        const blob = new Blob([csvData], { type: 'text/csv' })
                        downloadFile(blob, `${result.filename}_analysis.csv`)
                        toast.success('Result exported!')
                      }}
                    >
                      Export
                    </Button>
                  </div>
                </div>
              )}

              {result.status === 'failed' && (
                <div className="text-center py-6">
                  <XCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                  <p className="text-gray-600">Analysis failed</p>
                  <p className="text-sm text-red-500 mt-1">{result.error || 'Unknown error occurred'}</p>
                </div>
              )}

              {result.status === 'processing' && (
                <div className="text-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Analyzing file...</p>
                  <p className="text-sm text-gray-400 mt-1">This may take a few moments</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default AnalysisResults