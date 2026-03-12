import { motion } from "motion/react";
import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, Play, ShieldCheck, Microscope, Zap, Star, Layout, CheckCircle2, Award, Camera, Waves } from "lucide-react";
import Navbar from "../components/Navbar";
import BeforeAfterSlider from "../components/BeforeAfterSlider";

const portfolioData = {
    "dr-sarah-mitchell": {
        doctor: "Dr. Sarah Mitchell",
        tagline: "The Architect of Veneers",
        role: "Lead Cosmetic Dentist",
        signature: "S. Mitchell, DDS",
        bestCase: {
            title: "Artistic Smile Reconstruction",
            story: "This client presented with severe enamel erosion and uneven gum lines. My approach was a combination of laser gum contouring and 10 master-crafted porcelain veneers to create a symmetrical, light-reflective smile that looks completely biological.",
            stats: { primary: "Porcelain Veneers", complexity: "High Symmetery", visits: "3 Appointments" },
            caseDetails: [
                { label: "Client Concern", value: "Aged appearance and yellowed enamel." },
                { label: "Clinical Method", value: "Minimal-prep lithium disilicate veneers." },
                { label: "Final Outcome", value: "10-year guarantee on structural integrity." }
            ],
            before: "https://images.unsplash.com/photo-1593059276181-7928e442886f?q=80&w=800",
            after: "https://images.unsplash.com/photo-1593059276181-7928e442886f?q=80&w=800&auto=format&fit=crop",
        },
        techProof: [
            { title: "Digital Wax-up", desc: "We designed the smile in 3D before a single tooth was touched.", icon: <Layout className="w-5 h-5" /> },
            { title: "HD Photography", desc: "Every angle analyzed to ensure perfect light reflection.", icon: <Camera className="w-5 h-5" /> }
        ]
    },
    "dr-marcus-thorne": {
        doctor: "Dr. Marcus Thorne",
        tagline: "The Bio-Surgery Pioneer",
        role: "Implant Surgeon",
        signature: "M. Thorne, MSc",
        bestCase: {
            title: "Guided Implant Integration",
            story: "For this multi-unit replacement, we used stackable surgical guides. This allowed us to place three implants with extreme precision in a single session, significantly reducing healing time and ensuring perfect prosthetic alignment.",
            stats: { primary: "Guided Bio-Implant", complexity: "Surgical Precision", visits: "2 Appointments" },
            caseDetails: [
                { label: "Client Concern", value: "Missing teeth and bone resorption." },
                { label: "Clinical Method", value: "CBCT-guided flapless surgery." },
                { label: "Final Outcome", value: "Lifetime warranty on implant stability." }
            ],
            before: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800",
            after: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=800&auto=format&fit=crop",
        },
        techProof: [
            { title: "CBCT 3D Mapping", desc: "High-resolution bone analysis for safe placement.", icon: <Microscope className="w-5 h-5" /> },
            { title: "Digital Guides", desc: "3D printed guides to eliminate surgical error.", icon: <ShieldCheck className="w-5 h-5" /> }
        ]
    },
    "dr-elena-vance": {
        doctor: "Dr. Elena Vance",
        tagline: "The Master of Harmony",
        role: "Aesthetic Specialist",
        signature: "E. Vance, BDS",
        bestCase: {
            title: "Composite Harmony Reveal",
            story: "Instead of aggressive drilling, we opted for hand-sculpted composite bonding. By meticulously layering different shades of resin, we closed gaps and lengthened teeth to create a youthful, vibrant smile in just one afternoon session.",
            stats: { primary: "Aesthetic Bonding", complexity: "Artistic Layering", visits: "1 Afternoon" },
            caseDetails: [
                { label: "Client Concern", value: "Gaps between teeth and short appearance." },
                { label: "Clinical Method", value: "Biomimetic stratification bonding." },
                { label: "Final Outcome", value: "Instant confidence boost with zero pain." }
            ],
            before: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800",
            after: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=800&auto=format&fit=crop",
        },
        techProof: [
            { title: "Shade Mapping", desc: "Using polarized light to match natural enamel perfectly.", icon: <Waves className="w-5 h-5" /> },
            { title: "Nano-Polishing", desc: "High-gloss finish that resists long-term staining.", icon: <Star className="w-5 h-5" /> }
        ]
    }
};

export default function PortfolioPage({ clinic }: { clinic: any }) {
    const { id } = useParams();
    const data = portfolioData[id as keyof typeof portfolioData];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!data) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center uppercase">
            <Navbar clinic={clinic} />
            <h1 className="text-4xl font-display font-bold text-black mb-4">Case file not found</h1>
            <Link to="/specialists" className="btn-dark">Back to Registry</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Navbar clinic={clinic} />

            {/* Dynamic Hero */}
            <section className="pt-40 pb-20 bg-slate-50 text-slate-900 relative overflow-hidden">
                <div className="container mx-auto px-8 relative z-10">
                    <Link to="/specialists" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-12 uppercase text-[10px] font-black tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Return to Clinical Team
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-20 items-end">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Case Study No. 4022</span>
                                <div className="w-12 h-[1px] bg-slate-200" />
                            </div>
                            <h1 className="text-6xl md:text-[100px] font-display font-bold leading-[0.85] uppercase tracking-tighter mb-10 italic">
                                {data.tagline.split(' ').map((word, i) => (
                                    <span key={i} className={i === 2 ? "text-emerald-500" : ""}>{word} </span>
                                ))}
                            </h1>
                             <p className="text-2xl text-slate-400 font-medium font-sans">
                                Clinical Mastery by <span className="text-slate-900 underline decoration-emerald-500/50 underline-offset-8">{data.doctor}</span>
                            </p>
                        </motion.div>
                    </div>
                </div>
                {/* Background Texture */}
                 <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#000,#000_1px,transparent_1px,transparent_20px)]" />
            </section>

            {/* Main Evidence Section */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-12 gap-24 items-start">

                        {/* Left: Interactive Proof */}
                        <div className="lg:col-span-7">
                            <div className="relative">
                                <BeforeAfterSlider
                                    beforeImage={data.bestCase.before}
                                    afterImage={data.bestCase.after}
                                />
                                 <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl" />
                            </div>

                            <div className="mt-16 grid grid-cols-3 gap-8">
                                {Object.entries(data.bestCase.stats).map(([k, v]) => (
                                    <div key={k} className="text-center">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted mb-2">{k}</p>
                                        <p className="text-lg font-display font-bold text-black uppercase">{v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Storytelling & Facts */}
                        <div className="lg:col-span-5 space-y-16">
                            <div className="space-y-8">
                                <h2 className="text-5xl font-display font-bold text-black uppercase tracking-tighter leading-none">
                                    The Vision.
                                </h2>
                                <p className="text-xl text-muted font-medium leading-relaxed">
                                    {data.bestCase.story}
                                </p>

                                {/* Play Button */}
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-center text-emerald-500 scale-90 group-hover:scale-100 transition-transform">
                                        <Play className="w-6 h-6 fill-current" />
                                    </div>
                                </div>

                                {/* Top Badges */}
                                <div className="absolute top-8 left-8">
                                    <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest rounded-md animate-pulse">Live Reveal</span>
                                </div>
                            </div>
                            <p className="mt-6 text-center text-[10px] font-black text-muted uppercase tracking-[0.4em]">9:16 Clinical Diary</p>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="space-y-12 max-w-xl">
                             <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                                <Waves className="w-6 h-6 animate-pulse" />
                            </div>
                            <blockquote className="text-4xl md:text-6xl font-display font-medium text-slate-900 leading-tight tracking-tighter italic">
                                "The precision was <span className="text-emerald-500 underline decoration-slate-200 underline-offset-8">absolute.</span> I felt like my smile was being hand-crafted."
                            </blockquote>
                            <div className="pt-8 border-t border-black/5 flex items-center gap-6">
                                <div>
                                    <p className="text-2xl font-display font-bold text-black uppercase">Verified Client</p>
                                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-1 italic">London Smile Elite Member</p>
                                </div>
                                <div className="w-[1px] h-12 bg-black/10" />
                                 <div className="flex gap-2">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Results Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Action Hub */}
            <section className="py-32">
                <div className="container mx-auto px-8 max-w-5xl">
                     <div className="bg-slate-900 rounded-[60px] p-20 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-display font-bold text-white mb-12 uppercase tracking-tighter leading-[0.85]">
                                Start your <br />
                                <span className="text-emerald-400 italic">Success</span> Story.
                            </h2>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                                 <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-transform hover:scale-105 active:scale-95 shadow-xl">
                                    Consult with {data.doctor.split(' ')[1]}
                                </button>
                                <Link to="/contact" className="text-white/60 text-sm font-bold uppercase tracking-widest border-b border-white/20 hover:border-emerald-400 hover:text-white transition-colors pb-1">
                                    Explore Treatment Finance
                                </Link>
                            </div>
                        </div>
                        {/* Abstract BG */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/5 transition-colors" />
                    </div>
                </div>
            </section>
        </div>
    );
}
