-- ==========================================
-- REVENUE ENGINE & REPUTATION AUTOPILOT
-- ==========================================

-- 1. Reputation Autopilot Trigger Setup
-- Creates a DB trigger that detects when a lead status changes to 'Treated'
-- and conceptually invokes the edge function (or inserts into an event queue).

CREATE OR REPLACE FUNCTION public.trigger_reputation_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If status changed to 'Treated' from something else
  IF NEW.status = 'Treated' AND OLD.status != 'Treated' THEN
    -- In production, this would use pg_net to hit the Edge Function:
    -- PERFORM net.http_post(
    --   url := 'https://[PROJECT_REF].supabase.co/functions/v1/send-review-request',
    --   headers := '{"Content-Type": "application/json", "Authorization": "Bearer [ANON_KEY]"}'::jsonb,
    --   body := json_build_object('type', 'UPDATE', 'record', row_to_json(NEW))::jsonb
    -- );
    
    -- For local/dev visibility, we just log a postgres notice
    RAISE NOTICE 'Reputation Autopilot Triggered for Lead ID %, Name: %', NEW.id, NEW.name;
    
    -- Alternatively, insert into an events table to be consumed by a worker if pg_net is disabled
    -- INSERT INTO public.system_events (event_type, payload) 
    -- VALUES ('reputation_request', row_to_json(NEW));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS reputation_request_trigger ON public.consultation_requests;
CREATE TRIGGER reputation_request_trigger
  AFTER UPDATE OF status ON public.consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_reputation_request();


-- 2. Lead Recovery AI (Revenue at Risk Metric Update)
-- Updates get_revenue_metrics to find leads with >48h no response.
CREATE OR REPLACE FUNCTION get_revenue_metrics(p_clinic_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_system_generated_revenue NUMERIC := 0;
    v_marketing_roas NUMERIC := 0;
    v_revenue_at_risk NUMERIC := 0;
    
    v_closed_ad_revenue NUMERIC := 0;
    v_ad_driven_leads_count INT := 0;
    v_estimated_ad_spend NUMERIC := 0;
BEGIN
    -- System Generated Revenue: Sum of potential_value where recovered_by_ai = true
    SELECT COALESCE(SUM(potential_value), 0)
    INTO v_system_generated_revenue
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id AND recovered_by_ai = true;

    -- Revenue at Risk: Leads with >48 hours since last update (Lead Recovery AI logic)
    SELECT COALESCE(SUM(potential_value), 0)
    INTO v_revenue_at_risk
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id 
      AND status NOT IN ('Treated', 'Lost', 'Sale Closed')
      -- Calculating time since updated_at in hours
      AND (EXTRACT(EPOCH FROM (now() - updated_at)) / 3600) > 48;

    -- Marketing ROAS
    SELECT COALESCE(SUM(potential_value), 0), COUNT(id)
    INTO v_closed_ad_revenue, v_ad_driven_leads_count
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id 
      AND (utm_source IN ('meta', 'google') OR fbclid IS NOT NULL);
      
    -- Only count actual Treated revenue for ROAS
    SELECT COALESCE(SUM(potential_value), 0)
    INTO v_closed_ad_revenue
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id 
      AND (utm_source IN ('meta', 'google') OR fbclid IS NOT NULL)
      AND status = 'Treated';

    v_estimated_ad_spend := GREATEST(v_ad_driven_leads_count * 50, 500);

    IF v_estimated_ad_spend > 0 THEN
        v_marketing_roas := ROUND((v_closed_ad_revenue / v_estimated_ad_spend), 1);
    END IF;

    RETURN json_build_object(
        'system_generated_revenue', v_system_generated_revenue,
        'marketing_roas', v_marketing_roas,
        'revenue_at_risk', v_revenue_at_risk
    );
END;
$$;


-- 3. Staff ROI Leaderboard (Strict 'Treated' Revenue Rule)
-- Base ROI purely on ACTUAL closed revenue (status = 'Treated')
CREATE OR REPLACE VIEW staff_performance AS
SELECT 
  p.id,
  p.clinic_id,
  p.full_name,
  p.avatar_url,
  COUNT(c.id) AS total_assigned,
  COALESCE(SUM(c.potential_value) FILTER (WHERE c.status = 'Treated'), 0) AS total_revenue,
  ROUND(
    (COUNT(c.id) FILTER (WHERE c.status = 'Treated') * 100.0) / 
    NULLIF(COUNT(c.id), 0), 
  1) AS conversion_rate,
  -- Average Response Time (simulated aggregate for UI completeness)
  15 AS avg_response_mins
FROM public.profiles p
LEFT JOIN public.consultation_requests c ON c.assigned_to = p.full_name
WHERE p.role IN ('admin', 'staff', 'owner')
GROUP BY p.id, p.clinic_id, p.full_name, p.avatar_url;
