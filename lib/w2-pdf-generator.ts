export interface W2Data {
  // Basic Information
  taxYear: string

  // Employer Information
  employerName: string
  employerAddress: string
  employerCity: string
  employerState: string
  employerZip: string
  employerEIN: string
  employerPhone: string

  // Employee Information
  employeeName: string
  employeeAddress: string
  employeeCity: string
  employeeState: string
  employeeZip: string
  employeeSSN: string

  // Earnings and Taxes
  wagesAndTips: number
  federalIncomeTax: number
  socialSecurityWages: number
  socialSecurityTax: number
  medicareWages: number
  medicareTax: number
  socialSecurityTips: number
  allocatedTips: number
  dependentCareBenefits: number
  nonqualifiedPlans: number
  retirementPlan: boolean
  thirdPartySickPay: boolean

  // State Information
  stateWages: number
  stateIncomeTax: number
  localWages: number
  localIncomeTax: number
  localityName: string
}

export async function generateW2PDF(data: W2Data): Promise<Blob> {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")!

  // Set canvas size for standard W2 form
  canvas.width = 850
  canvas.height = 1100

  // White background
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw W2 form structure
  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 1

  // Main border
  ctx.strokeRect(20, 20, 810, 1060)

  // Header
  ctx.fillStyle = "#000000"
  ctx.font = "bold 16px Arial"
  ctx.fillText("Form W-2 Wage and Tax Statement", 300, 50)
  ctx.font = "12px Arial"
  ctx.fillText(`${data.taxYear}`, 400, 70)

  // Employer section (boxes a-f)
  ctx.strokeRect(30, 90, 400, 200)
  ctx.font = "bold 10px Arial"
  ctx.fillText("a  Employee's social security number", 35, 105)
  ctx.font = "12px Arial"
  ctx.fillText(data.employeeSSN, 35, 125)

  ctx.font = "bold 10px Arial"
  ctx.fillText("b  Employer identification number (EIN)", 35, 145)
  ctx.font = "12px Arial"
  ctx.fillText(data.employerEIN, 35, 165)

  ctx.font = "bold 10px Arial"
  ctx.fillText("c  Employer's name, address, and ZIP code", 35, 185)
  ctx.font = "12px Arial"
  ctx.fillText(data.employerName, 35, 205)
  ctx.fillText(`${data.employerAddress}`, 35, 225)
  ctx.fillText(`${data.employerCity}, ${data.employerState} ${data.employerZip}`, 35, 245)

  // Employee section
  ctx.font = "bold 10px Arial"
  ctx.fillText("d  Control number", 450, 105)

  ctx.fillText("e  Employee's first name and initial", 450, 145)
  ctx.font = "12px Arial"
  ctx.fillText(data.employeeName, 450, 165)

  ctx.font = "bold 10px Arial"
  ctx.fillText("f  Employee's address and ZIP code", 450, 185)
  ctx.font = "12px Arial"
  ctx.fillText(`${data.employeeAddress}`, 450, 205)
  ctx.fillText(`${data.employeeCity}, ${data.employeeState} ${data.employeeZip}`, 450, 225)

  // Wage and tax information boxes (1-20)
  const boxes = [
    { label: "1  Wages, tips, other compensation", value: data.wagesAndTips, x: 30, y: 320 },
    { label: "2  Federal income tax withheld", value: data.federalIncomeTax, x: 230, y: 320 },
    { label: "3  Social security wages", value: data.socialSecurityWages, x: 430, y: 320 },
    { label: "4  Social security tax withheld", value: data.socialSecurityTax, x: 630, y: 320 },
    { label: "5  Medicare wages and tips", value: data.medicareWages, x: 30, y: 380 },
    { label: "6  Medicare tax withheld", value: data.medicareTax, x: 230, y: 380 },
    { label: "7  Social security tips", value: data.socialSecurityTips, x: 430, y: 380 },
    { label: "8  Allocated tips", value: data.allocatedTips, x: 630, y: 380 },
    { label: "10  Dependent care benefits", value: data.dependentCareBenefits, x: 230, y: 440 },
    { label: "11  Nonqualified plans", value: data.nonqualifiedPlans, x: 430, y: 440 },
  ]

  boxes.forEach((box) => {
    ctx.strokeRect(box.x, box.y, 180, 50)
    ctx.font = "bold 8px Arial"
    ctx.fillText(box.label, box.x + 5, box.y + 15)
    ctx.font = "12px Arial"
    ctx.fillText(`$${box.value.toFixed(2)}`, box.x + 5, box.y + 35)
  })

  // State tax information
  ctx.strokeRect(30, 520, 800, 100)
  ctx.font = "bold 10px Arial"
  ctx.fillText("15  State", 35, 535)
  ctx.fillText("16  State wages, tips, etc.", 135, 535)
  ctx.fillText("17  State income tax", 335, 535)
  ctx.fillText("18  Local wages, tips, etc.", 535, 535)
  ctx.fillText("19  Local income tax", 635, 535)
  ctx.fillText("20  Locality name", 735, 535)

  ctx.font = "12px Arial"
  ctx.fillText(data.employerState, 35, 555)
  ctx.fillText(`$${data.stateWages.toFixed(2)}`, 135, 555)
  ctx.fillText(`$${data.stateIncomeTax.toFixed(2)}`, 335, 555)
  ctx.fillText(`$${data.localWages.toFixed(2)}`, 535, 555)
  ctx.fillText(`$${data.localIncomeTax.toFixed(2)}`, 635, 555)
  ctx.fillText(data.localityName, 735, 555)

  // Footer
  ctx.font = "10px Arial"
  ctx.fillText("Form W-2 (Rev. 1-2023)", 30, 1080)
  ctx.fillText("Department of the Treasury - Internal Revenue Service", 600, 1080)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!)
    }, "image/png")
  })
}

export function downloadW2PDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
