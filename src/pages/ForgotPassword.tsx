import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message || "Failed to send reset email");
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 mt-16">
        <div className="max-w-md w-full space-y-8 feature-card p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold">Reset password</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter your email to receive a password reset link
                </p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-secondary/30"
                    placeholder="name@example.com"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-accent/10 p-4 rounded-full">
                  <Mail className="h-12 w-12 text-accent" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold">Check your email</h2>
              
              <p className="text-muted-foreground">
                We've sent a password reset link to <span className="font-medium">{email}</span>.
                Please check your inbox and click the link to reset your password.
              </p>
              
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                
                <Button
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try again
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-accent hover:text-accent/80 font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}