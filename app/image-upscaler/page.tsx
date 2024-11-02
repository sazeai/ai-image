// app\image-upscaler\page.tsx


'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Download, Upload, RefreshCw } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import AdOverlay from '@/components/Adover'

export default function ImageUpscaler() {
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [resultImage, setResultImage] = useState('')
  const [originalImage, setOriginalImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('original')
  const [scale, setScale] = useState('2')
  const [showAdOverlay, setShowAdOverlay] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originalImage) {
      setError('Please upload an image first')
      return
    }
    setLoading(true)
    setError('')
    setResultImage('')
    setProgress(0)

    const formData = new FormData()
    if (file) {
      formData.append('file', file)
    } else if (imageUrl) {
      formData.append('imageUrl', imageUrl)
    }
    formData.append('scale', scale)

    try {
      const response = await fetch('/api/upscale-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to start image processing')
      }

      const data = await response.json()
      setPredictionId(data.predictionId)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while starting image processing.')
      setLoading(false)
    }
  }

  const checkPredictionStatus = useCallback(async (retryCount = 0) => {
    if (!predictionId) return
  
    try {
      const response = await fetch(`/api/upscale-image?id=${predictionId}`)
      if (!response.ok) {
        throw new Error('Failed to get prediction status')
      }
      const data = await response.json()
  
      if (data.output) {
        setResultImage(data.output)
        setLoading(false)
        setPredictionId(null)
        setProgress(100)
        setActiveTab('processed')
      } else if (data.error) {
        throw new Error(data.error)
      } else if (data.status === 'processing' || data.status === 'starting') {
        setProgress((prev) => Math.min(prev + 10, 90))
        const nextRetryCount = retryCount + 1
        const delay = Math.min(1000 * Math.pow(2, nextRetryCount), 30000) // Max delay of 30 seconds
        if (nextRetryCount < 10) { // Max 10 retries
          setTimeout(() => checkPredictionStatus(nextRetryCount), delay)
        } else {
          throw new Error('Maximum retries reached. Please try again.')
        }
      } else {
        throw new Error(`Unexpected prediction status: ${data.status}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred while checking image processing status.')
      setLoading(false)
      setPredictionId(null)
    }
  }, [predictionId])

  useEffect(() => {
    if (predictionId) {
      checkPredictionStatus()
    }
  }, [predictionId, checkPredictionStatus])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size exceeds 10MB limit')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed')
        return
      }
      setFile(selectedFile)
      setImageUrl('')
      setError('')
      setOriginalImage(URL.createObjectURL(selectedFile))
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value)
    setFile(null)
    setError('')
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (imageUrl) {
      setOriginalImage(imageUrl)
    }
  }

  const handleReset = () => {
    setImageUrl('')
    setFile(null)
    setResultImage('')
    setOriginalImage('')
    setLoading(false)
    setError('')
    setPredictionId(null)
    setProgress(0)
    setActiveTab('original')
    setScale('2')
  }

  const handleDownloaded = () => {
    setShowAdOverlay(true)
  }

  const handleAdOverlayClose = () => {
    setShowAdOverlay(false)
  }

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <CardTitle className="text-3xl font-bold text-center">AI Image Upscaler</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="upload" className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload Image</TabsTrigger>
              <TabsTrigger value="url">Image URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <div className="space-y-4">
                <Label htmlFor="file" className="block text-lg font-medium">
                  Upload an image (Max 10MB, JPEG/PNG/WebP)
                </Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">JPEG, PNG or WebP (MAX. 10MB)</p>
                    </div>
                    <Input
                      id="file"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="url">
              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <Label htmlFor="imageUrl" className="block text-lg font-medium">
                  Image URL
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    className="flex-grow"
                  />
                  <Button type="submit">Load</Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-4">
            <Label htmlFor="scale" className="block text-lg font-medium mb-2">
              Upscale Factor
            </Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select scale" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="4">4x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="flex items-center p-4 mt-4 text-red-800 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 mr-2" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {originalImage && (
            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="original">Original</TabsTrigger>
                  <TabsTrigger value="processed" disabled={!resultImage}>
                    Upscaled
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-4">
                  <div className="relative w-full h-64 md:h-96">
                    <Image src={originalImage} alt="Original image" layout="fill" objectFit="contain" />
                  </div>
                </TabsContent>
                <TabsContent value="processed" className="mt-4">
                  {resultImage ? (
                    <div className="relative w-full h-64 md:h-96">
                      <Image src={resultImage} alt="Upscaled image" layout="fill" objectFit="contain" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 md:h-96 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Processing not started yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                >
                  {loading ? 'Processing...' : 'Upscale Image'}
                </Button>
                <Button
                  onClick={handleReset}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              {loading && (
                <div className="mt-4 space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-center text-sm text-gray-500">Processing image... This may take a few moments.</p>
                </div>
              )}

              {resultImage && (
                <Button onClick={handleDownloaded} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Upscaled Image
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {showAdOverlay && (
        <AdOverlay
          imageUrl={resultImage}
          onClose={handleAdOverlayClose}
        />
      )}
    </div>
  )
}