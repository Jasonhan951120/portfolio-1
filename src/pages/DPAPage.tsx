import React from 'react';
import { motion } from 'motion/react';
import { Database, FileCheck, ShieldAlert, ArrowLeft, ArrowRightLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';

const DPAPage: React.FC = () => {
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
                            <Database className="w-3.5 h-3.5" />
                            Data Processing Agreement (DPA)
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Data Processing <br /><span className="italic font-normal text-slate-400 font-serif">Addendum</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto"
                        >
                            This agreement defines the technical and legal protocols for data handling between {activeClinicName} as the Data Controller and the Intelligence Suite platform.
                        </motion.p>
                    </header>

                    <div className="space-y-16">
                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-around text-center">
                                <div className="space-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                                        <Database className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">{activeClinicName}</h4>
                                    <p className="text-xs text-[#87A96B] font-bold uppercase tracking-widest">Data Controller</p>
                                </div>
                                <ArrowRightLeft className="w-8 h-8 text-slate-200 hidden md:block" />
                                <div className="space-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto shadow-lg shadow-black/10">
                                        <ShieldAlert className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Intelligence Suite</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Data Processor</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">01</div>
                                Roles and Responsibilities
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    <strong>{activeClinicName} (Data Controller):</strong> As the Controller, the Clinic determines the purposes and means of processing personal patient data within the Intelligence Suite. Use of the platform signifies the Clinic’s instruction to process data for the purpose of clinical proposal and marketing automation.
                                </p>
                                <p>
                                    <strong>Intelligence Suite (Data Processor):</strong> As the Processor, the platform acts solely on the documented instructions of the Clinic. The Processor implements robust technical measures to ensure the integrity and confidentiality of the data.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">02</div>
                                Data Subject Rights & Security
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    The Processor shall assist the Controller in fulfilling its obligations to respond to requests from data subjects (patients). This includes enabling the rights of access, rectification, erasure, and portability within the digital framework.
                                </p>
                                <p>
                                    Technical safeguards include end-to-end encryption and the principle of data minimization, ensuring that only information strictly required for the Bespoke Digital Smile Protocol is processed.
                                </p>
                            </div>
                        </section>

                        <section className="bg-slate-900 text-white rounded-[40px] p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
                            <h2 className="font-serif text-3xl mb-6 relative z-10">Compliance Commitment</h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
                                This DPA ensures that {activeClinicName} maintains full digital sovereignty over its clinical data while leveraging enterprise-grade automation, fully aligned with HIPAA and GDPR standards.
                            </p>
                            <div className="flex items-center gap-3 relative z-10">
                                <FileCheck className="w-6 h-6 text-[#87A96B]" />
                                <span className="text-xs font-bold uppercase tracking-widest text-[#87A96B]">Standard Contractual Clauses Integrated</span>
                            </div>
                        </section>
                    </div>

                    {/* Footer / Contact */}
                    <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
                        <div className="text-center pt-8 border-t border-slate-200">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">{activeClinicName} • Compliance Archive</p>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            For technical annexes or specific audit requests, please submit a professional inquiry through the clinic's secure administrative portal.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default DPAPage;
