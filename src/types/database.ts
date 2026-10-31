/**
 * Supabase Database TypeScript definitions.
 * This file can be regenerated automatically using the Supabase CLI:
 * `npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts`
 */

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
      fapriv_workspace: {
        Row: {
          id: string
          profile: Json
          shortcuts: Json
          notes: Json
          important_data: Json
          categories: Json
          tags: Json
          activities: Json
          deleted_items: Json
          security_pin: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          profile?: Json
          shortcuts?: Json
          notes?: Json
          important_data?: Json
          categories?: Json
          tags?: Json
          activities?: Json
          deleted_items?: Json
          security_pin?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          profile?: Json
          shortcuts?: Json
          notes?: Json
          important_data?: Json
          categories?: Json
          tags?: Json
          activities?: Json
          deleted_items?: Json
          security_pin?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      [key: string]: {
        Row: Record<string, unknown>
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Views: {
      [key: string]: {
        Row: Record<string, unknown>
        Relationships: unknown[]
      }
    }
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>
        Returns: unknown
      }
    }
    Enums: {
      [key: string]: string
    }
    CompositeTypes: {
      [key: string]: unknown
    }
  }
}
