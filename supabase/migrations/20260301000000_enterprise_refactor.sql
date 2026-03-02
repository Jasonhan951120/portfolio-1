-- 🏥 Dental Enterprise Platform: Multi-tenancy & RBAC Migration
-- Description: Adds clinic isolation, role-based access, and resource management.

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Upgrade profiles table for Multi-tenancy and RBAC
-- Note: 'role' allows for 'admin' (원장) and 'staff' (직원)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES public.clinics(id),
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'owner'));

-- 3. Upgrade consultation_requests for Clinic isolation
ALTER TABLE public.consultation_requests
  ADD COLUMN IF NOT EXISTS clinic_id UUID REFERENCES public.clinics(id);

-- 4. Create resources table (Chairs/Rooms)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'chair',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create appointments table for conflict-aware scheduling
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES public.clinics(id) NOT NULL,
  consultation_request_id UUID REFERENCES public.consultation_requests(id),
  doctor_id UUID REFERENCES public.profiles(id),
  resource_id UUID REFERENCES public.resources(id),
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'no_show', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 7. Multi-tenant RLS Policies

-- Profiles: Users see members of their own clinic
DROP POLICY IF EXISTS "Profiles are viewable by same-clinic members." ON public.profiles;
CREATE POLICY "Profiles are viewable by same-clinic members." ON public.profiles
  FOR SELECT USING (
    clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid()) OR id = auth.uid()
  );

-- Consultation Requests: Isolate by clinic
DROP POLICY IF EXISTS "Leads are viewable by clinic members." ON public.consultation_requests;
CREATE POLICY "Leads are viewable by clinic members." ON public.consultation_requests
  FOR SELECT USING (
    clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Leads are updatable by clinic members." ON public.consultation_requests;
CREATE POLICY "Leads are updatable by clinic members." ON public.consultation_requests
  FOR UPDATE USING (
    clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
  );

-- Resources: Isolate by clinic
DROP POLICY IF EXISTS "Resources are viewable by clinic members." ON public.resources;
CREATE POLICY "Resources are viewable by clinic members." ON public.resources
  FOR SELECT USING (
    clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
  );

-- Appointments: Isolate by clinic
DROP POLICY IF EXISTS "Appointments are viewable by clinic members." ON public.appointments;
CREATE POLICY "Appointments are viewable by clinic members." ON public.appointments
  FOR SELECT USING (
    clinic_id = (SELECT clinic_id FROM public.profiles WHERE id = auth.uid())
  );
