import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/authOptions";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('credits')
      .eq('email', session.user.email)
      .single()

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ credits: data.credits });
  } catch (error) {
    console.error('Error getting credits:', error);
    return NextResponse.json({ error: 'Failed to get credits' }, { status: 500 });
  }
}
