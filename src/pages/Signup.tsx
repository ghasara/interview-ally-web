
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (!agreedToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }
    
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register the user with Supabase
      const { error } = await signUp(email, password, name);
      
      if (error) {
        if (error.message && (
          error.message.includes("already") || 
          error.message.includes("registered") ||
          error.message.includes("exists")
        )) {
          toast.error("This email is already registered. Please sign in instead.");
        } else {
          toast.error(error.message || "Failed to create account. Please try again.");
        }
      } else {
        // Successful signup redirects to verification page in the AuthContext
      }
    } catch (error) {
      console.error("Signup error:", error);
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
          <div className="text-center">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="mt-2 text-muted-foreground">
              Sign up to get started with interviewally
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSignup}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/30"
                  placeholder="John Doe"
                />
              </div>
              
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
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-secondary/30 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Must be at least 8 characters
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => 
                      setAgreedToTerms(checked as boolean)
                    }
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link to="/terms" className="text-accent hover:text-accent/80">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-accent hover:text-accent/80">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/80 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-accent hover:text-accent/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
