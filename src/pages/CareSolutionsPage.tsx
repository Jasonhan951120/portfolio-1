import { motion } from "motion/react";
import { Search, ShieldAlert, Zap, Layers, Microscope, Layout, ArrowRight, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function CareSolutionsPage() {
    const solutions = [
        {
            title: "The Confidence Reconstruction",
            problem: "Missing or failed teeth causing bite issues and social anxiety.",
            idealFor: "Bone resorption, multiple missing teeth, unstable dentures.",
            path: ["CBCT 3D Mapping", "Bio-Implant Integration", "Final Aesthetic Load"],
            icon: <ShieldAlert className="w-8 h-8" />
        },
        {
            title: "Aesthetic Symmetry",
            problem: "Uneven, chipped, or aged enamel affecting the facial profile.",
            idealFor: "Enamel erosion, gaps, tooth discoloration.",
            path: ["Smile Design Simulation", "Artistic Veneer Crafting", "Bonding Refinement"],
            icon: <Zap className="w-8 h-8" />
        },
        {
            title: "Digital Alignment Mastery",
            problem: "Crooked teeth or bite misalignment causing pain and cleaning difficulty.",
            idealFor: "Crowding, spacing, bite corrections.",
            path: ["iTero 5D Scanning", "Invisalign AI Progression", "Virtual Care Monitoring"],
            icon: <Layout className="w-8 h-8" />
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Solutions Hero */}
            <section className="pt-40 pb-24 bg-primary text-white relative overflow-hidden">
                <div className="container mx-auto px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-xs font-black uppercase tracking-[0.4em] text-accent-readable mb-8 block underline decoration-accent/30 underline-offset-8">Care Pathways</span>
                        <h1 className="text-6xl md:text-[100px] font-display font-bold leading-[0.85] tracking-tighter uppercase mb-12 italic">
                            Clinical <br />
                            <span className="text-accent">Solutions.</span>
                        </h1>
                        <p className="text-xl text-white/60 font-medium max-w-2xl leading-relaxed">
                            Don't search for treatments. Find your solution. We map out integrated clinical pathways designed to solve complex dental challenges from the root cause.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent opacity-10" />
            </section>

            {/* Problem-Solution Matrix */}
            <section className="py-32">
                <div className="container mx-auto px-8">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {solutions.map((sol, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="p-12 bg-surface rounded-[60px] border border-black/15 hover:border-accent transition-all group"
                            >
                                <div className="w-20 h-20 rounded-[30px] bg-primary flex items-center justify-center text-white mb-10 shadow-xl shadow-primary/20 group-hover:bg-accent group-hover:text-black transition-colors">
                                    {sol.icon}
                                </div>
                                <h3 className="text-3xl font-display font-bold text-black uppercase mb-6 leading-none">{sol.title}</h3>

                                <div className="space-y-6 mb-12">
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-2 italic">The Challenge</p>
                                        <p className="text-lg font-bold text-black leading-snug">{sol.problem}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase text-muted tracking-widest mb-2 italic">Clinical Path</p>
                                        <div className="space-y-2">
                                            {sol.path.map((step, idx) => (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-4 h-4 text-accent-readable shrink-0" />
                                                    <span className="text-xs font-bold text-black/70">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Link to="/contact" className="w-full btn-dark !rounded-2xl flex items-center justify-center gap-3">
                                    Request Solution <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Intelligence Section */}
            <section className="py-32 bg-primary text-white overflow-hidden relative">
                <div className="container mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
                        <div className="space-y-12 lg:pr-32 relative z-20">
                            <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter leading-[0.85]">
                                Scaling <br />
                                <span className="text-accent italic">Intelligence.</span>
                            </h2>
                            <p className="text-xl text-white/50 font-medium leading-relaxed">
                                Our solutions aren't just based on experience—they are backed by heavy clinical data. From AI decay detection to robotic surgery guides, we use the most intelligent tools available in modern medicine.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <Microscope className="w-8 h-8 text-accent mb-4" />
                                    <h5 className="font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-2 text-white">Digital Accuracy</h5>
                                    <p className="text-[10px] text-white/40">0.01mm precision in all restorations.</p>
                                </div>
                                <div className="p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                    <Search className="w-8 h-8 text-accent mb-4" />
                                    <h5 className="font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-2 text-white">AI Diagnostics</h5>
                                    <p className="text-[10px] text-white/40">Early detection that saves 40% of future drilling.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="p-2 bg-white/10 rounded-[60px] backdrop-blur-3xl">
                                <div className="aspect-[4/5] bg-surface rounded-[55px] overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1629851759654-e74c810d79d1?q=80&w=800" alt="Tech" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:32px_32px]" />
            </section>

            {/* Anxiety Care Callout */}
            <section className="py-24 bg-surface/30">
                <div className="container mx-auto px-8">
                    <div className="max-w-5xl mx-auto rounded-[60px] bg-white p-12 md:p-20 border border-black/15 flex flex-col md:flex-row items-center gap-16">
                        <div className="w-32 h-32 rounded-full bg-accent flex items-center justify-center shrink-0 shadow-2xl shadow-accent/20">
                            <ShieldAlert className="w-12 h-12 text-black" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-[0.4em] text-primary mb-4">Fear Management</h4>
                            <h3 className="text-3xl font-display font-bold text-black uppercase mb-6 tracking-tight">Zero-Pain Protocols.</h3>
                            <p className="text-muted font-medium text-lg leading-relaxed">
                                We've addressed the #1 barrier to clinical health: Anxiety. From painless computerized anesthesia to sleep dentistry options, our system is designed for total sensory comfort.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Summary */}
            <section className="py-32">
                <div className="container mx-auto px-8 text-center max-w-4xl">
                    <h4 className="text-xs font-black uppercase tracking-[0.5em] text-primary mb-8">Personalized 1:1 Care</h4>
                    <p className="text-4xl md:text-6xl font-display font-medium text-black leading-tight tracking-tighter italics mb-12">
                        "Your smile is biometric. Your solution should be <span className="text-primary underline decoration-accent underline-offset-8">exclusive.</span>"
                    </p>
                    <Link to="/services" className="text-muted text-sm font-bold uppercase tracking-widest hover:text-black transition-colors border-b border-black/10 pb-1">
                        View Traditional Service Menu
                    </Link>
                </div>
            </section>
        </div>
    );
}
