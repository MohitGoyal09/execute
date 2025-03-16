import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// POST /api/payments/create-intent - Create a payment intent for security deposit or rent
export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a tenant
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.role !== "tenant") {
    return NextResponse.json(
      { error: "Only tenants can make payments" },
      { status: 403 }
    );
  }

  try {
    const { agreement_id, payment_type, amount } = await request.json();

    if (!agreement_id || !payment_type || !amount) {
      return NextResponse.json(
        { error: "Agreement ID, payment type, and amount are required" },
        { status: 400 }
      );
    }

    // Validate payment type
    if (!["rent", "security_deposit"].includes(payment_type)) {
      return NextResponse.json(
        { error: "Invalid payment type" },
        { status: 400 }
      );
    }

    // Check if agreement exists and user is the tenant
    const { data: agreement, error: agreementError } = await supabase
      .from("rental_agreements")
      .select(
        "id, tenant_id, landlord_id, rent_amount, security_deposit, status"
      )
      .eq("id", agreement_id)
      .single();

    if (agreementError || !agreement) {
      return NextResponse.json(
        { error: "Agreement not found" },
        { status: 404 }
      );
    }

    if (agreement.tenant_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to make payments for this agreement",
        },
        { status: 403 }
      );
    }

    // Check if agreement is signed
    if (agreement.status !== "signed") {
      return NextResponse.json(
        { error: "Payments can only be made for signed agreements" },
        { status: 400 }
      );
    }

    // Validate amount based on payment type
    const expectedAmount =
      payment_type === "rent"
        ? agreement.rent_amount
        : agreement.security_deposit;

    if (amount !== expectedAmount) {
      return NextResponse.json(
        {
          error: `Invalid amount. Expected ${expectedAmount} for ${payment_type}`,
        },
        { status: 400 }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2023-10-16",
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      metadata: {
        agreement_id,
        payment_type,
        tenant_id: user.id,
        landlord_id: agreement.landlord_id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment intent creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
