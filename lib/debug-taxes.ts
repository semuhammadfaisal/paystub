// Debug tax calculations
import { calculateTaxes, type TaxCalculationInput } from './tax-calculator'

// Test input matching your console output
const testInput: TaxCalculationInput = {
  grossPay: 14544.00,
  payFrequency: 'bi-weekly', 
  maritalStatus: 'single',
  exemptions: 0,
  taxState: 'CA',
  ytdGrossPay: 0
}

console.log('=== DEBUG TAX CALCULATION ===')
console.log('Input:', testInput)
console.log()

// Manual calculations for comparison
const grossPay = 14544.00
const ytdGrossPay = 0
const SOCIAL_SECURITY_RATE = 0.062
const MEDICARE_RATE = 0.0145
const SOCIAL_SECURITY_WAGE_BASE = 168600

console.log('=== MANUAL CALCULATIONS ===')
console.log('Gross Pay:', grossPay)
console.log('YTD Gross Pay:', ytdGrossPay)
console.log('Social Security Wage Base:', SOCIAL_SECURITY_WAGE_BASE)
console.log()

// Social Security check
console.log('Social Security Check:')
console.log('ytdGrossPay >= SOCIAL_SECURITY_WAGE_BASE?', ytdGrossPay >= SOCIAL_SECURITY_WAGE_BASE)
console.log('Expected Social Security Tax:', grossPay * SOCIAL_SECURITY_RATE)
console.log()

// Medicare check  
console.log('Medicare Check:')
console.log('Expected Medicare Tax:', grossPay * MEDICARE_RATE)
console.log()

// State tax check
const annualIncome = grossPay * 26 // bi-weekly
console.log('State Tax Check:')
console.log('Annual Income:', annualIncome)
console.log('CA State Rate: 8%')
console.log('Expected Annual State Tax:', annualIncome * 0.08)
console.log('Expected Per-Period State Tax:', (annualIncome * 0.08) / 26)
console.log()

// Now run the actual calculation
console.log('=== ACTUAL CALCULATION RESULT ===')
const result = calculateTaxes(testInput)
console.log('Result:', result)
