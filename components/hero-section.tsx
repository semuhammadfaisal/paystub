import React from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Clock, Headphones } from "lucide-react";

export function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-secondary/30 blur-3xl"></div>
        <div className="absolute top-1/3 -right-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/4 h-96 w-96  rounded-full bg-secondary/20 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              Fast, secure, and compliant
            </div>

            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-foreground">
              Create professional paystubs in minutes
            </h1>

            <p className="mt-4 text-lg text-foreground/70">
              Generate Paystubs, W‑2s, 1099‑MISC, and Tax Returns with bank‑ready formatting.
              Simple workflow, instant export, and expert support when you need it.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/signup">
                <Button size="lg" className="px-6">
                  Get Started
                </Button>
              </Link>
              <Link href="/create-paystub" className="sm:ml-1">
                <Button size="lg" variant="outline" className="px-6 hover:bg-primary/10">
                  Generate a Paystub
                </Button>
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium leading-none">Bank‑ready</p>
                  <p className="text-foreground/60">Accurate and compliant</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium leading-none">2‑minute setup</p>
                  <p className="text-foreground/60">Fast and intuitive</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm">
                <Headphones className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="font-medium leading-none">24/7 support</p>
                  <p className="text-foreground/60">We’re here to help</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr from-secondary/30 to-primary/20 blur-2xl"></div>
            <div className="rounded-2xl border bg-white shadow-2xl ring-1 ring-border overflow-hidden">
              <img
                src="/paystubheroimag.png"
                alt="Paystub preview mockup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}