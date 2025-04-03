import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  Download, 
  Copy, 
  Check, 
  X, 
  User, 
  CreditCard, 
  Key, 
  HelpCircle, 
  PlusCircle,
  Settings,
  Cpu,
  Smile
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Profile {
  full_name: string | null;
  email: string | null;
  id: string;
  updated_at: string | null;
  avatar_url: string | null;
}

interface Subscription {
  id: string;
  plan_id: string;
  plan_name: string | null;
  status: string;
  created_at: string | null;
  credits_per_month: number | null;
  credits_remaining: number | null;
  starts_at: string | null;
  ends_at: string | null;
}

interface License {
  id: number;
  key: string | null;
  credits: number | null;
  is_active: boolean | null;
  user_id: string | null;
}

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_provider: string;
  payment_id: string;
  metadata?: { credits?: number };
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [buyCreditsOpen, setBuyCreditsOpen] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState("20");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    loadUserData();
  }, [user, navigate]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
        
      if (profileData) {
        setProfile({
          ...profileData,
          email: user?.email || null
        });
      }
      
      const { data: subscriptionsData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user?.id);
        
      setSubscriptions(subscriptionsData || []);
      
      const { data: licensesData } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_id", user?.id);
        
      setLicenses(licensesData || []);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("License key copied to clipboard");
  };

  function redeemPromoCode() {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsRedeeming(true);
    try {
      const handlePromoCodeRedeem = async () => {
        const { data: promoData, error: promoError } = await supabase
          .from("promo_codes")
          .select("*")
          .eq("code", promoCode.trim())
          .eq("is_active", true)
          .single();
        
        if (promoError || !promoData) {
          toast.error("Invalid or expired promo code");
          setIsRedeeming(false);
          return;
        }

        const { data: existingRedemption } = await supabase
          .from("redeemed_promo_codes")
          .select("*")
          .eq("user_id", user?.id)
          .eq("promo_code_id", promoData.id)
          .single();

        if (existingRedemption) {
          toast.error("You have already redeemed this promo code");
          setIsRedeeming(false);
          return;
        }

        const licenseKey = generateLicenseKey();
        
        const { data: newLicense, error: licenseError } = await supabase
          .from("licenses")
          .insert({
            key: licenseKey,
            credits: promoData.credits,
            is_active: true,
            promo_code_id: promoData.id,
            user_id: user?.id
          })
          .select()
          .single();
          
        if (licenseError) {
          console.error("Error creating license:", licenseError);
          toast.error("Failed to create license key");
          setIsRedeeming(false);
          return;
        }

        await supabase
          .from("redeemed_promo_codes")
          .insert({
            user_id: user?.id,
            promo_code_id: promoData.id
          });

        setLicenses(prevLicenses => [...prevLicenses, newLicense]);

        toast.success("Promo code redeemed successfully!");
        setPromoCode("");
        setIsRedeeming(false);
      };
      
      handlePromoCodeRedeem();
    } catch (error) {
      console.error("Error redeeming promo code:", error);
      toast.error("Failed to redeem promo code. Please try again.");
      setIsRedeeming(false);
    }
  }

  function generateLicenseKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const segments = 4;
    const segmentLength = 5;
    let key = "";
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segmentLength; j++) {
        key += chars[Math.floor(Math.random() * chars.length)];
      }
      if (i < segments - 1) key += "-";
    }
    
    return key;
  }

  function handlePurchase(planId: string) {
    if (!user) {
      navigate("/login");
      return;
    }
    
    try {
      toast.info("Preparing payment process...");
      
      const createSubscription = async () => {
        const { data: subscription, error } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            plan_id: planId,
            plan_name: planId === "basic" ? "Basic" : "Pro",
            price: planId === "basic" ? 15.99 : 25.99,
            currency: "USD",
            interval: "month",
            interval_count: 1,
            status: "pending_payment",
            credits_per_month: planId === "basic" ? 20 : 40,
            credits_remaining: planId === "basic" ? 20 : 40,
            starts_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (error) {
          console.error("Subscription creation error:", error);
          toast.error("Failed to initiate payment process: " + error.message);
          return;
        }
        
        console.log("Created subscription:", subscription);

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .maybeSingle();
        
        toast.info("Connecting to payment gateway...");
        
        const sessionData = await supabase.auth.getSession();
        const accessToken = sessionData.data.session?.access_token;
        
        if (!accessToken) {
          throw new Error("Authentication required. Please log in again.");
        }
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              orderId: subscription.id,
              planId: planId,
              userId: user.id,
              amount: planId === "basic" ? 1599 : 2599, // In cents
              customerEmail: profile?.email || user?.email,
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
          
          window.location.href = paymentData.payment_link;
          
          setTimeout(() => {
            if (document.visibilityState === 'visible') {
              const newWindow = window.open(paymentData.payment_link, '_blank');
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                toast.info("Please use the dialog button to continue to payment");
              } else {
                toast.success("Payment page opened in a new tab");
              }
            }
          }, 1000);
        } else {
          throw new Error("No payment link received from server");
        }
      };
      
      createSubscription();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred while processing your request: " + (error.message || "Unknown error"));
    }
  }

  const handleBuyCredits = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    try {
      setIsLoading(true);
      toast.info("Preparing credits purchase...");
      
      const creditAmounts = {
        "10": { price: 7.99 },
        "20": { price: 14.99 },
        "50": { price: 34.99 },
        "100": { price: 59.99 }
      };
      
      const amount = parseInt(selectedCredits);
      const price = creditAmounts[selectedCredits as keyof typeof creditAmounts]?.price || 14.99;
      
      const transactionData = {
        user_id: user.id,
        amount: price,
        currency: "USD",
        status: "pending",
        payment_provider: "credits_purchase",
        payment_id: `credits_${amount}_${Date.now()}`,
        metadata: { credits: amount }
      };
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();
      
      const sessionData = await supabase.auth.getSession();
      const accessToken = sessionData.data.session?.access_token;
      
      if (!accessToken) {
        throw new Error("Authentication required. Please log in again.");
      }
      
      const tempTransactionId = `credits_${user.id}_${Date.now()}`;
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            orderId: tempTransactionId,
            type: "credits",
            userId: user.id,
            amount: Math.round(price * 100), // Convert to cents
            customerEmail: profile?.email || user?.email,
            customerName: profile?.full_name || "User",
            customerPhone: "9999999999",
            returnUrl: window.location.origin + "/payment/success",
            credits: amount
          }),
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Payment creation error response:", errorText);
        throw new Error("Failed to create payment: " + errorText);
      }
      
      const paymentData = await response.json();
      console.log("Payment data:", paymentData);
      
      if (paymentData.payment_link) {
        setPaymentUrl(paymentData.payment_link);
        window.location.href = paymentData.payment_link;
      } else {
        throw new Error("No payment link received from server");
      }
    } catch (error) {
      console.error("Credits purchase error:", error);
      toast.error("An error occurred while processing your request: " + (error.message || "Unknown error"));
    } finally {
      setIsLoading(false);
      setBuyCreditsOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4 max-w-6xl mx-auto mt-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button 
            variant="outline" 
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-2xl font-bold">{profile?.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info("Profile editing coming soon!")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {subscriptions.length > 0 ? (
                <div>
                  <p className="text-2xl font-bold">{subscriptions[0].plan_name}</p>
                  <p className="text-xs text-muted-foreground">Status: {subscriptions[0].status}</p>
                  <p className="text-xs text-muted-foreground">
                    {subscriptions[0].credits_remaining} of {subscriptions[0].credits_per_month} credits remaining
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-bold">No Plan</p>
                  <p className="text-xs text-muted-foreground">Subscribe to get started</p>
                  <Button
                    className="w-full mt-2 bg-accent hover:bg-accent/80 text-white"
                    onClick={() => navigate("/pricing")}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Choose Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Credits</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-2xl font-bold">
                  {licenses.reduce((total, license) => total + (license.credits || 0), 0)} Credits
                </p>
                <p className="text-xs text-muted-foreground">From {licenses.length} active license keys</p>
                <Button 
                  className="w-full mt-2 bg-accent hover:bg-accent/80 text-white"
                  onClick={() => setBuyCreditsOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Buy More Credits
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>License Keys</CardTitle>
                <CardDescription>
                  Your license keys provide access to InterviewAlly features
                </CardDescription>
              </CardHeader>
              <CardContent>
                {licenses.length > 0 ? (
                  <div className="space-y-4">
                    {licenses.map((license) => (
                      <div key={license.id} className="bg-secondary/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-mono text-accent">{license.key}</p>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(license.key || "")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <p>Credits: {license.credits}</p>
                        <p>Status: {license.is_active ? (
                          <span className="inline-flex items-center text-green-500">
                            <Check className="h-4 w-4 mr-1" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-red-500">
                            <X className="h-4 w-4 mr-1" /> Inactive
                          </span>
                        )}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    <p className="mb-4">No license keys available. Purchase a subscription or add credits to get started.</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-6">
                <div className="bg-secondary/10 p-4 rounded-lg w-full">
                  <h3 className="text-lg font-semibold mb-2">Redeem Promo Code</h3>
                  <div className="flex gap-2">
                    <Input 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="bg-secondary/30"
                    />
                    <Button
                      onClick={redeemPromoCode}
                      disabled={isRedeeming}
                      className="bg-accent hover:bg-accent/80 text-white"
                    >
                      {isRedeeming ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Redeeming...
                        </>
                      ) : (
                        "Redeem"
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Try these sample promo codes: WELCOME2024, STARTER100
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Desktop Application</CardTitle>
                <CardDescription>
                  Download the app to use your license
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Button 
                    className="bg-accent hover:bg-accent/80 text-white w-full"
                    onClick={() => {
                      toast.success("Download started");
                      if (user) {
                        supabase.from("downloads").insert({
                          user_id: user.id,
                          platform: "macOS",
                          file_name: "interviewally-macos-v1.0.dmg"
                        });
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download for macOS
                  </Button>
                  <Button 
                    className="bg-accent hover:bg-accent/80 text-white w-full"
                    onClick={() => {
                      toast.success("Download started");
                      if (user) {
                        supabase.from("downloads").insert({
                          user_id: user.id,
                          platform: "Windows",
                          file_name: "interviewally-windows-v1.0.exe"
                        });
                      }
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download for Windows
                  </Button>
                </div>
                
                <div className="rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/images/start_application.png" 
                    alt="InterviewAlly Desktop App" 
                    className="w-full"
                  />
                </div>
                
                <Card className="bg-secondary/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Getting Started</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Download and install the application</li>
                      <li>Launch InterviewAlly from your applications</li>
                      <li>Enter your license key to activate</li>
                      <li>Select an interview topic from the menu</li>
                      <li>Practice answering the generated questions</li>
                      <li>Review the AI feedback to improve</li>
                    </ol>
                  </CardContent>
                </Card>
                
                <div className="flex items-center justify-center">
                  <Button variant="ghost" className="text-accent" onClick={() => navigate("/help")}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Need help? Check our guides
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent usage and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Cpu className="h-10 w-10 text-muted-foreground" />
                  <h3 className="font-medium">No recent activity</h3>
                  <p className="text-sm text-muted-foreground">
                    Download the desktop app and start practicing to see your activity here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
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
      
      <Dialog open={buyCreditsOpen} onOpenChange={setBuyCreditsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Additional Credits</DialogTitle>
            <DialogDescription>
              Purchase credits to use in the InterviewAlly desktop application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Credit Package</label>
              <Select value={selectedCredits} onValueChange={setSelectedCredits}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select credits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Credits - $7.99</SelectItem>
                  <SelectItem value="20">20 Credits - $14.99</SelectItem>
                  <SelectItem value="50">50 Credits - $34.99</SelectItem>
                  <SelectItem value="100">100 Credits - $59.99</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-secondary/20 p-4 rounded-lg">
              <p className="text-sm mb-2">
                <span className="font-medium">Selected package:</span>{" "}
                {selectedCredits} Credits
              </p>
              <p className="text-sm">
                <span className="font-medium">Price:</span>{" "}
                ${selectedCredits === "10" ? "7.99" : 
                  selectedCredits === "20" ? "14.99" : 
                  selectedCredits === "50" ? "34.99" : "59.99"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setBuyCreditsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-accent hover:bg-accent/80 text-white"
              onClick={handleBuyCredits}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Purchase Credits"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
}
