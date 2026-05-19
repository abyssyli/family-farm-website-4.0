
// task project adjust
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: { id: string; slug: string; name: string; sort_order: number }
        Insert: { id?: string; slug: string; name: string; sort_order?: number }
        Update: { slug?: string; name?: string; sort_order?: number }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          category_slug: string
          slug: string
          name: string
          description: string | null
          image_path: string | null
          image_paths: string[]
          price_hint: string | null
          external_url: string | null
          is_active: boolean
          stock_quantity: number | null
          updated_at: string
        }
        Insert: {
          id: string
          category_slug: string
          slug: string
          name: string
          description?: string | null
          image_path?: string | null
          image_paths?: string[]
          price_hint?: string | null
          external_url?: string | null
          is_active?: boolean
          stock_quantity?: number | null
          updated_at?: string
        }
        Update: {
          category_slug?: string
          slug?: string
          name?: string
          description?: string | null
          image_path?: string | null
          image_paths?: string[]
          price_hint?: string | null
          external_url?: string | null
          is_active?: boolean
          stock_quantity?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      journal_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string | null
          body: string
          published_at: string | null
          updated_at: string
        }
        Insert: {
          id: string
          slug: string
          title: string
          excerpt?: string | null
          body: string
          published_at?: string | null
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          excerpt?: string | null
          body?: string
          published_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      farm_regions: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          image_path: string | null
          cta_label: string | null
          cta_href: string | null
          x: number
          y: number
        }
        Insert: {
          id: string
          slug: string
          title: string
          description?: string | null
          image_path?: string | null
          cta_label?: string | null
          cta_href?: string | null
          x: number
          y: number
        }
        Update: {
          slug?: string
          title?: string
          description?: string | null
          image_path?: string | null
          cta_label?: string | null
          cta_href?: string | null
          x?: number
          y?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          user_id: string
          preferred_categories: string[]
          updated_at: string
        }
        Insert: {
          user_id: string
          preferred_categories?: string[]
          updated_at?: string
        }
        Update: {
          user_id?: string
          preferred_categories?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          postal_code: string
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone?: string | null
          address_line1: string
          address_line2?: string | null
          city: string
          state: string
          postal_code: string
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          phone?: string | null
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          postal_code?: string
          is_default?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          id: string
          user_id: string | null
          product_id: string | null
          category_slug: string
          address_id: string | null
          message: string
          status: "pending" | "confirmed" | "completed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          product_id?: string | null
          category_slug: string
          address_id?: string | null
          message: string
          status?: "pending" | "confirmed" | "completed" | "cancelled"
          created_at?: string
        }
        Update: {
          user_id?: string | null
          product_id?: string | null
          category_slug?: string
          address_id?: string | null
          message?: string
          status?: "pending" | "confirmed" | "completed" | "cancelled"
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      sunday_rsvps: {
        Row: {
          id: string
          user_id: string
          event_date: string
          adult_count: number
          child_count: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_date: string
          adult_count?: number
          child_count?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          event_date?: string
          adult_count?: number
          child_count?: number
          notes?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          user_id: string
          product_id: string | null
          journal_post_id: string | null
          content: string
          image_urls: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id?: string | null
          journal_post_id?: string | null
          content: string
          image_urls?: string[]
          created_at?: string
        }
        Update: {
          content?: string
          image_urls?: string[]
        }
        Relationships: []
      }
      likes: {
        Row: {
          id: string
          user_id: string
          journal_post_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          journal_post_id?: string | null
          created_at?: string
        }
        Update: {
          journal_post_id?: string | null
        }
        Relationships: []
      }
      recipes: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          ingredients: string[]
          instructions: string[]
          image_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          ingredients?: string[]
          instructions?: string[]
          image_path?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          ingredients?: string[]
          instructions?: string[]
          image_path?: string | null
        }
        Relationships: []
      }
      sync_runs: {
        Row: {
          id: string
          status: "success" | "error"
          source: string
          message: string | null
          ran_at: string
        }
        Insert: {
          id?: string
          status: "success" | "error"
          source: string
          message?: string | null
          ran_at?: string
        }
        Update: {
          status?: "success" | "error"
          source?: string
          message?: string | null
          ran_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      inquiry_status: "pending" | "confirmed" | "completed" | "cancelled"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
