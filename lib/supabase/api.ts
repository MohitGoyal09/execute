import { supabase } from "@/lib/supabase";

// User related functions
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

// Properties related functions
export async function getProperties(userId: string, userType: string) {
  let query = supabase.from("properties").select("*");

  if (userType === "landlord") {
    query = query.eq("landlord_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*, users!landlord_id(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createProperty(propertyData: any) {
  const { data, error } = await supabase
    .from("properties")
    .insert(propertyData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProperty(id: string, propertyData: any) {
  const { data, error } = await supabase
    .from("properties")
    .update(propertyData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProperty(id: string) {
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Agreements related functions
export async function getAgreements(userId: string, userType: string) {
  let query = supabase
    .from("agreements")
    .select("*, properties(*), tenant:tenant_id(*)");

  if (userType === "landlord") {
    query = query.eq("landlord_id", userId);
  } else {
    query = query.eq("tenant_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getAgreementById(id: string) {
  const { data, error } = await supabase
    .from("agreements")
    .select("*, properties(*), tenant:tenant_id(*), landlord:landlord_id(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createAgreement(agreementData: any) {
  const { data, error } = await supabase
    .from("agreements")
    .insert(agreementData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateAgreement(id: string, agreementData: any) {
  const { data, error } = await supabase
    .from("agreements")
    .update(agreementData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function signAgreement(id: string, userType: string) {
  const signField =
    userType === "landlord" ? "landlord_signed" : "tenant_signed";
  const signDateField =
    userType === "landlord" ? "landlord_signed_date" : "tenant_signed_date";

  const { data, error } = await supabase
    .from("agreements")
    .update({
      [signField]: true,
      [signDateField]: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Viewings related functions
export async function getViewings(userId: string, userType: string) {
  let query = supabase
    .from("viewings")
    .select("*, properties(*), tenant:tenant_id(*)");

  if (userType === "landlord") {
    query = query.eq("landlord_id", userId);
  } else {
    query = query.eq("tenant_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createViewing(viewingData: any) {
  const { data, error } = await supabase
    .from("viewings")
    .insert(viewingData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateViewingStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("viewings")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Negotiations related functions
export async function getNegotiations(userId: string, userType: string) {
  let query = supabase
    .from("negotiations")
    .select("*, properties(*), tenant:tenant_id(*), landlord:landlord_id(*)");

  if (userType === "landlord") {
    query = query.eq("landlord_id", userId);
  } else {
    query = query.eq("tenant_id", userId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getNegotiationById(id: string) {
  const { data, error } = await supabase
    .from("negotiations")
    .select(
      "*, properties(*), tenant:tenant_id(*), landlord:landlord_id(*), messages(*)"
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getNegotiationMessages(negotiationId: string) {
  const { data, error } = await supabase
    .from("negotiation_messages")
    .select("*")
    .eq("negotiation_id", negotiationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function sendNegotiationMessage(messageData: any) {
  const { data, error } = await supabase
    .from("negotiation_messages")
    .insert(messageData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Agreement Analysis related functions
export async function saveAnalysis(analysisData: any) {
  const { data, error } = await supabase
    .from("agreement_analyses")
    .insert(analysisData)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAnalyses(userId: string) {
  const { data, error } = await supabase
    .from("agreement_analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Real-time subscriptions
export function subscribeToMessages(
  negotiationId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`negotiation-${negotiationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "negotiation_messages",
        filter: `negotiation_id=eq.${negotiationId}`,
      },
      callback
    )
    .subscribe();
}

export function subscribeToAgreementChanges(
  agreementId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`agreement-${agreementId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "agreements",
        filter: `id=eq.${agreementId}`,
      },
      callback
    )
    .subscribe();
}
