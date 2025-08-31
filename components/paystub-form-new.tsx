"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { StepHeader } from "@/components/step-header"
import type { PaystubData } from "@/components/paystub-generator"

interface PaystubFormProps {
  data: PaystubData
  onUpdate: (updates: Partial<PaystubData>) => void
}

export function PaystubForm({ data, onUpdate }: PaystubFormProps) {
  const handleInputChange = (field: keyof PaystubData, value: string | number | boolean) => {
    const updates: Partial<PaystubData> = { [field]: value }
    
    // Trigger recalculation when key fields change
    if (field === 'hourlyRate' || field === 'hoursWorked' || field === 'overtimeRate' || field === 'overtimeHours' || 
        field === 'medicare' || field === 'socialSecurity' || field === 'federalTax' || field === 'stateTax') {
      
      // Calculate with the new value
      const newData = { ...data, [field]: value }
      
      // Calculate gross pay
      if (newData.payType === "hourly") {
        const regularPay = (newData.hourlyRate || 0) * (newData.hoursWorked || 0)
        const overtimePay = (newData.overtimeRate || 0) * (newData.overtimeHours || 0)
        updates.grossPay = regularPay + overtimePay
      } else {
        updates.grossPay = newData.salary || 0
      }
      
      // Calculate total deductions
      updates.totalDeductions = (newData.medicare || 0) + (newData.socialSecurity || 0) + (newData.federalTax || 0) + (newData.stateTax || 0)
      
      // Calculate net pay
      updates.netPay = (updates.grossPay || 0) - (updates.totalDeductions || 0)
    }
    
    onUpdate(updates)
  }

  // Calculate gross pay for current period (for display only)
  const calculateGrossPay = () => {
    if (data.payType === "hourly") {
      const regularPay = (data.hourlyRate || 0) * (data.hoursWorked || 0)
      const overtimePay = (data.overtimeRate || 0) * (data.overtimeHours || 0)
      return regularPay + overtimePay
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
                  ✓ HOURLY
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="salary" 
                  className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                >
                  SALARY
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
                  ✓ EMPLOYEE
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="contractor" 
                  className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary border-primary text-primary hover:bg-primary/10"
                >
                  CONTRACTOR
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Email address *
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
                placeholder=""
                required
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
                  <SelectItem value="1">1 paystub</SelectItem>
                  <SelectItem value="2">2 paystubs</SelectItem>
                  <SelectItem value="3">3 paystubs</SelectItem>
                  <SelectItem value="6">6 paystubs</SelectItem>
                  <SelectItem value="12">12 paystubs</SelectItem>
                </SelectContent>
              </Select>
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
                  placeholder="Employer (Company) Name *"
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
                  placeholder="Street Address 1 *"
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
                  placeholder="City *"
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
                  placeholder="Zip code *"
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
                  placeholder="City *"
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
                  placeholder="Zip code *"
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
                    <SelectValue placeholder="0" />
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
              <SelectValue placeholder="PAYSTUB #1 - Pay period: 08/17/2025 to 08/30/2025" />
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
          <div className="mb-4 text-sm text-teal-600">
            * Indicates editable field. All other fields are auto-filled, please be cautious if overwriting.
          </div>
          
          {/* Pay Period Section */}
          <div className="space-y-6 mb-8">
            {/* Pay period number */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Pay period number</Label>
              <Select
                value={data.numberOfPaystubs.toString()}
                onValueChange={(value) => handleInputChange("numberOfPaystubs", parseInt(value))}
              >
                <SelectTrigger className="w-48 border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent">
                  <SelectValue placeholder="Pay period #18" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Pay period #1</SelectItem>
                  <SelectItem value="2">Pay period #2</SelectItem>
                  <SelectItem value="18">Pay period #18</SelectItem>
                  <SelectItem value="24">Pay period #24</SelectItem>
                </SelectContent>
              </Select>
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
                      <Input
                        type="number"
                        step="0.01"
                        value={data.hourlyRate}
                        onChange={(e) => handleInputChange("hourlyRate", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="20.00"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.5"
                        value={data.hoursWorked}
                        onChange={(e) => handleInputChange("hoursWorked", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="80"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium border-r border-gray-200">
                      {((data.hourlyRate || 0) * (data.hoursWorked || 0)).toFixed(2)}
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.ytdGrossPay - calculateGrossPay()}
                        onChange={(e) => handleInputChange("ytdGrossPay", (Number.parseFloat(e.target.value) || 0) + calculateGrossPay())}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="27,200.00"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {data.ytdGrossPay.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">Overtime</td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.overtimeRate}
                        onChange={(e) => handleInputChange("overtimeRate", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.5"
                        value={data.overtimeHours}
                        onChange={(e) => handleInputChange("overtimeHours", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="0"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium border-r border-gray-200">
                      {((data.overtimeRate || 0) * (data.overtimeHours || 0)).toFixed(2)}
                    </td>
                    <td className="p-4 text-center text-sm border-r border-gray-200">0.00</td>
                    <td className="p-4 text-center text-sm">0.00</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-primary text-sm cursor-pointer border-r border-gray-200">+ Add earnings</td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4"></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 text-sm font-semibold text-gray-700 border-r border-gray-200"></td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">GROSS PAY</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{calculateGrossPay().toFixed(2)}</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{(data.ytdGrossPay - calculateGrossPay()).toFixed(2)}</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700">{(calculateGrossPay() + (data.ytdGrossPay - calculateGrossPay())).toFixed(2)}</td>
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
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">FICA - Medicare</td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.medicare}
                        onChange={(e) => handleInputChange("medicare", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="23.20"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.ytdMedicare - (data.medicare || 0)}
                        onChange={(e) => handleInputChange("ytdMedicare", (Number.parseFloat(e.target.value) || 0) + (data.medicare || 0))}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="394.40"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {data.ytdMedicare.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">FICA - Social Security</td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.socialSecurity}
                        onChange={(e) => handleInputChange("socialSecurity", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="99.20"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.ytdSocialSecurity - (data.socialSecurity || 0)}
                        onChange={(e) => handleInputChange("ytdSocialSecurity", (Number.parseFloat(e.target.value) || 0) + (data.socialSecurity || 0))}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="1,686.40"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {data.ytdSocialSecurity.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">Federal Tax</td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.federalTax}
                        onChange={(e) => handleInputChange("federalTax", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="113.60"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.ytdFederalTax - (data.federalTax || 0)}
                        onChange={(e) => handleInputChange("ytdFederalTax", (Number.parseFloat(e.target.value) || 0) + (data.federalTax || 0))}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="1,931.20"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {data.ytdFederalTax.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-sm text-gray-700 border-r border-gray-200">State Tax</td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.stateTax}
                        onChange={(e) => handleInputChange("stateTax", Number.parseFloat(e.target.value) || 0)}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="p-4 border-r border-gray-200">
                      <Input
                        type="number"
                        step="0.01"
                        value={data.ytdStateTax - (data.stateTax || 0)}
                        onChange={(e) => handleInputChange("ytdStateTax", (Number.parseFloat(e.target.value) || 0) + (data.stateTax || 0))}
                        className="text-center border-b-2 border-teal-500 rounded-none border-t-0 border-l-0 border-r-0 bg-transparent text-sm"
                        placeholder="0.00"
                      />
                    </td>
                    <td className="p-4 text-center text-sm font-medium">
                      {data.ytdStateTax.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-4 text-primary text-sm cursor-pointer border-r border-gray-200">+ Add deduction</td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4 border-r border-gray-200"></td>
                    <td className="p-4"></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-4 text-sm font-semibold text-gray-700 border-r border-gray-200">Deduction Total</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{calculateTotalDeductions().toFixed(2)}</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">{(data.ytdTotalDeductions - calculateTotalDeductions()).toFixed(2)}</td>
                    <td className="p-4 text-center text-sm font-semibold text-gray-700">{(calculateTotalDeductions() + (data.ytdTotalDeductions - calculateTotalDeductions())).toFixed(2)}</td>
                  </tr>
                  <tr className="bg-gray-100">
                    <td className="p-4 text-sm font-bold text-gray-700 border-r border-gray-200">Net Pay</td>
                    <td className="p-4 text-center text-sm font-bold text-gray-700 border-r border-gray-200">{calculateNetPay().toFixed(2)}</td>
                    <td className="p-4 text-center text-sm font-bold text-gray-700 border-r border-gray-200">{(data.ytdNetPay - calculateNetPay()).toFixed(2)}</td>
                    <td className="p-4 text-center text-sm font-bold text-gray-700">{(calculateNetPay() + (data.ytdNetPay - calculateNetPay())).toFixed(2)}</td>
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
