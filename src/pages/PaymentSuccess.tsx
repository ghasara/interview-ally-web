
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get the order_id from URL params - Cashfree sends this back
  const orderId = searchParams.get("order_id");
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Set a timeout to auto-redirect to dashboard after 15 seconds
    // This ensures users don't get stuck on this page
    const redirectTimeout = setTimeout(() => {
      if (!isSuccess && !error) {
        console.log("Auto-redirecting to dashboard after timeout");
        navigate("/dashboard");
      }
    }, 15000);

    async function verifyPayment() {
      if (!orderId) {
        setIsVerifying(false);
        setError("Missing order information");
        return;
      }
      
      try {
        console.log("Verifying payment for order ID:", orderId);
        
        // Check subscription status
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("status, plan_id")
          .eq("id", orderId)
          .maybeSingle();
          
        if (subError) {
          throw subError;
        }
        
        if (!subscription) {
          setError("Subscription not found. Please contact support.");
          setIsVerifying(false);
          setIsLoading(false);
          return;
        }
        
        console.log("Found subscription:", subscription);
        
        if (subscription.status === "active") {
          setIsSuccess(true);
          toast.success("Payment successful! Your subscription is now active.");
          
          // Get license information
          const { data: license } = await supabase
            .from("licenses")
            .select("key, credits")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (license) {
            toast.success(`Your license key: ${license.key} with ${license.credits} credits`);
          }
          
          // Redirect to dashboard after successful payment confirmation
          setTimeout(() => {
            console.log("Redirecting to dashboard after payment success");
            navigate("/dashboard");
          }, 2000);
        } else if (subscription.status === "pending_payment") {
          // Payment might still be processing
          toast.info("Payment verification in progress. We'll notify you once confirmed.");
        } else {
          // Payment failed
          setError(`Payment was not successful. Status: ${subscription.status}`);
          toast.error("Payment was not successful.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError("Failed to verify payment status");
        toast.error("Failed to verify payment status");
      } finally {
        setIsVerifying(false);
        setIsLoading(false);
      }
    }
    
    verifyPayment();
    
    // Poll for updates every 2 seconds if payment is still processing
    const intervalId = setInterval(async () => {
      if (!isSuccess && orderId) {
        console.log("Polling for payment status updates...");
        
        try {
          const { data } = await supabase
            .from("subscriptions")
            .select("status")
            .eq("id", orderId)
            .maybeSingle();
            
          if (data && data.status === "active") {
            setIsSuccess(true);
            setError(null);
            toast.success("Payment successful! Your subscription is now active.");
            
            // Get license information
            const { data: license } = await supabase
              .from("licenses")
              .select("key, credits")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();
              
            if (license) {
              toast.success(`Your license key: ${license.key} with ${license.credits} credits`);
            }
            
            // Redirect to dashboard after successful payment
            console.log("Payment success detected, redirecting to dashboard");
            navigate("/dashboard", { replace: true });
            
            // Stop polling once payment is successful
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Error polling for payment status:", err);
        }
      } else {
        // Stop polling if success or no order ID
        clearInterval(intervalId);
      }
    }, 2000); // Check every 2 seconds
    
    return () => {
      clearInterval(intervalId);
      clearTimeout(redirectTimeout);
    };
  }, [orderId, user, navigate, isSuccess, error]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Verifying your payment...</h1>
            <p className="text-muted-foreground">Please wait while we confirm your transaction.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full p-6 feature-card rounded-xl">
          {isSuccess ? (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your subscription has been activated successfully. You now have access to all features included in your plan.
              </p>
              <Button 
                className="bg-accent hover:bg-accent/80 text-white w-full"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="text-center">
              {error ? (
                <>
                  <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
                  <p className="text-muted-foreground mb-6">
                    {error}
                  </p>
                </>
              ) : (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-accent mx-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-4">Payment Processing</h1>
                  <p className="text-muted-foreground mb-6">
                    Your payment is being processed. We'll update your subscription status as soon as the payment is confirmed.
                  </p>
                </>
              )}
              <Button 
                className="bg-accent hover:bg-accent/80 text-white w-full"
                onClick={() => navigate("/dashboard", { replace: true })}
              >
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
