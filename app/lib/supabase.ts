import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          first_name: string | null
          last_name: string | null
          profile_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          profile_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      analysis_history: {
        Row: {
          id: string
          user_id: string
          job_description: string
          resume_text: string
          analysis_result: any
          match_score: number
          verdict: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_description: string
          resume_text: string
          analysis_result: any
          match_score: number
          verdict: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_description?: string
          resume_text?: string
          analysis_result?: any
          match_score?: number
          verdict?: string
          created_at?: string
        }
      }
    }
  }
}
