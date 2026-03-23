import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://tpzdercbacefqfpadhcb.supabase.co";
// Using the anon key from .env.local
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwemRlcmNiYWNlZnFmcGFkaGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjc0NzEsImV4cCI6MjA4NTY0MzQ3MX0.tv2VlhE2M3_I6h6EUQvgKA_ROE52k54a5AfFmQpXsIw";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testEmail() {
  console.log("Invoking edge function...");
  const { data, error } = await supabase.functions.invoke('send-pt-link', {
    body: {
      lead_id: 'test-id-123',
      name: 'Donggyun Han',
      email: 'handonggyun18@gmail.com',
      service: 'Dental Implants',
      origin: 'http://localhost:5173',
      clinic_name: 'Hanlan OC Dental Clinic'
    }
  });

  if (error) {
    console.error("Edge function error:", error);
  } else {
    console.log("Edge function response:", data);
  }
}

testEmail();
