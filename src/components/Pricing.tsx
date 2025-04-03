import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 15.99,
    interval: "month",
    description: "Essential features for starters",
    features: [
      "20 credits per month",
      "Standard response time",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Job Seekers",
    price: 25.99,
    interval: "month",
    description: "Everything a professional needs",
    features: [
      "40 credits per month",
      "Fast response time",
      "Priority email support",
      "Interview preparation guides",
    ],
    isPopular: true,
  },
];

export function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePurchase = async (plan: PricingPlan) => {
    setLoadingPlan(plan.id);
    
    try {
      if (!user) {
        navigate("/signup");
        return;
      }
      
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          plan_name: plan.name,
          price: plan.price,
          currency: "USD",
          interval: plan.interval,
          interval_count: 1,
          status: "pending_payment",
          credits_per_month: plan.id === "basic" ? 20 : 40,
          credits_remaining: plan.id === "basic" ? 20 : 40,
          starts_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        console.error("Error creating subscription:", error);
        toast.error("Failed to create subscription: " + error.message);
        setLoadingPlan(null);
        return;
      }

      console.log("Created subscription:", subscription);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();
      
      setProcessingPayment(true);
      toast.info("Preparing payment page...");
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
          body: JSON.stringify({
            orderId: subscription.id,
            planId: plan.id,
            userId: user.id,
            amount: plan.price * 100, // Convert to cents for payment processing
            customerEmail: profile?.email || user.email,
            customerName: profile?.full_name || "User",
            customerPhone: "9999999999",
            returnUrl: window.location.origin + "/payment/success",
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment creation error response:", errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || "Failed to create payment");
        } catch (e) {
          throw new Error("Failed to create payment: " + errorText);
        }
      }

      const paymentData = await response.json();
      console.log("Payment data:", paymentData);
      
      if (paymentData.payment_link) {
        setPaymentUrl(paymentData.payment_link);
        
        // First try to redirect directly - this is most reliable
        window.location.href = paymentData.payment_link;
        
        // As a fallback, try to open in a new tab if direct redirection is blocked
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            const newWindow = window.open(paymentData.payment_link, '_blank');
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
              toast.info("Please use the button below to continue to the payment page.");
            } else {
              toast.success("Payment page opened in a new tab");
            }
          }
        }, 1000);
      } else {
        throw new Error("No payment link received from server");
      }
    } catch (error) {
      console.error("Error purchasing plan:", error);
      toast.error("An error occurred while processing your purchase: " + (error.message || "Unknown error"));
    } finally {
      setLoadingPlan(null);
      setProcessingPayment(false);
    }
  };

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that fits your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`feature-card p-8 rounded-xl transition-all duration-200 ${
                plan.isPopular ? "border-accent shadow-lg scale-105" : ""
              } animate-fade-in`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-0 right-0 flex justify-center">
                  <span className="px-3 py-1 bg-accent text-white text-xs rounded-full font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full ${
                  plan.isPopular 
                    ? "bg-accent hover:bg-accent/80 text-white" 
                    : "bg-secondary/80 hover:bg-secondary text-foreground"
                }`}
                onClick={() => handlePurchase(plan)}
                disabled={loadingPlan === plan.id || processingPayment}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get Started"
                )}
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center animate-fade-in">
          <p className="text-muted-foreground">
            Need a custom plan for your enterprise?{" "}
            <Link to="/contact" className="text-accent hover:text-accent/80">
              Contact us
            </Link>
          </p>
        </div>
      </div>
      
      <Dialog open={!!paymentUrl} onOpenChange={(isOpen) => {
        if (!isOpen) setPaymentUrl(null);
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete your payment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              If you were not automatically redirected to the payment page, please click the button below.
            </p>
            <Button 
              className="w-full bg-accent hover:bg-accent/80 text-white"
              onClick={() => {
                if (paymentUrl) {
                  window.location.href = paymentUrl;
                }
              }}
            >
              Continue to payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
