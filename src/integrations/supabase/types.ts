export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          capacity: number | null
          category: string | null
          created_at: string
          description_en: string | null
          description_mk: string | null
          difficulty: string | null
          duration_minutes: number | null
          festival_id: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          location_id: string | null
          price_mkd: number | null
          slug: string
          title_en: string
          title_mk: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          festival_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          location_id?: string | null
          price_mkd?: number | null
          slug: string
          title_en: string
          title_mk: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          difficulty?: string | null
          duration_minutes?: number | null
          festival_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          location_id?: string | null
          price_mkd?: number | null
          slug?: string
          title_en?: string
          title_mk?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio_en: string | null
          bio_mk: string | null
          country: string | null
          created_at: string
          genre: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          name: string
          slug: string
          sort_order: number
          stage: string | null
          updated_at: string
        }
        Insert: {
          bio_en?: string | null
          bio_mk?: string | null
          country?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          name: string
          slug: string
          sort_order?: number
          stage?: string | null
          updated_at?: string
        }
        Update: {
          bio_en?: string | null
          bio_mk?: string | null
          country?: string | null
          created_at?: string
          genre?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          name?: string
          slug?: string
          sort_order?: number
          stage?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          locale: string
          message: string
          name: string
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          locale?: string
          message: string
          name: string
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          locale?: string
          message?: string
          name?: string
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          artist_id: string | null
          category: string | null
          created_at: string
          description_en: string | null
          description_mk: string | null
          ends_at: string | null
          festival_id: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          is_published: boolean
          location_id: string | null
          slug: string
          starts_at: string
          title_en: string
          title_mk: string
          updated_at: string
        }
        Insert: {
          artist_id?: string | null
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          ends_at?: string | null
          festival_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          location_id?: string | null
          slug: string
          starts_at: string
          title_en: string
          title_mk: string
          updated_at?: string
        }
        Update: {
          artist_id?: string | null
          category?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          ends_at?: string | null
          festival_id?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          is_published?: boolean
          location_id?: string | null
          slug?: string
          starts_at?: string
          title_en?: string
          title_mk?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer_en: string
          answer_mk: string
          category: string | null
          created_at: string
          id: string
          is_published: boolean
          question_en: string
          question_mk: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          answer_en: string
          answer_mk: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          question_en: string
          question_mk: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          answer_en?: string
          answer_mk?: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          question_en?: string
          question_mk?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      festivals: {
        Row: {
          countdown_target: string | null
          created_at: string
          description_en: string | null
          description_mk: string | null
          end_date: string
          hero_image_url: string | null
          hero_video_url: string | null
          id: string
          is_published: boolean
          location_name: string | null
          name: string
          slug: string
          start_date: string
          stats: Json
          tagline_en: string | null
          tagline_mk: string | null
          updated_at: string
        }
        Insert: {
          countdown_target?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          end_date: string
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          is_published?: boolean
          location_name?: string | null
          name: string
          slug: string
          start_date: string
          stats?: Json
          tagline_en?: string | null
          tagline_mk?: string | null
          updated_at?: string
        }
        Update: {
          countdown_target?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          end_date?: string
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          is_published?: boolean
          location_name?: string | null
          name?: string
          slug?: string
          start_date?: string
          stats?: Json
          tagline_en?: string | null
          tagline_mk?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          alt_en: string | null
          alt_mk: string | null
          category: string | null
          created_at: string
          id: string
          image_url: string
          is_published: boolean
          sort_order: number
          title_en: string | null
          title_mk: string | null
          updated_at: string
        }
        Insert: {
          alt_en?: string | null
          alt_mk?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url: string
          is_published?: boolean
          sort_order?: number
          title_en?: string | null
          title_mk?: string | null
          updated_at?: string
        }
        Update: {
          alt_en?: string | null
          alt_mk?: string | null
          category?: string | null
          created_at?: string
          id?: string
          image_url?: string
          is_published?: boolean
          sort_order?: number
          title_en?: string | null
          title_mk?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          created_at: string
          description_en: string | null
          description_mk: string | null
          id: string
          image_url: string | null
          is_published: boolean
          latitude: number | null
          longitude: number | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          latitude?: number | null
          longitude?: number | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description_en?: string | null
          description_mk?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          latitude?: number | null
          longitude?: number | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          locale: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          locale?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          locale?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          body_en: string | null
          body_mk: string | null
          created_at: string
          id: string
          is_published: boolean
          meta_description_en: string | null
          meta_description_mk: string | null
          slug: string
          title_en: string
          title_mk: string
          updated_at: string
        }
        Insert: {
          body_en?: string | null
          body_mk?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description_en?: string | null
          meta_description_mk?: string | null
          slug: string
          title_en: string
          title_mk: string
          updated_at?: string
        }
        Update: {
          body_en?: string | null
          body_mk?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          meta_description_en?: string | null
          meta_description_mk?: string | null
          slug?: string
          title_en?: string
          title_mk?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          logo_url: string | null
          name: string
          sort_order: number
          tier: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_url?: string | null
          name: string
          sort_order?: number
          tier?: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_url?: string | null
          name?: string
          sort_order?: number
          tier?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      ticket_order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          quantity: number
          ticket_type_id: string
          unit_price_mkd: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          quantity: number
          ticket_type_id: string
          unit_price_mkd: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          quantity?: number
          ticket_type_id?: string
          unit_price_mkd?: number
        }
        Relationships: [
          {
            foreignKeyName: "ticket_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "ticket_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_order_items_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_orders: {
        Row: {
          buyer_email: string
          buyer_name: string
          buyer_phone: string | null
          confirmation_email_sent_at: string | null
          created_at: string
          currency: string
          festival_id: string | null
          id: string
          locale: string
          notes: string | null
          order_code: string
          status: Database["public"]["Enums"]["order_status"]
          total_mkd: number
          updated_at: string
        }
        Insert: {
          buyer_email: string
          buyer_name: string
          buyer_phone?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string
          currency?: string
          festival_id?: string | null
          id?: string
          locale?: string
          notes?: string | null
          order_code: string
          status?: Database["public"]["Enums"]["order_status"]
          total_mkd?: number
          updated_at?: string
        }
        Update: {
          buyer_email?: string
          buyer_name?: string
          buyer_phone?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string
          currency?: string
          festival_id?: string | null
          id?: string
          locale?: string
          notes?: string | null
          order_code?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_mkd?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_orders_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          capacity: number | null
          created_at: string
          currency: string
          description_en: string | null
          description_mk: string | null
          festival_id: string | null
          id: string
          is_available: boolean
          is_featured: boolean
          is_published: boolean
          name_en: string
          name_mk: string
          perks_en: string[]
          perks_mk: string[]
          price_mkd: number
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          currency?: string
          description_en?: string | null
          description_mk?: string | null
          festival_id?: string | null
          id?: string
          is_available?: boolean
          is_featured?: boolean
          is_published?: boolean
          name_en: string
          name_mk: string
          perks_en?: string[]
          perks_mk?: string[]
          price_mkd: number
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          currency?: string
          description_en?: string | null
          description_mk?: string | null
          festival_id?: string | null
          id?: string
          is_available?: boolean
          is_featured?: boolean
          is_published?: boolean
          name_en?: string
          name_mk?: string
          perks_en?: string[]
          perks_mk?: string[]
          price_mkd?: number
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_festival_id_fkey"
            columns: ["festival_id"]
            isOneToOne: false
            referencedRelation: "festivals"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      ticket_sold_counts: {
        Args: never
        Returns: {
          sold: number
          ticket_type_id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
      order_status: "pending" | "confirmed" | "cancelled" | "checked_in"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
      order_status: ["pending", "confirmed", "cancelled", "checked_in"],
    },
  },
} as const
