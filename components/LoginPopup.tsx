'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LoginPopupProps {
  onClose: () => void
}

export default function LoginPopup({ onClose }: LoginPopupProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/' })
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign in to use the AI Image Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleGoogleLogin} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <Button 
            onClick={onClose} 
            variant="outline" 
            className="w-full mt-2"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}