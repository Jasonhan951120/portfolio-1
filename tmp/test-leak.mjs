import fetch from 'node-fetch';

const SUPABASE_URL = 'https://tpzdercbacefqfpadhcb.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Truncated for safety

async function testLeak() {
    console.log("Testing variable leak protection in send-pt-v2...");
    
    // Intentionally sending raw variables in the personalized_note
    const payload = {
        name: "Donggyun Han",
        email: "handonggyun18@gmail.com",
        service: "Luxury Implants",
        lead_id: "test-leak-id",
        personalized_note: "Hi ${name}, your plan for {TreatmentName} is ready. This is leaking: ${leak}."
    };

    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-pt-v2`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ANON_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Result:", JSON.stringify(data, null, 2));
        
        if (data.success) {
            console.log("\nSuccess! Now check your email. All `${}` and `{}` should be gone/redacted.");
        } else {
            console.error("\nFailed:", data.error);
        }
    } catch (err) {
        console.error("\nError:", err);
    }
}

testLeak();
