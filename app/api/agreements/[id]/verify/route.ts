import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// This function is required for routes with dynamic parameters when using "output: export"
export async function generateStaticParams() {
  return [];
}

// POST /api/agreements/[id]/verify - Verify an agreement using AI
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

  // Get the agreement
  const { data: agreement, error: agreementError } = await supabase
    .from("rental_agreements")
    .select(
      `
      *,
      properties(*)
    `
    )
    .eq("id", agreementId)
    .single();

  if (agreementError || !agreement) {
    return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
  }

  // Check if user has permission to verify this agreement
  if (agreement.tenant_id !== user.id && agreement.landlord_id !== user.id) {
    return NextResponse.json(
      { error: "You do not have permission to verify this agreement" },
      { status: 403 }
    );
  }

  try {
    // Initialize Google Gemini AI
    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Prepare agreement content for analysis
    const agreementText = JSON.stringify(agreement.content);
    const propertyDetails = JSON.stringify({
      address: agreement.properties.address,
      city: agreement.properties.city,
      state: agreement.properties.state,
      zip_code: agreement.properties.zip_code,
      property_type: agreement.properties.property_type,
      bedrooms: agreement.properties.bedrooms,
      bathrooms: agreement.properties.bathrooms,
      rent_amount: agreement.rent_amount,
      security_deposit: agreement.security_deposit,
      start_date: agreement.start_date,
      end_date: agreement.end_date,
    });

    // Create prompt for AI analysis
    const prompt = `
      You are a legal expert specializing in rental agreements. Please analyze the following rental agreement 
      and check for completeness, fairness, and legal compliance. Identify any missing clauses, potential issues, 
      or areas that might be unfair to either party.
      
      Property details:
      ${propertyDetails}
      
      Agreement content:
      ${agreementText}
      
      Please provide your analysis in JSON format with the following structure:
      {
        "isComplete": boolean,
        "isFair": boolean,
        "missingClauses": string[],
        "potentialIssues": string[],
        "unfairTerms": string[],
        "suggestions": string[],
        "overallAssessment": string
      }
    `;

    // Generate AI response
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let analysis;
    try {
      // Extract JSON from the response (in case AI adds extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Update agreement with verification status
    const isVerified =
      analysis.isComplete &&
      analysis.isFair &&
      analysis.potentialIssues.length === 0;

    await supabase
      .from("rental_agreements")
      .update({ ai_verified: isVerified })
      .eq("id", agreementId);

    return NextResponse.json({
      verified: isVerified,
      analysis,
    });
  } catch (error) {
    console.error("AI verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify agreement with AI" },
      { status: 500 }
    );
  }
}
