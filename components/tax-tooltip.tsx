"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface TaxTooltipProps {
  type: "federal" | "state" | "socialSecurity" | "medicare"
  stateCode?: string
  maritalStatus?: string
  className?: string
}

export function TaxTooltip({ type, stateCode, maritalStatus, className }: TaxTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const getTooltipContent = () => {
    switch (type) {
      case "federal":
        return {
          title: "Federal Income Tax Calculation",
          content: (
            <div className="space-y-3">
              <p className="text-sm">
                Federal tax is calculated using progressive tax brackets based on your annual income and marital status.
              </p>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">
                  2024 Tax Brackets ({maritalStatus === "married" ? "Married Filing Jointly" : "Single"}):
                </p>
                {maritalStatus === "married" ? (
                  <ul className="text-xs space-y-1">
                    <li>• 10% on income up to $22,000</li>
                    <li>• 12% on income $22,001 - $89,450</li>
                    <li>• 22% on income $89,451 - $190,750</li>
                    <li>• 24% on income $190,751 - $364,200</li>
                    <li>• 32% on income $364,201 - $462,500</li>
                    <li>• 35% on income $462,501 - $693,750</li>
                    <li>• 37% on income over $693,750</li>
                  </ul>
                ) : (
                  <ul className="text-xs space-y-1">
                    <li>• 10% on income up to $11,000</li>
                    <li>• 12% on income $11,001 - $44,725</li>
                    <li>• 22% on income $44,726 - $95,375</li>
                    <li>• 24% on income $95,376 - $182,050</li>
                    <li>• 32% on income $182,051 - $231,250</li>
                    <li>• 35% on income $231,251 - $578,125</li>
                    <li>• 37% on income over $578,125</li>
                  </ul>
                )}
              </div>
              <p className="text-xs text-gray-600">
                <strong>Calculation:</strong> Annual income is estimated from your pay frequency, then standard deduction 
                (${maritalStatus === "married" ? "$29,200" : "$14,600"}) and personal exemptions are subtracted. 
                Tax is calculated progressively through brackets, then divided by pay periods.
              </p>
            </div>
          )
        }

      case "state":
        const getStateInfo = () => {
          const stateRates: Record<string, { rate: number; name: string }> = {
            'AL': { rate: 5.0, name: 'Alabama' },
            'AK': { rate: 0.0, name: 'Alaska' },
            'AZ': { rate: 2.8, name: 'Arizona' },
            'AR': { rate: 4.7, name: 'Arkansas' },
            'CA': { rate: 8.0, name: 'California' },
            'CO': { rate: 4.4, name: 'Colorado' },
            'CT': { rate: 6.0, name: 'Connecticut' },
            'DE': { rate: 5.5, name: 'Delaware' },
            'FL': { rate: 0.0, name: 'Florida' },
            'GA': { rate: 5.0, name: 'Georgia' },
            'HI': { rate: 5.5, name: 'Hawaii' },
            'ID': { rate: 5.8, name: 'Idaho' },
            'IL': { rate: 4.95, name: 'Illinois' },
            'IN': { rate: 3.15, name: 'Indiana' },
            'IA': { rate: 5.2, name: 'Iowa' },
            'KS': { rate: 4.4, name: 'Kansas' },
            'KY': { rate: 4.5, name: 'Kentucky' },
            'LA': { rate: 3.0, name: 'Louisiana' },
            'ME': { rate: 6.4, name: 'Maine' },
            'MD': { rate: 5.0, name: 'Maryland' },
            'MA': { rate: 5.0, name: 'Massachusetts' },
            'MI': { rate: 4.05, name: 'Michigan' },
            'MN': { rate: 7.2, name: 'Minnesota' },
            'MS': { rate: 5.0, name: 'Mississippi' },
            'MO': { rate: 4.2, name: 'Missouri' },
            'MT': { rate: 5.0, name: 'Montana' },
            'NE': { rate: 4.5, name: 'Nebraska' },
            'NV': { rate: 0.0, name: 'Nevada' },
            'NH': { rate: 0.0, name: 'New Hampshire' },
            'NJ': { rate: 6.0, name: 'New Jersey' },
            'NM': { rate: 4.0, name: 'New Mexico' },
            'NY': { rate: 6.5, name: 'New York' },
            'NC': { rate: 4.5, name: 'North Carolina' },
            'ND': { rate: 2.0, name: 'North Dakota' },
            'OH': { rate: 3.0, name: 'Ohio' },
            'OK': { rate: 3.5, name: 'Oklahoma' },
            'OR': { rate: 7.4, name: 'Oregon' },
            'PA': { rate: 3.07, name: 'Pennsylvania' },
            'RI': { rate: 5.0, name: 'Rhode Island' },
            'SC': { rate: 5.0, name: 'South Carolina' },
            'SD': { rate: 0.0, name: 'South Dakota' },
            'TN': { rate: 0.0, name: 'Tennessee' },
            'TX': { rate: 0.0, name: 'Texas' },
            'UT': { rate: 4.65, name: 'Utah' },
            'VT': { rate: 6.0, name: 'Vermont' },
            'VA': { rate: 4.75, name: 'Virginia' },
            'WA': { rate: 0.0, name: 'Washington' },
            'WV': { rate: 5.0, name: 'West Virginia' },
            'WI': { rate: 5.8, name: 'Wisconsin' },
            'WY': { rate: 0.0, name: 'Wyoming' }
          }
          
          return stateRates[stateCode || ''] || { rate: 0, name: 'Unknown' }
        }

        const stateInfo = getStateInfo()
        
        return {
          title: "State Income Tax Calculation",
          content: (
            <div className="space-y-3">
              <p className="text-sm">
                {stateInfo.rate === 0 ? (
                  <span className="text-green-600 font-medium">
                    {stateInfo.name} has no state income tax!
                  </span>
                ) : (
                  <>
                    State tax for <strong>{stateInfo.name}</strong> is calculated at approximately <strong>{stateInfo.rate}%</strong> of your annual income.
                  </>
                )}
              </p>
              
              {stateInfo.rate > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-600">
                    <strong>Calculation:</strong> Annual income × {stateInfo.rate}% ÷ number of pay periods per year
                  </p>
                  <p className="text-xs text-gray-500">
                    Note: This is a simplified calculation. Actual state tax may vary based on additional factors like deductions, exemptions, and progressive brackets specific to {stateInfo.name}.
                  </p>
                </div>
              )}

              {stateInfo.rate === 0 && (
                <p className="text-xs text-gray-500">
                  States with no income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming.
                </p>
              )}
            </div>
          )
        }

      case "socialSecurity":
        return {
          title: "Social Security Tax (FICA) Calculation",
          content: (
            <div className="space-y-3">
              <p className="text-sm">
                Social Security tax is calculated at <strong>6.2%</strong> of your gross pay, with important limits.
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">Key Details:</p>
                <ul className="text-xs space-y-1">
                  <li>• <strong>Rate:</strong> 6.2% of gross pay</li>
                  <li>• <strong>2024 Wage Base Limit:</strong> $168,600</li>
                  <li>• <strong>Maximum Annual Tax:</strong> $10,453.20</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  <strong>Calculation:</strong> Gross Pay × 6.2%
                </p>
                <p className="text-xs text-gray-500">
                  <strong>Important:</strong> Once your year-to-date earnings reach $168,600, no more Social Security tax is withheld for the remainder of the year. This protects high earners from paying Social Security tax on income above the wage base.
                </p>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs">
                <strong>Example:</strong> If you earn $2,000 gross pay, your Social Security tax would be $2,000 × 6.2% = $124.00
              </div>
            </div>
          )
        }

      case "medicare":
        return {
          title: "Medicare Tax (FICA) Calculation",
          content: (
            <div className="space-y-3">
              <p className="text-sm">
                Medicare tax has two components: regular Medicare tax and additional Medicare tax for high earners.
              </p>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">Regular Medicare Tax:</p>
                <ul className="text-xs space-y-1">
                  <li>• <strong>Rate:</strong> 1.45% of all gross pay</li>
                  <li>• <strong>No wage base limit</strong> (unlike Social Security)</li>
                  <li>• Applied to all income regardless of amount</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700">Additional Medicare Tax:</p>
                <ul className="text-xs space-y-1">
                  <li>• <strong>Rate:</strong> 0.9% on income above threshold</li>
                  <li>• <strong>Threshold (Single):</strong> $200,000 annually</li>
                  <li>• <strong>Threshold (Married):</strong> $250,000 annually</li>
                </ul>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  <strong>Calculation:</strong> 
                </p>
                <ul className="text-xs space-y-1 ml-2">
                  <li>1. Regular: Gross Pay × 1.45%</li>
                  <li>2. Additional: (Income above threshold) × 0.9%</li>
                  <li>3. Total Medicare Tax = Regular + Additional</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs">
                <strong>Example:</strong> $2,000 gross pay = $2,000 × 1.45% = $29.00 regular Medicare tax (plus additional if applicable)
              </div>
            </div>
          )
        }

      default:
        return { title: "", content: null }
    }
  }

  const { title, content } = getTooltipContent()

  return (
    <div className="relative inline-block">
      <button
        type="button"
        className={cn(
          "w-4 h-4 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors",
          className
        )}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="w-2.5 h-2.5 text-white" />
      </button>

      {isVisible && (
        <div className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg -top-2 left-6">
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
            {content}
          </div>
          
          {/* Arrow pointing to the info icon */}
          <div className="absolute top-3 -left-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-200"></div>
          <div className="absolute top-3.5 -left-1 w-0 h-0 border-t-3 border-b-3 border-r-3 border-t-transparent border-b-transparent border-r-white"></div>
        </div>
      )}
    </div>
  )
}
