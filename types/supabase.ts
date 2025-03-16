export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "tenant" | "landlord";
          full_name: string;
          phone_number: string | null;
          date_of_birth: string | null;
          profile_image_url: string | null;
          identity_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role: "tenant" | "landlord";
          full_name: string;
          phone_number?: string | null;
          date_of_birth?: string | null;
          profile_image_url?: string | null;
          identity_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: "tenant" | "landlord";
          full_name?: string;
          phone_number?: string | null;
          date_of_birth?: string | null;
          profile_image_url?: string | null;
          identity_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          landlord_id: string;
          title: string;
          description: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude: number | null;
          longitude: number | null;
          property_type: string;
          bedrooms: number;
          bathrooms: number;
          area_sqft: number;
          rent_amount: number;
          security_deposit: number;
          available_from: string;
          min_lease_duration: number;
          status: "available" | "rented" | "maintenance" | "inactive";
          amenities: Json;
          accessibility_features: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          landlord_id: string;
          title: string;
          description: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude?: number | null;
          longitude?: number | null;
          property_type: string;
          bedrooms: number;
          bathrooms: number;
          area_sqft: number;
          rent_amount: number;
          security_deposit: number;
          available_from: string;
          min_lease_duration: number;
          status?: "available" | "rented" | "maintenance" | "inactive";
          amenities?: Json;
          accessibility_features?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          landlord_id?: string;
          title?: string;
          description?: string;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          latitude?: number | null;
          longitude?: number | null;
          property_type?: string;
          bedrooms?: number;
          bathrooms?: number;
          area_sqft?: number;
          rent_amount?: number;
          security_deposit?: number;
          available_from?: string;
          min_lease_duration?: number;
          status?: "available" | "rented" | "maintenance" | "inactive";
          amenities?: Json;
          accessibility_features?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      property_images: {
        Row: {
          id: string;
          property_id: string;
          image_url: string;
          is_primary: boolean;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          image_url: string;
          is_primary?: boolean;
          display_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          image_url?: string;
          is_primary?: boolean;
          display_order?: number;
          created_at?: string;
        };
      };
      property_viewings: {
        Row: {
          id: string;
          property_id: string;
          tenant_id: string;
          viewing_date: string;
          status: "requested" | "confirmed" | "completed" | "cancelled";
          is_virtual: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          tenant_id: string;
          viewing_date: string;
          status?: "requested" | "confirmed" | "completed" | "cancelled";
          is_virtual?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          tenant_id?: string;
          viewing_date?: string;
          status?: "requested" | "confirmed" | "completed" | "cancelled";
          is_virtual?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          tenant_id: string;
          property_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          property_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          property_id?: string;
          created_at?: string;
        };
      };
      negotiations: {
        Row: {
          id: string;
          property_id: string;
          tenant_id: string;
          landlord_id: string;
          proposed_rent: number | null;
          proposed_deposit: number | null;
          proposed_move_in_date: string | null;
          proposed_lease_duration: number | null;
          special_terms: string | null;
          status: "active" | "accepted" | "rejected" | "expired";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          tenant_id: string;
          landlord_id: string;
          proposed_rent?: number | null;
          proposed_deposit?: number | null;
          proposed_move_in_date?: string | null;
          proposed_lease_duration?: number | null;
          special_terms?: string | null;
          status?: "active" | "accepted" | "rejected" | "expired";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          tenant_id?: string;
          landlord_id?: string;
          proposed_rent?: number | null;
          proposed_deposit?: number | null;
          proposed_move_in_date?: string | null;
          proposed_lease_duration?: number | null;
          special_terms?: string | null;
          status?: "active" | "accepted" | "rejected" | "expired";
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          negotiation_id: string;
          sender_id: string;
          message_text: string;
          attachment_url: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          negotiation_id: string;
          sender_id: string;
          message_text: string;
          attachment_url?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          negotiation_id?: string;
          sender_id?: string;
          message_text?: string;
          attachment_url?: string | null;
          read?: boolean;
          created_at?: string;
        };
      };
      rental_agreements: {
        Row: {
          id: string;
          property_id: string;
          tenant_id: string;
          landlord_id: string;
          negotiation_id: string | null;
          title: string;
          content: Json;
          start_date: string;
          end_date: string;
          rent_amount: number;
          security_deposit: number;
          payment_due_day: number;
          special_terms: string | null;
          ai_verified: boolean;
          status:
            | "draft"
            | "pending_review"
            | "pending_signature"
            | "signed"
            | "expired"
            | "terminated";
          tenant_signed: boolean;
          tenant_signed_at: string | null;
          landlord_signed: boolean;
          landlord_signed_at: string | null;
          document_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          property_id: string;
          tenant_id: string;
          landlord_id: string;
          negotiation_id?: string | null;
          title: string;
          content: Json;
          start_date: string;
          end_date: string;
          rent_amount: number;
          security_deposit: number;
          payment_due_day: number;
          special_terms?: string | null;
          ai_verified?: boolean;
          status?:
            | "draft"
            | "pending_review"
            | "pending_signature"
            | "signed"
            | "expired"
            | "terminated";
          tenant_signed?: boolean;
          tenant_signed_at?: string | null;
          landlord_signed?: boolean;
          landlord_signed_at?: string | null;
          document_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          property_id?: string;
          tenant_id?: string;
          landlord_id?: string;
          negotiation_id?: string | null;
          title?: string;
          content?: Json;
          start_date?: string;
          end_date?: string;
          rent_amount?: number;
          security_deposit?: number;
          payment_due_day?: number;
          special_terms?: string | null;
          ai_verified?: boolean;
          status?:
            | "draft"
            | "pending_review"
            | "pending_signature"
            | "signed"
            | "expired"
            | "terminated";
          tenant_signed?: boolean;
          tenant_signed_at?: string | null;
          landlord_signed?: boolean;
          landlord_signed_at?: string | null;
          document_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      agreement_versions: {
        Row: {
          id: string;
          agreement_id: string;
          version_number: number;
          content: Json;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          agreement_id: string;
          version_number: number;
          content: Json;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          agreement_id?: string;
          version_number?: number;
          content?: Json;
          created_by?: string;
          created_at?: string;
        };
      };
      agreement_comments: {
        Row: {
          id: string;
          agreement_id: string;
          user_id: string;
          section_id: string;
          comment_text: string;
          resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agreement_id: string;
          user_id: string;
          section_id: string;
          comment_text: string;
          resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agreement_id?: string;
          user_id?: string;
          section_id?: string;
          comment_text?: string;
          resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          link: string | null;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          link?: string | null;
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      property_search: {
        Args: {
          search_term: string;
        };
        Returns: {
          id: string;
          landlord_id: string;
          title: string;
          description: string;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          latitude: number | null;
          longitude: number | null;
          property_type: string;
          bedrooms: number;
          bathrooms: number;
          area_sqft: number;
          rent_amount: number;
          security_deposit: number;
          available_from: string;
          min_lease_duration: number;
          status: "available" | "rented" | "maintenance" | "inactive";
          amenities: Json;
          accessibility_features: Json;
          created_at: string;
          updated_at: string;
        }[];
      };
    };
    Enums: {
      user_role: "tenant" | "landlord";
      property_status: "available" | "rented" | "maintenance" | "inactive";
      viewing_status: "requested" | "confirmed" | "completed" | "cancelled";
      negotiation_status: "active" | "accepted" | "rejected" | "expired";
      agreement_status:
        | "draft"
        | "pending_review"
        | "pending_signature"
        | "signed"
        | "expired"
        | "terminated";
    };
  };
};
