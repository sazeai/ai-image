import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Image Generator',
  description: 'Generate images using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}