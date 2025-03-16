import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/notifications - Get notifications for the current user
export async function GET(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get notifications
  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ notifications });
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { notification_ids, all = false } = await request.json();

    if (
      !all &&
      (!notification_ids ||
        !Array.isArray(notification_ids) ||
        notification_ids.length === 0)
    ) {
      return NextResponse.json(
        { error: "Notification IDs are required" },
        { status: 400 }
      );
    }

    let query = supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);

    if (!all) {
      query = query.in("id", notification_ids);
    }

    const { error } = await query;

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

// DELETE /api/notifications - Delete notifications
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
    const { notification_ids, all = false } = await request.json();

    if (
      !all &&
      (!notification_ids ||
        !Array.isArray(notification_ids) ||
        notification_ids.length === 0)
    ) {
      return NextResponse.json(
        { error: "Notification IDs are required" },
        { status: 400 }
      );
    }

    let query = supabase.from("notifications").delete().eq("user_id", user.id);

    if (!all) {
      query = query.in("id", notification_ids);
    }

    const { error } = await query;

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
