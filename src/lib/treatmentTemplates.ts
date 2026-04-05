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

export const INDUSTRY_TEMPLATES: Record<string, Record<string, TreatmentTemplate>> = {
    "Dental": {
        "Dental Implants": {
            title: "Precision Implantology",
            investment: "£3,500",
            monthly: "£145.83",
            term: "24 Months",
            features: ["Digital Smile Simulation", "Micro-Precision Porcelain Sculpting", "Multi-layered Aesthetic Veneers", "Lifetime Guarantee"],
            description: "Hand-crafted porcelain veneers are the ultimate blend of art and dental science. This comprehensive procedure ensures maximum durability, aesthetic integration, and restored functional bite strength, providing a permanent solution that looks and feels completely natural.",
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
    },
    "Aesthetic": {
        "Laser Whitening": {
            title: "Advanced Laser Toning",
            investment: "£850",
            monthly: "£85.00",
            term: "10 Months",
            features: ["Pico-second Laser Precision", "Zero Downtime", "Stimulates Collagen", "Dermatologist Administered"],
            description: "Achieve a flawless, radiant complexion with our Advanced Laser Toning. Utilizing state-of-the-art Pico-second technology, this treatment shatters hyperpigmentation safely and effectively, restoring luminous skin tone.",
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1512496015851-a1c841103c81?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=1200"
            },
            testimonial: "My skin has never looked so luminous. The difference in just one session is breathtaking!"
        },
        "Dermal Fillers": {
            title: "Facial Harmonization",
            investment: "£1,200",
            monthly: "£100.00",
            term: "12 Months",
            features: ["Premium HA Fillers", "Strategic Volume Restoration", "Natural Lifting Effect", "MD Code Technique"],
            description: "Restore youth and symmetry with our bespoke Dermal Filler protocol. Unlike traditional filling, we focus on overall structural harmonization, lifting and contouring the face for a naturally refreshed look.",
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1542036484-916c802ddfbb?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6ece?auto=format&fit=crop&q=80&w=1200"
            },
            testimonial: "I look like myself, just completely refreshed and 5 years younger."
        },
        "Anti-Wrinkle Injections": {
            title: "Precision Neuromodulators",
            investment: "£600",
            monthly: "£60.00",
            term: "10 Months",
            features: ["FDA-Approved Toxin", "Micro-Droplet Technique", "Preserved Expression", "Fast-Acting Results"],
            description: "Soften dynamic lines and prevent future wrinkles with extreme precision. We administer micro-doses to targeted muscles, ensuring a smooth, rested appearance while preserving your natural facial expressions.",
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&q=80&w=1200"
            }
        }
    },
    "Wellness": {
        "Deep Tissue Therapy": {
            title: "Clinical Muscle Release",
            investment: "£450",
            monthly: "£45.00",
            term: "10 Months",
            features: ["Myofascial Release", "Trigger Point Therapy", "Increased Mobility", "Stress Hormone Reduction"],
            description: "Relieve chronic tension and restore absolute physiological harmony. Our deep tissue therapy goes beyond relaxation to systematically break down adhesions and restore unrestricted movement.",
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1200"
            },
            testimonial: "The pain I've had for years in my shoulder is completely gone. Incredible clinical expertise."
        },
        "IV Drip Recovery": {
            title: "Cellular Rehydration Infusion",
            investment: "£300",
            monthly: "£30.00",
            term: "10 Months",
            features: ["B-Vitamin Complex", "High-Dose Vitamin C", "Glutathione Boost", "Electrolyte Balancing"],
            description: "Reboot your system at a cellular level. This bespoke IV formulation bypasses the digestive system to deliver essential vitamins, minerals, and amino acids directly into your bloodstream for maximum absorption and instant vitality.",
            beforeAfter: {
                before: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1200",
                after: "https://images.unsplash.com/photo-1606811841660-1b51e9ed27ff?auto=format&fit=crop&q=80&w=1200"
            }
        }
    }
};

export function getTreatmentTemplate(clinicType: string, serviceName: string): TreatmentTemplate {
    const safeType = ['Dental', 'Aesthetic', 'Wellness'].includes(clinicType) ? clinicType : 'Dental';
    const activeIndustry = INDUSTRY_TEMPLATES[safeType];
    
    // Attempt exact match
    if (activeIndustry[serviceName]) {
        return activeIndustry[serviceName];
    }
    
    // Fuzzy match (fallback check if exact misses)
    const lowerService = serviceName.toLowerCase();
    const match = Object.keys(activeIndustry).find(k => k.toLowerCase().includes(lowerService) || lowerService.includes(k.toLowerCase()));
    
    if (match) return activeIndustry[match];
    
    // Ultimate fallback to first key in the industry
    const fallbackKey = Object.keys(activeIndustry)[0];
    return activeIndustry[fallbackKey];
}
