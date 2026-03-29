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
                            Data Processing <br /><span className="italic font-normal text-slate-400 font-serif">Agreement</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto"
                        >
                            Defining the governance framework between {activeClinicName} and its platform infrastructure to ensure sovereign data handling and technical compliance.
                        </motion.p>
                    </header>

                    <div className="space-y-16">
                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8 items-center justify-around text-center">
                                <div className="space-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
                                        <Database className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">The Clinic</h4>
                                    <p className="text-xs text-[#87A96B] font-bold uppercase tracking-widest">Data Controller</p>
                                </div>
                                <ArrowRightLeft className="w-8 h-8 text-slate-200 hidden md:block" />
                                <div className="space-y-2">
                                    <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mx-auto shadow-lg shadow-black/10">
                                        <ShieldAlert className="w-8 h-8 text-white" />
                                    </div>
                                    <h4 className="font-bold text-slate-900">Platform</h4>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Data Processor</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">01</div>
                                Definitions & Roles
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    <strong>Data Controller:</strong> {activeClinicName} (the "Clinic") determines the purposes and means of processing personal data related to its patients and administrative workflows.
                                </p>
                                <p>
                                    <strong>Data Processor:</strong> The platform infrastructure and its integrated services (the "Platform") process personal data solely on behalf of and under the documented instructions of the Clinic.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">02</div>
                                Technical Obligations
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    The Platform shall implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Pseudonymization and encryption of personal data using AES-256 standards.</li>
                                    <li>The ability to ensure the ongoing confidentiality, integrity, availability, and resilience of processing systems.</li>
                                    <li>The ability to restore the availability and access to personal data in a timely manner in the event of a physical or technical incident.</li>
                                    <li>A process for regularly testing, assessing, and evaluating the effectiveness of technical and organizational measures for ensuring the security of the processing.</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">03</div>
                                Data Subject Rights
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    The Platform shall, taking into account the nature of the processing, assist the Clinic by appropriate technical and organizational measures, insofar as this is possible, for the fulfillment of the Clinic's obligation to respond to requests for exercising the data subject's rights laid down in Chapter III of the GDPR (including access, rectification, erasure, and portability).
                                </p>
                            </div>
                        </section>

                        <section className="bg-slate-900 text-white rounded-[40px] p-10 md:p-16 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
                            <h2 className="font-serif text-3xl mb-6 relative z-10">Compliance Commitment</h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
                                This agreement ensures that {activeClinicName} maintains full digital sovereignty over its data while leveraging high-performance clinical automation, fully aligned with UK GDPR and international data protection standards.
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
                            For technical annexes or specific audit requests, please submit a professional inquiry to our compliance team.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default DPAPage;
