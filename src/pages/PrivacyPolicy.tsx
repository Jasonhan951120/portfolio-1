import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Database, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';

const PrivacyPolicy: React.FC = () => {
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
                            <Shield className="w-3.5 h-3.5" />
                            Global Medical Data Compliance
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Privacy & Medical <br /><span className="italic font-normal text-slate-400 font-serif">Data Governance</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed mb-4 max-w-2xl mx-auto"
                        >
                            At {activeClinicName}, we uphold the highest global standards for medical data protection, ensuring full compliance with HIPAA (Health Insurance Portability and Accountability Act) and GDPR (General Data Protection Regulation).
                        </motion.p>
                    </header>

                    {/* Content Sections */}
                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">01</div>
                                HIPAA & GDPR Alignment
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    Our data processing infrastructure is engineered to meet the stringent requirements of both HIPAA in the United States and GDPR in the United Kingdom/European Union. This dual-layer compliance ensures that your Protected Health Information (PHI) is handled with absolute care.
                                </p>
                                <p>
                                    We implement strict Access Controls and Audit Logging, ensuring that only authorized clinical personnel can access patient data during the consultation and treatment planning phases.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">02</div>
                                End-to-End Encryption
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    All patient records, clinical communications, and aesthetic proposals are protected by end-to-end encryption. Data is encrypted in transit using industry-standard TLS 1.3 and at rest using AES-256 military-grade encryption.
                                </p>
                                <p>
                                    Consultations and Digital Smile Protocol files are strictly isolated within our secure cloud infrastructure, preventing any cross-contamination of data or unauthorized external access.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">03</div>
                                Data Minimization & Retention
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    {activeClinicName} adheres to the principle of "Data Minimization." We only collect and store the information strictly necessary for providing your clinical proposals and marketing engagement.
                                </p>
                                <p>
                                    In accordance with medical record retention laws, data is only kept for the duration required by clinical governance, after which it is securely purged from our active biological and digital servers.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                            <h3 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-[#87A96B]" />
                                Patient Rights
                            </h3>
                            <div className="grid md:grid-cols-2 gap-8 text-slate-500 text-xs leading-relaxed">
                                <div>
                                    <h4 className="font-bold text-slate-700 mb-2">Right to Access & Portability</h4>
                                    <p>Patients have the right to request a digital copy of their personal data and treatment proposals in a structured, commonly used format.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-700 mb-2">Right to Erasure (Right to be Forgotten)</h4>
                                    <p>Under GDPR, patients may request the deletion of their non-clinical marketing data where it is no longer necessary for its original purpose.</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Footer / Contact */}
                    <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
                        <div className="text-center pt-8 border-t border-slate-200">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">{activeClinicName} • Data Protection Officer</p>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            For any inquiries regarding your data privacy or to exercise your rights, please contact our dedicated compliance team.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
