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
    ai_tone?: 'professional' | 'friendly' | 'direct';
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
    status: "New Lead" | "Booked" | "Proposal Sent" | "Visited" | "Treated" | "Closed Won" | "Abandoned" | "Future Pipeline" | "Archived" | "Consultation Done" | "Sale Closed" | "Waitlist";
    waitlist_status?: 'none' | 'active' | 'notified' | 'accepted' | 'expired';
    created_at: string;
    updated_at?: string;
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
    ai_summary?: string | null;
    is_vip?: boolean;
    category?: string;
    importedAt?: number;
    expectedRevenue?: number;
    before_photo?: string;
    after_photo?: string;
    pt_price_override?: number;
    pt_personalized_note?: string;
    treatment_name?: string;
    pt_before_image?: string;
    pt_after_image?: string;
    pt_booking_url?: string;
    ai_draft_context?: string;
    age?: number;
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
