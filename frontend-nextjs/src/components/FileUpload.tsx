'use client'

import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, FileIcon, Image, Video, Music } from 'lucide-react'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'
import { cn, formatFileSize, getFileType, validateFile, generateId } from '@/lib/utils'
import { FileWithProgress } from '@/types'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFilesSelected: (files: FileWithProgress[]) => void
  maxFiles?: number
  disabled?: boolean
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelected, 
  maxFiles = 10, 
  disabled = false 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileWithProgress[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles: FileWithProgress[] = []
    
    acceptedFiles.forEach((file) => {
      const validation = validateFile(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid file')
        return
      }
      
      const fileWithProgress: FileWithProgress = Object.assign(file, {
        id: generateId(),
        progress: 0,
        status: 'pending' as const,
      })
      
      validFiles.push(fileWithProgress)
    })
    
    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles)
      setSelectedFiles(newFiles)
      onFilesSelected(newFiles)
      
      toast.success(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} added`)
    }
  }, [selectedFiles, maxFiles, onFilesSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
      'video/*': ['.mp4', '.avi', '.mov', '.webm', '.mkv', '.flv'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  })

  const removeFile = (fileId: string) => {
    const newFiles = selectedFiles.filter(f => f.id !== fileId)
    setSelectedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const clearAllFiles = () => {
    setSelectedFiles([])
    onFilesSelected([])
  }

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-gray-500'
      case 'uploading':
        return 'text-blue-500'
      case 'processing':
        return 'text-yellow-500'
      case 'completed':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardContent padding="lg">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className={cn(
                  'h-12 w-12',
                  isDragActive ? 'text-blue-500' : 'text-gray-400'
                )} />
              </div>
              <div>
                <p className="text-xl font-semibold text-gray-700">
                  {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
                </p>
                <p className="text-gray-500 mt-2">
                  or click to browse your files
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Image className="h-4 w-4" />
                  <span>Images</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Video className="h-4 w-4" />
                  <span>Videos</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Music className="h-4 w-4" />
                  <span>Audio</span>
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Max file size: 100MB • Supported formats: JPG, PNG, MP4, MP3, WAV, etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Selected Files ({selectedFiles.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFiles}
                leftIcon={<X className="h-4 w-4" />}
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-3">
              {selectedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(getFileType(file))}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className={getStatusColor(file.status)}>
                          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.progress > 0 && file.progress < 100 && (
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      disabled={file.status === 'processing'}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FileUpload