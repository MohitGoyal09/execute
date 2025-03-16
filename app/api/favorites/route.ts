import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/favorites - Get favorites for the current user
export async function GET(request: NextRequest) {
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
      { error: "Only tenants can have favorites" },
      { status: 403 }
    );
  }

  // Get favorites with property details
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select(
      `
      *,
      properties(
        id, title, address, city, state, zip_code,
        property_type, bedrooms, bathrooms, rent_amount,
        property_images(image_url, is_primary)
      )
    `
    )
    .eq("tenant_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ favorites });
}

// POST /api/favorites - Add a property to favorites
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
      { error: "Only tenants can add favorites" },
      { status: 403 }
    );
  }

  try {
    const { property_id } = await request.json();

    if (!property_id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Check if property exists
    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("id")
      .eq("id", property_id)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const { data: existingFavorite, error: existingError } = await supabase
      .from("favorites")
      .select("id")
      .eq("tenant_id", user.id)
      .eq("property_id", property_id)
      .maybeSingle();

    if (!existingError && existingFavorite) {
      return NextResponse.json(
        { error: "Property already in favorites" },
        { status: 400 }
      );
    }

    // Add to favorites
    const { data: favorite, error } = await supabase
      .from("favorites")
      .insert({
        tenant_id: user.id,
        property_id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/favorites - Remove a property from favorites
export async function DELETE(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { property_id } = await request.json();

    if (!property_id) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Delete from favorites
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("tenant_id", user.id)
      .eq("property_id", property_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
