import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Hero() {
  const { user } = useAuth();
  
  return (
    <div className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background effects */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-10 right-20 w-72 h-72 bg-purple-400/20 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
      
      <div className="container px-4 mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-block px-3 py-1 mb-6 text-xs font-medium rounded-full bg-accent/10 text-accent">
              Version 1.0 — Now Available
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 gradient-text">
              Ace Your Technical Interviews
            </h1>
            <p className="text-lg md:text-xl mb-8 text-muted-foreground">
              Invisible real-time assistance for coding interviews. Get solutions to DSA problems instantly with interviewally's AI-powered companion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-accent hover:bg-accent/80 text-white text-lg py-6 px-8">
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Link to="/signup">
                  <Button className="bg-accent hover:bg-accent/80 text-white text-lg py-6 px-8">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link to="/features">
                <Button variant="outline" className="text-lg py-6 px-8">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center text-sm text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Invisible to all screen-recording software
            </div>
          </div>
          
          <div className="relative animate-fade-in animation-delay-2000">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-purple-500/10 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative shadow-2xl p-2 md:p-4 rounded-2xl overflow-hidden animate-float">
              <img 
                src="/images/start_application.png" 
                alt="interviewally desktop app" 
                className="rounded-xl w-full shadow-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="px-3 py-1 rounded-full bg-accent text-white text-xs inline-block">
                  DSA Problem Solver
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
