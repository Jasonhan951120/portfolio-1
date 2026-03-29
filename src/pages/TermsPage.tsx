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
                            Terms of Service & Engagement
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Terms of <br /><span className="italic font-normal text-slate-400 font-serif">Service</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed mb-4 max-w-2xl mx-auto"
                        >
                            These terms govern the use of the Digital Smile Protocol and surgical proposals provided by {activeClinicName}. By accessing our services, you agree to the following legal framework.
                        </motion.p>
                    </header>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">01</div>
                                Digital Smile Protocol & Usage
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    The Digital Smile Protocol ("the Protocol") is a proprietary diagnostic and aesthetic planning workflow utilized by {activeClinicName}. The digital simulations and visual representations provided are intended for educational and consultative purposes only.
                                </p>
                                <p>
                                    Final clinical outcomes may vary based on physiological factors, patient compliance, and surgical requirements. The Protocol does not constitute a guaranteed clinical result but rather a sophisticated prognostic goal.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">02</div>
                                Intellectual Property of Proposals
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    All digital treatment plans, 3D simulations, and aesthetic proposals generated through the {activeClinicName} platform remain the exclusive intellectual property of the clinic and its technology partners.
                                </p>
                                <p>
                                    Users are granted a non-exclusive, non-transferable license to view their personal proposals. Reproduction, distribution, or unauthorized commercial use of these digital assets is strictly prohibited and protected under international copyright law.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">03</div>
                                Clinic & Patient Responsibilities
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    <strong>Clinic Obligations:</strong> {activeClinicName} commits to providing accurate clinical assessments based on the data provided and maintaining the highest standards of professional care throughout the digital consultation phase.
                                </p>
                                <p>
                                    <strong>Patient Obligations:</strong> Patients are responsible for providing accurate medical history and following all pre-operative and post-operative instructions. Failure to disclose relevant medical information may void the validity of the digital proposal.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                            <h3 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-2">
                                <Info className="w-5 h-5 text-slate-400" />
                                Limitation of Liability
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                To the maximum extent permitted by law, {activeClinicName} and its affiliates shall not be liable for any indirect, incidental, or consequential damages arising from the use of digital simulations. Clinical decisions remain the collaborative responsibility of the attending surgeon and the patient.
                            </p>
                        </section>
                    </div>

                    {/* Footer / Contact */}
                    <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
                        <div className="text-center pt-8 border-t border-slate-200">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">{activeClinicName} • Legal Department</p>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            For further inquiries regarding our terms, please contact our administrative office directly.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default TermsPage;
