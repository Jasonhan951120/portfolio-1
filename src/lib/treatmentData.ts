export interface ServicePackage {
    slug: string;
    title: string;
    heroImage: string;
    description: string;
    fullDescription: string;
    price: string;
    duration: string;
    process: {
        step: string;
        title: string;
        description: string;
    }[];
    benefits: string[];
    specialist: {
        name: string;
        role: string;
        image: string;
    };
}

export const TREATMENTS: Record<string, ServicePackage> = {
    "composite-bonding": {
        slug: "composite-bonding",
        title: "Smile Enhancement",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965553/hf_20260224_194822_dbee3087-65d3-4e06-8769-5ae9acd1a02d_knmad9.jpg",
        description: "Transform your confidence in a single session with our premium aesthetic bonding.",
        fullDescription: "Our aesthetic enhancement package uses elite-grade materials to seamlessly perfect your smile's alignment and symmetry. This non-invasive session is our most popular choice for rapid, high-impact visual results.",
        price: "Packages from £150",
        duration: "Quick 60-minute session",
        process: [
            { step: "01", title: "Aesthetic Duo-Selection", description: "Collaborate with our lead specialist to choose the perfect visual tone for your face." },
            { step: "02", title: "Surface Preparation", description: "Ensuring the canvas is perfectly primed for maximum adhesion and longevity." },
            { step: "03", title: "Artistic Sculpting", description: "Our specialists hand-sculpt the material to your precise desired blueprint." },
            { step: "04", title: "Diamond Polishing", description: "Final high-gloss finish for a look that reflects light just like natural premium enamel." }
        ],
        benefits: ["Immediate visual return", "Preservation focused", "Bespoke hand-crafted finish", "Zero recovery time"],
        specialist: {
            name: "Dr. Elena Rossi",
            role: "Aesthetic Director",
            image: "https://images.unsplash.com/photo-1559839734-2b71f1e59816?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "dental-crowns": {
        slug: "dental-crowns",
        title: "Structural Rejuvenation",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965518/hf_20260224_200006_2409d25b-6837-41b8-a6df-76610032d5ae_azzouf.jpg",
        description: "Premium structural support for a resilient, lasting, and high-status smile.",
        fullDescription: "This advanced rejuvenation suite utilizes aerospace-grade ceramic to provide ultimate durability while maintaining a pure, natural aesthetic. Ideal for those seeking a total foundation upgrade.",
        price: "Investment from £850",
        duration: "Bespoke 2-phase process",
        process: [
            { step: "01", title: "Precision Mapping", description: "3D intraoral scanning captures a perfect digital twin for your custom design." },
            { step: "02", title: "Foundation Styling", description: "Carefully prepping the base to ensure a secure, lifelong integration." },
            { step: "03", title: "Phase 1: Temporary Fit", description: "A high-quality bridge solution while your master ceramic is forged." },
            { step: "04", title: "Phase 2: Master Fitting", description: "Permanent integration of your custom ceramic for a flawless, enduring smile." }
        ],
        benefits: ["Maximum structural integrity", "Bespoke ceramic artistry", "Life-long investment", "Elite status aesthetics"],
        specialist: {
            name: "Dr. Marcus Thorne",
            role: "Structural Lead",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "gum-contouring": {
        slug: "gum-contouring",
        title: "Aesthetic Alignment",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965515/hf_20260224_194846_7d5d1758-c976-4d65-90ba-0576f56488d9_1_eqsuqz.png",
        description: "Symmetry is the key to beauty. Refine your frame for a balanced, high-impact smile.",
        fullDescription: "Our frame refinement package uses gentle laser precision to sculpt your gum line, revealing the true length and beauty of your teeth. It's the ultimate 'finishing touch' for a professional look.",
        price: "Refinement from £300",
        duration: "Quick-align session",
        process: [
            { step: "01", title: "Proportion Analysis", description: "Golden-ratio mapping to find your face's most harmonious alignment." },
            { step: "02", title: "Comfort Protocol", description: "Ensuring an effortless experience with our premium relaxation suite." },
            { step: "03", title: "Laser Refinement", description: "Rapid sculpting with advanced light-tech for a bloodless, clean finish." },
            { step: "04", title: "Visual Reveal", description: "Immediate symmetry check and home-care plan for lasting results." }
        ],
        benefits: ["Golden-ratio symmetry", "Effortless laser tech", "Instant facial balance", "Zero downtime refresh"],
        specialist: {
            name: "Dr. Sarah Jenkins",
            role: "Alignment Specialist",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "sedation-dentistry": {
        slug: "sedation-dentistry",
        title: "The Comfort Suite",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965515/hf_20260224_200121_a1138bff-2f8f-4cfe-8812-97ba600000a3_1_xvip2y.png",
        description: "Experience your transformation in a state of pure, effortless relaxation.",
        fullDescription: "Our signature Comfort Suite is designed for those who value a stress-free journey. Drift into a calm state and wake up to your new smile, with zero memory of the technical work.",
        price: "Peace of mind from £250",
        duration: "Session extension",
        process: [
            { step: "01", title: "Wellness Profile", description: "Brief consultation to tailor the relaxation level to your comfort zone." },
            { step: "02", title: "Relaxation Induction", description: "Gentle transition into a serene, twilight sleep state." },
            { step: "03", title: "Concierge Supervision", description: "Dedicated monitoring throughout your session for absolute safety." },
            { step: "04", title: "The Refresh Zone", description: "Gentle re-awakening in our private recovery lounge with refreshments." }
        ],
        benefits: ["Zero treatment anxiety", "Time compression effect", "Concierge-level care", "Effortless appointments"],
        specialist: {
            name: "Dr. James Wilson",
            role: "Experience Director",
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "preventive-care": {
        slug: "preventive-care",
        title: "Maintenance Suite",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965514/hf_20260224_194907_1b8f2485-20d1-44df-9100-699164d7dd9d_nf1esk.jpg",
        description: "Comprehensive maintenance plans to ensure your aesthetic investment lasts a lifetime.",
        fullDescription: "Our maintenance protocols combine advanced digital diagnostics with elite hygiene technology to preserve the foundation of your smile and prevent long-term depreciation.",
        price: "Maintenance from £120",
        duration: "45-minute wellness check",
        process: [
            { step: "01", title: "Digital Performance Review", description: "AI-powered screening to detect early micro-shifts in your smile's integrity." },
            { step: "02", title: "Structural Health Check", description: "Precision measurement of your smile's supporting frame." },
            { step: "03", title: "Elite Hygiene Session", description: "Professional airflow technology for a gentle, high-gloss refresh." },
            { step: "04", title: "Longevity Strategy", description: "A tailored preservation blueprint for your daily lifestyle." }
        ],
        benefits: ["Preserves high-value work", "Elite hygiene refresh", "Stain-free maintenance", "Long-term visual security"],
        specialist: {
            name: "Dr. Elena Rossi",
            role: "Preservation Director",
            image: "https://images.unsplash.com/photo-1559839734-2b71f1e59816?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "childrens-dentistry": {
        slug: "childrens-dentistry",
        title: "Early Smile Blueprint",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965514/hf_20260224_200042_5152638d-c2b7-4464-9970-36c186bebc2d_awwpxx.jpg",
        description: "Building the foundation for a life of confidence with gentle, positive early experiences.",
        fullDescription: "Our junior blueprint sessions are designed to create positive associations with care. We focus on education and early alignment screening to ensure a perfect smile from the very beginning.",
        price: "First session from £60",
        duration: "Playful 30-minute session",
        process: [
            { step: "01", title: "Tech Discovery", description: "Introducing young clients to our cinematic gadgets in a fun, zero-stress way." },
            { step: "02", title: "Growth Assessment", description: "A gentle mapping of development and early alignment potentials." },
            { step: "03", title: "Confidence Coaching", description: "Interactive sessions showing junior clients how to master their home care." },
            { step: "04", title: "The Success Badge", description: "Celebrating a milestone visit with rewards and a cinematic photo-op!" }
        ],
        benefits: ["Fear-free foundation", "Early growth tracking", "Positive habit creation", "Bespoke junior care"],
        specialist: {
            name: "Dr. Emily Chen",
            role: "Junior Care Director",
            image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=400&h=400&auto=format&fit=crop"
        }
    }
};
