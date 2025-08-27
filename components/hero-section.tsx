import React from 'react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24 min-h-[400px]" style={{
      background: 'linear-gradient(135deg, #1DD1A1 0%, #10C3A1 50%, #0A9D8A 100%)'
    }}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white text-center">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 leading-tight tracking-tight">
          Generate 100% Legal Paystubs
        </h1>
        
        <p className="text-2xl lg:text-3xl xl:text-4xl italic mb-8 font-light text-white/95">
          Online, Hassle-free!
        </p>
        
        <div className="max-w-5xl mx-auto">
          <p className="text-base lg:text-lg xl:text-xl leading-relaxed font-normal text-white/90">
            We're the best Paystub generator for a reason. Join thousands of satisfied independent contractors and small business owners and get the highest quality Paystubs, W2s and 1099s — right to your inbox! We make it easy. Guaranteed.
          </p>
        </div>
      </div>
    </section>
  );
}