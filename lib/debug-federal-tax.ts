// Debug federal tax calculation
import { calculateTaxes, type TaxCalculationInput } from './tax-calculator'

// Test with low gross pay amounts like in your screenshot
const testCases = [
  { grossPay: 36.00, desc: "Very low gross pay" },
  { grossPay: 144.00, desc: "Low gross pay" },
  { grossPay: 500.00, desc: "Higher gross pay for comparison" }
]

console.log('=== FEDERAL TAX CALCULATION DEBUG ===\n')

testCases.forEach(testCase => {
  console.log(`--- ${testCase.desc}: $${testCase.grossPay} ---`)
  
  const input: TaxCalculationInput = {
    grossPay: testCase.grossPay,
    payFrequency: 'bi-weekly',
    maritalStatus: 'single',
    exemptions: 0,
    taxState: 'CA',
    ytdGrossPay: 0
  }
  
  // Manual calculation breakdown
  const annualIncome = testCase.grossPay * 26 // bi-weekly
  const standardDeduction = 14600 // Single filer 2024
  const personalExemptions = 0 * 4700 // 0 exemptions
  const taxableIncome = Math.max(0, annualIncome - standardDeduction - personalExemptions)
  
  console.log(`  Gross Pay (bi-weekly): $${testCase.grossPay}`)
  console.log(`  Annual Income: $${annualIncome} (${testCase.grossPay} × 26)`)
  console.log(`  Standard Deduction: $${standardDeduction}`)
  console.log(`  Personal Exemptions: $${personalExemptions} (0 exemptions × $4,700)`)
  console.log(`  Taxable Income: $${taxableIncome} (${annualIncome} - ${standardDeduction} - ${personalExemptions})`)
  
  if (taxableIncome <= 0) {
    console.log('  🔍 REASON FOR $0 FEDERAL TAX: Taxable income is $0 after deductions!')
    console.log(`  📊 Need annual income > $${standardDeduction + personalExemptions} to owe federal tax`)
    console.log(`  📊 Need bi-weekly gross pay > $${Math.ceil((standardDeduction + personalExemptions) / 26)} to owe federal tax`)
  }
  
  // Run actual calculation
  const result = calculateTaxes(input)
  console.log(`  Federal Tax Result: $${result.federalTax}`)
  console.log()
})

console.log('=== SUMMARY ===')
console.log('Federal tax is $0 because:')
console.log('1. Annual income is too low after standard deduction ($14,600)')
console.log('2. For bi-weekly pay, you need gross pay > $562 to owe federal tax')
console.log('3. Your current gross pays ($36-$144) result in annual incomes well below the tax threshold')
