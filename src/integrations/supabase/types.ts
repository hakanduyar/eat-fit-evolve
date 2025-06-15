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
      activities: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          date: string
          duration_minutes: number
          id: string
          name: string
          notes: string | null
          type: string
          user_id: string
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_minutes: number
          id?: string
          name: string
          notes?: string | null
          type: string
          user_id: string
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          date?: string
          duration_minutes?: number
          id?: string
          name?: string
          notes?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          client_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number
          id: string
          notes: string | null
          professional_id: string
          scheduled_at: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          professional_id: string
          scheduled_at: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          notes?: string | null
          professional_id?: string
          scheduled_at?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_connections: {
        Row: {
          client_id: string | null
          connection_type: string | null
          created_at: string | null
          dietitian_id: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          connection_type?: string | null
          created_at?: string | null
          dietitian_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          connection_type?: string | null
          created_at?: string | null
          dietitian_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_connections_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_connections_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_messages: {
        Row: {
          connection_id: string | null
          created_at: string | null
          id: string
          message: string
          message_type: string | null
          read_at: string | null
          recipient_id: string | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          connection_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          connection_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "client_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "client_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      client_notes: {
        Row: {
          client_id: string | null
          content: string
          created_at: string | null
          date: string | null
          dietitian_id: string | null
          id: string
          note_type: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string | null
          date?: string | null
          dietitian_id?: string | null
          id?: string
          note_type?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string | null
          date?: string | null
          dietitian_id?: string | null
          id?: string
          note_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_notes_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_id: string
          created_at: string | null
          id: string
          professional_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          id?: string
          professional_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          id?: string
          professional_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_nutrition: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string | null
          water_intake: number | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
          water_intake?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
          water_intake?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_nutrition_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_programs: {
        Row: {
          carbs_percentage: number | null
          created_at: string | null
          daily_calorie_target: number | null
          description: string | null
          dietitian_id: string | null
          duration_days: number | null
          fat_percentage: number | null
          id: string
          is_template: boolean | null
          name: string
          notes: string | null
          protein_percentage: number | null
          restrictions: string[] | null
          updated_at: string | null
        }
        Insert: {
          carbs_percentage?: number | null
          created_at?: string | null
          daily_calorie_target?: number | null
          description?: string | null
          dietitian_id?: string | null
          duration_days?: number | null
          fat_percentage?: number | null
          id?: string
          is_template?: boolean | null
          name: string
          notes?: string | null
          protein_percentage?: number | null
          restrictions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          carbs_percentage?: number | null
          created_at?: string | null
          daily_calorie_target?: number | null
          description?: string | null
          dietitian_id?: string | null
          duration_days?: number | null
          fat_percentage?: number | null
          id?: string
          is_template?: boolean | null
          name?: string
          notes?: string | null
          protein_percentage?: number | null
          restrictions?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diet_programs_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          calories_per_100g: number
          carbs_per_100g: number
          created_at: string | null
          fat_per_100g: number
          fiber_per_100g: number
          id: string
          name: string
          protein_per_100g: number
        }
        Insert: {
          calories_per_100g: number
          carbs_per_100g?: number
          created_at?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number
          id?: string
          name: string
          protein_per_100g?: number
        }
        Update: {
          calories_per_100g?: number
          carbs_per_100g?: number
          created_at?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number
          id?: string
          name?: string
          protein_per_100g?: number
        }
        Relationships: []
      }
      meal_entries: {
        Row: {
          amount: number
          calories: number
          carbs: number
          created_at: string | null
          daily_nutrition_id: string | null
          eaten_at: string | null
          fat: number
          fiber: number
          food_id: string | null
          id: string
          meal_type: string
          protein: number
          unit: string
        }
        Insert: {
          amount: number
          calories: number
          carbs?: number
          created_at?: string | null
          daily_nutrition_id?: string | null
          eaten_at?: string | null
          fat?: number
          fiber?: number
          food_id?: string | null
          id?: string
          meal_type: string
          protein?: number
          unit?: string
        }
        Update: {
          amount?: number
          calories?: number
          carbs?: number
          created_at?: string | null
          daily_nutrition_id?: string | null
          eaten_at?: string | null
          fat?: number
          fiber?: number
          food_id?: string | null
          id?: string
          meal_type?: string
          protein?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_entries_daily_nutrition_id_fkey"
            columns: ["daily_nutrition_id"]
            isOneToOne: false
            referencedRelation: "daily_nutrition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_entries_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_foods: {
        Row: {
          calories: number
          carbs: number
          created_at: string | null
          fat: number
          food_id: string
          id: string
          meal_id: string
          protein: number
          quantity_grams: number
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string | null
          fat: number
          food_id: string
          id?: string
          meal_id: string
          protein: number
          quantity_grams: number
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string | null
          fat?: number
          food_id?: string
          id?: string
          meal_id?: string
          protein?: number
          quantity_grams?: number
        }
        Relationships: [
          {
            foreignKeyName: "meal_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string | null
          date: string
          id: string
          meal_type: string
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          meal_type: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          meal_type?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      message_threads: {
        Row: {
          client_id: string | null
          created_at: string | null
          dietitian_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          dietitian_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          dietitian_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_threads_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_threads_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string | null
          sent_at: string | null
          thread_id: string | null
        }
        Insert: {
          content: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          thread_id?: string | null
        }
        Update: {
          content?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "message_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_profiles: {
        Row: {
          approval_date: string | null
          consultation_fee: number | null
          created_at: string
          diploma_info: string | null
          experience_years: number | null
          id: string
          is_approved: boolean
          license_number: string | null
          profile_id: string
          specializations: string[] | null
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          consultation_fee?: number | null
          created_at?: string
          diploma_info?: string | null
          experience_years?: number | null
          id?: string
          is_approved?: boolean
          license_number?: string | null
          profile_id: string
          specializations?: string[] | null
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          consultation_fee?: number | null
          created_at?: string
          diploma_info?: string | null
          experience_years?: number | null
          id?: string
          is_approved?: boolean
          license_number?: string | null
          profile_id?: string
          specializations?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      program_assignments: {
        Row: {
          assigned_date: string | null
          client_id: string | null
          created_at: string | null
          custom_calorie_target: number | null
          dietitian_id: string | null
          end_date: string | null
          id: string
          notes: string | null
          program_id: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_date?: string | null
          client_id?: string | null
          created_at?: string | null
          custom_calorie_target?: number | null
          dietitian_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          program_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_date?: string | null
          client_id?: string | null
          created_at?: string | null
          custom_calorie_target?: number | null
          dietitian_id?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          program_id?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_assignments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_assignments_dietitian_id_fkey"
            columns: ["dietitian_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_assignments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "diet_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          created_at: string | null
          daily_calories: number
          daily_carbs: number
          daily_fat: number
          daily_protein: number
          id: string
          updated_at: string | null
          user_id: string
          weekly_exercise_minutes: number
          weight_goal_kg: number | null
        }
        Insert: {
          created_at?: string | null
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_protein?: number
          id?: string
          updated_at?: string | null
          user_id: string
          weekly_exercise_minutes?: number
          weight_goal_kg?: number | null
        }
        Update: {
          created_at?: string | null
          daily_calories?: number
          daily_carbs?: number
          daily_fat?: number
          daily_protein?: number
          id?: string
          updated_at?: string | null
          user_id?: string
          weekly_exercise_minutes?: number
          weight_goal_kg?: number | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          activity_level: string | null
          birth_date: string | null
          created_at: string
          gender: Database["public"]["Enums"]["gender"] | null
          goal: Database["public"]["Enums"]["goal"] | null
          height: number | null
          id: string
          profile_id: string
          target_weight: number | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          activity_level?: string | null
          birth_date?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          goal?: Database["public"]["Enums"]["goal"] | null
          height?: number | null
          id?: string
          profile_id: string
          target_weight?: number | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          activity_level?: string | null
          birth_date?: string | null
          created_at?: string
          gender?: Database["public"]["Enums"]["gender"] | null
          goal?: Database["public"]["Enums"]["goal"] | null
          height?: number | null
          id?: string
          profile_id?: string
          target_weight?: number | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      water_intake: {
        Row: {
          amount_ml: number
          date: string
          id: string
          time_logged: string | null
          user_id: string
        }
        Insert: {
          amount_ml: number
          date?: string
          id?: string
          time_logged?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number
          date?: string
          id?: string
          time_logged?: string | null
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
      gender: "male" | "female" | "other"
      goal: "lose_weight" | "gain_weight" | "maintain"
      user_role: "user" | "dietitian" | "trainer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender: ["male", "female", "other"],
      goal: ["lose_weight", "gain_weight", "maintain"],
      user_role: ["user", "dietitian", "trainer"],
    },
  },
} as const
