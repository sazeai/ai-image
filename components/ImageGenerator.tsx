'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import AdOverlay from './AdOverlay'
import LoginPopup from './LoginPopup'
import { supabase } from '@/lib/supabase'
import { useSession } from "next-auth/react"
import Link from 'next/link'

const IMAGE_SIZES = {
  square_hd: 'Square HD',
  square: 'Square',
  portrait_4_3: 'Portrait 4:3',
  portrait_16_9: 'Portrait 16:9',
  landscape_4_3: 'Landscape 4:3',
  landscape_16_9: 'Landscape 16:9',
}

interface GenerationParams {
  prompt: string
  image_size: keyof typeof IMAGE_SIZES
  num_inference_steps: number
  guidance_scale: number
  seed?: number
  enable_safety_checker: boolean
}

const initialParams: GenerationParams = {
  prompt: "",
  image_size: "square",
  num_inference_steps: 28,
  guidance_scale: 3.5,
  enable_safety_checker: true
}

export default function ImageGenerator() {
  const [params, setParams] = useState<GenerationParams>(initialParams)
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [showAdOverlay, setShowAdOverlay] = useState(false)
  const [credits, setCredits] = useState(0)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchCredits()
    }
  }, [session])

  const fetchCredits = async () => {
    if (session?.user?.email) {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('email', session.user.email)
        .single()

      if (error) {
        console.error('Error fetching credits:', error)
      } else {
        setCredits(data.credits)
      }
    }
  }

  const handleInputInteraction = () => {
    if (status !== 'authenticated') {
      setShowLoginPopup(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status !== 'authenticated') {
      setShowLoginPopup(true)
      return
    }
    
    setIsGenerating(true)
    setImageUrl(null)
    setLoadingProgress(0)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('Invalid input: ' + (data.error || 'Please check your input parameters.'))
        } else {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }
      }

      if (!data || !data.url) {
        throw new Error('Invalid response format from API')
      }

      setImageUrl(data.url)
      await fetchCredits() // Fetch updated credits after successful generation
    } catch (err) {
      console.error('Error generating image:', err)
      setErrorMessage(err instanceof Error ? err.message : 'An error occurred while generating the image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setParams(initialParams)
    setImageUrl(null)
    setLoadingProgress(0)
    setErrorMessage(null)
  }

  const handleDownload = () => {
    if (imageUrl) {
      setShowAdOverlay(true)
    }
  }

  const handleCloseAdOverlay = () => {
    setShowAdOverlay(false)
  }

  const getImagePreviewStyle = () => {
    switch (params.image_size) {
      case 'portrait_4_3':
      case 'portrait_16_9':
        return 'aspect-[3/4] w-full max-w-[512px]'
      case 'landscape_4_3':
      case 'landscape_16_9':
        return 'aspect-[4/3] w-full max-w-[768px]'
      default:
        return 'aspect-square w-full max-w-[512px]'
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Card className="w-full md:w-[30%] md:h-screen md:overflow-y-auto">
        <CardContent className="p-4">
          <div className="mb-4 flex justify-between items-center">
            <span>Credits: {credits}</span>
            <Link href="/purchase-credits">
              <Button variant="outline">Buy Credits</Button>
            </Link>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h2>Free AI Influencer Generator</h2>
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea
                id="prompt"
                value={params.prompt}
                onChange={(e) => setParams({...params, prompt: e.target.value})}
                onFocus={handleInputInteraction}
                placeholder="Enter your image description"
                required
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_size">Image Size</Label>
              <Select
                value={params.image_size}
                onValueChange={(value: keyof typeof IMAGE_SIZES) => setParams({...params, image_size: value})}
                onOpenChange={handleInputInteraction}
              >
                <SelectTrigger id="image_size">
                  <SelectValue placeholder="Select image size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(IMAGE_SIZES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="num_inference_steps">Inference Steps</Label>
              <Input
                id="num_inference_steps"
                type="number"
                value={params.num_inference_steps}
                onChange={(e) => setParams({...params, num_inference_steps: Number(e.target.value)})}
                onFocus={handleInputInteraction}
                min={1}
                max={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guidance_scale">Guidance Scale</Label>
              <Input
                id="guidance_scale"
                type="number"
                value={params.guidance_scale}
                onChange={(e) => setParams({...params, guidance_scale: Number(e.target.value)})}
                onFocus={handleInputInteraction}
                min={1}
                max={20}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seed">Seed (optional)</Label>
              <Input
                id="seed"
                type="number"
                value={params.seed || ''}
                onChange={(e) => setParams({...params, seed: e.target.value ? Number(e.target.value) : undefined})}
                onFocus={handleInputInteraction}
                placeholder="Random seed for reproducible generation"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable_safety_checker"
                checked={params.enable_safety_checker}
                onCheckedChange={(checked) => {
                  handleInputInteraction()
                  setParams({...params, enable_safety_checker: checked})
                }}
              />
              <Label htmlFor="enable_safety_checker">Enable Safety Checker</Label>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="w-full" disabled={isGenerating}>
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </form>
          {errorMessage && (
            <div className="text-red-500 mt-2">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="w-full md:w-[70%] md:h-screen dotted-bg flex flex-col flex justify-center items-center p-4">
        <div className={`bg-white rounded-lg shadow flex items-center justify-center ${getImagePreviewStyle()} relative overflow-hidden`}>
          {isGenerating && (
            <div className="absolute inset-0 bg-gray-200 z-10">
              <div 
                className="h-1 bg-blue-500 transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
              <p className="text-center mt-4">Generating: {loadingProgress}%</p>
            </div>
          )}
          {imageUrl ? (
            <div className="relative w-full h-full transition-opacity duration-500 ease-in-out opacity-0" style={{ opacity: isGenerating ? 0 : 1 }}>
              <Image
                src={imageUrl}
                alt="Generated image"
                fill
                className="object-contain rounded-lg"
              />
              <Button
                className="absolute bottom-2 right-2"
                onClick={handleDownload}
              >
                Download
              </Button>
            </div>
          ) : (
            <p className="text-gray-500">Your Art Will Appear Here..</p>
          )}
        </div>
      </div>

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}

      {showAdOverlay && (
        <AdOverlay imageUrl={imageUrl} onClose={handleCloseAdOverlay} />
      )}
    </div>
  )
}