export interface Form1099Data {
  // Basic Information
  taxYear: string

  // Payer Information
  payerName: string
  payerAddress: string
  payerCity: string
  payerState: string
  payerZip: string
  payerTIN: string
  payerPhone: string

  // Recipient Information
  recipientName: string
  recipientAddress: string
  recipientCity: string
  recipientState: string
  recipientZip: string
  recipientTIN: string
  accountNumber: string

  // Payment Information
  rents: number
  royalties: number
  otherIncome: number
  federalIncomeTax: number
  fishingBoatProceeds: number
  medicalHealthcare: number
  nonemployeeCompensation: number
  substitutePayments: number
  cropInsuranceProceeds: number
  grossProceedsAttorney: number
  section409ADeferrals: number
  stateIncomeTax: number
  stateNumber: string
  payerStateNumber: string
}

export async function generate1099PDF(data: Form1099Data): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  // Set canvas size for standard 1099 form
  canvas.width = 850
  canvas.height = 1100

  // White background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw 1099-MISC form structure
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 1

  // Main border
  ctx.strokeRect(20, 20, 810, 1060)

  // Header
  ctx.fillStyle = "#000000"
  ctx.font = "bold 16px Arial"
  ctx.fillText("Form 1099-MISC", 350, 50)
  ctx.font = "12px Arial"
  ctx.fillText("Miscellaneous Income", 340, 70)
  ctx.fillText(`${data.taxYear}`, 400, 90)

  // Payer section
  ctx.strokeRect(30, 110, 400, 180)
  ctx.font = "bold 10px Arial"
  ctx.fillText("PAYER'S name, street address, city or town, state or province,", 35, 125)
  ctx.fillText("country, ZIP or foreign postal code, and telephone no.", 35, 135)

  ctx.font = "12px Arial"
  ctx.fillText(data.payerName, 35, 155)
  ctx.fillText(`${data.payerAddress}`, 35, 175)
  ctx.fillText(`${data.payerCity}, ${data.payerState} ${data.payerZip}`, 35, 195)
  ctx.fillText(`Phone: ${data.payerPhone}`, 35, 215)

  ctx.font = "bold 10px Arial"
  ctx.fillText("PAYER'S TIN", 35, 235)
  ctx.font = "12px Arial"
  ctx.fillText(data.payerTIN, 35, 255)

  // Recipient section
  ctx.strokeRect(450, 110, 380, 180)
  ctx.font = "bold 10px Arial"
  ctx.fillText("RECIPIENT'S TIN", 455, 125)
  ctx.font = "12px Arial"
  ctx.fillText(data.recipientTIN, 455, 145)

  ctx.font = "bold 10px Arial"
  ctx.fillText("RECIPIENT'S name", 455, 165)
  ctx.font = "12px Arial"
  ctx.fillText(data.recipientName, 455, 185)

  ctx.font = "bold 10px Arial"
  ctx.fillText("Street address (including apt. no.)", 455, 205)
  ctx.font = "12px Arial"
  ctx.fillText(`${data.recipientAddress}`, 455, 225)

  ctx.font = "bold 10px Arial"
  ctx.fillText("City or town, state or province, country, and ZIP", 455, 245)
  ctx.font = "12px Arial"
  ctx.fillText(`${data.recipientCity}, ${data.recipientState} ${data.recipientZip}`, 455, 265)

  // Payment boxes
  const paymentBoxes = [
    { label: "1  Rents", value: data.rents, x: 30, y: 320 },
    { label: "2  Royalties", value: data.royalties, x: 230, y: 320 },
    { label: "3  Other income", value: data.otherIncome, x: 430, y: 320 },
    { label: "4  Federal income tax withheld", value: data.federalIncomeTax, x: 630, y: 320 },
    { label: "5  Fishing boat proceeds", value: data.fishingBoatProceeds, x: 30, y: 400 },
    { label: "6  Medical and health care payments", value: data.medicalHealthcare, x: 230, y: 400 },
    { label: "7  Nonemployee compensation", value: data.nonemployeeCompensation, x: 430, y: 400 },
    { label: "8  Substitute payments in lieu of dividends", value: data.substitutePayments, x: 630, y: 400 },
    { label: "9  Crop insurance proceeds", value: data.cropInsuranceProceeds, x: 30, y: 480 },
    { label: "10  Gross proceeds paid to an attorney", value: data.grossProceedsAttorney, x: 230, y: 480 },
    { label: "11  Section 409A deferrals", value: data.section409ADeferrals, x: 430, y: 480 },
  ]

  paymentBoxes.forEach((box) => {
    ctx.strokeRect(box.x, box.y, 180, 60)
    ctx.font = "bold 8px Arial"
    ctx.fillText(box.label, box.x + 5, box.y + 15)
    ctx.font = "12px Arial"
    ctx.fillText(`$${box.value.toFixed(2)}`, box.x + 5, box.y + 40)
  })

  // State tax information
  ctx.strokeRect(30, 580, 800, 80)
  ctx.font = "bold 10px Arial"
  ctx.fillText("15  State tax withheld", 35, 595)
  ctx.fillText("16  State/Payer's state no.", 235, 595)
  ctx.fillText("17  State income", 435, 595)

  ctx.font = "12px Arial"
  ctx.fillText(`$${data.stateIncomeTax.toFixed(2)}`, 35, 620)
  ctx.fillText(`${data.stateNumber}/${data.payerStateNumber}`, 235, 620)
  ctx.fillText(`$${data.stateIncomeTax.toFixed(2)}`, 435, 620)

  // Account number
  ctx.font = "bold 10px Arial"
  ctx.fillText("Account number (see instructions)", 30, 690)
  ctx.font = "12px Arial"
  ctx.fillText(data.accountNumber, 30, 710)

  // Footer
  ctx.font = "10px Arial"
  ctx.fillText("Form 1099-MISC (Rev. 1-2023)", 30, 1080)
  ctx.fillText("Department of the Treasury - Internal Revenue Service", 600, 1080)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, "image/png")
  })
}

export function download1099PDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
