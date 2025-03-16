import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// POST /api/payments/webhook - Handle Stripe webhook events
export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-10-16",
  });

  const supabase = createClient();

  // Get the signature from the headers
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  try {
    // Get the raw body
    const body = await request.text();

    // Verify the event
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object, supabase);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object, supabase);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}

// Handle successful payment
async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { agreement_id, payment_type, tenant_id, landlord_id } =
    paymentIntent.metadata;

  if (!agreement_id || !payment_type || !tenant_id || !landlord_id) {
    console.error("Missing metadata in payment intent");
    return;
  }

  // Create notifications for both parties
  const amount = (paymentIntent.amount / 100).toFixed(2); // Convert cents to dollars
  const paymentTypeFormatted =
    payment_type === "rent" ? "rent" : "security deposit";

  await supabase.from("notifications").insert([
    {
      user_id: tenant_id,
      title: `Payment Successful`,
      message: `Your payment of $${amount} for ${paymentTypeFormatted} has been processed successfully.`,
      link: `/dashboard/agreements/${agreement_id}`,
    },
    {
      user_id: landlord_id,
      title: `Payment Received`,
      message: `You have received a payment of $${amount} for ${paymentTypeFormatted}.`,
      link: `/dashboard/agreements/${agreement_id}`,
    },
  ]);

  // If this was a security deposit payment, update the property status to 'rented'
  if (payment_type === "security_deposit") {
    // Get the property ID from the agreement
    const { data: agreement, error: agreementError } = await supabase
      .from("rental_agreements")
      .select("property_id")
      .eq("id", agreement_id)
      .single();

    if (agreementError || !agreement) {
      console.error("Failed to get agreement:", agreementError);
      return;
    }

    // Update property status
    await supabase
      .from("properties")
      .update({ status: "rented" })
      .eq("id", agreement.property_id);
  }
}

// Handle failed payment
async function handlePaymentIntentFailed(
  paymentIntent: Stripe.PaymentIntent,
  supabase: any
) {
  const { agreement_id, payment_type, tenant_id, landlord_id } =
    paymentIntent.metadata;

  if (!agreement_id || !payment_type || !tenant_id || !landlord_id) {
    console.error("Missing metadata in payment intent");
    return;
  }

  // Create notification for tenant
  const amount = (paymentIntent.amount / 100).toFixed(2); // Convert cents to dollars
  const paymentTypeFormatted =
    payment_type === "rent" ? "rent" : "security deposit";

  await supabase.from("notifications").insert({
    user_id: tenant_id,
    title: `Payment Failed`,
    message: `Your payment of $${amount} for ${paymentTypeFormatted} has failed. Please try again.`,
    link: `/dashboard/agreements/${agreement_id}`,
  });
}
