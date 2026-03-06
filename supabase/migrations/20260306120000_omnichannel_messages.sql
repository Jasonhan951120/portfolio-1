-- 20260306120000_omnichannel_messages.sql
-- Create the messages table for the Unified Omnichannel Inbox

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.consultation_requests(id) ON DELETE SET NULL,
    sender_raw TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'sms', 'instagram', 'website')),
    content TEXT,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their clinic" ON public.messages
    FOR SELECT USING (
        clinic_id IN (
            SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages for their clinic" ON public.messages
    FOR INSERT WITH CHECK (
        clinic_id IN (
            SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update their clinic's messages" ON public.messages
    FOR UPDATE USING (
        clinic_id IN (
            SELECT clinic_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- Index for realtime lookups and performance
CREATE INDEX IF NOT EXISTS idx_messages_clinic_id ON public.messages(clinic_id);
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON public.messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);

-- Allow realtime subscription
-- NOTE: Depending on your superset of realtime configuration, you might need to drop and recreate the publication.
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
