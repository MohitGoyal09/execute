import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/profile - Get the current user's profile
export async function GET(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile });
}

// POST /api/profile - Create a new profile (after signup)
export async function POST(request: NextRequest) {
  const supabase = createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return NextResponse.json(
      { error: "Profile already exists" },
      { status: 400 }
    );
  }

  try {
    const profileData = await request.json();

    // Validate required fields
    if (!profileData.role || !profileData.full_name) {
      return NextResponse.json(
        { error: "Role and full name are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!["tenant", "landlord"].includes(profileData.role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Add user ID to profile data
    profileData.id = user.id;

    // Insert profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .insert(profileData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// PATCH /api/profile - Update the current user's profile
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
    const updateData = await request.json();

    // Prevent updating id and role
    delete updateData.id;
    delete updateData.role;

    // Update profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
