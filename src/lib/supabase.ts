import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Clinic = {
    id: string;
    name: string;
    created_at: string;
};

export type Profile = {
    id: string;
    clinic_id: string;
    full_name: string | null;
    role: "admin" | "staff" | "owner";
    created_at: string;
};

export type ConsultationRequest = {
    id: string;
    clinic_id?: string;
    name: string;
    email: string;
    phone: string;
    service: string;
    notes: string | null;
    status: "New" | "Contacted" | "Consultation Booked" | "Visited" | "Treatment Started" | "Abandoned" | "Archived";
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

export type Patient = {
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
    patient_id: string;
    status: "draft" | "pending" | "confirmed" | "no_show" | "completed";
    scheduled_at: string | null;
    notes: string | null;
    created_at: string;
};
