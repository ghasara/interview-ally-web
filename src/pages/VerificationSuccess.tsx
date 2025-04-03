import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CheckCircle } from "lucide-react";

export default function VerificationSuccess() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 5000);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 mt-16">
        <div className="max-w-md w-full space-y-8 feature-card p-8 text-center">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full dark:bg-green-900/20">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold">Email Verified!</h2>
          
          <p className="text-muted-foreground">
            Your email has been successfully verified. You can now log in to your account.
          </p>
          
          <div className="pt-4">
            <Button
              className="w-full bg-accent hover:bg-accent/80 text-white"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            You will be automatically redirected to login in a few seconds...
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}