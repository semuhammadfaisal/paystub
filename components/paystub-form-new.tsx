"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { StepHeader } from "@/components/step-header"
import type { PaystubData } from "@/components/paystub-generator"
import { useState, useEffect } from "react"
import { calculateTaxes, type TaxCalculationInput } from "@/lib/tax-calculator"
import { TaxTooltip } from "@/components/tax-tooltip"

interface PaystubFormProps {
  data: PaystubData
  onUpdate: (updates: Partial<PaystubData>) => void
}

export function PaystubForm({ data, onUpdate }: PaystubFormProps) {
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({})
  // Optional: lock effective tax rates based on a reference scenario (e.g., salary = 1,000,000)
  const [lockedRates, setLockedRates] = useState<null | {
    medicareRate: number
    socialSecurityRate: number
    federalRate: number
    stateRate: number
  }>(null)

  // Auto-calculate taxes when component loads or key data changes
  useEffect(() => {
    // Ensure salary uses per-period amount, not annual
    const grossPay = data.payType === "hourly" 
      ? ((data.hourlyRate || 0) * (data.hoursWorked || 0)) + ((data.overtimeRate || 0) * (data.overtimeHours || 0))
      : (data.salary && data.numberOfPaystubs
          ? data.salary / data.numberOfPaystubs
          : (data.salary || 0))
    
    if (grossPay > 0) {
      if (lockedRates) {
        const medicare = grossPay * lockedRates.medicareRate
        const socialSecurity = grossPay * lockedRates.socialSecurityRate
        const federalTax = grossPay * lockedRates.federalRate
        const stateTax = grossPay * lockedRates.stateRate
        const totalDeductions = medicare + socialSecurity + federalTax + stateTax
        const netPay = grossPay - totalDeductions
        onUpdate({
          medicare,
          socialSecurity,
          federalTax,
          stateTax,
          totalDeductions,
          netPay,
          grossPay
        })
      } else {
        const taxInput: TaxCalculationInput = {
          grossPay,
          payFrequency: data.payFrequency || 'bi-weekly',
          maritalStatus: data.maritalStatus || 'single', 
          exemptions: data.exemptions || 0,
          taxState: data.taxState || 'CA', // Default to California for testing
          ytdGrossPay: 0 // Force YTD to 0 to ensure SS tax calculates properly
        }
        
        console.log('Tax calculation input:', taxInput)
        const taxResult = calculateTaxes(taxInput)
        console.log('Tax calculation result:', taxResult)
        
        // Always update taxes to ensure they're calculated
        onUpdate({
          medicare: taxResult.medicare + taxResult.additionalMedicare,
          socialSecurity: taxResult.socialSecurity,
          federalTax: taxResult.federalTax,
          stateTax: taxResult.stateTax,
          totalDeductions: taxResult.totalDeductions,
          netPay: taxResult.netPay,
          grossPay
        })

        // If the user is using the 1,000,000 salary reference, capture effective rates for later use
        if (data.payType === 'salary' && data.salary === 1_000_000 && data.numberOfPaystubs) {
          const effectiveRates = {
            medicareRate: (taxResult.medicare + taxResult.additionalMedicare) / grossPay,
            socialSecurityRate: taxResult.socialSecurity / grossPay,
            federalRate: taxResult.federalTax / grossPay,
            stateRate: taxResult.stateTax / grossPay,
          }
          setLockedRates(effectiveRates)
        }
      }
    }
  }, [data.hourlyRate, data.hoursWorked, data.overtimeRate, data.overtimeHours, data.salary, data.numberOfPaystubs, data.payType, data.payFrequency, data.maritalStatus, data.exemptions, data.taxState, data.ytdGrossPay])

  const setDisplay = (key: string, val: string) => {
    setDisplayValues((prev) => ({ ...prev, [key]: val }))
  }

  const getDisplay = (key: string, fallback: string) => {
    if (Object.prototype.hasOwnProperty.call(displayValues, key)) {
      return displayValues[key]
    }
    // If fallback is a number string that equals '0', return empty string
    return fallback === '0' ? '' : fallback
  }

  const toNumber = (v: string) => (v.trim() === "" ? 0 : Number.parseFloat(v))

  // Helper function to get maximum paystubs based on frequency
  const getMaxPaystubs = (frequency: string): number => {
    switch (frequency?.toLowerCase()) {
        case 'daily': return 52 // Daily paystubs numbered 1-52
      case 'weekly': return 52
      case 'bi-weekly': return 26
      case 'semi-monthly': return 24
      case 'monthly': return 12
      case 'quarterly': return 4
      case 'semi-annually': return 2
      case 'annually': return 1
      default: return 26 // Default to bi-weekly
    }
  }

  // Helper function to calculate gross pay per period based on annual salary and total paystubs required
  const calculateGrossPayPerPeriod = (annualSalary: number, numberOfPaystubs: number): number => {
    if (numberOfPaystubs <= 0) return 0
    return annualSalary / numberOfPaystubs
  }

  // Helper function to calculate YTD Total based on pay period number
  const calculateYTDTotal = (amountPerPeriod: number, payPeriodNumber: number): number => {
    // YTD Total = per-period amount × pay period number
    return amountPerPeriod * (payPeriodNumber || 1)
  }

  // Helper function to calculate Prior YTD based on pay period number
  const calculatePriorYTD = (amountPerPeriod: number, payPeriodNumber: number): number => {
    // Prior YTD = per-period amount × (pay period number - 1)
    const periodsBeforeCurrent = Math.max(0, (payPeriodNumber || 1) - 1)
    return amountPerPeriod * periodsBeforeCurrent
  }

  // Helper function to auto-determine pay period number based on pay date and frequency
  const calculatePayPeriodNumber = (payDate: string, frequency: string): number => {
    if (!payDate) return 1
    
    const date = new Date(payDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 1-12
    const dayOfMonth = date.getDate()
    
    switch (frequency?.toLowerCase()) {
      case 'daily':
        // For daily: approximate based on business days (5 days/week)
        const weekOfYear = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))
        return Math.min(weekOfYear, 52)
      case 'weekly':
        const weekNum = Math.ceil((date.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24 * 7))
        return Math.min(weekNum, 52)
      case 'bi-weekly':
        // For bi-weekly: calculate based on which bi-weekly period in the year
        const startOfYear = new Date(year, 0, 1)
        const daysDiff = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))
        const biWeeklyPeriod = Math.ceil((daysDiff + 1) / 14)
        return Math.min(biWeeklyPeriod, 26)
      case 'semi-monthly':
        // Two periods per month: 1st-15th and 16th-end
        return (month - 1) * 2 + (dayOfMonth <= 15 ? 1 : 2)
      case 'monthly':
        return month
      case 'quarterly':
        return Math.ceil(month / 3)
      case 'semi-annually':
        return month <= 6 ? 1 : 2
      case 'annually':
        return 1
      default:
        return 1
    }
  }

  const handleInputChange = (field: keyof PaystubData, value: string | number | boolean) => {
    const updates: Partial<PaystubData> = { [field]: value }
    
    // Auto-sync all state fields when tax state is changed
    if (field === 'taxState' && typeof value === 'string') {
      updates.companyState = value
      updates.employeeState = value
    }
    
    // Auto-calculate pay period number when pay date or frequency changes
    if ((field === 'payDate' || field === 'payFrequency') && data.payDate && data.payFrequency) {
      const payDate = field === 'payDate' ? value as string : data.payDate
      const frequency = field === 'payFrequency' ? value as string : data.payFrequency
      updates.payPeriodNumber = calculatePayPeriodNumber(payDate, frequency)
    }
    
    // Trigger recalculation when key fields change
    if (field === 'hourlyRate' || field === 'hoursWorked' || field === 'overtimeRate' || field === 'overtimeHours' || 
        field === 'salary' || field === 'payType' || field === 'payFrequency' || field === 'maritalStatus' || field === 'exemptions' || field === 'taxState' || field === 'payPeriodNumber' || field === 'payDate' || field === 'numberOfPaystubs') {
      
      // Calculate with the new value
      const newData = { ...data, ...updates }
      
      // Calculate gross pay per period
      let grossPay = 0
      if (newData.payType === "salary" && newData.salary && newData.numberOfPaystubs) {
        // For salary: calculate per-period amount based on annual salary and total paystubs required
        grossPay = calculateGrossPayPerPeriod(newData.salary, newData.numberOfPaystubs)
      } else if (newData.payType === "hourly") {
        // For hourly: use traditional calculation
        const regularPay = (newData.hourlyRate || 0) * (newData.hoursWorked || 0)
        const overtimePay = (newData.overtimeRate || 0) * (newData.overtimeHours || 0)
        grossPay = regularPay + overtimePay
      }
      updates.grossPay = grossPay
      
      // Auto-calculate taxes if we have sufficient data
      if (grossPay > 0 && newData.payFrequency && newData.maritalStatus && newData.taxState) {
        if (lockedRates) {
          updates.medicare = grossPay * lockedRates.medicareRate
          updates.socialSecurity = grossPay * lockedRates.socialSecurityRate
          updates.federalTax = grossPay * lockedRates.federalRate
          updates.stateTax = grossPay * lockedRates.stateRate
          updates.totalDeductions = (updates.medicare || 0) + (updates.socialSecurity || 0) + (updates.federalTax || 0) + (updates.stateTax || 0)
          updates.netPay = grossPay - (updates.totalDeductions || 0)
        } else {
          const taxInput: TaxCalculationInput = {
            grossPay,
            payFrequency: newData.payFrequency,
            maritalStatus: newData.maritalStatus,
            exemptions: newData.exemptions || 0,
            taxState: newData.taxState,
            ytdGrossPay: newData.ytdGrossPay || 0
          }
          
          const taxResult = calculateTaxes(taxInput)
          
          // Update tax fields with calculated values
          updates.medicare = taxResult.medicare + taxResult.additionalMedicare
          updates.socialSecurity = taxResult.socialSecurity
          updates.federalTax = taxResult.federalTax
          updates.stateTax = taxResult.stateTax
          updates.totalDeductions = taxResult.totalDeductions
          updates.netPay = taxResult.netPay

          // Capture effective rates when the reference salary is used
          if (newData.payType === 'salary' && newData.salary === 1_000_000 && newData.numberOfPaystubs) {
            setLockedRates({
              medicareRate: (updates.medicare || 0) / grossPay,
              socialSecurityRate: (updates.socialSecurity || 0) / grossPay,
              federalRate: (updates.federalTax || 0) / grossPay,
              stateRate: (updates.stateTax || 0) / grossPay,
            })
          }
        }
        
        // Auto-calculate YTD values based on pay period number
        const payPeriodNum = newData.payPeriodNumber || 1
        // Calculate YTD totals: (amount per period) × (pay period number)
        // Debug: Log values to identify the issue
        // Fix: Use the displayed gross pay value for YTD calculations
        const displayedGrossPay = newData.grossPay || grossPay
        console.log('YTD Debug - grossPay:', grossPay, 'displayedGrossPay:', displayedGrossPay, 'payPeriodNum:', payPeriodNum)
        updates.ytdGrossPay = calculateYTDTotal(displayedGrossPay, payPeriodNum)
        updates.ytdMedicare = calculateYTDTotal(updates.medicare, payPeriodNum)
        updates.ytdSocialSecurity = calculateYTDTotal(updates.socialSecurity, payPeriodNum)
        updates.ytdFederalTax = calculateYTDTotal(updates.federalTax, payPeriodNum)
        updates.ytdStateTax = calculateYTDTotal(updates.stateTax, payPeriodNum)
        updates.ytdTotalDeductions = calculateYTDTotal(updates.totalDeductions, payPeriodNum)
        updates.ytdNetPay = calculateYTDTotal(updates.netPay, payPeriodNum)
      } else if (grossPay > 0) {
        // Simplified auto-calculation with defaults if some fields missing
        const defaultPayFrequency = newData.payFrequency || 'bi-weekly'
        const defaultMaritalStatus = newData.maritalStatus || 'single'
        const defaultTaxState = newData.taxState || 'CA' // Default to California
        
        if (lockedRates) {
          updates.medicare = grossPay * lockedRates.medicareRate
          updates.socialSecurity = grossPay * lockedRates.socialSecurityRate
          updates.federalTax = grossPay * lockedRates.federalRate
          updates.stateTax = grossPay * lockedRates.stateRate
          updates.totalDeductions = (updates.medicare || 0) + (updates.socialSecurity || 0) + (updates.federalTax || 0) + (updates.stateTax || 0)
          updates.netPay = grossPay - (updates.totalDeductions || 0)
        } else {
          const taxInput: TaxCalculationInput = {
            grossPay,
            payFrequency: defaultPayFrequency,
            maritalStatus: defaultMaritalStatus,
            exemptions: newData.exemptions || 0,
            taxState: defaultTaxState,
            ytdGrossPay: 0 // Force YTD to 0 to ensure SS tax calculates properly
          }
          
          const taxResult = calculateTaxes(taxInput)
          
          // Update tax fields with calculated values (using defaults)
          updates.medicare = taxResult.medicare + taxResult.additionalMedicare
          updates.socialSecurity = taxResult.socialSecurity
          updates.federalTax = taxResult.federalTax
          updates.stateTax = taxResult.stateTax
          updates.totalDeductions = taxResult.totalDeductions
          updates.netPay = taxResult.netPay

          // Capture effective rates when the reference salary is used
          if (newData.payType === 'salary' && newData.salary === 1_000_000 && newData.numberOfPaystubs) {
            setLockedRates({
              medicareRate: (updates.medicare || 0) / grossPay,
              socialSecurityRate: (updates.socialSecurity || 0) / grossPay,
              federalRate: (updates.federalTax || 0) / grossPay,
              stateRate: (updates.stateTax || 0) / grossPay,
            })
          }
        }
        
        // Auto-calculate YTD values based on pay period number
        const payPeriodNum = newData.payPeriodNumber || 1
        // Calculate YTD totals: (amount per period) × (pay period number)
        // Debug: Log values to identify the issue
        // Fix: Use the displayed gross pay value for YTD calculations
        const displayedGrossPay = newData.grossPay || grossPay
        console.log('YTD Debug - grossPay:', grossPay, 'displayedGrossPay:', displayedGrossPay, 'payPeriodNum:', payPeriodNum)
        updates.ytdGrossPay = calculateYTDTotal(displayedGrossPay, payPeriodNum)
        updates.ytdMedicare = calculateYTDTotal(updates.medicare, payPeriodNum)
        updates.ytdSocialSecurity = calculateYTDTotal(updates.socialSecurity, payPeriodNum)
        updates.ytdFederalTax = calculateYTDTotal(updates.federalTax, payPeriodNum)
        updates.ytdStateTax = calculateYTDTotal(updates.stateTax, payPeriodNum)
        updates.ytdTotalDeductions = calculateYTDTotal(updates.totalDeductions, payPeriodNum)
        updates.ytdNetPay = calculateYTDTotal(updates.netPay, payPeriodNum)
      } else {
        // Manual calculation if no gross pay
        const totalDeductions = (updates.medicare || data.medicare || 0) + 
                               (updates.socialSecurity || data.socialSecurity || 0) + 
                               (updates.federalTax || data.federalTax || 0) + 
                               (updates.stateTax || data.stateTax || 0)
        updates.totalDeductions = totalDeductions
        updates.netPay = grossPay - totalDeductions
      }
    }
    
    onUpdate(updates)
  }

  // Calculate gross pay for current period (for display only)
  const calculateGrossPay = () => {
    if (data.payType === "hourly") {
      const regularPay = (data.hourlyRate || 0) * (data.hoursWorked || 0)
      const overtimePay = (data.overtimeRate || 0) * (data.overtimeHours || 0)
      return regularPay + overtimePay
    } else if (data.payType === "salary" && data.salary && data.numberOfPaystubs) {
      return calculateGrossPayPerPeriod(data.salary, data.numberOfPaystubs)
    } else {
      return data.salary || 0
    }
  }

  // Calculate total deductions for current period (for display only)
  const calculateTotalDeductions = () => {
    return (data.medicare || 0) + (data.socialSecurity || 0) + (data.federalTax || 0) + (data.stateTax || 0)
  }

  // Calculate net pay for current period (for display only)
  const calculateNetPay = () => {
    return calculateGrossPay() - calculateTotalDeductions()
  }

  return (
    <div className="space-y-0">
      {/* Custom Teal Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">STEP 2</span>
          <span className="text-lg">Paystub Details</span>
        </div>
      </div>
      
      {/* Form Content */}
      <div className="bg-white p-6 rounded-b-lg border border-gray-200 border-t-0">
        <div className="mb-4 text-sm text-gray-600">
          * Indicates required field.
        </div>
        
        {/* Basic Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Payment Type</Label>
              <ToggleGroup
                type="single"
                value={data.payType}
                onValueChange={(value) => value && handleInputChange("payType", value as "hourly" | "salary")}
                className="w-full max-w-sm"
              >
                <ToggleGroupItem 
                  value="hourly" 
                  className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                >
                  {data.payType === "hourly" ? "✓ " : ""}HOURLY
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="salary" 
                  className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                >
                  {data.payType === "salary" ? "✓ " : ""}SALARY
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Employment Type
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">?</span>
                </div>
              </Label>
              <ToggleGroup
                type="single"
                value={data.employmentType}
                onValueChange={(value) => value && handleInputChange("employmentType", value)}
                className="w-full max-w-sm"
              >
                <ToggleGroupItem 
                  value="employee" 
                  className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                >
                  {data.employmentType === "employee" ? "✓ " : ""}EMPLOYEE
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="contractor" 
                  className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                >
                  {data.employmentType === "contractor" ? "✓ " : ""}CONTRACTOR
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Email address
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">?</span>
                </div>
              </Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Payment frequency</Label>
              <Select value={data.payFrequency} onValueChange={(value) => handleInputChange("payFrequency", value)}>
                <SelectTrigger className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                  <SelectValue placeholder="Bi-Weekly (ex: every other Wednesday)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly (ex: every Friday)</SelectItem>
                  <SelectItem value="bi-weekly">Bi-Weekly (ex: every other Wednesday)</SelectItem>
                  <SelectItem value="semi-monthly">Semi-Monthly (ex: 1st and 15th)</SelectItem>
                  <SelectItem value="monthly">Monthly (ex: 1st of month only)</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annually">Semi-Annually</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Number of paystubs required</Label>
              <Select
                value={data.numberOfPaystubs.toString()}
                onValueChange={(value) => handleInputChange("numberOfPaystubs", parseInt(value))}
              >
                <SelectTrigger className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                  <SelectValue placeholder="1 paystub" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: getMaxPaystubs(data.payFrequency) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} paystub{num !== 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-500">
                Max for {data.payFrequency || 'bi-weekly'}: {getMaxPaystubs(data.payFrequency)} paystubs/year
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                State to be used in tax calculations
                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">?</span>
                </div>
              </Label>
              <Select value={data.taxState} onValueChange={(value) => handleInputChange("taxState", value)}>
                <SelectTrigger className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                  <SelectValue placeholder="State *" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AL">Alabama</SelectItem>
                  <SelectItem value="AK">Alaska</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="AR">Arkansas</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="CT">Connecticut</SelectItem>
                  <SelectItem value="DE">Delaware</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="HI">Hawaii</SelectItem>
                  <SelectItem value="ID">Idaho</SelectItem>
                  <SelectItem value="IL">Illinois</SelectItem>
                  <SelectItem value="IN">Indiana</SelectItem>
                  <SelectItem value="IA">Iowa</SelectItem>
                  <SelectItem value="KS">Kansas</SelectItem>
                  <SelectItem value="KY">Kentucky</SelectItem>
                  <SelectItem value="LA">Louisiana</SelectItem>
                  <SelectItem value="ME">Maine</SelectItem>
                  <SelectItem value="MD">Maryland</SelectItem>
                  <SelectItem value="MA">Massachusetts</SelectItem>
                  <SelectItem value="MI">Michigan</SelectItem>
                  <SelectItem value="MN">Minnesota</SelectItem>
                  <SelectItem value="MS">Mississippi</SelectItem>
                  <SelectItem value="MO">Missouri</SelectItem>
                  <SelectItem value="MT">Montana</SelectItem>
                  <SelectItem value="NE">Nebraska</SelectItem>
                  <SelectItem value="NV">Nevada</SelectItem>
                  <SelectItem value="NH">New Hampshire</SelectItem>
                  <SelectItem value="NJ">New Jersey</SelectItem>
                  <SelectItem value="NM">New Mexico</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="NC">North Carolina</SelectItem>
                  <SelectItem value="ND">North Dakota</SelectItem>
                  <SelectItem value="OH">Ohio</SelectItem>
                  <SelectItem value="OK">Oklahoma</SelectItem>
                  <SelectItem value="OR">Oregon</SelectItem>
                  <SelectItem value="PA">Pennsylvania</SelectItem>
                  <SelectItem value="RI">Rhode Island</SelectItem>
                  <SelectItem value="SC">South Carolina</SelectItem>
                  <SelectItem value="SD">South Dakota</SelectItem>
                  <SelectItem value="TN">Tennessee</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="UT">Utah</SelectItem>
                  <SelectItem value="VT">Vermont</SelectItem>
                  <SelectItem value="VA">Virginia</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                  <SelectItem value="WV">West Virginia</SelectItem>
                  <SelectItem value="WI">Wisconsin</SelectItem>
                  <SelectItem value="WY">Wyoming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="space-y-0 mt-8">
        {/* Custom Teal Header */}
        <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">STEP 3</span>
            <span className="text-lg">Company Information</span>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="bg-white p-6 rounded-b-lg border border-gray-200 border-t-0">
          <div className="mb-4 text-sm text-gray-600">
            * Indicates required field.
          </div>
          
          {/* Company Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="companyName"
                  value={data.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Employer (Company) Name"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="companyPhone"
                  value={data.companyPhone || ""}
                  onChange={(e) => handleInputChange("companyPhone", e.target.value)}
                  placeholder="Employer Telephone Number"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="companyAddress"
                  value={data.companyAddress}
                  onChange={(e) => handleInputChange("companyAddress", e.target.value)}
                  placeholder="Street Address 1"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="companyAddress2"
                  value={data.companyAddress2 || ""}
                  onChange={(e) => handleInputChange("companyAddress2", e.target.value)}
                  placeholder="Street Address 2"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="companyCity"
                  value={data.companyCity}
                  onChange={(e) => handleInputChange("companyCity", e.target.value)}
                  placeholder="City"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Select value={data.companyState} onValueChange={(value) => handleInputChange("companyState", value)}>
                  <SelectTrigger className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    <SelectValue placeholder="State *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Input
                  id="companyZip"
                  value={data.companyZip}
                  onChange={(e) => handleInputChange("companyZip", e.target.value)}
                  placeholder="Zip code"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Information Section */}
      <div className="space-y-0 mt-8">
        {/* Custom Teal Header */}
        <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">STEP 4</span>
            <span className="text-lg">Employee Information</span>
          </div>
        </div>
        
        {/* Form Content */}
        <div className="bg-white p-6 rounded-b-lg border border-gray-200 border-t-0">
          <div className="mb-4 text-sm text-gray-600">
            * Indicates required field.
          </div>
          
          {/* Employee Information Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  id="employeeName"
                  value={data.employeeName}
                  onChange={(e) => handleInputChange("employeeName", e.target.value)}
                  placeholder="Employee Name *"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeeSSN"
                  value={data.employeeSSN}
                  onChange={(e) => handleInputChange("employeeSSN", e.target.value)}
                  placeholder="Employee Social (last 4 digits)"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                  maxLength={4}
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeeId"
                  value={data.employeeId}
                  onChange={(e) => handleInputChange("employeeId", e.target.value)}
                  placeholder="Employee ID"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeePhone"
                  value={data.employeePhone}
                  onChange={(e) => handleInputChange("employeePhone", e.target.value)}
                  placeholder="Employee Phone Number"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeeAddress"
                  value={data.employeeAddress}
                  onChange={(e) => handleInputChange("employeeAddress", e.target.value)}
                  placeholder="Employee Address 1 *"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeeAddress2"
                  value={data.employeeAddress2 || ""}
                  onChange={(e) => handleInputChange("employeeAddress2", e.target.value)}
                  placeholder="Employee Address 2"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeeCity"
                  value={data.employeeCity}
                  onChange={(e) => handleInputChange("employeeCity", e.target.value)}
                  placeholder="City"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Select value={data.employeeState} onValueChange={(value) => handleInputChange("employeeState", value)}>
                  <SelectTrigger className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    <SelectValue placeholder="State *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    <SelectItem value="AR">Arkansas</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="CO">Colorado</SelectItem>
                    <SelectItem value="CT">Connecticut</SelectItem>
                    <SelectItem value="DE">Delaware</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="HI">Hawaii</SelectItem>
                    <SelectItem value="ID">Idaho</SelectItem>
                    <SelectItem value="IL">Illinois</SelectItem>
                    <SelectItem value="IN">Indiana</SelectItem>
                    <SelectItem value="IA">Iowa</SelectItem>
                    <SelectItem value="KS">Kansas</SelectItem>
                    <SelectItem value="KY">Kentucky</SelectItem>
                    <SelectItem value="LA">Louisiana</SelectItem>
                    <SelectItem value="ME">Maine</SelectItem>
                    <SelectItem value="MD">Maryland</SelectItem>
                    <SelectItem value="MA">Massachusetts</SelectItem>
                    <SelectItem value="MI">Michigan</SelectItem>
                    <SelectItem value="MN">Minnesota</SelectItem>
                    <SelectItem value="MS">Mississippi</SelectItem>
                    <SelectItem value="MO">Missouri</SelectItem>
                    <SelectItem value="MT">Montana</SelectItem>
                    <SelectItem value="NE">Nebraska</SelectItem>
                    <SelectItem value="NV">Nevada</SelectItem>
                    <SelectItem value="NH">New Hampshire</SelectItem>
                    <SelectItem value="NJ">New Jersey</SelectItem>
                    <SelectItem value="NM">New Mexico</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="NC">North Carolina</SelectItem>
                    <SelectItem value="ND">North Dakota</SelectItem>
                    <SelectItem value="OH">Ohio</SelectItem>
                    <SelectItem value="OK">Oklahoma</SelectItem>
                    <SelectItem value="OR">Oregon</SelectItem>
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="RI">Rhode Island</SelectItem>
                    <SelectItem value="SC">South Carolina</SelectItem>
                    <SelectItem value="SD">South Dakota</SelectItem>
                    <SelectItem value="TN">Tennessee</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="UT">Utah</SelectItem>
                    <SelectItem value="VT">Vermont</SelectItem>
                    <SelectItem value="VA">Virginia</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                    <SelectItem value="WV">West Virginia</SelectItem>
                    <SelectItem value="WI">Wisconsin</SelectItem>
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Input
                  id="employeeZip"
                  value={data.employeeZip}
                  onChange={(e) => handleInputChange("employeeZip", e.target.value)}
                  placeholder="Zip code"
                  className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Exemptions *</Label>
                <Select
                  value={data.exemptions.toString()}
                  onValueChange={(value) => handleInputChange("exemptions", parseInt(value))}
                >
                  <SelectTrigger className="border border-gray-300 rounded px-3 py-2 focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Marital Status</Label>
                <ToggleGroup
                  type="single"
                  value={data.maritalStatus}
                  onValueChange={(value) => value && handleInputChange("maritalStatus", value)}
                  className="w-full max-w-sm"
                >
                  <ToggleGroupItem 
                    value="single" 
                    className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                  >
                    ✓ SINGLE
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="married" 
                    className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                  >
                    MARRIED
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Direct Deposit</Label>
                <ToggleGroup
                  type="single"
                  value={data.directDeposit ? "yes" : "no"}
                  onValueChange={(value) => value && handleInputChange("directDeposit", value === "yes")}
                  className="w-full max-w-sm"
                >
                  <ToggleGroupItem 
                    value="no" 
                    className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                  >
                    ✓ NO
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="yes" 
                    className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                  >
                    YES
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 5 - Earnings Statement Section */}
      <div className="space-y-0 mt-8">
        {/* Custom Teal Header */}
        <div className="bg-primary text-primary-foreground px-6 py-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold">STEP 5</span>
            <span className="text-lg">Earnings Statement</span>
          </div>
        </div>
        
        {/* Paystub Selector */}
        <div className="bg-primary text-primary-foreground px-6 py-3">
          <Select
            value={`PAYSTUB #${data.payPeriodNumber} - Pay period: ${data.payPeriodStart} to ${data.payPeriodEnd}`}
            onValueChange={(value) => {
              // Handle paystub selection if needed
            }}
          >
            <SelectTrigger className="bg-primary border-none text-primary-foreground hover:bg-primary/90 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paystub1">PAYSTUB #1 - Pay period: 08/17/2025 to 08/30/2025</SelectItem>
              <SelectItem value="paystub2">PAYSTUB #2 - Pay period: 08/31/2025 to 09/13/2025</SelectItem>
              <SelectItem value="paystub3">PAYSTUB #3 - Pay period: 09/14/2025 to 09/27/2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Form Content */}
        <div className="bg-white p-6 rounded-b-lg border border-gray-200 border-t-0">
        
          {/* Pay Period Section */}
          <div className="space-y-6 mb-8">
            {/* Pay period number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Pay period number</Label>
              <Select
                value={(data.payPeriodNumber || 1).toString()}
                onValueChange={(value) => handleInputChange("payPeriodNumber", parseInt(value))}
              >
                <SelectTrigger className="w-48 border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: getMaxPaystubs(data.payFrequency) }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      Pay period #{num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-gray-500 mt-1">
                💡 <strong>Note:</strong> Pay Period #1 shows $0.00 Prior YTD (no previous periods). 
                Select higher periods (e.g., #5, #10) to see Prior YTD calculations.
              </div>
            </div>

            {/* Pay period and Pay date */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Pay period 
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">?</span>
                  </div>
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={data.payPeriodStart}
                    onChange={(e) => handleInputChange("payPeriodStart", e.target.value)}
                                            className="border-b-2 border-primary rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    type="date"
                    value={data.payPeriodEnd}
                    onChange={(e) => handleInputChange("payPeriodEnd", e.target.value)}
                                            className="border-b-2 border-primary rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  Pay date
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">?</span>
                  </div>
                </Label>
                <Input
                  type="date"
                  value={data.payDate}
                  onChange={(e) => handleInputChange("payDate", e.target.value)}
                                          className="border-b-2 border-primary rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Earnings Table */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">EARNINGS</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">RATE</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">HOURS</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">TOTAL</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700 border-r border-gray-200 flex items-center justify-center gap-1">
                      PRIOR YTD
                      <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">?</span>
                      </div>
                    </th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700">YTD TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">Regular</td>
                    <td className="p-4 border-r border-gray-200">
                      {data.payType === "salary" ? (
                        <Input
                          type="text"
                          value={getDisplay('salary', String(data.salary || ''))}
                          onChange={(e) => {
                            const v = e.target.value
                            setDisplay('salary', v)
                            handleInputChange("salary", toNumber(v))
                          }}
                          className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                          placeholder="Salary Amount"
                        />
                      ) : (
                        <Input
                          type="text"
                          value={getDisplay('hourlyRate', String(data.hourlyRate || ''))}
                          onChange={(e) => {
                            const v = e.target.value
                            setDisplay('hourlyRate', v)
                            handleInputChange("hourlyRate", toNumber(v))
                          }}
                          className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                          placeholder="Hourly Rate"
                        />
                      )}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="text"
                        value={getDisplay('hoursWorked', String(data.hoursWorked || ''))}
                        onChange={(e) => {
                          const v = e.target.value
                          setDisplay('hoursWorked', v)
                          handleInputChange("hoursWorked", toNumber(v))
                        }}
                        disabled={data.payType === "salary"}
                        className={`text-center border-b-2 rounded-none border-t-0 border-l-0 border-r-0 text-sm ${
                          data.payType === "salary" 
                            ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed" 
                            : "border-teal-500 bg-transparent"
                        }`}
                        placeholder=""
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium border-r border-gray-200">
                      {(() => {
                        if (data.payType === "salary") {
                          const perPeriod = calculateGrossPay();
                          return perPeriod ? perPeriod.toFixed(2) : '';
                        } else {
                          const result = (data.hourlyRate || 0) * (data.hoursWorked || 0);
                          return result ? result.toFixed(2) : '';
                        }
                      })()}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {(() => {
                          const currentGross = calculateGrossPay()
                          const priorYTD = calculatePriorYTD(currentGross, data.payPeriodNumber || 1)
                          return priorYTD.toFixed(2)
                        })()}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {(() => {
                        const currentGross = calculateGrossPay()
                        return calculateYTDTotal(currentGross, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">Overtime</td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="text"
                        value={getDisplay('overtimeRate', String(data.overtimeRate || ''))}
                        onChange={(e) => {
                          const v = e.target.value
                          setDisplay('overtimeRate', v)
                          handleInputChange("overtimeRate", toNumber(v))
                        }}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder=""
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="text"
                        value={getDisplay('overtimeHours', String(data.overtimeHours || ''))}
                        onChange={(e) => {
                          const v = e.target.value
                          setDisplay('overtimeHours', v)
                          handleInputChange("overtimeHours", toNumber(v))
                        }}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder=""
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium border-r border-gray-200">
                      {(() => {
                        const result = (data.overtimeRate || 0) * (data.overtimeHours || 0);
                        return result ? result.toFixed(2) : '';
                      })()}
                    </td>
                    <td className="p-4 text-center text-sm border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {(() => {
                          const currentOvertime = (data.overtimeRate || 0) * (data.overtimeHours || 0)
                          const priorYTD = calculatePriorYTD(currentOvertime, data.payPeriodNumber || 1)
                          return priorYTD.toFixed(2)
                        })()}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {(() => {
                        const currentOvertime = (data.overtimeRate || 0) * (data.overtimeHours || 0)
                        return calculateYTDTotal(currentOvertime, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                 
                  <tr className="bg-gray-50">
                    <td className="p-4 text-sm font-semibold text-gray-700 border-r border-gray-200"></td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">GROSS PAY</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{calculateGrossPay() ? calculateGrossPay().toFixed(2) : ''}</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                      {(() => {
                        const currentGross = calculateGrossPay()
                        const priorYTD = calculatePriorYTD(currentGross, data.payPeriodNumber || 1)
                        return priorYTD.toFixed(2)
                      })()}
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700">
                      {(() => {
                        const currentGross = calculateGrossPay()
                        return calculateYTDTotal(currentGross, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deductions Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">DEDUCTIONS</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">TOTAL</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">PRIOR YTD</th>
                    <th className="text-center p-4 text-sm font-semibold text-gray-700">YTD TOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200 flex items-center gap-2">
                      FICA - Medicare
                      <TaxTooltip type="medicare" maritalStatus={data.maritalStatus} />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {data.medicare ? data.medicare.toFixed(2) : '0.00'}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {(() => {
                          const currentMedicare = data.medicare || 0
                          const priorYTD = calculatePriorYTD(currentMedicare, data.payPeriodNumber || 1)
                          return priorYTD.toFixed(2)
                        })()}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {(() => {
                        const currentMedicare = data.medicare || 0
                        return calculateYTDTotal(currentMedicare, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200 flex items-center gap-2">
                      FICA - Social Security
                      <TaxTooltip type="socialSecurity" />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {data.socialSecurity ? data.socialSecurity.toFixed(2) : '0.00'}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {(() => {
                          const currentSS = data.socialSecurity || 0
                          const priorYTD = calculatePriorYTD(currentSS, data.payPeriodNumber || 1)
                          return priorYTD.toFixed(2)
                        })()}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {(() => {
                        const currentSS = data.socialSecurity || 0
                        return calculateYTDTotal(currentSS, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200 flex items-center gap-2">
                      Federal Tax
                      <TaxTooltip type="federal" maritalStatus={data.maritalStatus} />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {data.federalTax ? data.federalTax.toFixed(2) : '0.00'}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {(() => {
                          const currentFed = data.federalTax || 0
                          const priorYTD = calculatePriorYTD(currentFed, data.payPeriodNumber || 1)
                          return priorYTD.toFixed(2)
                        })()}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {(() => {
                        const currentFed = data.federalTax || 0
                        return calculateYTDTotal(currentFed, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200 flex items-center gap-2">
                      State Tax
                      <TaxTooltip type="state" stateCode={data.taxState} />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {data.stateTax ? data.stateTax.toFixed(2) : '0.00'}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <div className="text-center text-sm font-medium text-gray-700 bg-gray-50 py-2 px-3 rounded">
                        {(() => {
                          const currentState = data.stateTax || 0
                          const priorYTD = calculatePriorYTD(currentState, data.payPeriodNumber || 1)
                          return priorYTD.toFixed(2)
                        })()}
                        <div className="text-xs text-gray-500 mt-1">Auto-calculated</div>
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {(() => {
                        const currentState = data.stateTax || 0
                        return calculateYTDTotal(currentState, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                 
                  <tr className="bg-gray-50">
                    <td className="p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">Deduction Total</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{calculateTotalDeductions() ? calculateTotalDeductions().toFixed(2) : ''}</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                      {(() => {
                        const currentDeductions = calculateTotalDeductions()
                        const priorYTD = calculatePriorYTD(currentDeductions, data.payPeriodNumber || 1)
                        return priorYTD.toFixed(2)
                      })()}
                    </td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700">
                      {(() => {
                        const currentDeductions = calculateTotalDeductions()
                        return calculateYTDTotal(currentDeductions, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="p-4 text-sm font-bold text-gray-700 border-r border-gray-200">Net Pay</td>
                    <td className="p-4 text-center text-sm font-bold text-gray-700 border-r border-gray-200">{calculateNetPay() ? calculateNetPay().toFixed(2) : ''}</td>
                    <td className="p-4 text-center text-sm font-bold text-gray-700 border-r border-gray-200">
                      {(() => {
                        const currentNetPay = calculateNetPay()
                        const priorYTD = calculatePriorYTD(currentNetPay, data.payPeriodNumber || 1)
                        return priorYTD.toFixed(2)
                      })()}
                    </td>
                    <td className="p-4 text-center text-sm font-bold text-gray-700">
                      {(() => {
                        const currentNetPay = calculateNetPay()
                        return calculateYTDTotal(currentNetPay, data.payPeriodNumber || 1).toFixed(2)
                      })()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  )
}
