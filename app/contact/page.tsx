"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Phone, Mail, Clock, AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const whatsappNumber = "+12067045757"
  const whatsappLink = `https://wa.me/12067045757?text=Hi%20SRS%20Financials,%20I%20need%20help%20with%20my%20financial%20documents.`
  const signalLink = `https://signal.me/#eu/+12067045757`

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with decorative background */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-secondary/30 blur-3xl"></div>
          <div className="absolute top-1/3 -right-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 mb-6">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              Fast, secure, and compliant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-foreground mb-6">
              Get Your Documents Now – Contact Us Directly!
            </h1>
            
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-4">
              Need Paystubs or W2? Chat With Us
            </p>
            
            <p className="text-base text-foreground/60 max-w-4xl mx-auto mb-8">
              Thank you for choosing SRS Financials. To place your order for Paystubs, Tax Returns, W2 Forms, or any other financial document, please contact us directly through any of the platforms below:
            </p>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                asChild
                size="lg" 
                className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Chat
                </a>
              </Button>
              
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg hover:bg-primary/10"
              >
                <a href={signalLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Signal Chat
                </a>
              </Button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-sm text-left">
                  <p className="font-medium leading-none">15-30 min response</p>
                  <p className="text-foreground/60">During business hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div className="text-sm text-left">
                  <p className="font-medium leading-none">Manual preparation</p>
                  <p className="text-foreground/60">Real-looking templates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-white p-4 shadow-sm">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div className="text-sm text-left">
                  <p className="font-medium leading-none">Message only</p>
                  <p className="text-foreground/60">No website orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8">Contact Methods</h2>
            
            {/* WhatsApp */}
            <div className="rounded-2xl border bg-white shadow-lg ring-1 ring-border p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">WhatsApp</h3>
                  <p className="text-foreground/60">Instant messaging support</p>
                </div>
              </div>
              <p className="text-foreground/70 mb-4">Number: <span className="font-semibold">{whatsappNumber}</span></p>
              <Button 
                asChild
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start WhatsApp Chat
                </a>
              </Button>
            </div>

            {/* Signal */}
            <div className="rounded-2xl border bg-white shadow-lg ring-1 ring-border p-8 mb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Signal</h3>
                  <p className="text-foreground/60">Secure messaging alternative</p>
                </div>
              </div>
              <p className="text-foreground/70 mb-4">Number: <span className="font-semibold">{whatsappNumber}</span></p>
              <Button 
                asChild
                variant="outline"
                className="w-full hover:bg-primary/10"
              >
                <a href={signalLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Start Signal Chat
                </a>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="rounded-2xl border bg-white shadow-lg ring-1 ring-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">Other Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-foreground/70">srssolutionltd@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-foreground/70">{whatsappNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <span className="text-foreground/70">Florida, USA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services Visual */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr from-secondary/30 to-primary/20 blur-2xl"></div>
            <div className="rounded-2xl border bg-white shadow-2xl ring-1 ring-border p-8">
              <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Our Services</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Paystubs", link: "/create-paystub", available: true },
                  { name: "W2 Form", link: "/contact", available: false },
                  { name: "Tax Return", link: "/contact", available: false },
                  { name: "1099-MISC", link: "/contact", available: false }
                ].map((service, index) => (
                  <Link
                    key={index}
                    href={service.link}
                    className={`text-center p-4 rounded-lg border-2 transition-all duration-200 ${
                      service.available 
                        ? "border-primary/20 bg-primary/5 hover:border-primary hover:bg-primary/10" 
                        : "border-border bg-muted/50 hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    <div className={`font-semibold ${
                      service.available ? "text-primary" : "text-foreground/70"
                    }`}>
                      {service.name}
                    </div>
                    <div className="text-xs text-foreground/50 mt-1">
                      {service.available ? "Create Now" : "Contact Us"}
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm text-foreground/60 text-center">
                  📢 Orders are only taken via WhatsApp or Signal messaging platforms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Button asChild size="lg" variant="outline" className="hover:bg-primary/10">
            <Link href="/">
              ← Back to Home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
