"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function BlogsPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Paystub Components: A Complete Guide",
      excerpt: "Learn about the essential elements that make up a professional paystub and why each component matters for your financial records.",
      author: "SRS Financial Team",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Paystubs",
      image: "/paystub.jpg",
      featured: true
    },
    {
      id: 2,
      title: "W-2 Forms Explained: What Employees Need to Know",
      excerpt: "Everything you need to understand about W-2 forms, from tax withholdings to year-end reporting requirements.",
      author: "Tax Specialist",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Tax Forms",
      image: "/w2.jpg",
      featured: false
    },
    {
      id: 3,
      title: "1099-MISC vs 1099-NEC: Key Differences for Contractors",
      excerpt: "Understand the important distinctions between these two common 1099 forms and when each one applies.",
      author: "SRS Financial Team",
      date: "2024-01-10",
      readTime: "6 min read",
      category: "Tax Forms",
      image: "/1099.jpg",
      featured: false
    },
    {
      id: 4,
      title: "Tax Return Preparation: Essential Documents Checklist",
      excerpt: "A comprehensive list of documents you'll need to gather before filing your tax return this season.",
      author: "Tax Specialist",
      date: "2024-01-08",
      readTime: "4 min read",
      category: "Tax Returns",
      image: "/1099.jpg",
      featured: false
    },
    {
      id: 5,
      title: "Small Business Payroll: Best Practices for 2024",
      excerpt: "Essential payroll management tips for small business owners to ensure compliance and accuracy.",
      author: "Business Advisor",
      date: "2024-01-05",
      readTime: "8 min read",
      category: "Business",
      image: "/paystub.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Digital vs Paper Records: Modern Financial Documentation",
      excerpt: "Explore the benefits of digital financial record keeping and how to maintain organized documentation.",
      author: "SRS Financial Team",
      date: "2024-01-03",
      readTime: "5 min read",
      category: "Tips",
      image: "/w2.jpg",
      featured: false
    }
  ]

  const categories = ["All", "Paystubs", "Tax Forms", "Tax Returns", "Business", "Tips"]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-secondary/30 blur-3xl"></div>
          <div className="absolute top-1/3 -right-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl"></div>
          <div className="absolute -bottom-24 left-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 mb-6">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              Expert insights and guides
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter text-foreground mb-6">
              Financial Documentation Blog
            </h1>
            
            <p className="text-lg text-foreground/70 max-w-3xl mx-auto mb-8">
              Stay informed with expert insights, tips, and guides on paystubs, tax forms, and financial documentation best practices.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/40 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-white/80 backdrop-blur text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === "All" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-white/80 text-foreground hover:bg-primary/10 border"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Post */}
        {blogPosts.filter(post => post.featured).map((post) => (
          <div key={post.id} className="mb-16">
            <div className="rounded-2xl border bg-white shadow-2xl ring-1 ring-border overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <div className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr from-secondary/30 to-primary/20 blur-2xl"></div>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-primary/10 px-3 py-1 text-xs font-medium text-primary w-fit mb-4">
                    Featured Article
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-foreground/70 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-foreground/60 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <Button className="w-fit">
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <article key={post.id} className="group">
              <div className="rounded-2xl border bg-white shadow-lg ring-1 ring-border overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 mb-4 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-foreground/60">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="hover:bg-primary/10">
            Load More Articles
          </Button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="rounded-2xl border bg-white shadow-lg ring-1 ring-border p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Stay Updated with Financial Tips
            </h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest insights on financial documentation, tax tips, and business best practices delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border bg-white text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button className="px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-foreground/50 mt-4">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <Button asChild size="lg" variant="outline" className="hover:bg-primary/10">
            <Link href="/">
              ← Back to Home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
