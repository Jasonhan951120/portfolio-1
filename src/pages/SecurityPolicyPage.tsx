import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Server, Cpu, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';

const SecurityPolicyPage: React.FC = () => {
    const { clinicName } = useDashboardStore();
    const activeClinicName = clinicName || 'Hanlan OC';

    return (
        <div className="min-h-screen bg-[#FBFBFB] text-slate-900 font-sans selection:bg-sage-100 selection:text-sage-900">
            {/* Header / Navigation */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group transition-all">
                        <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-900 group-hover:-translate-x-1 transition-all" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-900">Return to Clinic</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center font-bold text-white shadow-sm">H</div>
                        <span className="font-display font-bold text-xl tracking-tight">Hanlan<span className="text-black/40">OC</span></span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-32 pb-24 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Page Title Section */}
                    <header className="mb-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-black text-[10px] font-bold uppercase tracking-widest mb-6"
                        >
                            <ShieldCheck className="w-3.5 h-3.5 text-[#87A96B]" />
                            Enterprise-Grade Technical Security
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Security <br /><span className="italic font-normal text-slate-400 font-serif">Infrastructure</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto"
                        >
                            {activeClinicName} prioritizes the absolute security of patient data and clinical communications through state-of-the-art encryption and architectural safeguards.
                        </motion.p>
                    </header>

                    <div className="space-y-16">
                        {/* High-Level Pillars */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {[
                                { icon: Lock, title: "AES-256", desc: "Military-grade encryption for all data at rest." },
                                { icon: Server, title: "Cloud Native", desc: "High-available, secure cloud infrastructure." },
                                { icon: Cpu, title: "SSL/TLS", desc: "Encrypted data transmission tunnels." }
                            ].map((pillar, idx) => (
                                <motion.div
                                    key={pillar.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 + (idx * 0.1) }}
                                    className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#87A96B]/30 transition-luxury"
                                >
                                    <pillar.icon className="w-8 h-8 text-[#87A96B] mb-6" strokeWidth={1.5} />
                                    <h4 className="font-bold text-slate-900 mb-2">{pillar.title}</h4>
                                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{pillar.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3 font-medium">
                                Technical Safeguards & Encryption
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">Encryption Standards</h3>
                                    <p>
                                        All sensitive patient information is encrypted at rest using Advanced Encryption Standard (AES) with a 256-bit key length. We employ industry-standard Transport Layer Security (TLS 1.3) protocols for encrypting all data in transit between the patient, clinic, and our servers.
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">Cloud Infrastructure</h3>
                                    <p>
                                        Our infrastructure resides on secure cloud providers with Multi-AZ redundancy. This ensures near-zero downtime and protection against physical server failure. Access to the production environment is strictly restricted via Multi-Factor Authentication (MFA) and controlled by Role-Based Access Control (RBAC).
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3 font-medium">
                                SOC 2 & HIPAA Alignment
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    While the {activeClinicName} platform focuses on clinical engagement, our technical controls align with the rigorous requirements of SOC 2 Type II and HIPAA/UK GDPR. We undergo regular internal vulnerability assessments and technical audits to ensure that our security posture remains ahead of emerging digital threats.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                                    {[
                                        "Biometric access to cloud data centers",
                                        "Automated intrusion detection systems",
                                        "Regular penetration testing protocols",
                                        "End-to-end encrypted backup systems"
                                    ].map((item) => (
                                        <div key={item} className="flex items-center gap-3 text-slate-500 font-medium">
                                            <CheckCircle2 className="w-4 h-4 text-[#87A96B]" />
                                            <span className="text-xs italic">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm text-center">
                            <h3 className="text-xl font-serif text-slate-900 mb-4">Zero-Retention Layer</h3>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto italic font-serif">
                                We operate a zero-retention policy for clinical X-rays and raw medical imagery after the initial consultation protocol is complete. This reduces the risk radius and ensures patient privacy is maintained at the highest level.
                            </p>
                        </section>
                    </div>

                    {/* Footer / Contact */}
                    <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
                        <div className="text-center pt-8 border-t border-slate-200">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">{activeClinicName} • Technical Security Team</p>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            Security is a continuous journey. If you discovery any potential vulnerability, please report it to our security response team immediately.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default SecurityPolicyPage;
