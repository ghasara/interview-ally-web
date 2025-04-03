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
      downloads: {
        Row: {
          downloaded_at: string | null
          file_name: string
          id: string
          platform: string
          user_id: string
        }
        Insert: {
          downloaded_at?: string | null
          file_name: string
          id?: string
          platform: string
          user_id: string
        }
        Update: {
          downloaded_at?: string | null
          file_name?: string
          id?: string
          platform?: string
          user_id?: string
        }
        Relationships: []
      }
      licenses: {
        Row: {
          created_at: string
          credits: number | null
          id: number
          is_active: boolean | null
          key: string | null
          promo_code_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          credits?: number | null
          id?: number
          is_active?: boolean | null
          key?: string | null
          promo_code_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          credits?: number | null
          id?: number
          is_active?: boolean | null
          key?: string | null
          promo_code_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "licenses_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          credits: number
          expiry_date: string | null
          id: string
          is_active: boolean
        }
        Insert: {
          code: string
          created_at?: string | null
          credits?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
        }
        Update: {
          code?: string
          created_at?: string | null
          credits?: number
          expiry_date?: string | null
          id?: string
          is_active?: boolean
        }
        Relationships: []
      }
      redeemed_promo_codes: {
        Row: {
          id: string
          promo_code_id: string
          redeemed_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          redeemed_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          redeemed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redeemed_promo_codes_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          credits_per_month: number | null
          credits_remaining: number | null
          currency: string | null
          current_period_end: string | null
          current_period_start: string | null
          ends_at: string | null
          id: string
          interval: string | null
          interval_count: number | null
          plan_id: string
          plan_name: string | null
          price: number | null
          razorpay_customer_id: string | null
          razorpay_subscription_id: string | null
          starts_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_per_month?: number | null
          credits_remaining?: number | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ends_at?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          plan_id: string
          plan_name?: string | null
          price?: number | null
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          starts_at?: string | null
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_per_month?: number | null
          credits_remaining?: number | null
          currency?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          ends_at?: string | null
          id?: string
          interval?: string | null
          interval_count?: number | null
          plan_id?: string
          plan_name?: string | null
          price?: number | null
          razorpay_customer_id?: string | null
          razorpay_subscription_id?: string | null
          starts_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
