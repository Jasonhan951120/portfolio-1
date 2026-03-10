-- Create a view for Revenue at Risk (Leads stagnant for > 48 hours)
CREATE OR REPLACE VIEW public.revenue_at_risk AS
SELECT 
  cr.id,
  cr.clinic_id,
  cr.name,
  cr.status,
  cr.potential_value,
  cr.updated_at as last_activity_at,
  EXTRACT(EPOCH FROM (now() - cr.updated_at))/3600 as hours_stagnant
FROM public.consultation_requests cr
WHERE 
  cr.status NOT IN ('Closed Won', 'Abandoned')
  AND cr.updated_at < (now() - interval '48 hours');
