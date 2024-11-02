import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type)
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const imageUrl = formData.get('imageUrl') as string | null
    const style = formData.get('style') as string
    const prompt = formData.get('prompt') as string
    const negativePrompt = formData.get('negativePrompt') as string
    const promptStrength = parseFloat(formData.get('promptStrength') as string)
    const denoisingStrength = parseFloat(formData.get('denoisingStrength') as string)

    if (!file && !imageUrl) {
      return NextResponse.json({ error: 'No file or image URL provided' }, { status: 400 })
    }

    let input: { image: string }

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File size exceeds the maximum limit of 10MB' }, { status: 400 })
      }
      if (!isValidFileType(file)) {
        return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64 = buffer.toString('base64')
      const mimeType = file.type
      input = { image: `data:${mimeType};base64,${base64}` }
    } else if (imageUrl) {
      input = { image: imageUrl }
    } else {
      return NextResponse.json({ error: 'No valid input provided' }, { status: 400 })
    }

    const prediction = await replicate.predictions.create({
      version: "a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf",
      input: {
        ...input,
        style,
        prompt,
        lora_scale: 1, // Default value
        negative_prompt: negativePrompt,
        prompt_strength: promptStrength,
        denoising_strength: denoisingStrength,
        instant_id_strength: 0.8, // Default value
        control_depth_strength: 0.8 // Default value
      },
    })

    return NextResponse.json({ predictionId: prediction.id })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to start image processing' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const predictionId = searchParams.get('id')

  if (!predictionId) {
    return NextResponse.json({ error: 'No prediction ID provided' }, { status: 400 })
  }

  try {
    const prediction = await replicate.predictions.get(predictionId)

    if (prediction.status === 'succeeded') {
      return NextResponse.json({ 
        output: prediction.output
      })
    } else if (prediction.status === 'failed') {
      return NextResponse.json({ error: 'Image processing failed' }, { status: 500 })
    } else {
      return NextResponse.json({ status: prediction.status })
    }
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to get prediction status' }, { status: 500 })
  }
}