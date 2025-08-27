import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SupportSection() {
  return (
    <section id="support" className="py-16 bg-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Get Support</h2>
            <p className="text-muted-foreground mb-6">
              Need help? Message us anytime or start a chat. We respond fast.
            </p>
            <div className="flex gap-3">
              <Link href="/signup"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Send us a message</Button></Link>
              <Link href="/signup"><Button variant="outline">Chat</Button></Link>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold mb-2">Contact</h3>
            <p>Florida, USA</p>
            <p className="mt-2">NEED SERVICE? <a className="text-primary font-semibold" href="tel:+12067045757">+1 (206) 704-5757</a></p>
            <p className="mt-1">Email: <a className="text-primary font-semibold" href="mailto:srssolutionltd@gmail.com">srssolutionltd@gmail.com</a></p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div>
                <div className="font-semibold">Generators</div>
                <ul className="text-muted-foreground">
                  <li><a href="/create-paystub">Paystubs</a></li>
                  <li><a href="/create-w2">W‑2</a></li>
                  <li><a href="/create-1099">1099‑MISC</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">About</div>
                <ul className="text-muted-foreground">
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#pricing">Pricing</a></li>
                  <li><a href="#reviews">Reviews</a></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold">Get Support</div>
                <ul className="text-muted-foreground">
                  <li><a href="#support">Send us a message</a></li>
                  <li><a href="#support">Chat</a></li>
                </ul>
              </div>
            </div>
            <p className="mt-6 text-xs text-muted-foreground">© {new Date().getFullYear()} SRS Financials. All Rights Reserved. · <a href="#">Privacy</a> · <a href="#">Terms</a></p>
          </div>
        </div>
      </div>
    </section>
  )
}
