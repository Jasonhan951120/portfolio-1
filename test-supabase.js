
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple .env parser since we don't want to rely on complex setup
const envContent = fs.readFileSync('.env', 'utf8');
const envConfig = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envConfig[key.trim()] = value.trim();
    }
});

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;

console.log('--- CONNECTION TEST START ---');
console.log(`URL: ${url}`);
console.log(`Key: ${key ? key.substring(0, 15) + '...' : 'MISSING'}`);

if (!url || !key) {
    console.error('ERROR: Missing environment variables!');
    process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
    try {
        console.log('Attempting to fetch data...');
        // Just try a simple select, even if table is empty it should not error 404/500
        // profiles table might be empty or restricted, but let's see errors
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('--- CONNECTION FAILED ---');
            console.error('Message:', error.message);
            console.error('Code:', error.code);
            console.error('Details:', JSON.stringify(error, null, 2));
        } else {
            console.log('--- CONNECTION SUCCESSFUL! ---');
            console.log('Supabase is reachable.');
        }
    } catch (err) {
        console.error('--- UNEXPECTED ERROR ---');
        console.error(err);
    }
}

testConnection();
