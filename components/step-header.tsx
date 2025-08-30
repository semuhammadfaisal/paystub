"use client"

import React from "react"

interface StepHeaderProps {
  step: number | string
  title: string
}

export function StepHeader({ step, title }: StepHeaderProps) {
  return (
    <div className="w-full bg-primary text-primary-foreground py-4 px-4 md:px-6">
      <div className="max-w-full flex items-center gap-3">
        <span className="text-xl font-extrabold tracking-tight">STEP {step}</span>
        <span className="text-xl md:text-2xl font-semibold">{title}</span>
      </div>
    </div>
  )
}


