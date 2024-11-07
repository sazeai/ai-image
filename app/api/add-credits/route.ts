import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

    const { credits, amount, transactionId } = await req.json()

    const { data, error } = await supabase.rpc('add_credits', {
      p_user_email: session.user.email,
      p_credits: credits,
      p_amount: amount,
      p_transaction_id: transactionId
    })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error adding credits:', error)
    return NextResponse.json({ error: 'Failed to add credits' }, { status: 500 })
  }
}
