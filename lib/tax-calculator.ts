// US Tax Calculation Utilities for Paystub Generation

export interface TaxCalculationInput {
  grossPay: number
  payFrequency: string
  maritalStatus: string
  exemptions: number
  taxState: string
  ytdGrossPay?: number
}

export interface TaxCalculationResult {
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  additionalMedicare: number
  totalDeductions: number
  netPay: number
}

// 2024 Federal Tax Brackets (Single)
const FEDERAL_TAX_BRACKETS_SINGLE = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11000, max: 44725, rate: 0.12 },
  { min: 44725, max: 95375, rate: 0.22 },
  { min: 95375, max: 182050, rate: 0.24 },
  { min: 182050, max: 231250, rate: 0.32 },
  { min: 231250, max: 578125, rate: 0.35 },
  { min: 578125, max: Infinity, rate: 0.37 }
]

// 2024 Federal Tax Brackets (Married Filing Jointly)
const FEDERAL_TAX_BRACKETS_MARRIED = [
  { min: 0, max: 22000, rate: 0.10 },
  { min: 22000, max: 89450, rate: 0.12 },
  { min: 89450, max: 190750, rate: 0.22 },
  { min: 190750, max: 364200, rate: 0.24 },
  { min: 364200, max: 462500, rate: 0.32 },
  { min: 462500, max: 693750, rate: 0.35 },
  { min: 693750, max: Infinity, rate: 0.37 }
]

// State tax rates (simplified - flat rates for states with income tax)
const STATE_TAX_RATES: Record<string, number> = {
  'AL': 0.05, // Alabama - simplified average
  'AK': 0.00, // Alaska - no state income tax
  'AZ': 0.045, // Arizona - simplified average
  'AR': 0.055, // Arkansas - simplified average
  'CA': 0.08, // California - simplified average (varies widely)
  'CO': 0.0455, // Colorado - flat rate
  'CT': 0.06, // Connecticut - simplified average
  'DE': 0.055, // Delaware - simplified average
  'FL': 0.00, // Florida - no state income tax
  'GA': 0.055, // Georgia - simplified average
  'HI': 0.075, // Hawaii - simplified average
  'ID': 0.055, // Idaho - simplified average
  'IL': 0.0495, // Illinois - flat rate
  'IN': 0.0323, // Indiana - flat rate
  'IA': 0.065, // Iowa - simplified average
  'KS': 0.055, // Kansas - simplified average
  'KY': 0.05, // Kentucky - flat rate
  'LA': 0.045, // Louisiana - simplified average
  'ME': 0.075, // Maine - simplified average
  'MD': 0.055, // Maryland - simplified average
  'MA': 0.05, // Massachusetts - flat rate
  'MI': 0.0425, // Michigan - flat rate
  'MN': 0.075, // Minnesota - simplified average
  'MS': 0.05, // Mississippi - simplified average
  'MO': 0.055, // Missouri - simplified average
  'MT': 0.065, // Montana - simplified average
  'NE': 0.065, // Nebraska - simplified average
  'NV': 0.00, // Nevada - no state income tax
  'NH': 0.00, // New Hampshire - no state income tax (except dividends/interest)
  'NJ': 0.065, // New Jersey - simplified average
  'NM': 0.055, // New Mexico - simplified average
  'NY': 0.065, // New York - simplified average
  'NC': 0.0525, // North Carolina - flat rate
  'ND': 0.045, // North Dakota - simplified average
  'OH': 0.045, // Ohio - simplified average
  'OK': 0.05, // Oklahoma - simplified average
  'OR': 0.085, // Oregon - simplified average
  'PA': 0.0307, // Pennsylvania - flat rate
  'RI': 0.055, // Rhode Island - simplified average
  'SC': 0.06, // South Carolina - simplified average
  'SD': 0.00, // South Dakota - no state income tax
  'TN': 0.00, // Tennessee - no state income tax
  'TX': 0.00, // Texas - no state income tax
  'UT': 0.0495, // Utah - flat rate
  'VT': 0.075, // Vermont - simplified average
  'VA': 0.055, // Virginia - simplified average
  'WA': 0.00, // Washington - no state income tax
  'WV': 0.055, // West Virginia - simplified average
  'WI': 0.065, // Wisconsin - simplified average
  'WY': 0.00, // Wyoming - no state income tax
}

// Social Security wage base for 2024
const SOCIAL_SECURITY_WAGE_BASE = 168600

// Standard deduction amounts for 2024
const STANDARD_DEDUCTION = {
  single: 14600,
  married: 29200
}

// Personal exemption amount (simplified)
const PERSONAL_EXEMPTION = 4700

/**
 * Convert pay frequency to annual multiplier
 */
function getAnnualMultiplier(payFrequency: string): number {
  switch (payFrequency.toLowerCase()) {
    case 'daily': return 260 // 5 days/week * 52 weeks
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

/**
 * Calculate federal income tax using tax brackets
 */
function calculateFederalTax(
  annualIncome: number,
  maritalStatus: string,
  exemptions: number
): number {
  // Calculate taxable income
  const standardDeduction = maritalStatus === 'married' 
    ? STANDARD_DEDUCTION.married 
    : STANDARD_DEDUCTION.single
  
  const personalExemptions = exemptions * PERSONAL_EXEMPTION
  const taxableIncome = Math.max(0, annualIncome - standardDeduction - personalExemptions)
  
  // Select appropriate tax brackets
  const brackets = maritalStatus === 'married' 
    ? FEDERAL_TAX_BRACKETS_MARRIED 
    : FEDERAL_TAX_BRACKETS_SINGLE
  
  let tax = 0
  let remainingIncome = taxableIncome
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break
    
    const taxableAtThisBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    )
    
    tax += taxableAtThisBracket * bracket.rate
    remainingIncome -= taxableAtThisBracket
  }
  
  return tax
}

/**
 * Calculate Social Security tax
 */
function calculateSocialSecurityTax(grossPay: number, ytdGrossPay: number = 0): number {
  const SOCIAL_SECURITY_RATE = 0.062 // 6.2%
  
  console.log('SS Tax calculation:', { grossPay, ytdGrossPay, SOCIAL_SECURITY_WAGE_BASE })
  
  // Check if YTD earnings have exceeded the wage base
  if (ytdGrossPay >= SOCIAL_SECURITY_WAGE_BASE) {
    console.log('YTD exceeds SS wage base, returning 0')
    return 0 // No more Social Security tax for the year
  }
  
  // Calculate how much of current pay is subject to Social Security tax
  const remainingWageBase = SOCIAL_SECURITY_WAGE_BASE - ytdGrossPay
  const taxableAmount = Math.min(grossPay, remainingWageBase)
  const result = taxableAmount * SOCIAL_SECURITY_RATE
  
  console.log('SS Tax result:', { remainingWageBase, taxableAmount, result })
  
  // Ensure we return a valid number
  if (isNaN(result) || result < 0) {
    console.log('SS Tax result is invalid, returning 0')
    return 0
  }
  
  return result
}

/**
 * Calculate Medicare tax (including additional Medicare tax for high earners)
 */
function calculateMedicareTax(
  grossPay: number, 
  annualIncome: number, 
  maritalStatus: string
): { medicare: number; additionalMedicare: number } {
  const MEDICARE_RATE = 0.0145 // 1.45%
  const ADDITIONAL_MEDICARE_RATE = 0.009 // 0.9%
  
  // Thresholds for additional Medicare tax
  const additionalMedicareThreshold = maritalStatus === 'married' ? 250000 : 200000
  
  const medicare = grossPay * MEDICARE_RATE
  
  let additionalMedicare = 0
  if (annualIncome > additionalMedicareThreshold) {
    const excessIncome = annualIncome - additionalMedicareThreshold
    const annualMultiplier = getAnnualMultiplier('bi-weekly') // Assuming bi-weekly for calculation
    additionalMedicare = Math.min(grossPay, excessIncome / annualMultiplier) * ADDITIONAL_MEDICARE_RATE
  }
  
  return { medicare, additionalMedicare }
}

/**
 * Calculate state income tax
 */
function calculateStateTax(annualIncome: number, taxState: string): number {
  // Normalize state code to uppercase
  const normalizedState = taxState?.toUpperCase() || ''
  const stateRate = STATE_TAX_RATES[normalizedState] || 0
  
  console.log('State tax calculation:', { 
    originalState: taxState,
    normalizedState, 
    stateRate, 
    annualIncome, 
    result: annualIncome * stateRate 
  })
  
  const result = annualIncome * stateRate
  
  // Ensure we return a valid number
  if (isNaN(result) || result < 0) {
    console.log('State tax result is invalid, returning 0')
    return 0
  }
  
  return result
}

/**
 * Main tax calculation function
 */
export function calculateTaxes(input: TaxCalculationInput): TaxCalculationResult {
  console.log('calculateTaxes called with input:', input)
  
  const {
    grossPay,
    payFrequency,
    maritalStatus,
    exemptions,
    taxState,
    ytdGrossPay = 0
  } = input
  
  // Calculate annual income estimate
  const annualMultiplier = getAnnualMultiplier(payFrequency)
  const annualIncome = grossPay * annualMultiplier
  
  console.log('Annual multiplier:', annualMultiplier, 'Annual income:', annualIncome)
  console.log('Calculating taxes for grossPay:', grossPay, 'ytdGrossPay:', ytdGrossPay)
  
  // Calculate federal income tax (annual amount divided by pay periods)
  const annualFederalTax = calculateFederalTax(annualIncome, maritalStatus, exemptions)
  const federalTax = annualFederalTax / annualMultiplier
  
  // Calculate state tax (annual amount divided by pay periods)
  const annualStateTax = calculateStateTax(annualIncome, taxState)
  const stateTax = annualStateTax / annualMultiplier
  
  // Calculate Social Security tax
  const socialSecurity = calculateSocialSecurityTax(grossPay, ytdGrossPay)
  console.log('Social Security calculation:', { grossPay, ytdGrossPay, socialSecurity })
  
  // Calculate Medicare taxes
  const { medicare, additionalMedicare } = calculateMedicareTax(
    grossPay, 
    annualIncome, 
    maritalStatus
  )
  console.log('Medicare calculation:', { medicare, additionalMedicare })
  console.log('State tax calculation:', { taxState, annualStateTax, stateTax: annualStateTax / annualMultiplier })
  
  // Calculate totals
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + additionalMedicare
  const netPay = grossPay - totalDeductions
  
  const result = {
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    additionalMedicare: Math.round(additionalMedicare * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netPay: Math.round(netPay * 100) / 100
  }
  
  console.log('Tax calculation result:', result)
  return result
}

/**
 * Get state tax rate for display purposes
 */
export function getStateTaxRate(stateCode: string): number {
  return STATE_TAX_RATES[stateCode] || 0
}

/**
 * Check if state has income tax
 */
export function hasStateTax(stateCode: string): boolean {
  return (STATE_TAX_RATES[stateCode] || 0) > 0
}
