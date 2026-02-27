import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Sparkles, ShieldCheck, Microscope, ArrowRight, Star, X, Check, CheckCircle2, Phone, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const treatments = [
    {
        id: "invisalign",
        title: "Invisalign",
        tagline: "The Future of Orthodontics",
        description: "The world's most advanced clear aligner system, custom-made for your perfect smile without the need for brackets or wires.",
        icons: <Sparkles className="w-6 h-6" />,
        features: ["Virtual 3D Plan", "Removable & Discreet", "Predictable Results"],
        procedure: [
            { step: "Discovery Scan", detail: "Using iTero 5D scanners, we create a 3D digital model of your teeth in minutes—no messy impressions." },
            { step: "ClinCheck Plan", detail: "Dr. Sarah Mitchell maps out your custom movement plan, showing you a digital preview of your final smile." },
            { step: "Aligned Care", detail: "Change your custom aligners every 1-2 weeks. We monitor your progress via virtual check-ins." }
        ],
        pricing: "From £104/month (Interest-free financing available)",
        comparison: [
            { feature: "Visits", us: "4-6 visits + Virtual check-ins", them: "Up to 20 trips to the office" },
            { feature: "Duration", us: "6-8 months average", them: "18-24 months" },
            { feature: "Technology", us: "Digital AI Impressions", them: "Gooey physical molds" },
            { feature: "Expertise", us: "Invisalign Diamond Apex Providers", them: "Low case volume dentists" }
        ],
        stats: "1000+ Smiles Transformed"
    },
    {
        id: "whitening",
        title: "Teeth Whitening",
        tagline: "Medical-Grade Radiance",
        description: "Our bespoke whitening protocols combine in-clinic power sessions with precision-fitted take-home maintenance for guaranteed results.",
        icons: <Star className="w-6 h-6" />,
        features: ["Guaranteed Result", "No Sensitivity", "Home Care Included"],
        procedure: [
            { step: "Enamel Analysis", detail: "We assess your current shade and tooth sensitivity levels to curate the perfect chemical concentration." },
            { step: "The Power Session", detail: "A 60-minute activation session in-clinic using advanced laser-light technology for 8 shades lift." },
            { step: "Maintenance", detail: "Custom precision-fit trays are fabricated for you to lock in the brightness at home." }
        ],
        pricing: "Full Kit £450 (Including In-surgery session)",
        comparison: [
            { feature: "Safety", us: "Medically supervised barrier protection", them: "Irritating over-the-counter strips" },
            { feature: "Result", us: "Guaranteed 8 shades lighter", them: "Random and uneven results" },
            { feature: "Sensitivity", us: "Desensitizing agents included", them: "Damaging high-acid formulas" }
        ],
        stats: "100% Satisfaction Rate"
    },
    {
        id: "bonding",
        title: "Composite Bonding",
        tagline: "Artistry in One Visit",
        description: "Seamlessly repair chips, gaps, or stains with our high-end aesthetic bonding—no drilling or injections required.",
        icons: <Microscope className="w-6 h-6" />,
        features: ["One Visit", "No Drilling", "Natural Finish"],
        procedure: [
            { step: "Artistic Preview", detail: "We 'mock-up' the shape directly on your teeth so you can see the results before we start." },
            { step: "Precision Sculpting", detail: "Layers of medical-grade resin are artistically applied and cured with high-intensity light." },
            { step: "Diamond Polishing", detail: "We use a multi-step polishing system to give your bonding the same luster as natural enamel." }
        ],
        pricing: "From £350 per tooth",
        comparison: [
            { feature: "Time", us: "Same-day transformation", them: "Multiple appointments" },
            { feature: "Comfort", us: "Zero drilling, zero pain", them: "Often requires anesthesia" },
            { feature: "Finish", us: "Hand-sculpted by aesthetic specialists", them: "Bulky, opaque resin finishes" }
        ],
        stats: "Same-Day Results"
    },
    {
        id: "implants",
        title: "Dental Implants",
        tagline: "The Gold Standard",
        description: "Replace missing teeth forever with titanium implants that look, feel, and function exactly like your natural biological teeth.",
        icons: <ShieldCheck className="w-6 h-6" />,
        features: ["Lifetime Solution", "Bone Preserving", "3D Guided Surgery"],
        procedure: [
            { step: "CBCT Mapping", detail: "We perform a 3D bone density analysis to find the optimal surgical site with sub-millimeter precision." },
            { step: "Guided Placement", detail: "Using 3D-printed surgical guides, the implant is placed in a quick, minimally-invasive 20-minute session." },
            { step: "Final Load", detail: "After integration, a custom-shaded porcelain crown is attached, restoring 100% of your bite force." }
        ],
        pricing: "From £2,500 (Financing available)",
        comparison: [
            { feature: "Longevity", us: "Lifetime structural guarantee", them: "Bridges/Dentures replaced every 5-7 years" },
            { feature: "Precision", us: "Robotic/3D Digital Guidance", them: "Free-hand' visual placement" },
            { feature: "Recovery", us: "Minimally invasive keyhole surgery", them: "Traditional large-incision surgery" }
        ],
        stats: "99% Success Rate"
    },
    {
        id: "veneers",
        title: "Porcelain Veneers",
        tagline: "Ultimate Smile Design",
        description: "Custom-crafted, ultra-thin porcelain shells that provide a total smile transformation with unmatched durability and stain resistance.",
        icons: <Award className="w-6 h-6" />,
        features: ["Stain Resistant", "Extreme Longevity", "Bespoke Design"],
        procedure: [
            { step: "Design Phase", detail: "We design your new smile in 3D, analyzing your facial symmetry and natural lip movement." },
            { step: "Trial Smile", detail: "You 'test drive' your new smile with temporary veneers to ensure you love the shape and color." },
            { step: "Hand Crafting", detail: "Our master ceramists hand-layer each veneer to mimic the light reflection of natural enamel." }
        ],
        pricing: "From £850 per tooth",
        comparison: [
            { feature: "Aesthetics", us: "Multi-layered hand-crafted porcelain", them: "Flat, monochromatic machine-milled teeth" },
            { feature: "Preparation", us: "Minimal-prep techniques", them: "Traditional heavy drilling" },
            { feature: "Longevity", us: "15-20 years clinical lifespan", them: "5-10 years with standard dental labs" }
        ],
        stats: "Premium Aesthetic Choice"
    },
    {
        id: "general",
        title: "General Dentistry",
        tagline: "Health First Protocols",
        description: "From comprehensive 21-point checkups to emergency care, we maintain the foundation of your oral health with no-pain technology.",
        icons: <Check className="w-6 h-6" />,
        features: ["AirFlow Cleaning", "Early Diagnostics", "Emergency Care"],
        procedure: [
            { step: "Clinical Data", detail: "We use intra-oral cameras and AI decay detection to find issues long before they require major work." },
            { step: "AirFlow Tech", detail: "A warm water jet and fine powder system that removes 100% of stains and biofilm with no scraping." },
            { step: "Action Plan", detail: "You receive a digital health report and a clear, tiered plan to maintain your smile for life." }
        ],
        pricing: "Checkups from £95",
        comparison: [
            { feature: "Cleaning", us: "Pain-free AirFlow Spa technology", them: "Traditional sharp metal scraping" },
            { feature: "Diagnostics", us: "AI-assisted X-ray analysis", them: "Visual check only" },
            { feature: "Service", us: "Same-day emergency appointments", them: "Weeks-long waiting lists" }
        ],
        stats: "Holistic Oral Health"
    }
];

export default function ServicesPage() {
    const [selectedService, setSelectedService] = useState<typeof treatments[0] | null>(null);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Services Header */}
            <section className="pt-40 pb-20 bg-primary text-white overflow-hidden relative">
                <div className="container mx-auto px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight mb-8">
                            Expert <br />
                            <span className="text-accent underline decoration-white/10 underline-offset-8">Treatments.</span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl font-medium leading-relaxed">
                            Experience clinical excellence combined with aesthetic artistry. Select a treatment below to view full procedural details.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Treatments Cards */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-8 max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {treatments.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card group hover:border-black/20"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-black transition-colors duration-500">
                                        {item.icons}
                                    </div>
                                    <span className="text-[9px] font-black uppercase text-accent bg-black px-3 py-1.5 rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">{item.stats}</span>
                                </div>

                                <h3 className="text-3xl font-display font-bold mb-4 text-black uppercase tracking-tight">{item.title}</h3>
                                <p className="text-muted font-medium mb-8 leading-relaxed min-h-[5rem]">
                                    {item.description}
                                </p>

                                <button
                                    onClick={() => setSelectedService(item)}
                                    className="bg-black text-white w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black/90 active:scale-95 transition-all"
                                >
                                    View Detail <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison & Detail Overlay */}
            <AnimatePresence>
                {selectedService && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 40 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 40 }}
                            className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[40px] shadow-2xl relative overflow-y-auto"
                        >
                            {/* Top Bar */}
                            <div className="sticky top-0 right-0 left-0 bg-white/90 backdrop-blur-md p-6 flex justify-between items-center z-10 border-b border-black/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-black">
                                        {selectedService.icons}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-display font-bold text-black uppercase">{selectedService.title} Details</h2>
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">{selectedService.tagline}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="w-10 h-10 rounded-full bg-surface flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-8 md:p-16">
                                <div className="grid lg:grid-cols-12 gap-16">
                                    {/* Left Column: Procedure & Info */}
                                    <div className="lg:col-span-7 space-y-16">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-10 underline decoration-black/10 underline-offset-8">Clinical Procedure</h4>
                                            <div className="space-y-10">
                                                {selectedService.procedure.map((p, i) => (
                                                    <div key={i} className="flex gap-8 group">
                                                        <span className="text-4xl font-display font-light text-black/10 group-hover:text-accent transition-colors">0{i + 1}</span>
                                                        <div>
                                                            <h5 className="text-xl font-bold text-black uppercase mb-2 tracking-tight">{p.step}</h5>
                                                            <p className="text-muted text-sm leading-relaxed font-medium">{p.detail}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="card !bg-surface/50 border-none p-10 flex flex-col md:flex-row items-center gap-10">
                                            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shrink-0">
                                                <CheckCircle2 className="w-8 h-8 text-black" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-widest text-black mb-2 italic">Investment</h4>
                                                <p className="text-2xl font-display font-bold text-black">{selectedService.pricing}</p>
                                                <p className="text-xs text-muted font-bold mt-2 uppercase tracking-widest">Pricing subject to clinical assessment</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Comparison Table */}
                                    <div className="lg:col-span-5">
                                        <div className="rounded-[40px] overflow-hidden border border-black/5 shadow-xl">
                                            <div className="bg-primary p-6 text-center">
                                                <div className="inline-flex items-center gap-3 mb-8">
                                                    <div className="w-12 h-[1px] bg-white/20" />
                                                    <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent-readable">The Clinical Backbone</span>
                                                </div>
                                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">London Smile vs Others</p>
                                            </div>
                                            <div className="divide-y divide-black/5">
                                                {selectedService.comparison.map((row, i) => (
                                                    <div key={i} className="grid grid-cols-2 divide-x divide-black/5">
                                                        <div className="p-6 bg-white">
                                                            <p className="text-[10px] font-black uppercase text-black mb-2">{row.feature} at London Smile</p>
                                                            <p className="text-sm font-bold text-black leading-tight tracking-tight uppercase">{row.us}</p>
                                                        </div>
                                                        <div className="p-6 bg-surface/50">
                                                            <p className="text-[10px] font-black uppercase text-muted mb-2">{row.feature} Elsewhere</p>
                                                            <p className="text-sm font-medium text-muted leading-tight tracking-normal">{row.them}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-12 space-y-4">
                                            <button className="btn-yellow w-full !py-6 text-lg">
                                                Book Consultation
                                            </button>
                                            <p className="text-center text-[10px] font-black text-muted uppercase tracking-[0.3em]">No-obligation clinical assessment</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Shared CTA */}
            <section className="pb-32">
                <div className="container mx-auto px-8">
                    <div className="bg-black rounded-[50px] p-12 md:p-24 text-center overflow-hidden relative">
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 relative z-10 leading-tight">
                            A bespoke plan <br />
                            <span className="text-accent underline decoration-white/10 underline-offset-8">For every smile.</span>
                        </h2>
                        <div className="flex justify-center relative z-10">
                            <Link to="/specialists" className="btn-yellow">
                                Meet the Team
                            </Link>
                        </div>
                        {/* Background Accent */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
                    </div>
                </div>
            </section>
        </div>
    );
}
