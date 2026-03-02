import { motion } from "motion/react";
import { ArrowUpRight, GraduationCap, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const specialists = [
    {
        name: "Dr. Sarah Mitchell",
        slug: "dr-sarah-mitchell",
        role: "Lead Cosmetic Dentist",
        image: "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=800",
        bio: "Specializing in smile makeovers and advanced porcelain veneers with over 15 years of experience.",
        education: "DDS, Advanced Cosmetic Dentistry - Royal College of London",
        specialty: "Aesthetic Restoration"
    },
    {
        name: "Dr. Marcus Thorne",
        slug: "dr-marcus-thorne",
        role: "Implant Surgeon",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
        bio: "Renowned for precision implantology and restorative surgery using the latest digital workflows.",
        education: "DDS, Diploma in Implant Dentistry",
        specialty: "Oral Rehabilitation"
    },
    {
        name: "Dr. Elena Vance",
        slug: "dr-elena-vance",
        role: "Aesthetic Specialist",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
        bio: "Expert in facial aesthetics and restorative bonding, dedicated to natural-looking transformations.",
        education: "BDS, Advanced Aesthetics Specialist",
        specialty: "Facial Aesthetics"
    }
];

export default function SpecialistsPage({ clinic }: { clinic: any }) {
    return (
        <div className="min-h-screen bg-white">
            <Navbar clinic={clinic} />

            {/* Header Section */}
            <section className="pt-40 pb-20 bg-white overflow-hidden relative border-b border-black/5">
                <div className="container mx-auto px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="w-12 h-[1px] bg-black/10" />
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">The Specialists</span>
                            <div className="w-12 h-[1px] bg-black/10" />
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-8 text-black uppercase tracking-tighter">
                            Clinical <br />
                            <span className="text-primary underline decoration-black/10 underline-offset-8">Excellence.</span>
                        </h1>
                        <p className="text-xl text-muted max-w-2xl mx-auto font-medium leading-relaxed">
                            Our world-class clinicians combine decades of experience with a passion for transformative aesthetic dentistry.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Specialists List */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-8 max-w-6xl">
                    <div className="space-y-32">
                        {specialists.map((person, i) => (
                            <motion.div
                                key={person.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-16 md:gap-24 items-center`}
                            >
                                {/* Image */}
                                <div className="w-full md:w-1/2">
                                    <div className="aspect-[4/5] overflow-hidden rounded-[50px] shadow-2xl border border-black/5 relative group">
                                        <img
                                            src={person.image}
                                            alt={person.name}
                                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="w-full md:w-1/2">
                                    <div className="mb-8">
                                        <p className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">
                                            {person.role}
                                        </p>
                                        <h2 className="text-4xl md:text-6xl font-display font-bold text-black uppercase tracking-tight mb-6">
                                            {person.name}
                                        </h2>
                                        <p className="text-lg text-muted font-medium mb-10 leading-relaxed italic">
                                            "{person.bio}"
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center shrink-0">
                                                <GraduationCap className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Education</h4>
                                                <p className="text-sm font-bold text-black uppercase tracking-tight">{person.education}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-surface flex items-center justify-center shrink-0">
                                                <Award className="w-5 h-5 text-black" />
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Key Specialty</h4>
                                                <p className="text-sm font-bold text-black uppercase tracking-tight">{person.specialty}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/portfolio/${person.slug}`}
                                        className="mt-12 btn-outline flex items-center gap-3 w-fit"
                                    >
                                        View Portfolio <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="bg-primary py-32 text-center overflow-hidden relative">
                <div className="container mx-auto px-8 relative z-10">
                    <Heart className="w-12 h-12 text-accent mx-auto mb-8 animate-pulse" />
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-10 leading-tight">
                        Trusted by Doctors. <br />
                        <span className="text-accent underline decoration-white/10 underline-offset-8 uppercase">Loved by Patients.</span>
                    </h2>
                    <div className="flex justify-center">
                        <button className="btn-yellow">
                            Consult Our Team
                        </button>
                    </div>
                </div>
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
            </section>
        </div>
    );
}
