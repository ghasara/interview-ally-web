
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Download, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DownloadPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 py-12 container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 gradient-text text-center">
            Download InterviewAlly
          </h1>
          <p className="text-xl text-muted-foreground mb-12 text-center">
            Get our desktop application to start acing your technical interviews
          </p>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="feature-card p-6">
              <h2 className="text-xl font-bold mb-4">macOS</h2>
              <p className="text-muted-foreground mb-6">
                Compatible with macOS 10.15 and later
              </p>
              <Button className="w-full bg-accent hover:bg-accent/80 text-white">
                <Download className="mr-2 h-4 w-4" />
                Download for macOS
              </Button>
            </div>
            
            <div className="feature-card p-6">
              <h2 className="text-xl font-bold mb-4">Windows</h2>
              <p className="text-muted-foreground mb-6">
                Compatible with Windows 10 and later
              </p>
              <Button className="w-full bg-accent hover:bg-accent/80 text-white">
                <Download className="mr-2 h-4 w-4" />
                Download for Windows
              </Button>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="feature-card p-6">
              <h2 className="text-xl font-bold mb-4">Activation</h2>
              <p className="text-muted-foreground mb-6">
                {user ? (
                  "Use your license key from the dashboard to activate the application after installation."
                ) : (
                  "Sign up and subscribe to get your license key for activation."
                )}
              </p>
              {!user && (
                <Link to="/signup">
                  <Button className="bg-accent hover:bg-accent/80 text-white">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {user && (
                <Link to="/dashboard">
                  <Button className="bg-accent hover:bg-accent/80 text-white">
                    View License Keys
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
