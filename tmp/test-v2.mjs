import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://tpzdercbacefqfpadhcb.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwemRlcmNiYWNlZnFmcGFkaGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjc0NzEsImV4cCI6MjA4NTY0MzQ3MX0.tv2VlhE2M3_I6h6EUQvgKA_ROE52k54a5AfFmQpXsIw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runTest() {
  console.log('Dispatching test email via send-pt-v2 to handonggyun18@gmail.com...');
  
  const { data, error } = await supabase.functions.invoke('send-pt-v2', {
    body: {
      lead_id: 'test_v2',
      name: 'Donggyun Han',
      email: 'handonggyun18@gmail.com',
      service: 'Dental Implants',
      origin: 'http://localhost:5173',
      personalized_note: 'Test note for v2.'
    }
  });

  if (error) {
    console.error('Edge function invocation failed:', error);
  } else {
    console.log('Success!', data);
  }
}

runTest();
