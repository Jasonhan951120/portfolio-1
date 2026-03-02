-- 🛡️ Enterprise Onboarding: Invitations & Team Management
-- Description: Adds invitations table and enhances the new user trigger for automated role/clinic assignment.

-- 1. Create Invitations Table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- RLS: Only admins can see/create invitations for their clinic
CREATE POLICY "Admins can manage invitations for their clinic" ON public.invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.clinic_id = invitations.clinic_id
      AND profiles.role IN ('admin', 'owner')
    )
  );

-- 2. Enhanced handle_new_user() Trigger
-- This logic checks for a pending invitation during signup.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  invite_record RECORD;
  target_clinic_id UUID;
  target_role TEXT;
BEGIN
  -- Check if there's a pending invitation for this email
  SELECT * INTO invite_record 
  FROM public.invitations 
  WHERE email = NEW.email 
    AND status = 'pending' 
    AND expires_at > NOW()
  LIMIT 1;

  IF invite_record.id IS NOT NULL THEN
    -- Join existing clinic from invitation
    target_clinic_id := invite_record.clinic_id;
    target_role := invite_record.role;
    
    -- Mark invitation as accepted
    UPDATE public.invitations 
    SET status = 'accepted' 
    WHERE id = invite_record.id;
  ELSE
    -- Default behavior for non-invited users (can be adjusted for Admin signup)
    -- For now, we leave clinic_id NULL and role as 'staff' (or 'admin' if we want auto-create-clinic flow)
    target_clinic_id := NULL;
    target_role := 'staff';
  END IF;

  INSERT INTO public.profiles (id, full_name, clinic_id, role)
  values (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'), 
    target_clinic_id, 
    target_role
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql DEFAULT DEFINER;

-- 3. Indexing for performance
CREATE INDEX IF NOT EXISTS idx_invitations_email ON public.invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON public.invitations(token);
