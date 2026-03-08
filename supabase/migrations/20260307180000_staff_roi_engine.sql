-- 20260307180000_staff_roi_engine.sql
-- Description: Adds lead assignment and creates a comprehensive staff performance view.

-- 1. Add assigned_staff_id to consultation_requests
ALTER TABLE public.consultation_requests
  ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.profiles(id);

-- Note: 'assigned_to' already exists in the type definition in supabase.ts, 
-- but we ensure it's properly indexed for the leaderboard.
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.consultation_requests(assigned_to);

-- 2. Create the Staff Performance View
-- This view aggregates ROI, Conversion Rates, and identifies Top Performers.
CREATE OR REPLACE VIEW public.staff_performance AS
WITH staff_leads AS (
    SELECT 
        assigned_to as staff_id,
        COUNT(*) as total_assigned,
        COUNT(*) FILTER (WHERE status IN ('Sale Closed', 'Closed Won', 'Consultation Done')) as closed_won_count,
        SUM(CASE 
            WHEN status IN ('Sale Closed', 'Closed Won', 'Consultation Done') THEN 
                COALESCE((
                    SELECT SUM(amount) FROM public.performed_treatments pt WHERE pt.lead_id = cr.id
                ), 1500) -- Fallback to generic average value if no explicit logs
            ELSE 0 
        END) as total_revenue
    FROM public.consultation_requests cr
    WHERE assigned_to IS NOT NULL
    GROUP BY assigned_to
),
staff_response_times AS (
    SELECT 
        p.id as staff_id,
        AVG(EXTRACT(EPOCH FROM (m.created_at - cr.created_at)) / 60) as avg_response_mins
    FROM public.profiles p
    JOIN public.messages m ON m.clinic_id = p.clinic_id AND m.direction = 'outbound'
    JOIN public.consultation_requests cr ON m.lead_id = cr.id
    GROUP BY p.id
)
SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.clinic_id,
    COALESCE(sl.total_assigned, 0) as total_assigned,
    COALESCE(sl.closed_won_count, 0) as closed_won_count,
    COALESCE(sl.total_revenue, 0) as total_revenue,
    CASE 
        WHEN COALESCE(sl.total_assigned, 0) > 0 
        THEN (sl.closed_won_count::FLOAT / sl.total_assigned::FLOAT) * 100 
        ELSE 0 
    END as conversion_rate,
    COALESCE(srt.avg_response_mins, 0) as avg_response_mins
FROM public.profiles p
LEFT JOIN staff_leads sl ON p.id = sl.staff_id
LEFT JOIN staff_response_times srt ON p.id = srt.staff_id
WHERE p.role IN ('staff', 'admin');

-- 3. Enable Realtime for the performance metrics
-- Since views aren't directly supported by realtime in the same way, 
-- we ensure the underlying tables are in the publication.
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultation_requests;
-- public.messages is already in the publication from a previous migration.
