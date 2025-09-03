// Simple test to verify tax calculation
import { calculateTaxes, type TaxCalculationInput } from './tax-calculator'

// Test the tax calculation with sample data - matching your console output
const testInput: TaxCalculationInput = {
  grossPay: 4730.77, // Based on your net pay calculation, working backwards
  payFrequency: 'bi-weekly',
  maritalStatus: 'single',
  exemptions: 0,
  taxState: 'CA',
  ytdGrossPay: 0
}

console.log('=== TESTING TAX CALCULATION ===')
console.log('Input:', testInput)
console.log()

console.log('=== EXPECTED CALCULATIONS ===')
const grossPay = testInput.grossPay
console.log('Social Security (6.2%):', Math.round(grossPay * 0.062 * 100) / 100)
console.log('Medicare (1.45%):', Math.round(grossPay * 0.0145 * 100) / 100)
console.log('Annual income:', grossPay * 26)
console.log('CA State Tax (8% annual / 26):', Math.round(grossPay * 26 * 0.08 / 26 * 100) / 100)
console.log()

console.log('=== ACTUAL CALCULATION RESULT ===')
const result = calculateTaxes(testInput)
console.log('Result:', result)
