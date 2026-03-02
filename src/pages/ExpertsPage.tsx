import { motion } from "motion/react";
import { Sparkles, Users, ShieldCheck, Microscope, Heart, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

const experts = [
    {
        role: "Lead Dental Hygienist",
        name: "Emma Thompson",
        bio: "With a clinical focus on periodontal health and guided biofilm therapy, Emma has transformed the oral hygiene routines of over 5,000 patients. She specializes in painless deep cleaning using the latest Airflow technology.",
        expertise: ["Guided Biofilm Therapy", "Airflow Technology", "Periodontal Maintenance"],
        education: "BSc Dental Hygiene, University of Portsmouth"
    },
    {
        role: "Senior Patient Coordinator",
        name: "Michael Chen",
        bio: "Michael bridges the gap between clinical excellence and patient experience. He manages complex treatment timelines and financial coordination, ensuring that every patient's journey from their first scan to their final reveal is stress-free.",
        expertise: ["Treatment Planning", "Financial Coordination", "Digital Workflow"],
        education: "Healthcare Management, LSE"
    },
    {
        role: "Head Clinical Assistant",
        name: "Sophia Loren",
        bio: "Sophia oversees our surgical protocols and sterilization standards. With a background in oral surgery assistance, she ensures that every procedure at London Smile meets the highest medical standards for safety and precision.",
        expertise: ["Surgical Assistance", "Infection Control", "Digital Scanning"],
        education: "NEBDN National Diploma in Dental Nursing"
    }
];

const protocols = [
    {
        title: "Precision Diagnostics",
        desc: "We use 3D intraoral scanners to capture every detail of your smile without the discomfort of traditional molds.",
        icon: <Microscope className="w-5 h-5" />
    },
    {
        title: "Clinical Safety",
        desc: "Our cross-infection protocols exceed UK national standards, utilizing medical-grade sterilization for every tool.",
        icon: <ShieldCheck className="w-5 h-5" />
    },
    {
        title: "Patient Advocacy",
        desc: "You are never alone. Our coordinators are available 24/7 to answer post-surgery questions and manage care.",
        icon: <Heart className="w-5 h-5" />
    }
];

export default function ExpertsPage({ clinic }: { clinic: any }) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar clinic={clinic} />

            {/* Dynamic Header */}
            <section className="pt-40 pb-20 bg-primary text-white overflow-hidden relative">
                <div className="container mx-auto px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <div className="inline-flex items-center gap-3 mb-8">
                            <div className="w-12 h-[1px] bg-white/20" />
                            <span className="text-xs font-bold uppercase tracking-[0.4em] text-accent-readable">The Clinical Backbone</span>
                        </div>
                        <h1 className="text-6xl md:text-[100px] font-display font-bold leading-[0.85] mb-10 uppercase tracking-tighter">
                            Masters of <br />
                            <span className="text-accent underline decoration-white/10 underline-offset-8">Support.</span>
                        </h1>
                        <p className="text-xl text-white/60 font-medium leading-relaxed max-w-xl">
                            Our experts don't just assist; they lead their fields to ensure your experience at London Smile is clinical perfection.
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 skew-x-12 translate-x-1/2" />
            </section>

            {/* Enhanced Expert Cards */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-8 max-w-7xl">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {experts.map((expert, i) => (
                            <motion.div
                                key={expert.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="card group hover:border-black/20"
                            >
                                <div className="w-24 h-24 rounded-[30px] bg-primary flex items-center justify-center text-white font-display text-5xl font-bold mb-10 group-hover:bg-accent group-hover:text-black transition-all duration-700">
                                    {expert.name[0]}
                                </div>

                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">{expert.role}</p>
                                <h3 className="text-4xl font-display font-bold text-black uppercase tracking-tight mb-8 leading-none">
                                    {expert.name}
                                </h3>

                                <p className="text-muted font-medium text-sm leading-relaxed mb-10">
                                    {expert.bio}
                                </p>

                                <div className="space-y-6 pt-8 border-t border-black/5">
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3">Key Expertise</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {expert.expertise.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 bg-surface rounded-lg text-black">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1">Education</h4>
                                        <p className="text-xs font-bold text-black">{expert.education}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Clinical Protocols Section */}
            <section className="py-24 md:py-32 bg-surface">
                <div className="container mx-auto px-8">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-black uppercase tracking-tighter mb-6">
                            The London Smile <br /> <span className="text-primary italic underline decoration-black/5">Protocol.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        {protocols.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="text-center space-y-6"
                            >
                                <div className="w-16 h-16 rounded-full bg-white border border-black/5 shadow-lg flex items-center justify-center mx-auto text-primary">
                                    {p.icon}
                                </div>
                                <h4 className="text-xl font-display font-bold text-black uppercase">{p.title}</h4>
                                <p className="text-sm text-muted font-medium leading-relaxed max-w-xs mx-auto">
                                    {p.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 text-center">
                <div className="container mx-auto px-8 max-w-4xl">
                    <div className="card !bg-primary text-white !p-20 overflow-hidden relative">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-display font-bold mb-10 leading-[1.1]">
                                Experience care that is <br />
                                <span className="text-accent underline decoration-white/10 underline-offset-8">Scientifically Better.</span>
                            </h2>
                            <div className="flex justify-center">
                                <button className="btn-yellow flex items-center gap-3">
                                    Our Specialists <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-5 bg-[repeating-linear-gradient(45deg,#fff,#fff_10px,transparent_10px,transparent_20px)]" />
                    </div>
                </div>
            </section>
        </div>
    );
}
