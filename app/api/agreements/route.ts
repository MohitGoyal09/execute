import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/agreements - Get agreements for the current user
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

  let query = supabase.from("rental_agreements").select(`
      *,
      properties(id, title, address, city, state, zip_code),
      profiles!rental_agreements_tenant_id_fkey(id, full_name),
      profiles!rental_agreements_landlord_id_fkey(id, full_name)
    `);

  // Filter based on user role
  if (profile.role === "tenant") {
    query = query.eq("tenant_id", user.id);
  } else if (profile.role === "landlord") {
    query = query.eq("landlord_id", user.id);
  }

  const { data: agreements, error } = await query.order("updated_at", {
    ascending: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ agreements });
}

// POST /api/agreements - Create a new rental agreement
export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user is a landlord
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.role !== "landlord") {
    return NextResponse.json(
      { error: "Only landlords can create rental agreements" },
      { status: 403 }
    );
  }

  try {
    const agreementData = await request.json();

    // Validate required fields
    const requiredFields = [
      "property_id",
      "tenant_id",
      "title",
      "content",
      "start_date",
      "end_date",
      "rent_amount",
      "security_deposit",
      "payment_due_day",
    ];

    for (const field of requiredFields) {
      if (!agreementData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if property exists and belongs to the user
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("landlord_id")
      .eq("id", agreementData.property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.landlord_id !== user.id) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to create an agreement for this property",
        },
        { status: 403 }
      );
    }

    // Add landlord_id to agreement data
    agreementData.landlord_id = user.id;

    // Insert agreement
    const { data: agreement, error } = await supabase
      .from("rental_agreements")
      .insert(agreementData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create initial version record
    await supabase.from("agreement_versions").insert({
      agreement_id: agreement.id,
      version_number: 1,
      content: agreementData.content,
      created_by: user.id,
    });

    // Create notification for tenant
    await supabase.from("notifications").insert({
      user_id: agreementData.tenant_id,
      title: "New Rental Agreement",
      message: "A landlord has created a rental agreement for you to review",
      link: `/dashboard/agreements/${agreement.id}`,
    });

    return NextResponse.json({ agreement }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
