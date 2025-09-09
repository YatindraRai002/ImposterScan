import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DeepFake Detection System - AI-Powered Analysis',
  description: 'Advanced machine learning algorithms analyze images, videos, and audio files to identify synthetic media with high accuracy.',
  keywords: 'deepfake, detection, AI, machine learning, fraud prevention, synthetic media',
  authors: [{ name: 'DeepFake Detection Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 min-h-screen`}>
        <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-cyber-grid opacity-30" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}