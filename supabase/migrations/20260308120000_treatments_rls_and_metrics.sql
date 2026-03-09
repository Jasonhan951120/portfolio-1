-- 1. Enforce strict Row Level Security (RLS) on the clinic_treatments table
ALTER TABLE public.clinic_treatments ENABLE ROW LEVEL SECURITY;

-- Allow INSERT, UPDATE, DELETE only for authenticated admins/owners via profiles join
CREATE POLICY "Admins and Owners can manage treatments" 
ON public.clinic_treatments 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.clinic_id = clinic_treatments.clinic_id AND (p.role = 'admin' OR p.role = 'owner')
    )
);

-- Allow SELECT for everyone (authenticated or public depending on architecture, but let's allow authenticated to read)
CREATE POLICY "Anyone can view treatments" 
ON public.clinic_treatments 
FOR SELECT 
USING (true);

-- 2. Server-Side Aggregation for Revenue Metrics
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

    -- Revenue at Risk: Sum of potential_value where status is 'New Lead' or 'Future Pipeline'
    SELECT COALESCE(SUM(potential_value), 0)
    INTO v_revenue_at_risk
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id AND status IN ('New Lead', 'Future Pipeline');

    -- Marketing ROAS
    SELECT COALESCE(SUM(potential_value), 0), COUNT(id)
    INTO v_closed_ad_revenue, v_ad_driven_leads_count
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id 
      AND (utm_source IN ('meta', 'google') OR fbclid IS NOT NULL);
      
    -- Only count closed-won revenue for ROAS
    SELECT COALESCE(SUM(potential_value), 0)
    INTO v_closed_ad_revenue
    FROM public.consultation_requests
    WHERE clinic_id = p_clinic_id 
      AND (utm_source IN ('meta', 'google') OR fbclid IS NOT NULL)
      AND status = 'Sale Closed';

    -- Mock estimating ad spend: 50 CPA, min 500
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
