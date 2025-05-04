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
      documents: {
        Row: {
          id: string
          profile_id: string
          document_url: string
          document_type: string
          verification_status: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id?: string
          document_url: string
          document_type: string
          verification_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          document_url?: string
          document_type?: string
          verification_status?: string
          created_at?: string
        }
      }
      fan_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          cpf: string
          birth_date: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          gender: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          cpf: string
          birth_date: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          gender?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          cpf?: string
          birth_date?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          gender?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}