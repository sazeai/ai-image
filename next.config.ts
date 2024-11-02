import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['replicate.delivery', 'fal.media'],
  },
  env: {
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
}

export default nextConfig