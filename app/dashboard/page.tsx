'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Home, CreditCard, History } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const purchaseSuccess = searchParams.get('purchase') === 'success'
    const newCredits = searchParams.get('credits')
    
    if (purchaseSuccess && newCredits) {
      setShowSuccess(true)
      setCredits(parseInt(newCredits, 10))
    }

    // Simulate loading progress
    const timer = setTimeout(() => setProgress(100), 500)
    return () => clearTimeout(timer)
  }, [searchParams])

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto p-4 space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => router.push('/')} variant="outline">
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </div>
      
      {showSuccess && (
        <Alert>
          <AlertTitle>Purchase Successful!</AlertTitle>
          <AlertDescription>
            Your credits have been added to your account.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="credits" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credits">Credits</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="credits">
          <Card>
            <CardHeader>
              <CardTitle>Your Credits</CardTitle>
            </CardHeader>
            <CardContent>
              {credits !== null ? (
                <div className="space-y-4">
                  <p className="text-5xl font-bold text-center">{credits}</p>
                  <Progress value={progress} className="w-full" />
                  <Button className="w-full" onClick={() => router.push('/purchase')}>
                    <CreditCard className="mr-2 h-4 w-4" /> Buy More Credits
                  </Button>
                </div>
              ) : (
                <p className="text-center">Loading...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span>Purchase</span>
                  <span className="font-semibold">+50 credits</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Used</span>
                  <span className="font-semibold text-red-500">-1 credit</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Purchase</span>
                  <span className="font-semibold">+10 credits</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={() => router.push('/')}>
            Generate Image
          </Button>
          <Button variant="outline" onClick={() => router.push('/remove-bg')}>
            Remove Background
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
