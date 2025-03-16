import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET /api/agreements/[id] - Get a specific rental agreement
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

  // Get the agreement with related data
  const { data: agreement, error } = await supabase
    .from("rental_agreements")
    .select(
      `
      *,
      properties(*),
      profiles!rental_agreements_tenant_id_fkey(id, full_name, profile_image_url),
      profiles!rental_agreements_landlord_id_fkey(id, full_name, profile_image_url),
      agreement_versions(id, version_number, created_at, created_by),
      agreement_comments(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  // Check if user has permission to view this agreement
  if (agreement.tenant_id !== user.id && agreement.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to view this agreement" },
      { status: 403 }
    );
  }

  return NextResponse.json({ agreement });
}

// PATCH /api/agreements/[id] - Update a rental agreement
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

  // Get the agreement
  const { data: agreement, error: agreementError } = await supabase
    .from("rental_agreements")
    .select("*")
    .eq("id", id)
    .single();

  if (agreementError || !agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  // Check if user has permission to update this agreement
  const isLandlord = agreement.landlord_id === user.id;
  const isTenant = agreement.tenant_id === user.id;

  if (!isLandlord && !isTenant) {
    return NextResponse.json(
      { error: "You do not have permission to update this agreement" },
      { status: 403 }
    );
  }

  try {
    const updateData = await request.json();

    // Prevent updating certain fields
    delete updateData.property_id;
    delete updateData.tenant_id;
    delete updateData.landlord_id;

    // Special handling for content updates (create new version)
    const contentChanged =
      updateData.content &&
      JSON.stringify(updateData.content) !== JSON.stringify(agreement.content);

    if (contentChanged) {
      // Only landlords can update content unless agreement is in draft
      if (!isLandlord && agreement.status !== "draft") {
        return NextResponse.json(
          { error: "Only landlords can update agreement content" },
          { status: 403 }
        );
      }

      // Get the current highest version number
      const { data: versions, error: versionError } = await supabase
        .from("agreement_versions")
        .select("version_number")
        .eq("agreement_id", id)
        .order("version_number", { ascending: false })
        .limit(1);

      if (versionError) {
        return NextResponse.json(
          { error: versionError.message },
          { status: 500 }
        );
      }

      const nextVersion =
        versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      // Create new version record
      await supabase.from("agreement_versions").insert({
        agreement_id: id,
        version_number: nextVersion,
        content: updateData.content,
        created_by: user.id,
      });

      // Reset signatures if content changes
      updateData.tenant_signed = false;
      updateData.tenant_signed_at = null;
      updateData.landlord_signed = false;
      updateData.landlord_signed_at = null;
    }

    // Handle signature updates
    if (updateData.tenant_signed === true && isTenant) {
      updateData.tenant_signed_at = new Date().toISOString();
    } else if (updateData.landlord_signed === true && isLandlord) {
      updateData.landlord_signed_at = new Date().toISOString();
    }

    // Prevent tenant from changing landlord signature and vice versa
    if (isTenant) {
      delete updateData.landlord_signed;
      delete updateData.landlord_signed_at;
    } else if (isLandlord) {
      delete updateData.tenant_signed;
      delete updateData.tenant_signed_at;
    }

    // Update the agreement
    const { data: updatedAgreement, error } = await supabase
      .from("rental_agreements")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Check if both parties have signed and update status if needed
    if (
      updatedAgreement.tenant_signed &&
      updatedAgreement.landlord_signed &&
      updatedAgreement.status === "pending_signature"
    ) {
      await supabase
        .from("rental_agreements")
        .update({ status: "signed" })
        .eq("id", id);

      updatedAgreement.status = "signed";

      // Create notifications for both parties
      await supabase.from("notifications").insert([
        {
          user_id: updatedAgreement.tenant_id,
          title: "Agreement Signed",
          message: "Your rental agreement has been signed by both parties",
          link: `/dashboard/agreements/${id}`,
        },
        {
          user_id: updatedAgreement.landlord_id,
          title: "Agreement Signed",
          message: "Your rental agreement has been signed by both parties",
          link: `/dashboard/agreements/${id}`,
        },
      ]);
    }

    return NextResponse.json({ agreement: updatedAgreement });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
