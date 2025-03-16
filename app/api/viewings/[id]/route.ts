import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/viewings/[id] - Get a specific viewing
export async function GET(
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

  // Get the viewing with related data
  const { data: viewing, error } = await supabase
    .from("property_viewings")
    .select(
      `
      *,
      properties(*, landlord_id, property_images(*)),
      profiles!property_viewings_tenant_id_fkey(id, full_name, phone_number, profile_image_url)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Check if user has permission to view this viewing
  if (
    viewing.tenant_id !== user.id &&
    viewing.properties.landlord_id !== user.id
  ) {
    return NextResponse.json(
      { error: "You do not have permission to view this viewing" },
      { status: 403 }
    );
  }

  return NextResponse.json({ viewing });
}

// PATCH /api/viewings/[id] - Update a viewing status
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

  // Get the viewing
  const { data: viewing, error: viewingError } = await supabase
    .from("property_viewings")
    .select("*, properties(landlord_id)")
    .eq("id", id)
    .single();

  if (viewingError || !viewing) {
    return NextResponse.json({ error: "Viewing not found" }, { status: 404 });
  }

  try {
    const updateData = await request.json();

    // Validate the update data
    if (!updateData.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Check permissions based on the requested status change
    const isLandlord = viewing.properties.landlord_id === user.id;
    const isTenant = viewing.tenant_id === user.id;

    if (!isLandlord && !isTenant) {
      return NextResponse.json(
        { error: "You do not have permission to update this viewing" },
        { status: 403 }
      );
    }

    // Landlords can confirm or cancel viewings
    // Tenants can only cancel their own viewings
    if (
      (updateData.status === "confirmed" && !isLandlord) ||
      (updateData.status === "cancelled" && !isLandlord && !isTenant) ||
      (updateData.status === "completed" && !isLandlord)
    ) {
      return NextResponse.json(
        { error: "You do not have permission to set this status" },
        { status: 403 }
      );
    }

    // Update the viewing
    const { data: updatedViewing, error } = await supabase
      .from("property_viewings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for the other party
    const notificationUserId = isLandlord
      ? viewing.tenant_id
      : viewing.properties.landlord_id;

    const statusMap: Record<string, string> = {
      confirmed: "confirmed",
      cancelled: "cancelled",
      completed: "marked as completed",
    };

    const statusText = statusMap[updateData.status] || updateData.status;

    await supabase.from("notifications").insert({
      user_id: notificationUserId,
      title: `Viewing ${statusText}`,
      message: `Your property viewing has been ${statusText}`,
      link: `/dashboard/viewings/${id}`,
    });

    return NextResponse.json({ viewing: updatedViewing });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/viewings/[id] - Delete a viewing
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

  // Get the viewing
  const { data: viewing, error: viewingError } = await supabase
    .from("property_viewings")
    .select("tenant_id, properties:property_id(landlord_id)")
    .eq("id", id)
    .single();

  if (viewingError || !viewing) {
    return NextResponse.json({ error: "Viewing not found" }, { status: 404 });
  }

  // Check if user has permission to delete this viewing
  if (
    viewing.tenant_id !== user.id &&
    viewing.properties &&
    viewing.properties.landlord_id !== user.id
  ) {
    return NextResponse.json(
      { error: "You do not have permission to delete this viewing" },
      { status: 403 }
    );
  }

  // Delete the viewing
  const { error } = await supabase
    .from("property_viewings")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
