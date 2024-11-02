'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, CreditCard, Zap } from 'lucide-react'
import PayPalButton from './PayPalButton'
import { supabase } from '@/lib/supabase'
import LoginPopup from './LoginPopup'
import { toast } from "@/hooks/use-toast"

const CREDIT_PACKAGES = [
  { credits: 10, price: 2, popular: false },
  { credits: 50, price: 10, popular: true },
  { credits: 100, price: 20, popular: false },
]

export default function CreditPurchase() {
  const [selectedPackage, setSelectedPackage] = useState<typeof CREDIT_PACKAGES[0] | null>(null)
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const { data: session, status } = useSession()

  const purchaseCredits = async (transactionId: string): Promise<{ success: boolean; credits?: number; error?: any }> => {
    if (!session?.user?.email || !selectedPackage) {
      return { success: false, error: 'Invalid session or package' }
    }

    try {
      const { data, error } = await supabase.rpc('add_credits', {
        p_user_email: session.user.email,
        p_credits: selectedPackage.credits,
        p_amount: selectedPackage.price,
        p_transaction_id: transactionId
      })

      if (error) throw error

      if (data && data.success) {
        return { success: true, credits: data.credits }
      } else {
        throw new Error('Unexpected response from server')
      }
    } catch (error: any) {
      console.error('Error details:', JSON.stringify(error, null, 2))
      return { success: false, error }
    }
  }

  const handleSuccess = async (details: any) => {
    if (status !== 'authenticated') {
      setShowLoginPopup(true)
      return
    }

    setIsProcessing(true)

    const { success, credits, error } = await purchaseCredits(details.id)

    setIsProcessing(false)

    if (!success) {
      console.error('Error purchasing credits:', error)
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Purchase Successful",
        description: `You've successfully purchased ${credits} credits!`,
        variant: "default",
      })
      router.push(`/dashboard?purchase=success&credits=${credits}`)
    }
  }

  const closeLoginPopup = () => {
    setShowLoginPopup(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Purchase Credits</CardTitle>
          <CardDescription className="text-center">Choose a credit package to power your AI creations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            {CREDIT_PACKAGES.map((pkg) => (
              <Card 
                key={pkg.credits} 
                className={`relative overflow-hidden transition-all duration-300 ${
                  selectedPackage === pkg 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : 'hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-bl">
                    POPULAR
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-4xl font-bold text-center mb-2">{pkg.credits}</div>
                  <div className="text-sm text-center mb-4">Credits</div>
                  <div className="text-2xl font-semibold text-center mb-4">${pkg.price.toFixed(2)}</div>
                  <Button
                    onClick={() => setSelectedPackage(pkg)}
                    variant={selectedPackage === pkg ? "default" : "outline"}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {selectedPackage === pkg ? 'Selected' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedPackage && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Complete Your Purchase</h3>
              {!isProcessing ? (
                <PayPalButton
                  amount={selectedPackage.price}
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing your payment...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Why Purchase Credits?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <CreditCard className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Flexible Pricing</h3>
              <p>Pay only for what you need. Our credit system ensures you get the best value for your AI generations.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Zap className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p>Credits are added to your account immediately after purchase. Start creating amazing AI art right away!</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {showLoginPopup && <LoginPopup onClose={closeLoginPopup} />}
    </div>
  )
}