import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Database, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
                        <div className="w-8 h-8 rounded-lg bg-[#87A96B] flex items-center justify-center font-bold text-white shadow-sm">H</div>
                        <span className="font-display font-bold text-xl tracking-tight">Hanlan<span className="text-[#87A96B]">OC</span></span>
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#87A96B]/10 border border-[#87A96B]/20 text-[#87A96B] text-[10px] font-bold uppercase tracking-widest mb-6"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            UK Compliance & Data Security
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Privacy & Digital <br /><span className="italic font-normal text-slate-400 font-serif">Governance Policy</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-slate-500 text-lg font-medium leading-relaxed"
                        >
                            Hanlan OC is built on a "Privacy-by-Design" foundation, ensuring British clinics remain fully compliant with ICO and UK GDPR standards while optimising client engagement.
                        </motion.p>
                    </header>

                    {/* Zero-EMR Architecture Notice */}
                    <section className="mb-24">
                        <div className="bg-white border border-slate-100 rounded-[40px] p-10 md:p-16 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#87A96B]/5 blur-3xl rounded-full -mr-32 -mt-32 transition-luxury group-hover:scale-110"></div>

                            <div className="relative z-10 flex flex-col md:flex-row gap-12">
                                <div className="md:w-1/3">
                                    <h2 className="font-serif text-3xl text-slate-900 mb-6">Zero-EMR <br />Architecture</h2>
                                    <div className="h-1 w-12 bg-[#87A96B] rounded-full mb-8"></div>
                                    <p className="text-slate-500 text-sm leading-relaxed font-normal">
                                        Unlike traditional client portals, Hanlan OC does not store clinical records. We operate purely on a marketing and administrative layer to protect your clinic from data liability.
                                    </p>
                                </div>
                                <div className="md:w-2/3 grid gap-8">
                                    {/* Pillar A */}
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-[#87A96B]/10 flex items-center justify-center shrink-0 border border-[#87A96B]/20">
                                            <Database className="w-6 h-6 text-[#87A96B]" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">A. Principle of Data Minimisation</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                We collect zero Special Category Data, as defined by UK GDPR Article 9. We do not store clinical records, X-rays, or medical histories. Our system only processes contact details and marketing conversion metrics required for ROI tracking.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pillar B */}
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                            <Lock className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">B. System Role Separation</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                Your existing EMR (e.g., EXACT, R4, Dentally) remains your secure "System of Record". Hanlan OC acts purely as a "System of Engagement" for marketing automation. By decoupling these layers, we eliminate the risk of clinical data leaks during marketing activities.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pillar C */}
                                    <div className="flex gap-6 items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                            <CreditCard className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">C. Secure B2C Transactions</h3>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                All payments processed via our Stripe integration are handled under PCI DSS Level 1 standards. Transaction data is completely isolated from client clinical charts, ensuring financial interactions never compromise medical confidentiality.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Technical Safeguards */}
                    <section className="mb-24">
                        <h2 className="font-serif text-3xl text-slate-900 mb-12 text-center">British Technical Safeguards</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#87A96B]/30 hover:shadow-sm transition-luxury">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#87A96B] mb-4">UK Hosting</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Data resides exclusively on AWS UK (London) regions to ensure no cross-border data transfers outside the UK adequacy zone.
                                </p>
                            </div>
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#87A96B]/30 hover:shadow-sm transition-luxury">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#87A96B] mb-4">ICO Aligned</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    Our workflows are engineered to support "Privacy by Design" as mandated by the Information Commissioner’s Office (ICO).
                                </p>
                            </div>
                            <div className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-[#87A96B]/30 hover:shadow-sm transition-luxury">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-[#87A96B] mb-4">256-Bit AES</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">
                                    All data is encrypted in transit using TLS 1.3 and at rest using AES-256 standard, the gold standard for digital governance.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Footer / Contact */}
                    <footer className="pt-12 border-t border-slate-100 text-center">
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">Hanlan OC • UK Compliance Team</p>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            For any queries regarding Data Processing Agreements (DPA) or clinic-specific compliance audits, please contact our Data Protection Officer.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
