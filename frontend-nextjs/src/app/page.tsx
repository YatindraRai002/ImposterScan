'use client'

import React, { useState, useEffect } from 'react'
import { Shield, Brain, Zap, CheckCircle, Upload, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import FileUpload from '@/components/FileUpload'
import AnalysisResults from '@/components/AnalysisResults'
import { FileWithProgress, AnalysisJob, SystemHealth } from '@/types'
import DeepFakeAPI from '@/lib/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function HomePage() {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [results, setResults] = useState<AnalysisJob[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload')

  // Check system health on mount
  useEffect(() => {
    checkSystemHealth()
  }, [])

  const checkSystemHealth = async () => {
    try {
      const health = await DeepFakeAPI.getHealth()
      setSystemHealth(health)
    } catch (error) {
      console.error('Failed to check system health:', error)
      toast.error('Unable to connect to analysis server')
    }
  }

  const handleFilesSelected = (newFiles: FileWithProgress[]) => {
    setFiles(newFiles)
  }

  const startAnalysis = async () => {
    if (files.length === 0) {
      toast.error('Please select files to analyze')
      return
    }

    setIsAnalyzing(true)

    try {
      // Process files one by one
      for (const file of files) {
        // Update file status to uploading
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'uploading' } : f
        ))

        try {
          // Upload and analyze file
          const result = await DeepFakeAPI.uploadAndAnalyze(
            file,
            (progress) => {
              // Update upload progress
              setFiles(prev => prev.map(f => 
                f.id === file.id ? { ...f, progress } : f
              ))
            },
            (job) => {
              // Update analysis status
              setFiles(prev => prev.map(f => 
                f.id === file.id ? { 
                  ...f, 
                  status: job.status === 'processing' ? 'processing' : job.status,
                  progress: job.status === 'processing' ? 50 : job.status === 'completed' ? 100 : f.progress
                } : f
              ))
            }
          )

          // Update file status and add to results
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'completed', 
              progress: 100,
              result: result.result 
            } : f
          ))

          setResults(prev => [result, ...prev])
          
          toast.success(`Analysis completed for ${file.name}`)

        } catch (error) {
          console.error(`Analysis failed for ${file.name}:`, error)
          
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { 
              ...f, 
              status: 'error', 
              error: error instanceof Error ? error.message : 'Analysis failed'
            } : f
          ))

          toast.error(`Analysis failed for ${file.name}`)
        }
      }

      // Switch to results tab after analysis
      setActiveTab('results')

    } catch (error) {
      console.error('Batch analysis failed:', error)
      toast.error('Analysis process failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setFiles([])
    setResults([])
    setActiveTab('upload')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DeepFake Detector</h1>
                <p className="text-sm text-gray-500">AI-Powered Analysis</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {systemHealth && (
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                  systemHealth.status === 'healthy' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    systemHealth.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  <span>{systemHealth.status === 'healthy' ? 'Online' : 'Limited'}</span>
                </div>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Detect <span className="gradient-text">DeepFakes</span>
              <br />with AI Precision
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Advanced machine learning algorithms analyze images, videos, and audio files 
              to identify synthetic media with 96.1% accuracy.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">96.1%</div>
              <div className="text-gray-600">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10M+</div>
              <div className="text-gray-600">Files Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">2.8s</div>
              <div className="text-gray-600">Avg Processing Time</div>
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card className="text-center">
              <CardContent padding="lg">
                <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                <p className="text-gray-600">Advanced neural networks trained on millions of samples</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent padding="lg">
                <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Real-time analysis with results in seconds</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent padding="lg">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">High Accuracy</h3>
                <p className="text-gray-600">Industry-leading detection rates with detailed evidence</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span>Upload & Analyze</span>
                {files.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                    {files.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'results'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Results</span>
                {results.length > 0 && (
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                    {results.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <FileUpload 
                onFilesSelected={handleFilesSelected}
                disabled={isAnalyzing}
              />

              {files.length > 0 && (
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={startAnalysis}
                    loading={isAnalyzing}
                    size="lg"
                    className="px-8"
                  >
                    {isAnalyzing ? 'Analyzing Files...' : `Analyze ${files.length} File${files.length > 1 ? 's' : ''}`}
                  </Button>
                  
                  {!isAnalyzing && (
                    <Button
                      variant="outline"
                      onClick={resetAnalysis}
                      size="lg"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AnalysisResults results={results} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">DeepFake Detector</span>
          </div>
          <p className="text-gray-400 mb-4">
            Advanced AI-powered deepfake detection for a safer digital world.
          </p>
          <p className="text-gray-500 text-sm">
            © 2024 DeepFake Detection Team. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}