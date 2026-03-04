export const KANBAN_COLUMNS = ["New Lead", "Contacted", "Booked", "Visited", "Treated", "Abandoned", "Waitlisted"];

export const TREATMENT_VALUES: Record<string, number> = {
    "Dental Implants": 3000,
    "Invisalign / Aligners": 2500,
    "Veneers": 1200,
    "Composite Bonding": 800,
    "Teeth Whitening": 500,
    "Dental Crown": 900,
    "Emergency Appointment": 300,
    "General Inquiry": 1500,
    "Other": 1000,
};

export const DONUT_SEGMENTS = [
    { label: "Implants", count: 0, color: "from-blue-500 to-blue-600", hex: "#3b82f6" },
    { label: "Invisalign", count: 0, color: "from-purple-500 to-purple-600", hex: "#a855f7" },
    { label: "Veneers", count: 0, color: "from-emerald-500 to-emerald-600", hex: "#10b981" },
    { label: "Other", count: 0, color: "from-gray-400 to-gray-500", hex: "#94a3b8" },
];

export const STATUS_COLORS: Record<string, string> = {
    "New Lead": "text-[#C5A059] border-[#C5A059]/40 bg-[#C5A059]/10",
    "Booked": "text-purple-400 border-purple-400/40 bg-transparent",
    "Visited": "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
    "Treated": "text-[#87A96B] border-[#87A96B]/40 bg-[#87A96B]/10",
    "Abandoned": "text-gray-400 border-black/10 bg-black/5",
};
