"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [taxDropdownOpen, setTaxDropdownOpen] = useState(false)

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
                Paystubs
              </Link>

              <Link
                href="/contact"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                W2 Form
              </Link>

              {/* Custom Tax Return Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setTaxDropdownOpen(!taxDropdownOpen)}
                  onMouseEnter={() => setTaxDropdownOpen(true)}
                  onMouseLeave={() => setTaxDropdownOpen(false)}
                  className="flex items-center text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
                >
                  Tax Return
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${taxDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {taxDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-[600px] bg-white border rounded-md shadow-lg z-50"
                    onMouseEnter={() => setTaxDropdownOpen(true)}
                    onMouseLeave={() => setTaxDropdownOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-3 p-4">
                      <div className="row-span-3">
                        <Link
                          href="/contact"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none hover:shadow-md text-foreground transition-all"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Tax Returns
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            File your taxes accurately and efficiently with our professional tax return services.
                          </p>
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="/contact"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Individual Tax Return</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Personal income tax filing for individuals
                          </p>
                        </Link>
                      </div>
                      <div>
                        <Link
                          href="/contact"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Business Tax Return</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Tax services for small businesses and entrepreneurs
                          </p>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                1099 Misc Form
              </Link>

              <Link
                href="/blogs"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Blogs
              </Link>
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
                {/* Navigation buttons removed as requested */}
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
                Paystubs
              </Link>
              <Link
                href="/create-w2"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                W2 Form
              </Link>

              {/* Mobile Tax Return Dropdown */}
              <div className="px-4 py-2">
                <div className="text-foreground text-sm font-medium mb-2">Tax Return</div>
                <div className="ml-4 space-y-2">
                  <Link
                    href="/create-tax-return"
                    className="block text-foreground hover:text-primary text-sm py-1 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    Overview
                  </Link>
                  <Link
                    href="/create-tax-return/individual"
                    className="block text-foreground hover:text-primary text-sm py-1 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    Individual Tax Return
                  </Link>
                  <Link
                    href="/create-tax-return/business"
                    className="block text-foreground hover:text-primary text-sm py-1 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    Business Tax Return
                  </Link>
                </div>
              </div>

              <Link
                href="/create-1099"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                1099 Misc Form
              </Link>
              <Link
                href="/blogs"
                className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                Blogs
              </Link>
              {/* Support and Sign In links removed as requested */}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
