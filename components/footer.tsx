export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-bold text-sm">SRS</div>
              <span className="text-secondary font-bold text-lg">FINANCIALS</span>
            </div>
            <p className="text-primary-foreground/80 text-sm">
              SRS Financials offers fast, accurate paystubs, tax returns, and proof of income documents. We provide personalized support and secure, reliable service. Your trusted partner for all financial documentation needs.
            </p>
            <div className="mt-4 space-y-1 text-sm text-primary-foreground/80">
              <p>📍 Florida, USA</p>
              <p>📞 <a href="tel:+12067045757" className="hover:text-secondary">+1 (206) 704-5757</a></p>
              <p>✉️ <a href="mailto:srssolutionltd@gmail.com" className="hover:text-secondary">srssolutionltd@gmail.com</a></p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-secondary">
                  Paystubs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  W2 Forms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Tax Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  1099 Forms
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-secondary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Live Chat
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <a href="#" className="hover:text-secondary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm">© 2024 SRS Financials. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
