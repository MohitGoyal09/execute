export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_type: 'landlord' | 'tenant'
          full_name: string
          contact_info: Json
          created_at: string
        }
        Insert: {
          id: string
          user_type: 'landlord' | 'tenant'
          full_name: string
          contact_info?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_type?: 'landlord' | 'tenant'
          full_name?: string
          contact_info?: Json
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          landlord_id: string
          address: string
          property_type: string
          bedrooms: number
          bathrooms: number
          amenities: Json
          created_at: string
        }
        Insert: {
          id?: string
          landlord_id: string
          address: string
          property_type: string
          bedrooms: number
          bathrooms: number
          amenities?: Json
          created_at?: string
        }
        Update: {
          id?: string
          landlord_id?: string
          address?: string
          property_type?: string
          bedrooms?: number
          bathrooms?: number
          amenities?: Json
          created_at?: string
        }
      }
      agreements: {
        Row: {
          id: string
          property_id: string
          landlord_id: string
          tenant_id: string | null
          status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated'
          start_date: string | null
          end_date: string | null
          rent_amount: number
          deposit_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          landlord_id: string
          tenant_id?: string | null
          status?: 'draft' | 'pending' | 'active' | 'expired' | 'terminated'
          start_date?: string | null
          end_date?: string | null
          rent_amount: number
          deposit_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          landlord_id?: string
          tenant_id?: string | null
          status?: 'draft' | 'pending' | 'active' | 'expired' | 'terminated'
          start_date?: string | null
          end_date?: string | null
          rent_amount?: number
          deposit_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
      agreement_versions: {
        Row: {
          id: string
          agreement_id: string
          content: Json
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          agreement_id: string
          content: Json
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          agreement_id?: string
          content?: Json
          created_by?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          agreement_id: string
          amount: number
          type: 'rent' | 'deposit' | 'other'
          due_date: string
          payment_date: string | null
          status: 'pending' | 'paid' | 'overdue'
          created_at: string
        }
        Insert: {
          id?: string
          agreement_id: string
          amount: number
          type: 'rent' | 'deposit' | 'other'
          due_date: string
          payment_date?: string | null
          status?: 'pending' | 'paid' | 'overdue'
          created_at?: string
        }
        Update: {
          id?: string
          agreement_id?: string
          amount?: number
          type?: 'rent' | 'deposit' | 'other'
          due_date?: string
          payment_date?: string | null
          status?: 'pending' | 'paid' | 'overdue'
          created_at?: string
        }
      }
      property_conditions: {
        Row: {
          id: string
          property_id: string
          report_type: 'move-in' | 'move-out' | 'inspection'
          report_date: string
          images: string[]
          notes: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          report_type: 'move-in' | 'move-out' | 'inspection'
          report_date: string
          images?: string[]
          notes?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          report_type?: 'move-in' | 'move-out' | 'inspection'
          report_date?: string
          images?: string[]
          notes?: string | null
          created_by?: string
          created_at?: string
        }
      }
    }
    Enums: {
      user_type: 'landlord' | 'tenant'
      agreement_status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated'
      payment_type: 'rent' | 'deposit' | 'other'
      payment_status: 'pending' | 'paid' | 'overdue'
      report_type: 'move-in' | 'move-out' | 'inspection'
    }
  }
}