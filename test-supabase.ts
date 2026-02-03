
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// Manually load .env since we are running with ts-node/node directly
const envConfig = dotenv.parse(fs.readFileSync('.env'));

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;

console.log(`Testing connection to: ${url}`);
console.log(`Using key: ${key.substring(0, 10)}...`);

const supabase = createClient(url, key);

async function testConnection() {
    try {
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Connection FAILED:', error.message);
            console.error('Error details:', error);
        } else {
            console.log('Connection SUCCESSFUL!');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
