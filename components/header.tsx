"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check localStorage for mock user session
    const mockUser = localStorage.getItem("mockUser")
    if (mockUser) {
      setUser(JSON.parse(mockUser))
    }
  }, [])

  const handleSignOut = async () => {
    localStorage.removeItem("mockUser")
    setUser(null)
    window.location.href = "/login"
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold text-sm">SRS</div>
                <span className="text-primary font-bold text-lg">FINANCIALS</span>
              </div>
            </Link>
          </div>

          <nav className="hidden lg:block">
            <div className="flex items-center space-x-1">
              <Link
                href="/create-paystub"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Paystub
              </Link>
              <Link
                href="#documents"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Documents
              </Link>
              <Link
                href="#pricing"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                About Us
              </Link>
              <span className="px-3 py-2 text-sm font-medium rounded-md text-foreground/70">US</span>
            </div>
          </nav>

          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
            ) : user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleSignOut} variant="outline" size="sm" className="font-medium bg-transparent">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="#support" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="font-medium bg-transparent">
                    Get support
                  </Button>
                </Link>
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}

            <button
              className="lg:hidden p-2 rounded-md text-foreground hover:text-primary hover:bg-muted/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/50 py-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/create-paystub"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Paystub
              </Link>
              <Link
                href="#documents"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Documents
              </Link>
              <Link
                href="#pricing"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#about"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="#support"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Get support
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors sm:hidden"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
