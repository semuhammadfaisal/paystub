import { Card, CardContent } from "@/components/ui/card"

export function ServicesSection() {
  const services = [
    {
      title: "Paystubs Made Easy",
      description:
        "Get custom Paystubs that look just like real employee pay statements. We manually calculate everything to ensure accuracy – no online generators here. Whether you need a printable paystub or a proof of income document for rent, loans, or job verification – we've got you covered.",
    },
    {
      title: "Tax Return Assistance",
      description:
        "Need help with your tax filing? We provide personal tax document services for self-employed, freelancers, and employees. We handle everything from IRS e-file ready reports to tax refund summaries, making income tax preparation quick and stress-free.",
    },
    {
      title: "W2 Form Services",
      description:
        "Missing your W-2 wage form? We help recreate official-looking W2 payroll documents to assist with proof of income or tax purposes. Our forms are suitable for job applications, housing, and financial checks.",
    },
    {
      title: "1099 For Contractors",
      description:
        "If you're self-employed or a freelancer, we offer detailed 1099-MISC and 1099-NEC forms. These are perfect for non-employee compensation and independent contractor income reports.",
    },
    {
      title: "Bank Statement",
      description:
        "Need a bank statement for income verification, visa applications, or housing? We provide editable, print-ready bank statements that mimic real monthly bank records – professionally designed and discreetly delivered.",
    },
    {
      title: "Monthly Payroll Service",
      description:
        "We offer reliable monthly payroll services to help businesses manage employee salaries, deductions, and tax compliance with accuracy. Our professional team ensures timely processing, detailed reports, and hassle-free payroll management, so you can focus on growing your business.",
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Services We Offer
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto leading-relaxed">
            Professional document services tailored to your needs. Simple, accurate, and reliable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border border-gray-200 bg-white rounded-none hover:border-[#239BA0] transition-all duration-300"
            >
              <CardContent className="p-8">
                {/* Service Title */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                    {service.title}
                  </h3>
                </div>

                {/* Service Description */}
                <div>
                  <p className="text-gray-600 font-light leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
