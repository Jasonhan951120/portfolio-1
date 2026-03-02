import { motion } from "motion/react";
import { Heart, Sparkles, Award, Users, ArrowRight, Quote, CheckCircle2, Shield } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function WhatWeDoPage({ clinic }: { clinic: any }) {
    const journey = [
        {
            title: "The Emotional Discovery",
            desc: "Beyond X-rays, we listen. We understand your goals, your anxieties, and the future you envision for your smile.",
            icon: <Heart className="w-6 h-6" />,
            stat: "60min Consultation"
        },
        {
            title: "The Digital Canvas",
            desc: "Using AI and 3D mapping, we design your smile before we touch a single tooth. Precision meets artistic intuition.",
            icon: <Sparkles className="w-6 h-6" />,
            stat: "100% Digital Workflow"
        },
        {
            title: "Painless Transformation",
            desc: "Expert hands and pain-free technology. Whether it's one day or six months, the journey is curated for your comfort.",
            icon: <Award className="w-6 h-6" />,
            stat: "Anxiety-Free Care"
        },
        {
            title: "Lifetime Confidence",
            desc: "A smile that doesn't just look good—it functions perfectly. We stand by our work with long-term clinical guarantees.",
            icon: <Shield className="w-6 h-6" />,
            stat: "Lifetime Guarantee"
        }
    ];

    const situations = [
        { label: "Smile Makeover", desc: "Veneers, Whitening, Alignment", link: "/services" },
        { label: "Restorative Care", desc: "Implants, Crowns, Bridges", link: "/services" },
        { label: "Emergency Center", desc: "Same-Day Pain Relief", link: "/contact" }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar clinic={clinic} />

            {/* Vision Hero */}
            <section className="pt-40 pb-24 bg-primary text-white relative overflow-hidden">
                <div className="container mx-auto px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <span className="text-xs font-black uppercase tracking-[0.5em] text-accent-readable mb-8 block">Our Philosophy</span>
                        <h1 className="text-6xl md:text-[120px] font-display font-bold leading-[0.85] tracking-tighter uppercase italic mb-12">
                            Design for <br />
                            <span className="text-accent">Human</span> Smile.
                        </h1>
                        <p className="text-2xl text-white/60 font-medium leading-relaxed max-w-2xl">
                            We don't just treat teeth. We reconstruct confidence, restore health, and transform the way you present yourself to the world.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#fff,#fff_1px,transparent_1px,transparent_20px)]" />
            </section>

            {/* The "Why" Section */}
            <section className="py-32">
                <div className="container mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <h2 className="text-5xl md:text-7xl font-display font-bold text-black uppercase tracking-tighter leading-none">
                                Your Happiness <br />
                                <span className="text-primary italic">Is our Data point.</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <p className="text-6xl font-display font-bold text-primary">98%</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted mt-2">Enhanced Confidence</p>
                                </div>
                                <div>
                                    <p className="text-6xl font-display font-bold text-primary">15k+</p>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted mt-2">Smiles Reconstructed</p>
                                </div>
                            </div>
                            <p className="text-xl text-muted leading-relaxed font-medium">
                                "Our mission is simple: To provide the most scientific dentistry on the planet, delivered with a heart. Every patient who leaves our chair should feel not only healthier but truly happier."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                                    <Quote className="w-6 h-6 text-black fill-current" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Dr. Marcus Thorne, Clinical Director</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-surface rounded-[60px] overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200" alt="Clinic Life" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-primary/20" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-accent rounded-3xl p-8 flex flex-col justify-end shadow-2xl">
                                <p className="text-4xl font-display font-bold text-black">A+</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-black/60">Quality Audit Score</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Situation Based Care */}
            <section className="py-24 border-b border-black/5">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4">Immediate Solutions</h3>
                            <h2 className="text-4xl md:text-6xl font-display font-bold text-black uppercase tracking-tighter">Your Situation.</h2>
                        </div>
                        <Link to="/portfolio/dr-sarah-mitchell" className="text-sm font-bold uppercase tracking-widest border-b-2 border-accent pb-1 inline-flex items-center gap-2 hover:gap-4 transition-all">
                            View Clinical Case Gallery <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {situations.map((sit, i) => (
                            <Link key={i} to={sit.link} className="p-10 bg-white border border-black/15 rounded-[40px] hover:border-accent transition-all group">
                                <h4 className="text-2xl font-display font-bold text-black uppercase mb-2">{sit.label}</h4>
                                <p className="text-muted font-medium italic">{sit.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Journey */}
            <section className="py-32 bg-surface">
                <div className="container mx-auto px-8">
                    <div className="text-center mb-24">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-6">The Process</h3>
                        <h2 className="text-5xl md:text-8xl font-display font-bold text-black uppercase tracking-tighter">Your Transformation.</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {journey.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 rounded-[40px] shadow-sm hover:shadow-xl transition-all group border border-black/15 flex flex-col md:flex-row gap-10 items-start md:items-center"
                            >
                                <div className="w-20 h-20 rounded-[28px] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-black transition-all shrink-0 relative">
                                    <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-black text-white text-[10px] font-black flex items-center justify-center shadow-lg">0{i + 1}</span>
                                    {step.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <h4 className="text-2xl font-display font-bold text-black uppercase leading-none">{step.title}</h4>
                                        <span className="text-[9px] font-black uppercase text-accent bg-black px-3 py-1.5 rounded-full whitespace-nowrap w-fit">{step.stat}</span>
                                    </div>
                                    <p className="text-muted text-sm leading-relaxed font-medium">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32">
                <div className="container mx-auto px-8 max-w-5xl">
                    <div className="bg-primary rounded-[60px] p-24 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-display font-bold text-white mb-12 uppercase tracking-tighter leading-none italic">
                                Ready to <br />
                                <span className="text-accent">Be Happy?</span>
                            </h2>
                            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                                <Link to="/contact" className="btn-yellow text-lg">
                                    Start Your Journey
                                </Link>
                                <Link to="/specialists" className="text-white text-xs font-black uppercase tracking-[0.3em] border-b border-white/20 hover:border-accent transition-colors pb-1">
                                    Meet the Architects
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
