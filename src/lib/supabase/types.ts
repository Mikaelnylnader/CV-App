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
      resumes: {
        Row: {
          id: string
          user_id: string
          original_file_path: string
          job_url: string
          optimized_file_path: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          webhook_response: Json | null
          webhook_response_at: string | null
          webhook_attempts: number
          webhook_last_attempt_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_file_path: string
          job_url: string
          optimized_file_path?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          webhook_response?: Json | null
          webhook_response_at?: string | null
          webhook_attempts?: number
          webhook_last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_file_path?: string
          job_url?: string
          optimized_file_path?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          webhook_response?: Json | null
          webhook_response_at?: string | null
          webhook_attempts?: number
          webhook_last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cover_letters: {
        Row: {
          id: string
          user_id: string
          resume_file_path: string
          job_url: string
          generated_file_path: string | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          webhook_response: Json | null
          webhook_response_at: string | null
          webhook_attempts: number
          webhook_last_attempt_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resume_file_path: string
          job_url: string
          generated_file_path?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          webhook_response?: Json | null
          webhook_response_at?: string | null
          webhook_attempts?: number
          webhook_last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resume_file_path?: string
          job_url?: string
          generated_file_path?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          webhook_response?: Json | null
          webhook_response_at?: string | null
          webhook_attempts?: number
          webhook_last_attempt_at?: string | null
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