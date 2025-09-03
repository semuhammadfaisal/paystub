// Quick test to verify tax fixes
const { calculateTaxes } = require('./tax-calculator.ts');

// Test with similar data to what's causing the issue
const testInput = {
  grossPay: 4730.77,
  payFrequency: 'bi-weekly',
  maritalStatus: 'single',
  exemptions: 0,
  taxState: 'CA', // California
  ytdGrossPay: 0
};

console.log('=== TAX CALCULATION TEST ===');
console.log('Input:', testInput);

const result = calculateTaxes(testInput);
console.log('\n=== RESULTS ===');
console.log('Federal Tax:', result.federalTax);
console.log('State Tax:', result.stateTax, '(should be > 0 for CA)');
console.log('Social Security:', result.socialSecurity, '(should be ~', (testInput.grossPay * 0.062).toFixed(2), ')');
console.log('Medicare:', result.medicare, '(should be ~', (testInput.grossPay * 0.0145).toFixed(2), ')');
console.log('Additional Medicare:', result.additionalMedicare);
console.log('Total Deductions:', result.totalDeductions);
console.log('Net Pay:', result.netPay);
