
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing as PricingComponent } from "@/components/Pricing";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <PricingComponent />
      </main>
      <Footer />
    </div>
  );
}
