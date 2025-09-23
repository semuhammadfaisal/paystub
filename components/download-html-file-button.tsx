"use client"

import { useState } from "react"
import { FileDown } from "lucide-react"
import type { PaystubData as GeneratorPaystubData } from "@/components/paystub-generator"

interface Props {
  data: GeneratorPaystubData
  label?: string
}

export function DownloadHtmlFileButton({ data, label = "Download HTML" }: Props) {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    try {
      setLoading(true)

      // Find the best capture container across all templates
      const elTarget = document.getElementById("paystub-capture-target") as HTMLElement | null
      const elVisible = document.getElementById("paystub-preview-capture") as HTMLElement | null
      const elSnapshot = document.getElementById("paystub-capture-snapshot") as HTMLElement | null

      // Prefer specific target when present; else visible wrapper; else snapshot clone
      let chosen: HTMLElement | null = elTarget || elVisible || elSnapshot
      if (!chosen) {
        alert("Preview element not found. Please make sure the preview is visible.")
        return
      }

      // For elements that use a capture target, include its parent to keep decorative overlays (e.g., watermarks)
      const containerForExport = (chosen.id === 'paystub-capture-target' ? (chosen.parentElement as HTMLElement) || chosen : chosen)
      // Clone and strip any elements marked as non-export (e.g., buttons)
      const clone = containerForExport.cloneNode(true) as HTMLElement
      const nonExport = clone.querySelectorAll('[data-nonexport="true"]')
      nonExport.forEach(n => n.parentNode?.removeChild(n))

      // Inline computed styles from the live DOM to the clone to preserve exact appearance
      try {
        const applyComputed = (src: Element, dst: HTMLElement) => {
          const cs = window.getComputedStyle(src as HTMLElement)
          const styleText: string[] = []
          // Copy all computed properties
          for (let i = 0; i < cs.length; i++) {
            const prop = cs.item(i)
            const val = cs.getPropertyValue(prop)
            // Skip extremely large or dynamic properties if desired
            styleText.push(`${prop}:${val}`)
          }
          dst.setAttribute('style', `${dst.getAttribute('style') || ''};${styleText.join(';')}`)
        }
        const walk = (srcNode: Element, dstNode: Element) => {
          if (dstNode instanceof HTMLElement) {
            applyComputed(srcNode, dstNode)
          }
          const srcChildren = Array.from(srcNode.children)
          const dstChildren = Array.from(dstNode.children)
          for (let i = 0; i < Math.min(srcChildren.length, dstChildren.length); i++) {
            walk(srcChildren[i], dstChildren[i])
          }
        }
        walk(containerForExport, clone)
      } catch (e) {
        console.warn('Failed to inline computed styles (continuing):', e)
      }
      const htmlFragment = clone.outerHTML

      // Minimal standalone HTML document using Tailwind CDN to honor utility classes and arbitrary values
      const title = `Paystub - ${data.templateId || "template"} - ${data.employeeName || "employee"}`
      const doc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html, body { background:#f0f0f0; margin:0; padding:20px; }
  </style>
</head>
<body>
${htmlFragment}
</body>
</html>`

      const blob = new Blob([doc], { type: "text/html;charset=utf-8" })
      const safeName = (data.employeeName || 'employee').replace(/[^a-z0-9\-_.]+/gi, '-')
      const filename = `paystub-${(data.templateId||'template').toString().toLowerCase()}-${safeName}.html`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Download HTML error:', e)
      alert('Failed to download HTML.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      data-nonexport="true"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium bg-white hover:bg-gray-50"
    >
      <FileDown className="w-4 h-4" />
      {loading ? 'Preparing…' : label}
    </button>
  )
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
