'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <Button onClick={() => signOut()}>
        Sign out
      </Button>
    )
  }
  return (
    <Button onClick={() => signIn('google')}>
      Sign in with Google
    </Button>
  )
}