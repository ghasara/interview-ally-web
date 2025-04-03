import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await updatePassword(password);
      
      if (!error) {
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 mt-16">
        <div className="max-w-md w-full space-y-8 feature-card p-8">
          {!isSuccess ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold">Reset your password</h2>
                <p className="mt-2 text-muted-foreground">
                  Enter a new password for your account
                </p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2">
                    New password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
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
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-secondary/30 pr-10"
                      placeholder="••••••••"
                    />
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
                      Resetting password...
                    </>
                  ) : (
                    "Reset password"
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">Password reset successful!</h2>
              
              <p className="text-muted-foreground">
                Your password has been successfully changed.
                You can now log in with your new password.
              </p>
              
              <div className="pt-4">
                <Link to="/login">
                  <Button className="w-full bg-accent hover:bg-accent/80 text-white">
                    Go to login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}