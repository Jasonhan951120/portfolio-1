import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Cloud, Eye, Settings, ArrowLeft, CheckCircle2 } from 'lucide-react';
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
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Enterprise-Grade Security Protocol
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-serif text-5xl md:text-6xl text-slate-900 mb-8 leading-tight tracking-tight"
                        >
                            Security & Data <br /><span className="italic font-normal text-slate-400 font-serif">Protection</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm font-medium text-slate-600 leading-relaxed max-w-2xl mx-auto"
                        >
                            The security architecture of {activeClinicName} is engineered to protect sensitive clinical proposals and administrative data through multi-layered technical safeguards.
                        </motion.p>
                    </header>

                    <div className="grid md:grid-cols-2 gap-8 mb-24">
                        <div className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:border-black/5 transition-luxury">
                            <Lock className="w-10 h-10 text-black mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-serif mb-4 text-slate-900">Advanced Encryption</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                We utilize military-grade AES-256 encryption for all data at rest. Communications between your browser and our servers are secured via SSL/TLS 1.3, ensuring high-fidelity data integrity.
                            </p>
                        </div>
                        <div className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:border-black/5 transition-luxury">
                            <Cloud className="w-10 h-10 text-black mb-6" strokeWidth={1.5} />
                            <h3 className="text-xl font-serif mb-4 text-slate-900">Secure Cloud Isolation</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Our infrastructure is hosted on AWS UK (London) regions with strict Virtual Private Cloud (VPC) isolation, preventing unauthorized external access to our clinical proposal databases.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">01</div>
                                Authentication & Access
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    Access to the administrative dashboard is restricted through secure authentication protocols. We implement role-based access control (RBAC), ensuring that {activeClinicName} personnel only access data pertinent to their specific clinical or administrative role.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif text-slate-900 mb-6 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-serif text-sm">02</div>
                                Monitoring & Audits
                            </h2>
                            <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                                <p>
                                    We conduct regular vulnerability scans and security audits to identify and remediate potential risks. Real-time monitoring and automated alert systems ensure that any suspicious activities are instantly flagged and addressed by our security team.
                                </p>
                            </div>
                        </section>

                        <section className="bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm">
                            <h3 className="text-xl font-serif text-slate-900 mb-6 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-slate-400" />
                                Incident Response
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                In the unlikely event of a security incident, {activeClinicName} maintains a predefined response protocol to contain the risk, notify relevant stakeholders, and restore system integrity in accordance with ICO and GDPR requirements.
                            </p>
                        </section>
                    </div>

                    {/* Footer / Contact */}
                    <footer className="mt-24 pt-12 border-t border-slate-100 text-center">
                        <div className="text-center pt-8 border-t border-slate-200">
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-4">{activeClinicName} • Technical Operations</p>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto italic font-serif">
                            For technical security whitepapers or audit compliance certificates, please contact our Information Security Officer.
                        </p>
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default SecurityPolicyPage;
