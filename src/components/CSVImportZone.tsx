import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle2, XCircle, Loader2, Lock, ShieldCheck } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../lib/constants';

interface CSVImportZoneProps {
    clinicId: string;
    specialty?: string | null;
    onImportComplete: () => void;
}

export function CSVImportZone({ clinicId, specialty, onImportComplete }: CSVImportZoneProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

    const processData = async (data: any[]) => {
        setIsProcessing(true);
        setResult(null);
        let successCount = 0;
        let failCount = 0;

        const inserts = data.map((row, index) => {
            // PII SCRUBBER: Strict blocklist for PMS export headers
            // We EXPLICITLY ignore: 'Name', 'First Name', 'Last Name', 'Phone', 'Mobile', 'Email', 'DOB', 'Birth Date', 'Address', 'Postcode'

            const serviceRaw = row['TreatmentType'] || row['Treatment Type'] || row['Service'] || row['Treatment'] || 'General Consultation';
            const rawVal = String(row['Potential Value'] || row['Value'] || '0').replace(/[^0-9.]/g, '');
            const potentialValue = parseFloat(rawVal) || 1000;
            const statusRaw = row['Status'] || row['Lead Status'] || 'New Lead';

            // Generate pseudonym for privacy (Side-car architecture requirement)
            const pseudonym = `Patient #${Math.floor(Math.random() * 9000) + 1000}`;

            // Try to find a matched service
            const serviceMatch = Object.keys(SERVICE_CONVERSION_VALUES).find(k =>
                k.toLowerCase().includes(String(serviceRaw).toLowerCase()) || String(serviceRaw).toLowerCase().includes(k.toLowerCase())
            );
            const service = serviceMatch || "Premium Service";

            return {
                clinic_id: clinicId,
                name: pseudonym, // Local Scrubber Active
                email: "privacy.protected@hanlan.private", // Dropped
                phone: "SCRUBBED_PII", // Dropped
                service,
                status: statusRaw,
                potential_value: potentialValue,
                utm_source: "PMS_IMPORT_SCRUBBED",
                created_at: new Date().toISOString()
            };
        }).filter(Boolean);

        if (inserts.length > 0) {
            // Chunk inserts just in case of massive CSVs
            const chunkSize = 100;
            for (let i = 0; i < inserts.length; i += chunkSize) {
                const chunk = inserts.slice(i, i + chunkSize);
                const { error } = await supabase.from('consultation_requests').insert(chunk);
                if (error) {
                    console.error("Bulk insert failed for chunk:", error);
                    failCount += chunk.length;
                } else {
                    successCount += chunk.length;
                }
            }
        }

        setResult({ success: successCount, failed: failCount });
        setIsProcessing(false);
        if (successCount > 0) onImportComplete(); // This will trigger fetchLeads in the parent, or parent relies on Realtime!
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsHovering(false);

        const file = e.dataTransfer.files[0];
        if (file && (file.type === "text/csv" || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
             // In a real app we'd handle excel using xlsx library, but for now we accept it contextually
             if (file.name.endsWith('.csv')) {
                 Papa.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        processData(results.data);
                    },
                    error: (error: any) => {
                        console.error("CSV Parse Error:", error);
                        setResult({ success: 0, failed: 1 });
                    }
                });
             } else {
                  alert("Currently only CSV format is fully supported in this demo MVP.");
             }
        } else {
            alert("Please upload a valid CSV or Excel file.");
        }
    }, [clinicId]);

    // Dynamic UI Wording Logic based on Specialty
    const currentSpecialty = specialty?.toLowerCase() || '';
    let dropzoneSubCopy = "Drop your Patient Data (CSV) here";
    if (currentSpecialty === 'dental' || currentSpecialty === 'dentistry') {
        dropzoneSubCopy = "Drop your PMS (e.g., EXACT, Dentally) export here";
    } else if (currentSpecialty === 'dermatology' || currentSpecialty === 'aesthetics') {
        dropzoneSubCopy = "Drop your Clinic Software (e.g., Pabau, Jane App) export here";
    }

    return (
        <div className="mb-8">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={onDrop}
                className={`relative overflow-hidden rounded-[44px] border border-dashed transition-all duration-500 p-12 flex flex-col items-center justify-center min-h-[220px]
          ${isHovering ? 'border-emerald-400/60 bg-emerald-400/5 scale-[1.01] shadow-[0_20px_60px_rgba(16,185,129,0.1)]' : 'border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl hover:bg-white/[0.05] hover:border-white/20'}
        `}
            >
                <AnimatePresence mode="wait">
                    {isProcessing ? (
                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-[#00FFA3] animate-spin mb-3" />
                            <p className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">Processing Upload...</p>
                            <p className="text-xs text-gray-500 mt-1">Extracting patient intelligence</p>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
                            {result.success > 0 ? (
                                <>
                                    <div className="w-12 h-12 bg-[#00FFA3]/10 rounded-full flex items-center justify-center mb-3">
                                        <CheckCircle2 className="w-6 h-6 text-[#00FFA3]" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Successfully Imported {result.success} Records</p>
                                    <button onClick={() => setResult(null)} className="mt-4 text-xs font-bold text-[#00FFA3] hover:text-[#00FFA3]/80 underline underline-offset-4">Import Another</button>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">Import Failed</p>
                                    <button onClick={() => setResult(null)} className="mt-4 text-xs font-bold text-gray-500 hover:text-white underline underline-offset-4">Try Again</button>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center pointer-events-none">
                            <div className="w-20 h-20 mb-6 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative">
                                <div className="absolute inset-0 bg-emerald-400/10 blur-[20px] rounded-full opacity-50" />
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`relative z-10 transition-colors duration-300 ${isHovering ? 'text-emerald-400' : 'text-white/40'}`}>
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                    <path d="m9 12 2 2 4-4" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-black text-white mb-2 tracking-tight">Synchronize Your Vault</h3>
                            <p className="text-xs text-slate-500 font-medium max-w-[320px] leading-relaxed">
                                {dropzoneSubCopy} <br/>
                                <span className="text-emerald-400/60 mt-1 block italic opacity-80">Supported formats: CSV, (XLSX planned)</span>
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Trust Banner UI */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 p-4 rounded-2xl bg-emerald-500/5 backdrop-blur-md border border-emerald-500/20 flex items-start gap-4"
            >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h4 className="text-xs font-bold text-gray-900 flex items-center gap-1.5 mb-0.5">
                        End-to-End Local Parsing
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className="text-[11px] leading-relaxed text-gray-600 font-medium">
                        Patient names and contact info are scrubbed locally in your browser. We never see or store PII data. (GDPR & HIPAA Compliant)
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
