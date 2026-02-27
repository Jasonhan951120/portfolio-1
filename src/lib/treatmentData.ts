export interface Treatment {
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

export const TREATMENTS: Record<string, Treatment> = {
    "composite-bonding": {
        slug: "composite-bonding",
        title: "Composite Bonding",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965553/hf_20260224_194822_dbee3087-65d3-4e06-8769-5ae9acd1a02d_knmad9.jpg",
        description: "Enhance your smile in just one visit with minimally invasive cosmetic bonding.",
        fullDescription: "Composite bonding is a popular cosmetic dental procedure that involves applying a tooth-colored resin material to your teeth to improve their appearance. It's an excellent, cost-effective way to repair chips, gaps, or uneven edges in a single visit.",
        price: "From £150 per tooth",
        duration: "1 hour per session",
        process: [
            { step: "01", title: "Shade Matching", description: "Choice of resin shade that perfectly matches your natural teeth." },
            { step: "02", title: "Preparation", description: "The tooth surface is slightly roughened and a conditioning liquid is applied." },
            { step: "03", title: "Application", description: "The resin is applied, shaped, and smoothed to the desired look." },
            { step: "04", title: "Curing & Polishing", description: "A special light is used to harden the resin, followed by professional polishing." }
        ],
        benefits: ["One-visit transformation", "Minimally invasive", "Natural-looking results", "Repair chips & gaps"],
        specialist: {
            name: "Dr. Elena Rossi",
            role: "Cosmetic Dentist",
            image: "https://images.unsplash.com/photo-1559839734-2b71f1e59816?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "dental-crowns": {
        slug: "dental-crowns",
        title: "Dental Crowns",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965518/hf_20260224_200006_2409d25b-6837-41b8-a6df-76610032d5ae_azzouf.jpg",
        description: "Restore strength and appearance to damaged teeth with custom-made crowns.",
        fullDescription: "A dental crown is a custom-made cap that covers a damaged or weakened tooth, restoring its shape, size, strength, and appearance. At London Smile, we use premium ceramic materials that mimic the light-reflecting properties of natural enamel.",
        price: "From £850 per crown",
        duration: "2 appointments",
        process: [
            { step: "01", title: "Digital Impression", description: "We use 3D intraoral scanners to capture a precise model of your teeth." },
            { step: "02", title: "Preparation", description: "The tooth is carefully shaped to accommodate the crown securely." },
            { step: "03", title: "Temporary Crown", description: "A temporary crown is fitted while your custom permanent one is crafted." },
            { step: "04", title: "Final Fit", description: "Your custom ceramic crown is bonded permanently for a perfect match." }
        ],
        benefits: ["Structural restoration", "Enamel-like aesthetics", "Long-lasting durability", "Protects weakened teeth"],
        specialist: {
            name: "Dr. Marcus Thorne",
            role: "Prosthodontist Specialist",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "gum-contouring": {
        slug: "gum-contouring",
        title: "Gum Contouring",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965515/hf_20260224_194846_7d5d1758-c976-4d65-90ba-0576f56488d9_1_eqsuqz.png",
        description: "Reshape and refine your gum line for a more balanced and pleasing smile.",
        fullDescription: "Gum contouring (or gum reshaping) is a cosmetic procedure used to refine and level an uneven gum line. It's perfect for patients with a 'gummy smile' or those who want their teeth to appear longer and more symmetrical.",
        price: "From £300",
        duration: "45-90 minutes",
        process: [
            { step: "01", title: "Aesthetic Planning", description: "We map out the ideal gum line that complements your facial features." },
            { step: "02", title: "Local Anaesthesia", description: "Ensuring your complete comfort with precise numbing." },
            { step: "03", title: "Laser Contouring", description: "Using advanced lasers to carefully remove excess gum tissue with minimal bleeding." },
            { step: "04", title: "Immediate Recovery", description: "The laser promotes instant healing, with very little downtime required." }
        ],
        benefits: ["Balanced gum-to-tooth ratio", "Painless laser technology", "Instant results", "Boosts smile confidence"],
        specialist: {
            name: "Dr. Sarah Jenkins",
            role: "Periodontist",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "sedation-dentistry": {
        slug: "sedation-dentistry",
        title: "Sedation Dentistry",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965515/hf_20260224_200121_a1138bff-2f8f-4cfe-8812-97ba600000a3_1_xvip2y.png",
        description: "Relax throughout your treatment with safe and comfortable sedation options.",
        fullDescription: "Sedation dentistry allows patients with dental anxiety to undergo necessary treatments in a state of total relaxation. Whether it's IV sedation or oral conscious sedation, we prioritize your peace of mind and comfort.",
        price: "From £250 (Add-on)",
        duration: "Dependent on treatment",
        process: [
            { step: "01", title: "Health Screening", description: "A thorough review of your medical history to ensure safety." },
            { step: "02", title: "Sedation Level", description: "Choosing between mild relaxation or deeper twilight sleep (IV)." },
            { step: "03", title: "Expert Monitoring", description: "Continuous monitoring of vital signs throughout your entire session." },
            { step: "04", title: "Comfortable Wake-up", description: "Gentle recovery in our dedicated quiet room after the procedure." }
        ],
        benefits: ["Anxiety-free treatments", "Reduced gag reflex", "Painless experience", "Time passes quickly"],
        specialist: {
            name: "Dr. James Wilson",
            role: "Sedation Specialist",
            image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "preventive-care": {
        slug: "preventive-care",
        title: "Preventive Dental Care",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965514/hf_20260224_194907_1b8f2485-20d1-44df-9100-699164d7dd9d_nf1esk.jpg",
        description: "Comprehensive check-ups and hygiene treatments to keep your smile healthy.",
        fullDescription: "Prevention is the foundation of modern dentistry. Our comprehensive care plans include advanced diagnostics, professional oral hygiene, and personalized advice to ensure your teeth last a lifetime.",
        price: "From £120",
        duration: "45 minutes",
        process: [
            { step: "01", title: "Diagnostic Review", description: "Digital X-rays and AI-powered screening for early detection." },
            { step: "02", title: "Gum Health Check", description: "Precise measurement of periodontal health to prevent gum disease." },
            { step: "03", title: "Expert Hygiene", description: "Professional 'Scale & Polish' using gentle Airflow technology." },
            { step: "04", title: "Prevention Plan", description: "A tailored long-term strategy for your home care routine." }
        ],
        benefits: ["Prevention over cure", "Fresh breath", "Stain removal", "Early problem detection"],
        specialist: {
            name: "Dr. Elena Rossi",
            role: "General & Cosmetic Dentist",
            image: "https://images.unsplash.com/photo-1559839734-2b71f1e59816?q=80&w=400&h=400&auto=format&fit=crop"
        }
    },
    "childrens-dentistry": {
        slug: "childrens-dentistry",
        title: "Children’s Dentistry",
        heroImage: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965514/hf_20260224_200042_5152638d-c2b7-4464-9970-36c186bebc2d_awwpxx.jpg",
        description: "Gentle, friendly dental care tailored specifically for children in a calm environment.",
        fullDescription: "We believe children should enjoy visiting the dentist. Our specialized pediatric care focuses on education, preventative treatments, and creating positive associations with oral health from an early age.",
        price: "From £60",
        duration: "30 minutes",
        process: [
            { step: "01", title: "Playful Introduction", description: "Getting the child comfortable with our 'cool' technology and gadgets." },
            { step: "02", title: "Gentle Examination", description: "A stress-free check of dental development and bite alignment." },
            { step: "03", title: "Educational Fun", description: "Showing kids how to brush like pros with interactive tools." },
            { step: "04", title: "Positive Reward", description: "A sticker and a smile to celebrate a successful visit!" }
        ],
        benefits: ["Fear-free atmosphere", "Expert pediatric guidance", "Early orthodontic screening", "Preventative sealant coatings"],
        specialist: {
            name: "Dr. Emily Chen",
            role: "Pediatric Specialist",
            image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=400&h=400&auto=format&fit=crop"
        }
    }
};
