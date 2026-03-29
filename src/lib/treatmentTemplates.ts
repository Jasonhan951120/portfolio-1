export interface TreatmentTemplate {
    title: string;
    investment: string;
    monthly: string;
    term: string;
    features: string[];
    description: string;
    beforeAfter: {
        before: string;
        after: string;
    };
    testimonial?: string;
}

export const TREATMENT_TEMPLATES: Record<string, TreatmentTemplate> = {
    "Dental Implants": {
        title: "Precision Implantology",
        investment: "£3,500",
        monthly: "£145.83",
        term: "24 Months",
        features: ["Custom Abutment", "Premium Titanium Post", "Hand-crafted Porcelain Crown", "Lifetime Guarantee"],
        description: "Dental implants are the gold standard for tooth replacement. This comprehensive procedure ensures maximum durability, aesthetic integration, and restored functional bite strength, providing a permanent solution that looks and feels completely natural.",
        beforeAfter: {
            before: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200",
            after: "https://images.unsplash.com/photo-1606811841660-1b51e9ed27ff?auto=format&fit=crop&q=80&w=1200"
        },
        testimonial: "The precision and care taken was incredible. Truly a Harley Street standard.",
    },
    "Invisalign / Aligners": {
        title: "SmartSmile Simulation",
        investment: "£3,000",
        monthly: "£125.00",
        term: "24 Months",
        features: ["Full 3D Simulation", "Set of Clear Aligners", "Retainers Included", "Post-treatment Whitening"],
        description: "Our SmartSmile aligner protocol offers a discreet, comfortable path to your perfect smile. Using advanced 3D scanning, we map the exact movement of your teeth to ensure precision alignment without traditional braces.",
        beforeAfter: {
            before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1200",
            after: "https://images.unsplash.com/photo-1516012828019-06ad1742de8a?auto=format&fit=crop&q=80&w=1200"
        }
    },
    "Teeth Whitening": {
        title: "Signature Illuminating Whitening",
        investment: "£450",
        monthly: "£45.00",
        term: "10 Months",
        features: ["Professional Grade Gel", "Bespoke Custom Trays", "In-Clinic Laser Session", "Anti-Sensitivity Protocol"],
        description: "Achieve a dazzling, radiant smile with our Signature Illuminating Whitening. Utilizing premium, low-sensitivity formulas, this treatment lifts deep stains safely and effectively out of the enamel, brightening your smile by several shades.",
        beforeAfter: {
            before: "https://images.unsplash.com/photo-1629909615184-74f4b1e434cd?auto=format&fit=crop&q=80&w=1200",
            after: "https://images.unsplash.com/photo-1590623101650-77a83dccf5f5?auto=format&fit=crop&q=80&w=1200"
        }
    },
    "Composite Bonding": {
        title: "Flawless Edge Bonding",
        investment: "£1,200",
        monthly: "£100.00",
        term: "12 Months",
        features: ["Micro-Aesthetic Sculpting", "Zero Enamel Filing", "Same-Day Results", "High-Gloss Polish"],
        description: "Transform chips, gaps, and uneven edges instantly. Our composite bonding protocol uses highly aesthetic resins sculpted directly onto your teeth to create a perfectly symmetrical and natural-looking smile in just one visit.",
        beforeAfter: {
            before: "https://images.unsplash.com/photo-1598256990422-9571212dc9ce?auto=format&fit=crop&q=80&w=1200",
            after: "https://images.unsplash.com/photo-1606811841660-1b51e9ed27ff?auto=format&fit=crop&q=80&w=1200"
        }
    }
};
