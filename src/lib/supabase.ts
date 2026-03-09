import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("CRITICAL: Missing Supabase Environment Variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Application will fail to load.");
}

export const supabase = createClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "placeholder");

export type Clinic = {
    id: string;
    name: string;
    created_at: string;
    subscription_status: 'active' | 'past_due' | 'none' | 'trialing';
    stripe_customer_id?: string | null;
    subscription_id?: string | null;
};

export type Profile = {
    id: string;
    clinic_id: string | null;
    full_name: string | null;
    email?: string | null;
    role: "admin" | "staff" | "owner";
    updated_at: string | null;
    is_admin: boolean;
    title?: string | null;
    specialty?: string | null;
    bio?: string | null;
    education?: string | null;
    avatar_url?: string | null;
    is_public?: boolean;
};



export type ConsultationRequest = {
    id: string;
    clinic_id?: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    notes: string | null;
    status: "New Lead" | "Qualified" | "Proposal Sent" | "Closed Won" | "Abandoned" | "Future Pipeline" | "Archived" | "Scheduled" | "Consultation Done" | "Sale Closed";
    created_at: string;
    first_contact_at?: string;
    review_requested_at?: string;
    assigned_to?: string;
    recall_interval_months?: number;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    referrer?: string;
    appointment_date?: string;
    treated_at?: string;
    doctor_id?: string;
    resource_id?: string;
    duration_minutes?: number;
    potential_value?: number;
    intent_score?: number;
    fbclid?: string | null;
    recovered_by_ai?: boolean;
};

export type Resource = {
    id: string;
    clinic_id: string;
    type: string;
    name: string;
    created_at: string;
};

export type Treatment = {
    id: string;
    clinic_id: string;
    name: string;
    duration_minutes: number;
    required_resource: string | null;
    created_at: string;
};

export type Lead = {
    id: string;
    clinic_id: string;
    name: string;
    phone: string | null;
    is_vip: boolean;
    created_at: string;
};

export type Appointment = {
    id: string;
    clinic_id: string;
    consultation_request_id?: string;
    patient_id?: string;
    doctor_id: string;
    resource_id: string;
    status: "pending" | "confirmed" | "no_show" | "completed" | "cancelled";
    scheduled_at: string;
    duration_minutes: number;
    notes: string | null;
    created_at: string;
};

export type Invitation = {
    id: string;
    clinic_id: string;
    email: string;
    role: "admin" | "staff";
    status: "pending" | "accepted" | "expired";
    token: string;
    expires_at: string;
    created_at: string;
};

export type AuditLog = {
    id: string;
    clinic_id: string;
    lead_id: string;
    user_id: string;
    user_name: string;
    lead_name: string;
    action_type: string;
    previous_value: string;
    new_value: string;
    timestamp: string;
};

export type StaffPerformance = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    clinic_id: string | null;
    total_assigned: number;
    closed_won_count: number;
    total_revenue: number;
    conversion_rate: number;
    avg_response_mins: number;
};
