import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { createHash } from 'crypto'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_URL_DOMAINS = ['example.com', 'yourdomain.com'] // Add your allowed domains here

function isValidFileType(file: File): boolean {
  return ALLOWED_FILE_TYPES.includes(file.type)
}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return ALLOWED_URL_DOMAINS.includes(parsedUrl.hostname)
  } catch {
    return false
  }
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_')
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const imageUrl = formData.get('imageUrl') as string | null

    if (!file && !imageUrl) {
      return NextResponse.json({ error: 'No file or image URL provided' }, { status: 400 })
    }

    let input: { image: string; filename?: string }

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
      const sanitizedFilename = sanitizeFilename(file.name)
      input = { 
        image: `data:${mimeType};base64,${base64}`,
        filename: sanitizedFilename
      }
    } else if (imageUrl) {
      if (!isValidUrl(imageUrl)) {
        return NextResponse.json({ error: 'Invalid or disallowed image URL' }, { status: 400 })
      }
      input = { image: imageUrl }
    } else {
      // This case should never happen due to the earlier check, but it satisfies TypeScript
      return NextResponse.json({ error: 'No valid input provided' }, { status: 400 })
    }

    const prediction = await replicate.predictions.create({
      version: "da7d45f3b836795f945f221fc0b01a6d3ab7f5e163f13208948ad436001e2255",
      input: input,
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
      // Generate a unique filename for the processed image
      const hash = createHash('md5').update(predictionId).digest('hex')
      const filename = `processed_image_${hash}.png`

      return NextResponse.json({ 
        output: prediction.output,
        filename: filename
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