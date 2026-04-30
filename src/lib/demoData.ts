import { ConsultationRequest } from './supabase';

export const DEMO_LEADS: Partial<ConsultationRequest>[] = [
    {
        id: "demo-alex",
        name: "Alex Thompson",
        email: "demo@example.com",
        phone: "+44 7700 900001",
        service: "Dental Implants",
        potential_value: 3000,
        status: "New Lead",
        intent_score: 95,
        created_at: new Date().toISOString()
    },
    {
        id: "demo-james",
        name: "James Wilson",
        email: "demo@example.com",
        phone: "+44 7700 900002",
        service: "Dental Implants",
        potential_value: 8500,
        status: "Booked",
        intent_score: 99,
        created_at: new Date().toISOString()
    },
    {
        id: "demo-sarah",
        name: "Sarah Jenkins",
        email: "demo@example.com",
        phone: "+44 7700 900003",
        service: "Invisalign / Aligners",
        potential_value: 3500,
        status: "New Lead",
        intent_score: 88,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
        id: "demo-michael",
        name: "Michael Ross",
        email: "demo@example.com",
        phone: "+44 7700 900004",
        service: "Veneers",
        potential_value: 12000,
        status: "Visited",
        intent_score: 91,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
        id: "demo-david",
        name: "David Clarke",
        email: "demo@example.com",
        phone: "+44 7700 900005",
        service: "Dental Implants",
        potential_value: 5500,
        status: "New Lead",
        intent_score: 82,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: "demo-olivia",
        name: "Olivia Bennett",
        email: "demo@example.com",
        phone: "+44 7700 900006",
        service: "Veneers",
        potential_value: 9500,
        status: "Treated",
        intent_score: 96,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
    },
    {
        id: "demo-benedict",
        name: "Benedict Shaw",
        email: "demo@example.com",
        phone: "+44 7700 900007",
        service: "Invisalign / Aligners",
        potential_value: 4000,
        status: "Visited",
        intent_score: 75,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    ...Array.from({ length: 40 }).map((_, i) => ({
        id: `demo-fill-${i}`,
        name: [
            "Thomas Miller", "Jack Wright", "Emily Thompson", "Jessica White", "Alice Walker",
            "Lucas Robinson", "Grace Green", "Edward Hall", "Ruby Young", "Oscar King"
        ][i % 10] + " " + (i + 11),
        email: "demo@example.com",
        phone: `+44 7700 9${String(i + 100).padStart(5, '0')}`,
        service: ["Dental Implants", "Invisalign / Aligners", "Veneers", "Composite Bonding"][i % 4],
        potential_value: [3500, 4500, 1500, 2500, 5000, 2000, 800, 1200][i % 8],
        status: ["New Lead", "Booked", "Visited", "New Lead", "Booked"][i % 5] as any,
        intent_score: 60 + (i % 40),
        created_at: new Date(Date.now() - (i * 1000 * 60 * 60 * 4)).toISOString(),
    }))
];
