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
      blockchain_ledger: {
        Row: {
          id: string
          donor_id: string | null
          hospital_id: string | null
          donation_type: string
          tx_hash: string
          network: string
          status: string
          timestamp: string
        }
        Insert: {
          id?: string
          donor_id?: string | null
          hospital_id?: string | null
          donation_type: string
          tx_hash: string
          network?: string
          status?: string
          timestamp?: string
        }
        Update: {
          id?: string
          donor_id?: string | null
          hospital_id?: string | null
          donation_type?: string
          tx_hash?: string
          network?: string
          status?: string
          timestamp?: string
        }
        Relationships: []
      }
      plasma_donations: {
        Row: {
          id: string
          donor_id: string
          hospital_id: string
          plasma_type: string
          donation_volume_ml: number
          extracted_date: string
          expiry_date: string
          component_status: string
          created_at: string
        }
        Insert: {
          id?: string
          donor_id: string
          hospital_id: string
          plasma_type: string
          donation_volume_ml: number
          extracted_date?: string
          expiry_date: string
          component_status?: string
          created_at?: string
        }
        Update: {
          id?: string
          donor_id?: string
          hospital_id?: string
          plasma_type?: string
          donation_volume_ml?: number
          extracted_date?: string
          expiry_date?: string
          component_status?: string
          created_at?: string
        }
        Relationships: []
      }
      plasma_inventory: {
        Row: {
          id: string
          hospital_id: string
          plasma_type: string
          units: number
          updated_at: string
        }
        Insert: {
          id?: string
          hospital_id: string
          plasma_type: string
          units?: number
          updated_at?: string
        }
        Update: {
          id?: string
          hospital_id?: string
          plasma_type?: string
          units?: number
          updated_at?: string
        }
        Relationships: []
      }
      plasma_requests: {
        Row: {
          id: string
          patient_name: string
          hospital_id: string
          diagnosis: string | null
          plasma_type: string
          required_units: number
          urgency: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_name: string
          hospital_id: string
          diagnosis?: string | null
          plasma_type: string
          required_units: number
          urgency?: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_name?: string
          hospital_id?: string
          diagnosis?: string | null
          plasma_type?: string
          required_units?: number
          urgency?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      plasma_therapy_logs: {
        Row: {
          id: string
          plasma_request_id: string
          donation_id: string | null
          hospital_id: string
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          plasma_request_id: string
          donation_id?: string | null
          hospital_id: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          plasma_request_id?: string
          donation_id?: string | null
          hospital_id?: string
          status?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      emergency_requests: {
        Row: {
          additional_details: string | null
          blood_type: string
          created_at: string | null
          id: string
          location: string
          patient_name: string
          status: string | null
          units_required: number
          user_id: string
        }
        Insert: {
          additional_details?: string | null
          blood_type: string
          created_at?: string | null
          id?: string
          location: string
          patient_name: string
          status?: string | null
          units_required: number
          user_id: string
        }
        Update: {
          additional_details?: string | null
          blood_type?: string
          created_at?: string | null
          id?: string
          location?: string
          patient_name?: string
          status?: string | null
          units_required?: number
          user_id?: string
        }
        Relationships: []
      }
      hospitals: {
        Row: {
          avg_opd_registrations: number | null
          created_at: string | null
          district: string
          email: string
          government_category: string | null
          hmis_solution_deployed: boolean | null
          hospital_address: string
          hospital_head_name: string | null
          hospital_name: string
          hospital_type: string
          id: string
          is_mobile_verified: boolean | null
          is_verified: boolean | null
          landline_number: string | null
          mobile_number: string
          number_of_doctors: number | null
          registration_status: string | null
          state: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avg_opd_registrations?: number | null
          created_at?: string | null
          district: string
          email: string
          government_category?: string | null
          hmis_solution_deployed?: boolean | null
          hospital_address: string
          hospital_head_name?: string | null
          hospital_name: string
          hospital_type: string
          id?: string
          is_mobile_verified?: boolean | null
          is_verified?: boolean | null
          landline_number?: string | null
          mobile_number: string
          number_of_doctors?: number | null
          registration_status?: string | null
          state: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avg_opd_registrations?: number | null
          created_at?: string | null
          district?: string
          email?: string
          government_category?: string | null
          hmis_solution_deployed?: boolean | null
          hospital_address?: string
          hospital_head_name?: string | null
          hospital_name?: string
          hospital_type?: string
          id?: string
          is_mobile_verified?: boolean | null
          is_verified?: boolean | null
          landline_number?: string | null
          mobile_number?: string
          number_of_doctors?: number | null
          registration_status?: string | null
          state?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          message_type: string | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_type?: string | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          message_type?: string | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      otp_verifications: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          hospital_id: string | null
          id: string
          is_used: boolean | null
          otp_code: string
          phone_number: string
          purpose: string
          user_id: string | null
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          hospital_id?: string | null
          id?: string
          is_used?: boolean | null
          otp_code: string
          phone_number: string
          purpose: string
          user_id?: string | null
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          hospital_id?: string | null
          id?: string
          is_used?: boolean | null
          otp_code?: string
          phone_number?: string
          purpose?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "otp_verifications_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          allergies: string | null
          avatar_url: string | null
          backup_codes: string[] | null
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          email_notifications: boolean | null
          first_name: string | null
          id: string
          is_available: boolean | null
          is_mobile_verified: boolean | null
          last_donation_date: string | null
          last_name: string | null
          location_sharing: boolean | null
          medical_conditions: string | null
          medications: string | null
          phone: string | null
          sms_notifications: boolean | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          avatar_url?: string | null
          backup_codes?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id: string
          is_available?: boolean | null
          is_mobile_verified?: boolean | null
          last_donation_date?: string | null
          last_name?: string | null
          location_sharing?: boolean | null
          medical_conditions?: string | null
          medications?: string | null
          phone?: string | null
          sms_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          avatar_url?: string | null
          backup_codes?: string[] | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          email_notifications?: boolean | null
          first_name?: string | null
          id?: string
          is_available?: boolean | null
          is_mobile_verified?: boolean | null
          last_donation_date?: string | null
          last_name?: string | null
          location_sharing?: boolean | null
          medical_conditions?: string | null
          medications?: string | null
          phone?: string | null
          sms_notifications?: boolean | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
