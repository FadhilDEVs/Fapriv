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
      // Future business tables will be defined here
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
