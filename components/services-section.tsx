import { Card, CardContent } from "@/components/ui/card"

export function ServicesSection() {
  const services = [
    {
      title: "Paystubs Made Easy",
      description:
        "Get custom pay stubs that look just like real employee pay statements. We manually calculate everything to ensure accuracy – no online generators here. Whether you need a printable paystub or a proof of income document for rent, loans, or job verification – we've got you covered.",
      bgColor: "bg-secondary",
    },
    {
      title: "Tax Return Assistance",
      description:
        "Need help with your tax filing? We provide personal tax document services for self-employed, freelancers, and employees. We handle everything from IRS e-file ready reports to tax refund summaries, making income tax preparation quick and stress-free.",
      bgColor: "bg-secondary",
    },
    {
      title: "W2 Form Services",
      description:
        "Missing your W-2 wage form? We help recreate official-looking W2 payroll documents to assist with proof of income or tax purposes. Our forms are suitable for job applications, housing, and financial checks.",
      bgColor: "bg-secondary",
    },
    {
      title: "1099 For Contractors",
      description:
        "If you're self-employed or a freelancer, we offer detailed 1099-MISC and 1099-NEC forms. These are perfect for non-employee compensation and independent contractor income reports.",
      bgColor: "bg-secondary",
    },
    {
      title: "Bank Statement",
      description:
        "Need a bank statement for income verification, visa applications, or housing? We provide editable, print-ready bank statements that mimic real monthly bank records – professionally designed and discreetly delivered.",
      bgColor: "bg-secondary",
    },
    {
      title: "Monthly Payroll Service",
      description:
        "We offer reliable monthly payroll services to help businesses manage employee salaries, deductions, and tax compliance with accuracy. Our professional team ensures timely processing, detailed reports, and hassle-free payroll management, so you can focus on growing your business.",
      bgColor: "bg-secondary",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="bg-secondary py-4">
            <h2 className="text-primary text-3xl font-bold">What Service We Offer</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`${service.bgColor} py-4 px-6`}>
                <h3 className="text-primary text-xl font-bold text-center">{service.title}</h3>
              </div>
              <CardContent className="p-6">
                <p className="text-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
