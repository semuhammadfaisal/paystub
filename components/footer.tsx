export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">SRS Financials</h3>
            </div>
            <p className="text-gray-600 font-light leading-relaxed text-sm mb-6">
              SRS Financials offers fast, accurate paystubs, tax returns, and proof of income documents. We provide personalized support and secure, reliable service. Your trusted partner for all financial documentation needs.
            </p>
            <div className="space-y-3 text-sm text-gray-600 font-light">
              <p className="flex items-center">
                <span className="w-4 h-4 mr-3 text-[#239BA0]">📍</span>
                Florida, USA
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 mr-3 text-[#239BA0]">📞</span>
                <a href="tel:+12067045757" className="hover:text-[#239BA0] transition-colors duration-200">+1 (206) 704-5757</a>
              </p>
              <p className="flex items-center">
                <span className="w-4 h-4 mr-3 text-[#239BA0]">✉️</span>
                <a href="mailto:srssolutionltd@gmail.com" className="hover:text-[#239BA0] transition-colors duration-200">srssolutionltd@gmail.com</a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 tracking-tight">Services</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-light">
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Paystubs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  W2 Forms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Tax Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  1099 Forms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 tracking-tight">Support</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-light">
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Live Chat
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 tracking-tight">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-600 font-light">
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#239BA0] transition-colors duration-200">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm font-light">© 2024 SRS Financials. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
