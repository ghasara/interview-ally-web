import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Parse the webhook payload
    const payload = await req.json();
    console.log("Received webhook payload:", payload);

    // Verify the webhook signature
    const signature = req.headers.get("x-webhook-signature");
    console.log("Webhook signature:", signature);
    // In production, implement signature verification here using CASHFREE_SECRET_KEY
    
    // Extract payment details from payload according to Cashfree's documentation
    const { 
      order_id, 
      order_status,
      order_amount,
      cf_payment_id,
      entity,
      metadata
    } = payload.data || {};

    if (!order_id || !order_status) {
      throw new Error("Invalid webhook payload");
    }

    console.log(`Processing order ${order_id} with status ${order_status}`);

    // Check if this is a credit purchase by checking the payment transaction
    const { data: paymentTransaction, error: paymentError } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("id", order_id)
      .single();

    // If it's a credit purchase
    if (!paymentError && paymentTransaction && paymentTransaction.payment_provider === "credits_purchase") {
      console.log(`Processing credit purchase for order ${order_id} with status ${order_status}`);
      
      if (order_status === "PAID") {
        // Extract the number of credits from metadata
        const credits = paymentTransaction.metadata?.credits || 0;
        
        if (credits > 0) {
          console.log(`Credit purchase successful. Adding ${credits} credits for user ${paymentTransaction.user_id}`);
          
          // Update the payment transaction status
          const { error: updateError } = await supabase
            .from("payment_transactions")
            .update({
              status: "completed"
            })
            .eq("id", order_id);
            
          if (updateError) {
            console.error("Failed to update payment transaction:", updateError);
          }
          
          // Generate license key for the credits
          const licenseKey = generateLicenseKey();
          
          // Create a license for the credits
          const { error: licenseError } = await supabase
            .from("licenses")
            .insert({
              key: licenseKey,
              credits: credits,
              is_active: true,
              user_id: paymentTransaction.user_id,
            });
            
          if (licenseError) {
            console.error("Error creating license for credits:", licenseError);
          }
        }
      } else if (["EXPIRED", "FAILED", "CANCELLED"].includes(order_status)) {
        console.log(`Credit purchase ${order_status} for order ${order_id}.`);
        
        // Update the payment transaction status
        const { error: updateError } = await supabase
          .from("payment_transactions")
          .update({
            status: "failed"
          })
          .eq("id", order_id);
          
        if (updateError) {
          console.error("Failed to update payment transaction:", updateError);
        }
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Otherwise, this is a subscription payment
    const { data: subscription, error: subscriptionError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", order_id)
      .single();

    if (subscriptionError || !subscription) {
      console.error("Subscription error:", subscriptionError);
      throw new Error(`Subscription not found for order: ${order_id}`);
    }

    console.log("Found subscription:", subscription);

    // Update subscription based on payment status
    if (order_status === "PAID") {
      console.log(`Payment successful for order ${order_id}. Activating subscription.`);
      
      // Calculate credits based on plan
      const credits = subscription.plan_id === "basic" ? 20 : subscription.plan_id === "pro" ? 40 : 100;
      
      const currentDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Set end date to 1 month later
      
      // Payment successful, update subscription status
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          current_period_start: currentDate.toISOString(),
          current_period_end: endDate.toISOString(),
          razorpay_subscription_id: cf_payment_id, // Using this field to store Cashfree payment ID
          credits_per_month: credits,
          credits_remaining: credits
        })
        .eq("id", order_id);

      if (updateError) {
        console.error("Failed to update subscription:", updateError);
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }

      // Generate license key for the user
      const licenseKey = generateLicenseKey();

      console.log(`Generating license key ${licenseKey} with ${credits} credits for user ${subscription.user_id}`);

      // Insert the license record
      const { error: licenseError } = await supabase
        .from("licenses")
        .insert({
          key: licenseKey,
          credits: credits,
          is_active: true,
          user_id: subscription.user_id,
        });

      if (licenseError) {
        console.error("Error creating license:", licenseError);
      }
    } else if (["EXPIRED", "FAILED", "CANCELLED"].includes(order_status)) {
      console.log(`Payment ${order_status} for order ${order_id}. Marking subscription as failed.`);
      
      // Payment failed, update subscription status
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "failed",
        })
        .eq("id", order_id);

      if (updateError) {
        console.error("Failed to update subscription:", updateError);
        throw new Error(`Failed to update subscription: ${updateError.message}`);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process webhook" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// Function to generate a unique license key
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