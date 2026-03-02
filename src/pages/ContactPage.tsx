import { motion, AnimatePresence } from "motion/react";
import { Phone, Mail, MapPin, Clock, ArrowRight, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight, CheckCircle2, Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

const CLINIC_IMAGES = [
    "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200", // Modern Reception
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200", // Dental Suite
    "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200", // Minimalist Hallway
];

const TRUST_SIGNALS = [
    { icon: ShieldCheck, text: "GDC Registered Specialists" },
    { icon: CheckCircle2, text: "4.9/5 Patient Satisfaction" },
    { icon: Zap, text: "Emergency Appointments Available" },
];

export default function ContactPage({ clinic }: { clinic: any }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "General Inquiry" });
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const nextImage = () => setCurrentImage((prev) => (prev + 1) % CLINIC_IMAGES.length);
    const prevImage = () => setCurrentImage((prev) => (prev - 1 + CLINIC_IMAGES.length) % CLINIC_IMAGES.length);

    useEffect(() => {
        const timer = setInterval(nextImage, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", service: "General Inquiry" });
            }
        } catch (error) {
            console.error("Submission error:", error);
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            <Navbar clinic={clinic} />

            {/* Conversion Hero */}
            <section className="pt-32 pb-24">
                <div className="container mx-auto px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-stretch">

                        {/* Left Side: Conversion Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-[60px] p-8 md:p-16 shadow-2xl border border-black/5 flex flex-col justify-center min-w-0"
                        >
                            <div className="inline-flex items-center gap-3 mb-8">
                                <Sparkles className="w-5 h-5 text-accent" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Immediate Reservation</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight tracking-tight uppercase mb-8">
                                Start Your Transformation
                            </h1>


                            <AnimatePresence mode="wait">
                                {status === "success" ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-10"
                                    >
                                        <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <CheckCircle2 className="w-12 h-12 text-black" />
                                        </div>
                                        <h2 className="text-3xl font-display font-bold mb-4 text-black uppercase">Request Received</h2>
                                        <p className="text-muted text-lg font-medium">Our coordinator will contact you within 24 hours.</p>
                                        <button onClick={() => setStatus("idle")} className="mt-10 btn-dark px-8 py-4 rounded-full">New Request</button>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Full Name</label>
                                                <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#FBFBFB] border border-black/5 rounded-2xl px-6 py-4 focus:border-primary focus:outline-none transition-all font-bold" placeholder="E.g. James Smith" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Phone Number</label>
                                                <input required type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-[#FBFBFB] border border-black/5 rounded-2xl px-6 py-4 focus:border-primary focus:outline-none transition-all font-bold" placeholder="+44 20" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Email Address</label>
                                            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#FBFBFB] border border-black/5 rounded-2xl px-6 py-4 focus:border-primary focus:outline-none transition-all font-bold" placeholder="james@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-muted ml-1">Desired Treatment</label>
                                            <select value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} className="w-full bg-[#FBFBFB] border border-black/5 rounded-2xl px-6 py-4 focus:border-primary focus:outline-none transition-all font-bold appearance-none">
                                                <option>Invisalign & Alignment</option>
                                                <option>Veneers & Aesthetics</option>
                                                <option>Advanced Surgery</option>
                                                <option>Emergency Care</option>
                                                <option>General Inquiry</option>
                                            </select>
                                        </div>
                                        <button disabled={status === "loading"} type="submit" className="w-full btn-yellow py-6 text-xl rounded-2xl flex items-center justify-center gap-4 group">
                                            {status === "loading" ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Request Free Consultation <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Right Side: Visual Showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            className="relative rounded-[60px] overflow-hidden group shadow-2xl hidden lg:block"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImage}
                                    src={CLINIC_IMAGES[currentImage]}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-16">
                                <p className="text-white/60 font-black uppercase tracking-[0.4em] text-xs mb-4">The Clinical Environment</p>
                                <h2 className="text-4xl text-white font-display font-bold uppercase tracking-tighter italic">Designed for <br /> Serenity and Precision.</h2>
                            </div>

                            {/* Controls Overlay */}
                            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={prevImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><ChevronLeft /></button>
                                <button onClick={nextImage} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><ChevronRight /></button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Value Bar (Trust Signals) */}
            <section className="bg-primary py-12">
                <div className="container mx-auto px-8">
                    <div className="grid md:grid-cols-3 gap-12">
                        {TRUST_SIGNALS.map((signal, i) => (
                            <div key={signal.text} className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                    <signal.icon className="w-7 h-7 text-accent" />
                                </div>
                                <span className="text-white text-sm font-black uppercase tracking-[0.2em]">{signal.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Practical Clinical Information */}
            <section className="py-24 bg-[#FBFBFB]">
                <div className="container mx-auto px-8">

                    {/* Section Label */}
                    <div className="flex items-center gap-4 mb-16">
                        <span className="w-8 h-[2px] bg-black/20 inline-block" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Find Us</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* Hours Card — Dark */}
                        <div className="bg-black rounded-[32px] p-10 flex flex-col">
                            <div className="flex items-center justify-between mb-10">
                                <Clock className="w-6 h-6 text-white/40" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Clinic Hours</span>
                            </div>
                            <div className="flex-1 space-y-1 text-sm">
                                {[
                                    { day: "Mon", hours: "9:00am – 6:00pm" },
                                    { day: "Tue", hours: "9:00am – 6:00pm" },
                                    { day: "Wed", hours: "9:00am – 8:00pm" },
                                    { day: "Thu", hours: "9:00am – 6:00pm" },
                                    { day: "Fri", hours: "9:00am – 5:00pm" },
                                    { day: "Sat", hours: "10:00am – 4:00pm" },
                                ].map(({ day, hours }) => (
                                    <div key={day} className="flex justify-between items-center py-2 border-b border-white/5 text-white/70 font-medium">
                                        <span className="font-bold text-white/50 w-8">{day}</span>
                                        <span>{hours}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center py-2 text-white/20 font-medium italic">
                                    <span className="font-bold w-8">Sun</span>
                                    <span>Closed</span>
                                </div>
                            </div>
                            <div className="mt-8 inline-flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Open Now</span>
                            </div>
                        </div>

                        {/* Location Card — Light */}
                        <div className="bg-white rounded-[32px] p-10 flex flex-col border border-black/5">
                            <div className="flex items-center justify-between mb-10">
                                <MapPin className="w-6 h-6 text-black/30" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Location</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-3xl font-display font-bold text-black leading-tight mb-2">
                                    123 Harley St,
                                </p>
                                <p className="text-3xl font-display font-bold text-black/30 leading-tight">
                                    London W1G 6AB
                                </p>
                            </div>
                            <a href="#" className="mt-10 group inline-flex items-center gap-3 self-start">
                                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <ArrowRight className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-black group-hover:text-primary transition-colors">Get Directions</span>
                            </a>
                        </div>

                        {/* Contact Card — Yellow accent */}
                        <div className="bg-white rounded-[32px] p-10 flex flex-col border border-black/5">
                            <div className="flex items-center justify-between mb-10">
                                <Mail className="w-6 h-6 text-black/30" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Contact</span>
                            </div>
                            <div className="flex-1 space-y-5">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Email</p>
                                    <a href="mailto:info@londonsmile.com" className="text-lg font-bold text-black hover:text-primary transition-colors break-all">
                                        info@londonsmile.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-1">Phone</p>
                                    <a href="tel:02071234567" className="text-xl font-bold text-black hover:text-primary transition-colors">
                                        020 7123 4567
                                    </a>
                                </div>
                            </div>
                            <div className="mt-10 pt-6 border-t border-black/5 flex gap-4">
                                {[
                                    { Icon: Instagram, label: "Instagram" },
                                    { Icon: Facebook, label: "Facebook" },
                                    { Icon: Twitter, label: "Twitter" },
                                ].map(({ Icon, label }) => (
                                    <button key={label} aria-label={label} className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center hover:border-black hover:bg-black hover:text-white text-black/30 transition-all">
                                        <Icon className="w-4 h-4" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
