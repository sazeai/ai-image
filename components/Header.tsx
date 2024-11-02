'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import LoginPopup from './LoginPopup'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const { data: session } = useSession()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [credits, setCredits] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (session) {
      fetchCredits()
    }
  }, [session])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [router])

  const fetchCredits = async () => {
    if (session?.user?.email) {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('email', session.user.email)
        .single()

      if (error) {
        console.error('Error fetching credits:', error)
      } else {
        setCredits(data.credits)
      }
    }
  }

  const handleLoginClick = () => {
    setShowLoginPopup(true)
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold hover:text-gray-200 transition-colors"
          >
            AI Image Generator
          </Link>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMenu}
              className="text-white hover:bg-gray-700"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <nav className="hidden md:block">
            <ul className="flex items-center space-x-4">
              {session ? (
                <>
                  <li>
                    <span className="text-sm">Welcome, {session.user?.name}</span>
                  </li>
                  <li>
                    <span className="text-sm">Credits: {credits}</span>
                  </li>
                  <li>
                    <Link href="/purchase-credits">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-transparent text-white border-white hover:bg-white hover:text-gray-800"
                      >
                        Buy Credits
                      </Button>
                    </Link>
                  </li>
                  <li>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      size="sm"
                      className="bg-transparent text-white border-white hover:bg-white hover:text-gray-800"
                    >
                      Logout
                    </Button>
                  </li>
                </>
              ) : (
                <li>
                  <Button 
                    onClick={handleLoginClick} 
                    size="sm"
                    className="bg-white text-gray-800 hover:bg-gray-200"
                  >
                    Login
                  </Button>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
              {session ? (
                <>
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium">Welcome, {session.user?.name}</div>
                    <div className="text-sm text-gray-300">Credits: {credits}</div>
                  </div>
                  <div className="space-y-2">
                    <Link 
                      href="/purchase-credits" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full bg-transparent text-white border-white hover:bg-white hover:text-gray-800"
                      >
                        Buy Credits
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleLogout} 
                      variant="outline" 
                      size="sm"
                      className="w-full bg-transparent text-white border-white hover:bg-white hover:text-gray-800"
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Button 
                  onClick={handleLoginClick} 
                  size="sm"
                  className="w-full bg-white text-gray-800 hover:bg-gray-200"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
    </header>
  )
}