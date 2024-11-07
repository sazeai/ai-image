'use client'

import { Suspense } from 'react'
import DashboardContent from '@/components/DashboardContent'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
