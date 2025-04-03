
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CASHFREE_APP_ID = Deno.env.get("CASHFREE_APP_ID");
const CASHFREE_SECRET_KEY = Deno.env.get("CASHFREE_SECRET_KEY");
const IS_PRODUCTION = false; // Set to true for production environment

const CASHFREE_API_URL = IS_PRODUCTION
  ? "https://api.cashfree.com/pg/orders"
  : "https://sandbox.cashfree.com/pg/orders";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { orderId, planId, userId, amount, customerEmail, customerPhone, customerName, returnUrl } = await req.json();

    console.log("Received payment request:", { orderId, planId, userId, amount, customerEmail, returnUrl });

    if (!orderId || !planId || !userId || !amount || !customerEmail || !returnUrl) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          details: { orderId, planId, userId, amount, customerEmail, returnUrl }
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
      return new Response(
        JSON.stringify({
          error: "Cashfree credentials are not configured",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create an order in Cashfree - following the documentation
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: userId,
        customer_email: customerEmail,
        customer_phone: customerPhone || "9999999999", // Required by Cashfree
        customer_name: customerName || "User", // Required by Cashfree
      },
      order_meta: {
        return_url: `${returnUrl}?order_id={order_id}`,
        notify_url: "", // Optional webhook URL
      },
      order_note: `Subscription for plan: ${planId}`,
    };

    console.log("Creating order with payload:", JSON.stringify(orderPayload));
    console.log("Using Cashfree API URL:", CASHFREE_API_URL);
    console.log("Using Cashfree APP ID:", CASHFREE_APP_ID);

    // Make request to Cashfree API
    const response = await fetch(CASHFREE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CASHFREE_APP_ID,
        "x-client-secret": CASHFREE_SECRET_KEY,
      },
      body: JSON.stringify(orderPayload),
    });

    const responseText = await response.text();
    
    try {
      const data = JSON.parse(responseText);
      console.log("Cashfree API response:", data);
      
      if (!response.ok) {
        throw new Error(`Cashfree API error: ${data.message || JSON.stringify(data)}`);
      }
      
      // Return the payment session URL from Cashfree
      return new Response(
        JSON.stringify({
          success: true,
          payment_link: data.payment_link,
          order_id: data.order_id,
          cf_order_id: data.cf_order_id,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Failed to parse Cashfree response:", error);
      console.error("Raw response:", responseText);
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to parse Cashfree API response", 
          details: responseText
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create payment" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
