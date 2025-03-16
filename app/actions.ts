"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const supabase = createServerActionClient({ cookies });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    redirect("/dashboard");
  } catch (err) {
    console.error("Sign in error:", err);
    return { error: "An unexpected error occurred" };
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const userType = formData.get("userType") as string;

  if (!email || !password || !fullName || !userType) {
    return { error: "All fields are required" };
  }

  try {
    const supabase = createServerActionClient({ cookies });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          user_type: userType,
        },
        emailRedirectTo: `${
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        }/auth/callback`,
      },
    });

    if (error) {
      return { error: error.message };
    }

    // Check if auto-confirm is enabled (development)
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      redirect("/dashboard");
    }

    return {
      success: true,
      message:
        "Account created! Please check your email to verify your account.",
    };
  } catch (err) {
    console.error("Sign up error:", err);
    return { error: "An unexpected error occurred" };
  }
}

export async function signOut() {
  try {
    const supabase = createServerActionClient({ cookies });
    await supabase.auth.signOut();
    redirect("/");
  } catch (err) {
    console.error("Sign out error:", err);
    return { error: "Failed to sign out" };
  }
}
