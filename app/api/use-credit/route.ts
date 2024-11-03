import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { data, error } = await supabase.rpc('use_credit', {
      p_user_email: session.user.email
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error using credit:', error)
    return NextResponse.json({ error: 'Failed to use credit' }, { status: 500 })
  }
}
