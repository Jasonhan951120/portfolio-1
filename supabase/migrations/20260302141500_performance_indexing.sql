-- Performance Indexing for Consultation Requests
CREATE INDEX IF NOT EXISTS idx_leads_name ON consultation_requests(name);
CREATE INDEX IF NOT EXISTS idx_leads_status ON consultation_requests(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON consultation_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_clinic_id ON consultation_requests(clinic_id);
