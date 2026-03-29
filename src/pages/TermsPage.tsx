import React from 'react';
import { motion } from 'motion/react';
import { FileText, Shield, Scale, Info, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';

const TermsPage: React.FC = () => {
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
                            <Scale className="w-3.5 h-3.5" />
                            Terms of Service & Clinical Governance
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Terms of <br /><span className="italic font-normal text-slate-400 font-serif">Engagement</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed mb-4 max-w-2xl mx-auto"
                        >
                            These terms establish the professional relationship between {activeClinicName} and its patients, specifically governing the "Bespoke Digital Smile Protocol" and its associated clinical outputs.
                        </motion.p>
                    </header>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">01</div>
                                Bespoke Digital Smile Protocol
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    The "Bespoke Digital Smile Protocol" utilized by {activeClinicName} is a proprietary, multi-faceted diagnostic and aesthetic workflow. It integrates advanced 3D imaging, facial analysis, and digital simulations to project potential clinical outcomes.
                                </p>
                                <p>
                                    Patients acknowledge that these digital simulations are elective prognostic tools. While they represent the high-precision goal of {activeClinicName}, final biological integration and surgical results may vary based on individual healing and physiological response.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">02</div>
                                Intellectual Property of Clinical Proposals
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    All digital treatment plans, clinical proposals, and transformative simulations generated under the Bespoke Digital Smile Protocol constitute the intellectual property of {activeClinicName}.
                                </p>
                                <p>
                                    Ownership of the clinical design, aesthetic mapping, and surgical staging remains with the Clinic. Patients are provided access to these proposals for personal consultative use. Any unauthorized reproduction or external clinical use of these proprietary designs is strictly prohibited.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">03</div>
                                Professional Relationship & Liability
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    The relationship between {activeClinicName} and the patient is one of professional trust and clinical excellence. Responsibility for providing accurate medical history rests with the patient to ensure the safety and efficacy of the Bespoke protocol.
                                </p>
                                <p>
                                    {activeClinicName} limits its liability to the provision of professional services in accordance with standard clinical protocols. The digital phase is a component of the comprehensive care package and does not replace the necessity of in-person surgical assessment.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                            <h3 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-slate-400" />
                                Acceptance of Terms
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                By proceeding with a digital consultation or engaging with the {activeClinicName} platform, you formally accept these terms and conditions. These terms are governed by the laws of the jurisdiction in which the Clinic operates.
                            </p>
                        </section>
                    </div>

                    {/* Footer / Contact */}
                    <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
                        <div className="text-center pt-8 border-t border-slate-200">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">{activeClinicName} • Administration</p>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            For further inquiries regarding our professional terms, please contact our administrative office during business hours.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default TermsPage;
