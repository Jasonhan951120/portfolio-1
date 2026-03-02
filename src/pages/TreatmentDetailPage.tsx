import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Clock, CreditCard, ShieldCheck, Sparkles, User, CheckCircle2 } from "lucide-react";
import { TREATMENTS } from "../lib/treatmentData";
import Navbar from "../components/Navbar";
import { useEffect } from "react";

export default function TreatmentDetailPage({ clinic }: { clinic: any }) {
    const { slug } = useParams();
    const navigate = useNavigate();
    const treatment = slug ? TREATMENTS[slug] : null;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!treatment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface">
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold mb-4">Treatment Not Found</h1>
                    <Link to="/" className="btn-yellow">Return Home</Link>
                </div>
            </div>
        );
    }

    const handleBookNow = () => {
        navigate("/", { state: { scrollTo: "lead-form" } });
    };

    return (
        <div className="min-h-screen bg-surface">
            <Navbar clinic={clinic} />

            <main className="pt-20">
                {/* Hero Section */}
                <section className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
                    <motion.div
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 z-0"
                    >
                        <img
                            src={treatment.heroImage}
                            alt={treatment.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                    </motion.div>

                    <div className="container mx-auto px-8 relative z-10 text-white">
                        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
                            <ArrowLeft className="w-4 h-4" /> Back to All Services
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <h1 className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tighter uppercase leading-[0.9]">
                                {treatment.title.split(' ').map((word, i) => (
                                    <span key={i} className={i === 1 ? "text-[#DFFF5E]" : ""}>
                                        {word}{' '}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/80 max-w-2xl font-medium leading-relaxed">
                                {treatment.description}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-24">
                    <div className="container mx-auto px-8">
                        <div className="grid lg:grid-cols-12 gap-16">

                            {/* Left Column: Details */}
                            <div className="lg:col-span-8 space-y-20">

                                {/* description */}
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-black/30 mb-8 block">Overview</h2>
                                    <p className="text-2xl md:text-3xl font-medium leading-relaxed text-black/80">
                                        {treatment.fullDescription}
                                    </p>
                                </div>

                                {/* The Process */}
                                <div>
                                    <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-black/30 mb-12 block">The Process</h2>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        {treatment.process.map((p, i) => (
                                            <div key={i} className="bg-white p-10 rounded-[40px] border border-black/5 shadow-xl">
                                                <span className="text-4xl font-display font-bold text-black/10 mb-6 block">{p.step}</span>
                                                <h4 className="text-xl font-display font-bold text-black mb-4 uppercase tracking-tight">{p.title}</h4>
                                                <p className="text-muted font-medium">{p.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Benefits */}
                                <div className="bg-black text-white p-12 md:p-20 rounded-[60px] relative overflow-hidden">
                                    <Sparkles className="absolute top-10 right-10 w-20 h-20 text-white/5" />
                                    <h2 className="text-3xl font-display font-bold mb-12 uppercase">Why our {treatment.title}?</h2>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        {treatment.benefits.map((benefit, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-[#DFFF5E] shrink-0" />
                                                <span className="text-lg font-medium text-white/80">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>

                            {/* Right Column: Sticky Sidebar */}
                            <div className="lg:col-span-4">
                                <div className="sticky top-32 space-y-6">

                                    {/* Stats Card */}
                                    <div className="bg-white rounded-[40px] p-10 border border-black/5 shadow-2xl">
                                        <div className="space-y-8 mb-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-black" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Pricing</p>
                                                    <p className="font-bold text-black">{treatment.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                                    <Clock className="w-5 h-5 text-black" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Duration</p>
                                                    <p className="font-bold text-black">{treatment.duration}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center">
                                                    <ShieldCheck className="w-5 h-5 text-black" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Specialist</p>
                                                    <p className="font-bold text-black">GDC Registered</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleBookNow}
                                            className="w-full btn-yellow py-6 text-lg rounded-2xl flex items-center justify-center gap-3 group"
                                        >
                                            Book Your Session
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </button>
                                        <p className="text-center text-[10px] items-center justify-center gap-1.5 font-bold uppercase tracking-widest text-black/30 mt-6 flex">
                                            0% Finance available
                                        </p>
                                    </div>

                                    {/* Specialist Card */}
                                    <div className="bg-[#f8f8f8] rounded-[40px] p-8 border border-black/5">
                                        <div className="flex items-center gap-6">
                                            <img
                                                src={treatment.specialist.image}
                                                alt={treatment.specialist.name}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                                            />
                                            <div>
                                                <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-1">Lead Specialist</p>
                                                <h4 className="font-display font-bold text-black uppercase">{treatment.specialist.name}</h4>
                                                <p className="text-xs text-muted font-medium italic">{treatment.specialist.role}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-black text-white py-20 border-t border-white/5">
                <div className="container mx-auto px-8 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.4em] opacity-40">London Smile Excellence</p>
                </div>
            </footer>
        </div>
    );
}
