import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/negotiations - Get negotiations for the current user
export async function GET(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user role
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  let query = supabase.from("negotiations").select(`
      *,
      properties(id, title, address, city, state, zip_code, rent_amount, security_deposit, property_images(image_url, is_primary)),
      profiles!negotiations_tenant_id_fkey(id, full_name, profile_image_url),
      profiles!negotiations_landlord_id_fkey(id, full_name, profile_image_url)
    `);

  // Filter based on user role
  if (profile.role === "tenant") {
    query = query.eq("tenant_id", user.id);
  } else if (profile.role === "landlord") {
    query = query.eq("landlord_id", user.id);
  }

  const { data: negotiations, error } = await query.order("updated_at", {
    ascending: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ negotiations });
}

// POST /api/negotiations - Create a new negotiation
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
      { error: "Only tenants can initiate negotiations" },
      { status: 403 }
    );
  }

  try {
    const negotiationData = await request.json();

    // Validate required fields
    if (!negotiationData.property_id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Check if property exists and is available
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id, landlord_id, status")
      .eq("id", negotiationData.property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.status !== "available") {
      return NextResponse.json(
        { error: "Property is not available for negotiation" },
        { status: 400 }
      );
    }

    // Check if there's already an active negotiation for this property and tenant
    const { data: existingNegotiation, error: existingError } = await supabase
      .from("negotiations")
      .select("id")
      .eq("property_id", negotiationData.property_id)
      .eq("tenant_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!existingError && existingNegotiation) {
      return NextResponse.json(
        {
          error: "You already have an active negotiation for this property",
          existingId: existingNegotiation.id,
        },
        { status: 400 }
      );
    }

    // Add tenant_id and landlord_id to negotiation data
    negotiationData.tenant_id = user.id;
    negotiationData.landlord_id = property.landlord_id;

    // Insert negotiation
    const { data: negotiation, error } = await supabase
      .from("negotiations")
      .insert(negotiationData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for landlord
    await supabase.from("notifications").insert({
      user_id: property.landlord_id,
      title: "New Negotiation Request",
      message: "A tenant has started a negotiation for your property",
      link: `/dashboard/negotiations/${negotiation.id}`,
    });

    return NextResponse.json({ negotiation }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
