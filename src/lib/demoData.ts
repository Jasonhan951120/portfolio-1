import { ConsultationRequest } from './supabase';

export const DEMO_LEADS: Partial<ConsultationRequest>[] = [
    {
        id: "demo-1",
        name: "James Carter",
        service: "Dental Implants",
        potential_value: 8500,
        status: "New Lead",
        intent_score: 94,
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
        phone: "+447700900123",
        pt_before_image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
        pt_after_image: "https://images.unsplash.com/photo-1606811841660-1b51e9ed27ff?auto=format&fit=crop&q=80&w=1200",
        pt_personalized_note: "James, it was a pleasure discussing your implant transformation today. As visualized, we can achieve total aesthetic restoration."
    },
    {
        id: "demo-2",
        name: "Emma Watson",
        service: "Invisalign / Aligners",
        potential_value: 3500,
        status: "New Lead",
        intent_score: 88,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        phone: "+447700900456",
        pt_before_image: "https://example.com/placeholder.jpg",
        pt_after_image: "https://example.com/dummy.jpg",
        pt_personalized_note: "Emma, here is a placeholder simulation."
    },
    {
        id: "demo-3",
        name: "Oliver Smith",
        service: "Veneers",
        potential_value: 12000,
        status: "Booked",
        intent_score: 91,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        appointment_date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Tomorrow
        pt_before_image: null,
        pt_after_image: null,
        pt_personalized_note: "Oliver, your plan is ready but images are pending."
    },
    {
        id: "demo-4",
        name: "Isabella Jones",
        service: "Dental Implants",
        potential_value: 5500,
        status: "New Lead",
        intent_score: 82,
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
        id: "demo-5",
        name: "William Brown",
        service: "Veneers",
        potential_value: 9500,
        status: "Booked",
        intent_score: 96,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        appointment_date: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString()
    },
    {
        id: "demo-6",
        name: "Sophia Taylor",
        service: "Invisalign / Aligners",
        potential_value: 4000,
        status: "Visited",
        intent_score: 75,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
        id: "demo-7",
        name: "Harry Williams",
        service: "Dental Implants",
        potential_value: 15000,
        status: "New Lead",
        intent_score: 98,
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
    },
    {
        id: "demo-8",
        name: "Amelia Evans",
        service: "Composite Bonding",
        potential_value: 2500,
        status: "New Lead",
        intent_score: 65,
        created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
    },
    {
        id: "demo-9",
        name: "George Davies",
        service: "Veneers",
        potential_value: 7500,
        status: "Treated",
        intent_score: 100,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        treated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
        id: "demo-10",
        name: "Charlotte Wilson",
        service: "Invisalign / Aligners",
        potential_value: 3800,
        status: "Booked",
        intent_score: 85,
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString()
    },
    // Adding 40 more mixed records to hit the ~£85,400 pipeline goal (excluding treated)
    ...Array.from({ length: 40 }).map((_, i) => ({
        id: `demo-fill-${i}`,
        name: [
            "Thomas Miller", "Jack Wright", "Emily Thompson", "Jessica White", "Alice Walker", 
            "Lucas Robinson", "Grace Green", "Edward Hall", "Ruby Young", "Oscar King"
        ][i % 10] + " " + (i + 11),
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
