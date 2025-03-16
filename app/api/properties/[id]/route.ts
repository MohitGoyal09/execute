import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/properties/[id] - Get a specific property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const id = params.id;

  const { data: property, error } = await supabase
    .from("properties")
    .select(
      `
      *,
      property_images(*),
      profiles!properties_landlord_id_fkey(id, full_name, profile_image_url)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json({ property });
}

// PATCH /api/properties/[id] - Update a property
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const id = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if property exists and belongs to the user
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("landlord_id")
    .eq("id", id)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  if (property.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to update this property" },
      { status: 403 }
    );
  }

  try {
    const updateData = await request.json();

    // Prevent updating landlord_id
    delete updateData.landlord_id;

    const { data: updatedProperty, error } = await supabase
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ property: updatedProperty });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const id = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if property exists and belongs to the user
  const { data: property, error: propertyError } = await supabase
    .from("properties")
    .select("landlord_id")
    .eq("id", id)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  if (property.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to delete this property" },
      { status: 403 }
    );
  }

  // Delete property (cascade will handle related records)
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
