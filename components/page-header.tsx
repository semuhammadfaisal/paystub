"use client"

import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Link from "next/link";

export function PageHeader() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in personalized and customized paystub templates. Can you help me?");
    window.open(`https://wa.me/12067045757?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/">
          <Button variant="outline" size="sm" className="hover:bg-gray-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        
        <Button 
          onClick={handleWhatsAppClick}
          size="sm" 
          className="bg-green-500 hover:bg-green-600 text-white border-0"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Customized templates
        </Button>
      </div>
    </div>
  );
}
