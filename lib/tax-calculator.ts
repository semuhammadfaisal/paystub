// US Tax Calculation Utilities for Paystub Generation

export interface TaxCalculationInput {
  grossPay: number
  payFrequency: string
  maritalStatus: string
  exemptions: number
  taxState: string
  ytdGrossPay?: number
}

/**
 * Convert pay frequency to number of weeks in a period (for weekly dollar caps)
 */
function getWeeksPerPeriod(payFrequency: string): number {
  switch ((payFrequency || '').toLowerCase()) {
    case 'daily': return 1 / 5 // assume 5 work-days/week
    case 'weekly': return 1
    case 'bi-weekly': return 2
    case 'semi-monthly': return 52 / 24
    case 'monthly': return 52 / 12
    case 'quarterly': return 13
    case 'semi-annually': return 26
    case 'annually': return 52
    default: return 2 // default to bi-weekly
  }
}

/**
 * Calculate State Disability Insurance (SDI/TDI/PFL) for applicable states.
 * Returns per-period amount.
 */
export function calculateStateDisability(
  grossPay: number,
  payFrequency: string,
  taxState: string,
  ytdGrossPay: number = 0,
): number {
  const state = (taxState || '').toUpperCase()
  const cfg = SDI_CONFIG[state]
  if (!cfg || !grossPay || grossPay <= 0) return 0

  if (cfg.type === 'wage_base') {
    const annualMult = getAnnualMultiplier(payFrequency)
    const remainingBase = Math.max(0, (cfg.wageBase || 0) - (ytdGrossPay || 0))
    if (remainingBase <= 0) return 0
    const perPeriodCap = remainingBase / annualMult
    const taxable = Math.max(0, Math.min(grossPay, perPeriodCap))
    return taxable * cfg.rate
  }

  if (cfg.type === 'weekly_cap') {
    const weeks = getWeeksPerPeriod(payFrequency)
    const cap = (cfg.weeklyCap || 0) * weeks
    return Math.min(grossPay * cfg.rate, cap)
  }

  // rate_only
  return grossPay * cfg.rate
}

export interface TaxCalculationResult {
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  additionalMedicare: number
  stateDisability: number
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

// State tax rates aligned to the provided reference.
// Notes:
// - Flat/no-tax states use the exact rates listed.
// - Progressive/bracketed states use a simplified effective rate approximation
//   around the middle of the stated range for per-paycheck estimation.
// - Local/city/county taxes and SDI/TDI are NOT included here (handled elsewhere if needed).
const STATE_TAX_RATES: Record<string, number> = {
  'AL': 0.05,    // Alabama: 2% - 5% (approx top bracket as effective cap)
  'AK': 0.00,    // Alaska: 0%
  'AZ': 0.028,   // Arizona: 2.55% - 2.98% (approx midpoint)
  'AR': 0.047,   // Arkansas: 0% - 4.7%
  'CA': 0.08,    // California: 1% - 13.3% (approx effective)
  'CO': 0.044,   // Colorado: flat 4.4%
  'CT': 0.06,    // Connecticut: 3% - 6.99%
  'DE': 0.055,   // Delaware: 2.2% - 6.6%
  'FL': 0.00,    // Florida: 0%
  'GA': 0.05,    // Georgia: 1% - 5.75%
  'HI': 0.055,   // Hawaii: 1.4% - 11% (approx midpoint; SDI separate)
  'ID': 0.058,   // Idaho: ~5.8%
  'IL': 0.0495,  // Illinois: flat 4.95%
  'IN': 0.0315,  // Indiana: flat 3.15% (county tax not included)
  'IA': 0.052,   // Iowa: 4.4% - 6%
  'KS': 0.044,   // Kansas: 3.1% - 5.7%
  'KY': 0.045,   // Kentucky: flat 4.5%
  'LA': 0.03,    // Louisiana: 1.85% - 4.25%
  'ME': 0.064,   // Maine: 5.8% - 7.15%
  'MD': 0.05,    // Maryland: 2% - 5.75% (county tax not included)
  'MA': 0.05,    // Massachusetts: flat 5%
  'MI': 0.0405,  // Michigan: flat 4.05% (city tax not included)
  'MN': 0.072,   // Minnesota: 5.35% - 9.85%
  'MS': 0.05,    // Mississippi: 0% - 5%
  'MO': 0.042,   // Missouri: 1.5% - 4.95%
  'MT': 0.05,    // Montana: 1% - 6.75%
  'NE': 0.045,   // Nebraska: 2.46% - 6.64%
  'NV': 0.00,    // Nevada: 0%
  'NH': 0.00,    // New Hampshire: wages 0%
  'NJ': 0.06,    // New Jersey: 1.4% - 10.75% (SDI/FLI separate)
  'NM': 0.04,    // New Mexico: 1.7% - 5.9%
  'NY': 0.065,   // New York: 4% - 10.9% (NYC tax not included)
  'NC': 0.045,   // North Carolina: flat 4.5%
  'ND': 0.02,    // North Dakota: 1.1% - 2.9%
  'OH': 0.03,    // Ohio: 0% - 3.99% (local city tax not included)
  'OK': 0.035,   // Oklahoma: 0.25% - 4.75%
  'OR': 0.074,   // Oregon: 4.75% - 9.9%
  'PA': 0.0307,  // Pennsylvania: flat 3.07% (local wage tax not included)
  'RI': 0.05,    // Rhode Island: 3.75% - 5.99% (TDI separate)
  'SC': 0.05,    // South Carolina: 0% - 6.5%
  'SD': 0.00,    // South Dakota: 0%
  'TN': 0.00,    // Tennessee: 0%
  'TX': 0.00,    // Texas: 0%
  'UT': 0.0465,  // Utah: flat 4.65%
  'VT': 0.06,    // Vermont: 3.35% - 8.75%
  'VA': 0.0475,  // Virginia: 2% - 5.75%
  'WA': 0.00,    // Washington: 0% (capital gains not payroll)
  'WV': 0.05,    // West Virginia: 3% - 6.5%
  'WI': 0.058,   // Wisconsin: 3.54% - 7.65%
  'WY': 0.00,    // Wyoming: 0%
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

// States with SDI/TDI/PFL type employee payroll contributions (approximate 2024 values)
// Notes:
// - These are simplified approximations intended for per-paycheck estimation.
// - Where a wage base cap applies (CA/NJ), we cap the taxable wages using YTD gross pay.
// - HI uses a weekly dollar cap; we scale it by weeks-per-period based on pay frequency.
// - NY has complex DBL/PFL caps; we approximate with a simple percentage only.
const SDI_CONFIG: Record<string, { type: 'wage_base' | 'weekly_cap' | 'rate_only'; rate: number; wageBase?: number; weeklyCap?: number }> = {
  // California SDI + PFL: ~1.0% of wages, wage base ~160k
  CA: { type: 'wage_base', rate: 0.01, wageBase: 160000 },
  // New Jersey TDI + FLI combined (approx): ~0.7% of wages, wage base ~160k
  NJ: { type: 'wage_base', rate: 0.007, wageBase: 160000 },
  // New York DBL + PFL (approx): ~0.5% of wages (caps not modeled here)
  NY: { type: 'rate_only', rate: 0.005 },
  // Rhode Island TDI: ~1.1% - 1.2% of all wages (no wage cap)
  RI: { type: 'rate_only', rate: 0.011 },
  // Hawaii TDI: up to 0.5% of weekly wages, weekly cap ~ $6
  HI: { type: 'weekly_cap', rate: 0.005, weeklyCap: 6 },
}

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
  
  // Calculate State Disability (SDI/TDI/PFL) where applicable
  const stateDisability = calculateStateDisability(grossPay, payFrequency, taxState, ytdGrossPay)
  
  // Calculate totals
  const totalDeductions = federalTax + stateTax + socialSecurity + medicare + additionalMedicare + stateDisability
  const netPay = grossPay - totalDeductions
  
  const result = {
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    additionalMedicare: Math.round(additionalMedicare * 100) / 100,
    stateDisability: Math.round(stateDisability * 100) / 100,
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
