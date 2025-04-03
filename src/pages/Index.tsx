
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Compatibility } from "@/components/Compatibility";
import { Commands } from "@/components/Commands";
import { HowToUse } from "@/components/HowToUse";
import { Screenshots } from "@/components/Screenshots";
import { AppScreenshots } from "@/components/AppScreenshots";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    // Add smooth scrolling functionality
    const handleScrollToSection = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleScrollToSection);
    
    return () => {
      document.removeEventListener('click', handleScrollToSection);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <Compatibility />
        <Screenshots />
        <AppScreenshots />
        <Commands />
        <HowToUse />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
