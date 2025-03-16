import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// This function is required for routes with dynamic parameters when using "output: export"
export async function generateStaticParams() {
  return [];
}

// GET /api/negotiations/[id]/messages - Get messages for a negotiation
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const negotiationId = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if negotiation exists and user is a participant
  const { data: negotiation, error: negotiationError } = await supabase
    .from("negotiations")
    .select("tenant_id, landlord_id")
    .eq("id", negotiationId)
    .single();

  if (negotiationError || !negotiation) {
    return NextResponse.json(
      { error: "Negotiation not found" },
      { status: 404 }
    );
  }

  if (
    negotiation.tenant_id !== user.id &&
    negotiation.landlord_id !== user.id
  ) {
    return NextResponse.json(
      { error: "You do not have permission to view these messages" },
      { status: 403 }
    );
  }

  // Get messages
  const { data: messages, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      profiles(id, full_name, profile_image_url)
    `
    )
    .eq("negotiation_id", negotiationId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Mark messages as read if they were sent to the current user
  const unreadMessages =
    messages?.filter(
      (message) => message.sender_id !== user.id && !message.read
    ) || [];

  if (unreadMessages.length > 0) {
    const unreadIds = unreadMessages.map((message) => message.id);

    await supabase.from("messages").update({ read: true }).in("id", unreadIds);
  }

  return NextResponse.json({ messages });
}

// POST /api/negotiations/[id]/messages - Send a message in a negotiation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const negotiationId = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if negotiation exists and user is a participant
  const { data: negotiation, error: negotiationError } = await supabase
    .from("negotiations")
    .select("tenant_id, landlord_id, status")
    .eq("id", negotiationId)
    .single();

  if (negotiationError || !negotiation) {
    return NextResponse.json(
      { error: "Negotiation not found" },
      { status: 404 }
    );
  }

  if (
    negotiation.tenant_id !== user.id &&
    negotiation.landlord_id !== user.id
  ) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to send messages in this negotiation",
      },
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
    const { message_text, attachment_url } = await request.json();

    if (!message_text || message_text.trim() === "") {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    // Create message
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        negotiation_id: negotiationId,
        sender_id: user.id,
        message_text,
        attachment_url: attachment_url || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update negotiation's updated_at timestamp
    await supabase
      .from("negotiations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", negotiationId);

    // Create notification for the other party
    const notificationUserId =
      user.id === negotiation.tenant_id
        ? negotiation.landlord_id
        : negotiation.tenant_id;

    await supabase.from("notifications").insert({
      user_id: notificationUserId,
      title: "New message in negotiation",
      message: "You have received a new message in your negotiation",
      link: `/dashboard/negotiations/${negotiationId}`,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
