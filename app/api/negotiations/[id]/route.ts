import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This function is required for routes with dynamic parameters when using "output: export"
export async function generateStaticParams() {
  return [];
}

// GET /api/negotiations/[id] - Get a specific negotiation
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

  // Get the negotiation with related data
  const { data: negotiation, error } = await supabase
    .from("negotiations")
    .select(
      `
      *,
      properties(*),
      profiles!negotiations_tenant_id_fkey(id, full_name, profile_image_url),
      profiles!negotiations_landlord_id_fkey(id, full_name, profile_image_url),
      messages(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Check if user has permission to view this negotiation
  if (
    negotiation.tenant_id !== user.id &&
    negotiation.landlord_id !== user.id
  ) {
    return NextResponse.json(
      { error: "You do not have permission to view this negotiation" },
      { status: 403 }
    );
  }

  return NextResponse.json({ negotiation });
}

// PATCH /api/negotiations/[id] - Update a negotiation
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

  // Get the negotiation
  const { data: negotiation, error: negotiationError } = await supabase
    .from("negotiations")
    .select("*")
    .eq("id", id)
    .single();

  if (negotiationError || !negotiation) {
    return NextResponse.json(
      { error: "Negotiation not found" },
      { status: 404 }
    );
  }

  // Check if user has permission to update this negotiation
  if (
    negotiation.tenant_id !== user.id &&
    negotiation.landlord_id !== user.id
  ) {
    return NextResponse.json(
      { error: "You do not have permission to update this negotiation" },
      { status: 403 }
    );
  }

  // Check if negotiation is active
  if (negotiation.status !== "active") {
    return NextResponse.json(
      { error: "This negotiation is no longer active" },
      { status: 400 }
    );
  }

  try {
    const updateData = await request.json();

    // Prevent updating tenant_id, landlord_id, property_id
    delete updateData.tenant_id;
    delete updateData.landlord_id;
    delete updateData.property_id;

    // Update the negotiation
    const { data: updatedNegotiation, error } = await supabase
      .from("negotiations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If status is changed to accepted or rejected, create notification
    if (updateData.status === "accepted" || updateData.status === "rejected") {
      const notificationUserId =
        user.id === negotiation.tenant_id
          ? negotiation.landlord_id
          : negotiation.tenant_id;

      const statusText =
        updateData.status === "accepted" ? "accepted" : "rejected";

      await supabase.from("notifications").insert({
        user_id: notificationUserId,
        title: `Negotiation ${statusText}`,
        message: `Your negotiation has been ${statusText}`,
        link: `/dashboard/negotiations/${id}`,
      });
    }

    return NextResponse.json({ negotiation: updatedNegotiation });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
