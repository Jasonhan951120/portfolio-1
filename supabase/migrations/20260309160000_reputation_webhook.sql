-- Migration: Create Webhook Trigger for Reputation Autopilot

-- Ensure pg_net extension is enabled (required for webhook POST requests)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create the function that calls the Edge Function
CREATE OR REPLACE FUNCTION public.trigger_reputation_autopilot()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url text := 'https://tpzdercbacefqfpadhcb.supabase.co/functions/v1/send-review-request';
  request_body jsonb;
BEGIN
  -- Only trigger when status changes TO 'Treated'
  IF NEW.status = 'Treated' AND (OLD.status IS NULL OR OLD.status != 'Treated') THEN
    
    -- Build the payload
    request_body := json_build_object(
      'type', 'UPDATE',
      'table', 'consultation_requests',
      'record', row_to_json(NEW),
      'old_record', row_to_json(OLD)
    );

    -- Perform the HTTP POST request using pg_net
    PERFORM net.http_post(
      url := edge_function_url,
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('request.jwt.env', true) || '"}',
      body := request_body
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the consultation_requests table
DROP TRIGGER IF EXISTS trigger_reputation_request ON public.consultation_requests;
CREATE TRIGGER trigger_reputation_request
  AFTER UPDATE OF status ON public.consultation_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_reputation_autopilot();
