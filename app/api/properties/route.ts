import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/properties - Get all properties or search properties
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search");
  const city = searchParams.get("city");
  const minBedrooms = searchParams.get("minBedrooms");
  const maxRent = searchParams.get("maxRent");
  const propertyType = searchParams.get("propertyType");
  const hasAccessibility = searchParams.get("hasAccessibility");

  let query = supabase
    .from("properties")
    .select(
      `
      *,
      property_images(*)
    `
    )
    .eq("status", "available")
    .order("created_at", { ascending: false });

  // Apply filters if provided
  if (search) {
    // Use the custom search function
    const { data: searchResults, error: searchError } = await supabase.rpc(
      "property_search",
      { search_term: search }
    );

    if (searchError) {
      return NextResponse.json({ error: searchError.message }, { status: 500 });
    }

    return NextResponse.json({ properties: searchResults });
  }

  if (city) {
    query = query.ilike("city", `%${city}%`);
  }

  if (minBedrooms) {
    query = query.gte("bedrooms", parseInt(minBedrooms));
  }

  if (maxRent) {
    query = query.lte("rent_amount", parseInt(maxRent));
  }

  if (propertyType) {
    query = query.eq("property_type", propertyType);
  }

  if (hasAccessibility === "true") {
    query = query.not("accessibility_features", "eq", "{}");
  }

  const { data: properties, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties });
}

// POST /api/properties - Create a new property
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
      { error: "Only landlords can create properties" },
      { status: 403 }
    );
  }

  try {
    const propertyData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "description",
      "address",
      "city",
      "state",
      "zip_code",
      "property_type",
      "bedrooms",
      "bathrooms",
      "area_sqft",
      "rent_amount",
      "security_deposit",
      "available_from",
      "min_lease_duration",
    ];

    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Add landlord_id to property data
    propertyData.landlord_id = user.id;

    // Insert property
    const { data: property, error } = await supabase
      .from("properties")
      .insert(propertyData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ property }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
