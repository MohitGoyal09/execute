import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/properties/[id]/images - Get all images for a property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const propertyId = params.id;

  const { data: images, error } = await supabase
    .from("property_images")
    .select("*")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ images });
}

// POST /api/properties/[id]/images - Add images to a property
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const propertyId = params.id;

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
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  if (property.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to add images to this property" },
      { status: 403 }
    );
  }

  try {
    const { images } = await request.json();

    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "No images provided" },
        { status: 400 }
      );
    }

    // Get the current highest display order
    const { data: existingImages, error: orderError } = await supabase
      .from("property_images")
      .select("display_order")
      .eq("property_id", propertyId)
      .order("display_order", { ascending: false })
      .limit(1);

    let startOrder = 0;
    if (!orderError && existingImages && existingImages.length > 0) {
      startOrder = existingImages[0].display_order + 1;
    }

    // Prepare image data for insertion
    const imageData = images.map(
      (image: { url: string; isPrimary?: boolean }, index: number) => ({
        property_id: propertyId,
        image_url: image.url,
        is_primary: image.isPrimary || false,
        display_order: startOrder + index,
      })
    );

    // Insert images
    const { data: insertedImages, error } = await supabase
      .from("property_images")
      .insert(imageData)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If any image is marked as primary, update other images to not be primary
    const hasPrimary = imageData.some((img) => img.is_primary);
    if (hasPrimary) {
      await supabase
        .from("property_images")
        .update({ is_primary: false })
        .eq("property_id", propertyId)
        .neq("is_primary", true);
    }

    return NextResponse.json({ images: insertedImages }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/properties/[id]/images - Delete images from a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const propertyId = params.id;

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
    .eq("id", propertyId)
    .single();

  if (propertyError || !property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  if (property.landlord_id !== user.id) {
    return NextResponse.json(
      {
        error: "You do not have permission to delete images from this property",
      },
      { status: 403 }
    );
  }

  try {
    const { imageIds } = await request.json();

    if (!Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: "No image IDs provided" },
        { status: 400 }
      );
    }

    // Delete images
    const { error } = await supabase
      .from("property_images")
      .delete()
      .in("id", imageIds)
      .eq("property_id", propertyId);

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
