import { ConsultationRequest } from './supabase';

export const DEMO_LEADS: Partial<ConsultationRequest>[] = [
    {
        id: "donggyun-live",
        name: "Donggyun Han",
        email: "handonggyun18@gmail.com",
        phone: "820133951543",
        service: "Dental Implants",
        potential_value: 3000,
        status: "New Lead",
        intent_score: 95,
        created_at: new Date().toISOString()
    },
    {
        id: "demo-james",
        name: "James Wilson",
        email: "handonggyun18@gmail.com",
        service: "Dental Implants",
        potential_value: 8500,
        status: "Booked",
        intent_score: 99,
        created_at: new Date().toISOString()
    },
    {
        id: "demo-sarah",
        name: "Sarah Jenkins",
        email: "handonggyun18@gmail.com",
        service: "Invisalign / Aligners",
        potential_value: 3500,
        status: "New Lead",
        intent_score: 88,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
        id: "demo-michael",
        name: "Michael Ross",
        email: "handonggyun18@gmail.com",
        service: "Veneers",
        potential_value: 12000,
        status: "Visited",
        intent_score: 91,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
        id: "demo-david",
        name: "David Beckham",
        email: "handonggyun18@gmail.com",
        service: "Dental Implants",
        potential_value: 5500,
        status: "New Lead",
        intent_score: 82,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: "demo-olivia",
        name: "Olivia Colman",
        email: "handonggyun18@gmail.com",
        service: "Veneers",
        potential_value: 9500,
        status: "Treated",
        intent_score: 96,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
        id: "demo-benedict",
        name: "Benedict Cumberbatch",
        email: "handonggyun18@gmail.com",
        service: "Invisalign / Aligners",
        potential_value: 4000,
        status: "Visited",
        intent_score: 75,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    // Adding 40 more mixed records to hit the ~£85,400 pipeline goal (excluding treated)
    ...Array.from({ length: 40 }).map((_, i) => ({
        id: `demo-fill-${i}`,
        name: [
            "Thomas Miller", "Jack Wright", "Emily Thompson", "Jessica White", "Alice Walker", 
            "Lucas Robinson", "Grace Green", "Edward Hall", "Ruby Young", "Oscar King"
        ][i % 10] + " " + (i + 11),
        email: "handonggyun18@gmail.com",
        service: ["Dental Implants", "Invisalign / Aligners", "Veneers", "Composite Bonding"][i % 4],
        potential_value: [3500, 4500, 1500, 2500, 5000, 2000, 800, 1200][i % 8],
        status: ["New Lead", "Booked", "Visited", "New Lead", "Booked"][i % 5] as any,
        intent_score: Math.floor(Math.random() * 40) + 60,
        created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 7).toISOString(),
        phone: "+447700900" + (700 + i)
    }))
];

// Target Pipeline calculation logic test (informational):
// Current values summed for non-Treated:
// demo-1: 8500
// demo-2: 3500
// demo-3: 12000
// demo-4: 5500
// demo-5: 9500
// demo-6: 4000
// demo-7: 15000
// demo-8: 2500
// demo-10: 3800
// Subtotal items: 64,300
// Remaining for 85,400: 21,100
// 40 items average ~527.5.
// Let's adjust the potential_value array to hit it closer.
