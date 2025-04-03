
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Features as FeaturesComponent } from "@/components/Features";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <FeaturesComponent />
      </main>
      <Footer />
    </div>
  );
}
