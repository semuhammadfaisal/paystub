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
  const handleInputChange = (field: keyof PaystubData, value: string | number) => {
    onUpdate({ [field]: value })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="employee" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="employee">Employee</TabsTrigger>
          <TabsTrigger value="employer">Employer</TabsTrigger>
          <TabsTrigger value="pay">Pay Info</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
        </TabsList>

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

          <div>
            <Label htmlFor="employeeSSN">Social Security Number</Label>
            <Input
              id="employeeSSN"
              value={data.employeeSSN}
              onChange={(e) => handleInputChange("employeeSSN", e.target.value)}
              placeholder="XXX-XX-XXXX"
            />
          </div>
        </TabsContent>

        <TabsContent value="employer" className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              placeholder="ABC Corporation"
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="federalTax">Federal Tax ($)</Label>
              <Input
                id="federalTax"
                type="number"
                step="0.01"
                value={data.federalTax}
                onChange={(e) => handleInputChange("federalTax", Number.parseFloat(e.target.value) || 0)}
                placeholder="200.00"
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
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="socialSecurity">Social Security ($)</Label>
              <Input
                id="socialSecurity"
                type="number"
                step="0.01"
                value={data.socialSecurity}
                onChange={(e) => handleInputChange("socialSecurity", Number.parseFloat(e.target.value) || 0)}
                placeholder="62.00"
              />
            </div>
            <div>
              <Label htmlFor="medicare">Medicare ($)</Label>
              <Input
                id="medicare"
                type="number"
                step="0.01"
                value={data.medicare}
                onChange={(e) => handleInputChange("medicare", Number.parseFloat(e.target.value) || 0)}
                placeholder="14.50"
              />
            </div>
          </div>

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
      </Tabs>

      <div className="pt-6 border-t">
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Generate Paystub PDF</Button>
      </div>
    </div>
  )
}
