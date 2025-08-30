"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PaystubData } from "@/components/paystub-generator"

interface PaystubFormProps {
  data: PaystubData
  onUpdate: (updates: Partial<PaystubData>) => void
}

export function PaystubForm({ data, onUpdate }: PaystubFormProps) {
  const handleInputChange = (field: keyof PaystubData, value: string | number | boolean) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="employer">Employer</TabsTrigger>
          <TabsTrigger value="pay">Pay Info</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="ytd">YTD Totals</TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-4">
          <div>
            <Label htmlFor="templateId">Template Selection</Label>
            <Select
              value={data.templateId}
              onValueChange={(value) => handleInputChange("templateId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">Template #1</SelectItem>
                <SelectItem value="template2">Template #2</SelectItem>
                <SelectItem value="template3">Template #3</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coNumber">CO Number</Label>
              <Input
                id="coNumber"
                value={data.coNumber}
                onChange={(e) => handleInputChange("coNumber", e.target.value)}
                placeholder="0f4"
              />
            </div>
            <div>
              <Label htmlFor="fileNumber">File Number</Label>
              <Input
                id="fileNumber"
                value={data.fileNumber}
                onChange={(e) => handleInputChange("fileNumber", e.target.value)}
                placeholder="359651"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deptNumber">DEPT Number</Label>
              <Input
                id="deptNumber"
                value={data.deptNumber}
                onChange={(e) => handleInputChange("deptNumber", e.target.value)}
                placeholder="165014"
              />
            </div>
            <div>
              <Label htmlFor="clockNumber">Clock Number</Label>
              <Input
                id="clockNumber"
                value={data.clockNumber}
                onChange={(e) => handleInputChange("clockNumber", e.target.value)}
                placeholder="34881"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vchrNumber">VCHR Number</Label>
              <Input
                id="vchrNumber"
                value={data.vchrNumber}
                onChange={(e) => handleInputChange("vchrNumber", e.target.value)}
                placeholder="23623"
              />
            </div>
            <div>
              <Label htmlFor="adviceNumber">Advice Number</Label>
              <Input
                id="adviceNumber"
                value={data.adviceNumber}
                onChange={(e) => handleInputChange("adviceNumber", e.target.value)}
                placeholder="00042792"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <div>
            <Label htmlFor="paymentType">Payment Type</Label>
            <Select
              value={data.paymentType}
              onValueChange={(value) => handleInputChange("paymentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="employmentType">Employment Type</Label>
            <Select
              value={data.employmentType}
              onValueChange={(value) => handleInputChange("employmentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="temporary">Temporary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="numberOfPaystubs">Number of Paystubs Required</Label>
            <Select
              value={data.numberOfPaystubs.toString()}
              onValueChange={(value) => handleInputChange("numberOfPaystubs", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
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

          <div>
            <Label htmlFor="taxState">State to be Used in Tax Calculations *</Label>
            <Select
              value={data.taxState}
              onValueChange={(value) => handleInputChange("taxState", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
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
        </TabsContent>

        <TabsContent value="employee" className="space-y-4">
          <div>
            <Label htmlFor="employeeName">Full Name</Label>
            <Input
              id="employeeName"
              value={data.employeeName}
              onChange={(e) => handleInputChange("employeeName", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div>
            <Label htmlFor="employeeAddress">Address</Label>
            <Input
              id="employeeAddress"
              value={data.employeeAddress}
              onChange={(e) => handleInputChange("employeeAddress", e.target.value)}
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="employeeCity">City</Label>
              <Input
                id="employeeCity"
                value={data.employeeCity}
                onChange={(e) => handleInputChange("employeeCity", e.target.value)}
                placeholder="New York"
              />
            </div>
            <div>
              <Label htmlFor="employeeState">State</Label>
              <Input
                id="employeeState"
                value={data.employeeState}
                onChange={(e) => handleInputChange("employeeState", e.target.value)}
                placeholder="NY"
              />
            </div>
            <div>
              <Label htmlFor="employeeZip">ZIP</Label>
              <Input
                id="employeeZip"
                value={data.employeeZip}
                onChange={(e) => handleInputChange("employeeZip", e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={data.employeeId}
                onChange={(e) => handleInputChange("employeeId", e.target.value)}
                placeholder="123456789"
              />
            </div>
            <div>
              <Label htmlFor="employeePhone">Employee Phone Number</Label>
              <Input
                id="employeePhone"
                value={data.employeePhone}
                onChange={(e) => handleInputChange("employeePhone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="employeeSSN">Social Security Number (last 4 digits)</Label>
            <Input
              id="employeeSSN"
              value={data.employeeSSN}
              onChange={(e) => handleInputChange("employeeSSN", e.target.value)}
              placeholder="XXXX"
              maxLength={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exemptions">Exemptions / Allowances *</Label>
              <Select
                value={data.exemptions.toString()}
                onValueChange={(value) => handleInputChange("exemptions", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                value={data.maritalStatus}
                onValueChange={(value) => handleInputChange("maritalStatus", value as "single" | "married" | "head_of_household")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="head_of_household">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="directDeposit">Direct Deposit</Label>
            <Select
              value={data.directDeposit.toString()}
              onValueChange={(value) => handleInputChange("directDeposit", value === "true")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="employer" className="space-y-4">
          <div>
            <Label htmlFor="companyName">Employer (Company) Name *</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="ABC Corporation"
              required
            />
          </div>

          <div>
            <Label htmlFor="companyPhone">Employer Telephone Number</Label>
            <Input
              id="companyPhone"
              value={data.companyPhone}
              onChange={(e) => handleInputChange("companyPhone", e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input
              id="companyAddress"
              value={data.companyAddress}
              onChange={(e) => handleInputChange("companyAddress", e.target.value)}
              placeholder="456 Business Ave"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="companyCity">City</Label>
              <Input
                id="companyCity"
                value={data.companyCity}
                onChange={(e) => handleInputChange("companyCity", e.target.value)}
                placeholder="New York"
              />
            </div>
            <div>
              <Label htmlFor="companyState">State</Label>
              <Input
                id="companyState"
                value={data.companyState}
                onChange={(e) => handleInputChange("companyState", e.target.value)}
                placeholder="NY"
              />
            </div>
            <div>
              <Label htmlFor="companyZip">ZIP</Label>
              <Input
                id="companyZip"
                value={data.companyZip}
                onChange={(e) => handleInputChange("companyZip", e.target.value)}
                placeholder="10001"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyEIN">Employer ID Number (EIN)</Label>
            <Input
              id="companyEIN"
              value={data.companyEIN}
              onChange={(e) => handleInputChange("companyEIN", e.target.value)}
              placeholder="XX-XXXXXXX"
            />
          </div>
        </TabsContent>

        <TabsContent value="pay" className="space-y-4">
          <div>
            <Label htmlFor="payPeriodNumber">Pay Period Number</Label>
            <Input
              id="payPeriodNumber"
              type="number"
              value={data.payPeriodNumber}
              onChange={(e) => handleInputChange("payPeriodNumber", Number.parseInt(e.target.value) || 1)}
              placeholder="18"
            />
          </div>

          <div>
            <Label htmlFor="payType">Pay Type</Label>
            <Select
              value={data.payType}
              onValueChange={(value) => handleInputChange("payType", value as "hourly" | "salary")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.payType === "hourly" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={data.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", Number.parseFloat(e.target.value) || 0)}
                    placeholder="25.00"
                  />
                </div>
                <div>
                  <Label htmlFor="hoursWorked">Hours Worked</Label>
                  <Input
                    id="hoursWorked"
                    type="number"
                    step="0.5"
                    value={data.hoursWorked}
                    onChange={(e) => handleInputChange("hoursWorked", Number.parseFloat(e.target.value) || 0)}
                    placeholder="40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overtimeHours">Overtime Hours</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    step="0.5"
                    value={data.overtimeHours}
                    onChange={(e) => handleInputChange("overtimeHours", Number.parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeRate">Overtime Rate ($)</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    step="0.01"
                    value={data.overtimeRate}
                    onChange={(e) => handleInputChange("overtimeRate", Number.parseFloat(e.target.value) || 0)}
                    placeholder="37.50"
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <Label htmlFor="salary">Salary Amount ($)</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                value={data.salary}
                onChange={(e) => handleInputChange("salary", Number.parseFloat(e.target.value) || 0)}
                placeholder="5000.00"
              />
            </div>
          )}

          <div>
            <Label htmlFor="payFrequency">Pay Frequency</Label>
            <Select value={data.payFrequency} onValueChange={(value) => handleInputChange("payFrequency", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="payPeriodStart">Pay Period Start</Label>
              <Input
                id="payPeriodStart"
                type="date"
                value={data.payPeriodStart}
                onChange={(e) => handleInputChange("payPeriodStart", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payPeriodEnd">Pay Period End</Label>
              <Input
                id="payPeriodEnd"
                type="date"
                value={data.payPeriodEnd}
                onChange={(e) => handleInputChange("payPeriodEnd", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payDate">Pay Date</Label>
              <Input
                id="payDate"
                type="date"
                value={data.payDate}
                onChange={(e) => handleInputChange("payDate", e.target.value)}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-4">
          <h3 className="text-lg font-semibold">Tax Deductions</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="federalTax">Federal Tax ($)</Label>
              <Input
                id="federalTax"
                type="number"
                step="0.01"
                value={data.federalTax}
                onChange={(e) => handleInputChange("federalTax", Number.parseFloat(e.target.value) || 0)}
                placeholder="113.60"
              />
            </div>
            <div>
              <Label htmlFor="stateTax">State Tax ($)</Label>
              <Input
                id="stateTax"
                type="number"
                step="0.01"
                value={data.stateTax}
                onChange={(e) => handleInputChange("stateTax", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold pt-4">FICA Deductions</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialSecurity">FICA - Social Security ($)</Label>
              <Input
                id="socialSecurity"
                type="number"
                step="0.01"
                value={data.socialSecurity}
                onChange={(e) => handleInputChange("socialSecurity", Number.parseFloat(e.target.value) || 0)}
                placeholder="99.20"
              />
            </div>
            <div>
              <Label htmlFor="medicare">FICA - Medicare ($)</Label>
              <Input
                id="medicare"
                type="number"
                step="0.01"
                value={data.medicare}
                onChange={(e) => handleInputChange("medicare", Number.parseFloat(e.target.value) || 0)}
                placeholder="23.20"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="stateDisability">State Disability Insurance ($)</Label>
            <Input
              id="stateDisability"
              type="number"
              step="0.01"
              value={data.stateDisability}
              onChange={(e) => handleInputChange("stateDisability", Number.parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>

          <h3 className="text-lg font-semibold pt-4">Insurance Deductions</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="healthInsurance">Health Insurance ($)</Label>
              <Input
                id="healthInsurance"
                type="number"
                step="0.01"
                value={data.healthInsurance}
                onChange={(e) => handleInputChange("healthInsurance", Number.parseFloat(e.target.value) || 0)}
                placeholder="150.00"
              />
            </div>
            <div>
              <Label htmlFor="dentalInsurance">Dental Insurance ($)</Label>
              <Input
                id="dentalInsurance"
                type="number"
                step="0.01"
                value={data.dentalInsurance}
                onChange={(e) => handleInputChange("dentalInsurance", Number.parseFloat(e.target.value) || 0)}
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visionInsurance">Vision Insurance ($)</Label>
              <Input
                id="visionInsurance"
                type="number"
                step="0.01"
                value={data.visionInsurance}
                onChange={(e) => handleInputChange("visionInsurance", Number.parseFloat(e.target.value) || 0)}
                placeholder="10.00"
              />
            </div>
            <div>
              <Label htmlFor="lifeInsurance">Life Insurance ($)</Label>
              <Input
                id="lifeInsurance"
                type="number"
                step="0.01"
                value={data.lifeInsurance}
                onChange={(e) => handleInputChange("lifeInsurance", Number.parseFloat(e.target.value) || 0)}
                placeholder="15.00"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold pt-4">Retirement & Savings</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="retirement401k">401(k) Contribution ($)</Label>
              <Input
                id="retirement401k"
                type="number"
                step="0.01"
                value={data.retirement401k}
                onChange={(e) => handleInputChange("retirement401k", Number.parseFloat(e.target.value) || 0)}
                placeholder="100.00"
              />
            </div>
            <div>
              <Label htmlFor="rothIRA">Roth IRA Contribution ($)</Label>
              <Input
                id="rothIRA"
                type="number"
                step="0.01"
                value={data.rothIRA}
                onChange={(e) => handleInputChange("rothIRA", Number.parseFloat(e.target.value) || 0)}
                placeholder="50.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="hsa">HSA Contribution ($)</Label>
            <Input
              id="hsa"
              type="number"
              step="0.01"
              value={data.hsa}
              onChange={(e) => handleInputChange("hsa", Number.parseFloat(e.target.value) || 0)}
              placeholder="75.00"
            />
          </div>

          <h3 className="text-lg font-semibold pt-4">Other Deductions</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parkingFee">Parking Fee ($)</Label>
              <Input
                id="parkingFee"
                type="number"
                step="0.01"
                value={data.parkingFee}
                onChange={(e) => handleInputChange("parkingFee", Number.parseFloat(e.target.value) || 0)}
                placeholder="50.00"
              />
            </div>
            <div>
              <Label htmlFor="unionDues">Union Dues ($)</Label>
              <Input
                id="unionDues"
                type="number"
                step="0.01"
                value={data.unionDues}
                onChange={(e) => handleInputChange("unionDues", Number.parseFloat(e.target.value) || 0)}
                placeholder="25.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="otherDeductions">Other Deductions ($)</Label>
            <Input
              id="otherDeductions"
              type="number"
              step="0.01"
              value={data.otherDeductions}
              onChange={(e) => handleInputChange("otherDeductions", Number.parseFloat(e.target.value) || 0)}
              placeholder="0.00"
            />
          </div>
        </TabsContent>

        <TabsContent value="ytd" className="space-y-4">
          <h3 className="text-lg font-semibold">Year to Date Totals</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ytdGrossPay">YTD Gross Pay ($)</Label>
              <Input
                id="ytdGrossPay"
                type="number"
                step="0.01"
                value={data.ytdGrossPay}
                onChange={(e) => handleInputChange("ytdGrossPay", Number.parseFloat(e.target.value) || 0)}
                placeholder="28800.00"
              />
            </div>
            <div>
              <Label htmlFor="ytdNetPay">YTD Net Pay ($)</Label>
              <Input
                id="ytdNetPay"
                type="number"
                step="0.01"
                value={data.ytdNetPay}
                onChange={(e) => handleInputChange("ytdNetPay", Number.parseFloat(e.target.value) || 0)}
                placeholder="24552.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ytdFederalTax">YTD Federal Tax ($)</Label>
              <Input
                id="ytdFederalTax"
                type="number"
                step="0.01"
                value={data.ytdFederalTax}
                onChange={(e) => handleInputChange("ytdFederalTax", Number.parseFloat(e.target.value) || 0)}
                placeholder="2044.80"
              />
            </div>
            <div>
              <Label htmlFor="ytdStateTax">YTD State Tax ($)</Label>
              <Input
                id="ytdStateTax"
                type="number"
                step="0.01"
                value={data.ytdStateTax}
                onChange={(e) => handleInputChange("ytdStateTax", Number.parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ytdSocialSecurity">YTD Social Security ($)</Label>
              <Input
                id="ytdSocialSecurity"
                type="number"
                step="0.01"
                value={data.ytdSocialSecurity}
                onChange={(e) => handleInputChange("ytdSocialSecurity", Number.parseFloat(e.target.value) || 0)}
                placeholder="1785.60"
              />
            </div>
            <div>
              <Label htmlFor="ytdMedicare">YTD Medicare ($)</Label>
              <Input
                id="ytdMedicare"
                type="number"
                step="0.01"
                value={data.ytdMedicare}
                onChange={(e) => handleInputChange("ytdMedicare", Number.parseFloat(e.target.value) || 0)}
                placeholder="417.60"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ytdTotalDeductions">YTD Total Deductions ($)</Label>
            <Input
              id="ytdTotalDeductions"
              type="number"
              step="0.01"
              value={data.ytdTotalDeductions}
              onChange={(e) => handleInputChange("ytdTotalDeductions", Number.parseFloat(e.target.value) || 0)}
              placeholder="4248.00"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-6 border-t">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Generate Paystub PDF</Button>
      </div>
    </div>
  )
}
