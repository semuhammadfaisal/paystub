"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

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
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    href="/create-paystub"
                    className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
                  >
                    Paystubs
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/create-w2"
                    className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
                  >
                    W2 Form
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary">
                    Tax Return
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md text-foreground"
                            href="/create-tax-return"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Tax Returns
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              File your taxes accurately and efficiently with our professional tax return services.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-foreground"
                            href="/create-tax-return/individual"
                          >
                            <div className="text-sm font-medium leading-none">Individual Tax Return</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Personal income tax filing for individuals
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground text-foreground"
                            href="/create-tax-return/business"
                          >
                            <div className="text-sm font-medium leading-none">Business Tax Return</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              Tax services for small businesses and entrepreneurs
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/create-1099"
                    className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
                  >
                    1099 Misc Form
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    href="/blogs"
                    className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
                  >
                    Blogs
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
