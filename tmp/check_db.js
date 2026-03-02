
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing environment variables");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
    const { data: clinics, error: ce } = await supabase.from('clinics').select('*');
    console.log("Clinics:", JSON.stringify(clinics, null, 2));

    const { data: treatments, error: te } = await supabase.from('clinic_treatments').select('*');
    console.log("Treatments:", JSON.stringify(treatments, null, 2));
}

checkData();
