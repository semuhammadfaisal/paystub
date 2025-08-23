"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Download, Eye, DollarSign, Calendar, TrendingUp } from "lucide-react"
import { signOut } from "@/lib/actions"
import DocumentViewer from "@/components/document-viewer"
import { generatePaystubPDF, downloadPDF, type PaystubData } from "@/lib/pdf-generator"

interface DashboardClientProps {
  user: any
  paystubs: any[]
  orders: any[]
}

export default function DashboardClient({ user, paystubs, orders }: DashboardClientProps) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedPaystub, setSelectedPaystub] = useState<PaystubData | null>(null)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const handleSignOut = async () => {
    await signOut()
  }

  const handleViewPaystub = (paystub: any) => {
    setSelectedPaystub(paystub)
    setViewerOpen(true)
  }

  const handleDownloadPaystub = async (paystub: any) => {
    setIsDownloading(paystub.id)
    try {
      const pdfBlob = await generatePaystubPDF(paystub)
      const filename = `paystub-${paystub.employee_name.replace(/\s+/g, "-")}-${paystub.pay_date}.png`
      downloadPDF(pdfBlob, filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(null)
    }
  }

  // Calculate statistics
  const totalSpent = orders.reduce((sum, order) => sum + Number.parseFloat(order.amount), 0)
  const thisMonthPaystubs = paystubs.filter((p) => {
    const created = new Date(p.created_at)
    const now = new Date()
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold text-sm">SRS</div>
              <span className="text-primary font-bold text-lg">FINANCIALS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your paystubs and financial documents</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Paystubs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paystubs.length}</div>
              <p className="text-xs text-muted-foreground">Generated documents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{thisMonthPaystubs}</div>
              <p className="text-xs text-muted-foreground">New paystubs created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">On document packages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">Customer account</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Paystubs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Paystubs</CardTitle>
                <CardDescription>Your recently generated paystub documents</CardDescription>
              </CardHeader>
              <CardContent>
                {paystubs.length > 0 ? (
                  <div className="space-y-4">
                    {paystubs.slice(0, 5).map((paystub) => (
                      <div key={paystub.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <FileText className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-medium">
                              {paystub.employee_name} - {paystub.pay_period_start} to {paystub.pay_period_end}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Generated on {new Date(paystub.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-medium text-green-600">${paystub.net_pay.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewPaystub(paystub)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPaystub(paystub)}
                            disabled={isDownloading === paystub.id}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {isDownloading === paystub.id ? "..." : "Download"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No paystubs created yet</p>
                    <Link href="/create-paystub">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Paystub
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders */}
            {orders.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your recent document package purchases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium capitalize">{order.package_type} Package</p>
                            <p className="text-sm text-muted-foreground">
                              Ordered on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                          <span className="font-medium">${order.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Create new documents or manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/create-paystub">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Paystub
                  </Button>
                </Link>
                <Link href="/create-w2">
                  <Button variant="outline" className="w-full bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate W2 Form
                  </Button>
                </Link>
                <Link href="/create-tax-return">
                  <Button variant="outline" className="w-full bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Tax Return
                  </Button>
                </Link>
                <Link href="/create-1099">
                  <Button variant="outline" className="w-full bg-transparent">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate 1099 Form
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        paystubData={selectedPaystub}
        title="Paystub Preview"
      />
    </div>
  )
}
