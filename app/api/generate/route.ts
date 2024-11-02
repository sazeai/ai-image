import { NextResponse } from 'next/server'
import { fal } from "@fal-ai/client"
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

fal.config({
  credentials: process.env.FAL_KEY
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface GenerationResult {
  images: Array<{ url: string }>
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check and deduct credit
    const { data: creditData, error: creditError } = await supabase.rpc('use_credit', {
      p_user_email: session.user.email
    })

    if (creditError || !creditData.success) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 })
    }

    const body = await req.json()
    const result = await fal.subscribe<GenerationResult>("fal-ai/flux/dev", {
      input: {
        prompt: body.prompt,
        image_size: body.image_size,
        num_inference_steps: body.num_inference_steps,
        guidance_scale: body.guidance_scale,
        seed: body.seed,
        num_images: body.num_images,
        enable_safety_checker: body.enable_safety_checker
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(update.logs.map((log) => log.message))
        }
      },
    })

    if (!result.data || !result.data.images || !Array.isArray(result.data.images)) {
      throw new Error('Invalid response format from API')
    }

    return NextResponse.json({ ...result.data.images[0], credits: creditData.credits })
  } catch (error) {
    console.error('Error generating image:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}