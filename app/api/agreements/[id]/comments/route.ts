import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/agreements/[id]/comments - Get comments for an agreement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const agreementId = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if agreement exists and user is a participant
  const { data: agreement, error: agreementError } = await supabase
    .from("rental_agreements")
    .select("tenant_id, landlord_id")
    .eq("id", agreementId)
    .single();

  if (agreementError || !agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  if (agreement.tenant_id !== user.id && agreement.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to view these comments" },
      { status: 403 }
    );
  }

  // Get comments
  const { data: comments, error } = await supabase
    .from("agreement_comments")
    .select(
      `
      *,
      profiles(id, full_name, profile_image_url)
    `
    )
    .eq("agreement_id", agreementId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ comments });
}

// POST /api/agreements/[id]/comments - Add a comment to an agreement
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const agreementId = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if agreement exists and user is a participant
  const { data: agreement, error: agreementError } = await supabase
    .from("rental_agreements")
    .select("tenant_id, landlord_id, status")
    .eq("id", agreementId)
    .single();

  if (agreementError || !agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  if (agreement.tenant_id !== user.id && agreement.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to comment on this agreement" },
      { status: 403 }
    );
  }

  // Check if agreement is in a state that allows comments
  const allowedStatuses = ["draft", "pending_review"];
  if (!allowedStatuses.includes(agreement.status)) {
    return NextResponse.json(
      {
        error:
          "Comments can only be added to agreements in draft or review status",
      },
      { status: 400 }
    );
  }

  try {
    const { section_id, comment_text } = await request.json();

    if (!section_id || !comment_text || comment_text.trim() === "") {
      return NextResponse.json(
        { error: "Section ID and comment text are required" },
        { status: 400 }
      );
    }

    // Create comment
    const { data: comment, error } = await supabase
      .from("agreement_comments")
      .insert({
        agreement_id: agreementId,
        user_id: user.id,
        section_id,
        comment_text,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for the other party
    const notificationUserId =
      user.id === agreement.tenant_id
        ? agreement.landlord_id
        : agreement.tenant_id;

    await supabase.from("notifications").insert({
      user_id: notificationUserId,
      title: "New comment on agreement",
      message: "Someone has added a comment to your rental agreement",
      link: `/dashboard/agreements/${agreementId}`,
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// PATCH /api/agreements/[id]/comments - Update comment status (resolve/unresolve)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const agreementId = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if agreement exists and user is a participant
  const { data: agreement, error: agreementError } = await supabase
    .from("rental_agreements")
    .select("tenant_id, landlord_id")
    .eq("id", agreementId)
    .single();

  if (agreementError || !agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  if (agreement.tenant_id !== user.id && agreement.landlord_id !== user.id) {
    return NextResponse.json(
      {
        error:
          "You do not have permission to update comments on this agreement",
      },
      { status: 403 }
    );
  }

  try {
    const { comment_id, resolved } = await request.json();

    if (!comment_id || resolved === undefined) {
      return NextResponse.json(
        { error: "Comment ID and resolved status are required" },
        { status: 400 }
      );
    }

    // Check if comment exists and belongs to this agreement
    const { data: comment, error: commentError } = await supabase
      .from("agreement_comments")
      .select("id")
      .eq("id", comment_id)
      .eq("agreement_id", agreementId)
      .single();

    if (commentError || !comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Update comment
    const { data: updatedComment, error } = await supabase
      .from("agreement_comments")
      .update({ resolved })
      .eq("id", comment_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ comment: updatedComment });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
