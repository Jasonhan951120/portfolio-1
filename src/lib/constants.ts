export const KANBAN_COLUMNS = ["New Lead", "Booked", "Visited", "Treated", "Closed Won", "Abandoned"];

export const SERVICE_CONVERSION_VALUES: Record<string, number> = {
    "Dental Implants": 3500,
    "Invisalign / Aligners": 3000,
    "Veneers": 1500,
    "Composite Bonding": 1000,
    "Teeth Whitening": 600,
    "Dental Crown": 1200,
    "Emergency Appointment": 500,
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
    "New Lead": "text-emerald-600 border-emerald-200 bg-emerald-50/50",
    "Booked": "text-indigo-600 border-indigo-200 bg-indigo-50/50",
    "Proposal Sent": "text-amber-600 border-amber-200 bg-amber-50/50",
    "Visited": "text-blue-600 border-blue-200 bg-blue-50/50",
    "Treated": "text-emerald-700 border-emerald-300 bg-emerald-100",
    "Closed Won": "text-emerald-700 border-emerald-300 bg-emerald-100 shadow-sm",
    "Abandoned": "text-slate-400 border-slate-200 bg-slate-50",
    "Future Pipeline": "text-slate-600 border-slate-200 bg-slate-100/50",
};
