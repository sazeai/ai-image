import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false

      // Check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select()
        .eq('email', user.email)
        .single()

      if (!existingUser) {
        // Create new user in Supabase with initial credits
        const { error } = await supabase
          .from('users')
          .insert([
            {
              email: user.email,
              name: user.name,
              credits: 5, // Give 5 free credits to new users
            }
          ])
        
        if (error) return false
      }

      return true
    },
    async session({ session, token }) {
      if (session.user) {
        // Get user from Supabase
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        // Add the user ID to the session
        session.user.id = user?.id
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }