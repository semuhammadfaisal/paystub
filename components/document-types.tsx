import Link from "next/link"

export function DocumentTypes() {
  const documents = [
    {
      title: "Paystub",
      image: "/paystub.jpg",
      href: "/create-paystub",
      cta: "Create your paystub",
    },
    {
      title: "W-2",
      image: "/w2.jpg",
      href: "/create-w2",
      cta: "Create your W-2",
    },
    {
      title: "1099-MISC",
      image: "/1099.jpg",
      href: "/create-1099",
      cta: "Create your 1099-MISC",
    },
  ]

  return (
    <section id="documents" className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
          {documents.map((doc, index) => (
            <div key={index} className="flex flex-col items-stretch">
              {/* Top Title */}
              <div className="py-10 md:py-12 text-center">
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                  {doc.title}
                </h3>
              </div>

              {/* Illustration */}
              <div className="flex-1 flex items-center justify-center py-10 min-h-[300px] w-full">
                <img
                  src={doc.image || "/placeholder.svg"}
                  alt={`${doc.title} template`}
                  className="w-72 md:w-80 h-auto object-contain drop-shadow mx-auto"
                />
              </div>

              {/* Bottom full-width CTA bar */}
              <Link
                href={doc.href}
                className="block w-full bg-gradient-to-r from-[#2dbcc1] to-[#1e7d85] text-white text-xl md:text-2xl font-bold text-center py-6"
              >
                {doc.cta} 
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
