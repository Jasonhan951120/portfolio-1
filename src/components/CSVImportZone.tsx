import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, CheckCircle2, XCircle, Loader2, Lock, ShieldCheck } from 'lucide-react';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import { SERVICE_CONVERSION_VALUES } from '../lib/constants';

interface CSVImportZoneProps {
    clinicId: string;
    onImportComplete: () => void;
}

export function CSVImportZone({ clinicId, onImportComplete }: CSVImportZoneProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

    const processData = async (data: any[]) => {
        setIsProcessing(true);
        setResult(null);
        let successCount = 0;
        let failCount = 0;

        const inserts = data.map((row, index) => {
            // PII SCRUBBER: Immediately define what we keep. 
            // We EXCLUDE: 'Name', 'Phone', 'Email', 'DOB', 'Address'
            // We EXTRACT: 'Potential Value', 'Status', 'TreatmentType'

            const serviceRaw = row['TreatmentType'] || row['Treatment Type'] || row['Service'] || row['Treatment'] || 'General Checkup';
            const potentialValue = parseFloat(row['Potential Value'] || row['Value'] || '0') || 0;
            const statusRaw = row['Status'] || row['Lead Status'] || 'New Lead';

            // Generate pseudonym for privacy
            const pseudonym = `Patient #${1000 + index}`;

            // Try to find a matched service
            const serviceMatch = Object.keys(SERVICE_CONVERSION_VALUES).find(k =>
                k.toLowerCase().includes(String(serviceRaw).toLowerCase()) || String(serviceRaw).toLowerCase().includes(k.toLowerCase())
            );
            const service = serviceMatch || "Dental Implants";

            return {
                clinic_id: clinicId,
                name: pseudonym, // Local Scrubbing
                email: "scrubbed@hanlan.private",
                phone: "Privacy Protected",
                service,
                status: statusRaw,
                potential_value: potentialValue,
                utm_source: "EXACT_CSV_IMPORT_SCRUBBED"
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
        if (file && (file.type === "text/csv" || file.name.endsWith('.csv'))) {
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
            alert("Please upload a valid CSV file.");
        }
    }, [clinicId]);

    return (
        <div className="mb-8">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
                onDragLeave={() => setIsHovering(false)}
                onDrop={onDrop}
                className={`relative overflow-hidden rounded-[32px] border-2 border-dashed transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[160px]
          ${isHovering ? 'border-[#87A96B] bg-[#87A96B]/5 scale-[1.02] shadow-[0_8px_30px_rgb(135,169,107,0.15)]' : 'border-black/10 bg-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-white border-[#A0A0A0]/20'}
        `}
            >
                <AnimatePresence mode="wait">
                    {isProcessing ? (
                        <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                            <Loader2 className="w-8 h-8 text-[#87A96B] animate-spin mb-3" />
                            <p className="text-sm font-bold text-gray-900 tracking-wide">Processing Upload...</p>
                            <p className="text-xs text-gray-500 mt-1">Extracting patient intelligence</p>
                        </motion.div>
                    ) : result ? (
                        <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center text-center">
                            {result.success > 0 ? (
                                <>
                                    <div className="w-12 h-12 bg-[#87A96B]/10 rounded-full flex items-center justify-center mb-3">
                                        <CheckCircle2 className="w-6 h-6 text-[#87A96B]" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">Successfully Imported {result.success} Records</p>
                                    <button onClick={() => setResult(null)} className="mt-4 text-xs font-bold text-[#87A96B] hover:text-[#87A96B]/80 underline underline-offset-4">Import Another</button>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-3">
                                        <XCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-900">Import Failed</p>
                                    <button onClick={() => setResult(null)} className="mt-4 text-xs font-bold text-gray-500 hover:text-gray-900 underline underline-offset-4">Try Again</button>
                                </>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center pointer-events-none">
                            <div className="w-14 h-14 bg-black/[0.03] rounded-[20px] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                                <UploadCloud className={`w-6 h-6 transition-colors duration-300 ${isHovering ? 'text-[#87A96B]' : 'text-gray-400'}`} />
                            </div>
                            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Upload EXACT Export (CSV)</h3>
                            <p className="text-xs text-gray-500 font-medium max-w-[250px]">
                                Drag and drop your legacy EMR patient list here. We'll automatically build your revenue pipeline.
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
