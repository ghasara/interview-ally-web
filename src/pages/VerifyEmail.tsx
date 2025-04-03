import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifyEmail() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [isResending, setIsResending] = useState(false);
  const { resendVerification } = useAuth();

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    await resendVerification(email);
    setIsResending(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 mt-16">
        <div className="max-w-md w-full space-y-8 feature-card p-8 text-center">
          <div className="flex justify-center">
            <div className="bg-accent/10 p-4 rounded-full">
              <Mail className="h-12 w-12 text-accent" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold">Check your email</h2>
          
          <p className="text-muted-foreground">
            We've sent a verification link to <span className="font-medium">{email}</span>.
            Please check your inbox and click the link to verify your email address.
          </p>
          
          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Didn't receive the email? Check your spam folder or click below to resend.
            </p>
            
            <Button
              className="w-full bg-accent hover:bg-accent/80 text-white"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend verification email"
              )}
            </Button>
          </div>
          
          <div className="pt-4">
            <Link to="/login" className="text-accent hover:text-accent/80">
              Return to login
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}