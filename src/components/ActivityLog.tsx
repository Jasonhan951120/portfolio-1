import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Shield, Clock, User, ArrowRight, History } from 'lucide-react';

interface AuditLog {
    id: string;
    timestamp: string;
    user_name: string;
    lead_name: string;
    action_type: string;
    previous_value: string;
    new_value: string;
}

export const ActivityLog: React.FC<{ clinicId: string }> = ({ clinicId }) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, [clinicId]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .eq('clinic_id', clinicId)
                .order('timestamp', { ascending: false })
                .limit(50);

            if (error) throw error;
            setLogs(data || []);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    };

    const formatMessage = (log: AuditLog) => {
        const time = new Date(log.timestamp).toLocaleString('en-GB', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let actionText = '';
        switch (log.action_type) {
            case 'STATUS_CHANGE':
                actionText = `moved ${log.lead_name} from [${log.previous_value}] to [${log.new_value}]`;
                break;
            case 'DATE_UPDATE':
                actionText = `updated ${log.lead_name}'s appointment to ${new Date(log.new_value).toLocaleDateString()}`;
                break;
            case 'DELETED':
                actionText = `deleted patient record: ${log.lead_name}`;
                break;
            case 'SLA_BREACH':
                actionText = `SLA breach detected for ${log.lead_name}`;
                break;
            case 'DEPOSIT_UPDATE':
                actionText = `updated deposit for ${log.lead_name}`;
                break;
            default:
                actionText = `performed ${log.action_type} on ${log.lead_name}`;
        }

        return (
            <div className="flex items-center gap-6 py-4 border-b border-gray-100 last:border-0 group">
                <div className="metric-label text-[9px] text-gray-400 min-w-[90px]">
                    {time}
                </div>
                <div className="flex-1 text-[13px] text-gray-600" data-hj-suppress>
                    <span className="font-bold text-gray-900">{log.user_name}</span>
                    <span className="mx-3 text-gray-200">/</span>
                    <span className="leading-relaxed">{actionText}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Shield className="w-3.5 h-3.5 text-gray-200" />
                </div>
            </div>
        );
    };

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center p-20">
                <History className="w-5 h-5 text-gray-200 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">System Audit Trail</h3>
                    <p className="metric-label text-[9px] text-gray-400 mt-1 uppercase tracking-widest">Regulatory Compliance Log</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2.5 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all shadow-sm"
                >
                    <History className="w-4 h-4 text-gray-400" />
                </button>
            </div>

            <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                {logs.length === 0 ? (
                    <div className="text-center py-16">
                        <Shield className="w-10 h-10 text-gray-100 mx-auto mb-4" />
                        <p className="metric-label text-[10px] text-gray-400">No activity recorded for this period.</p>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {logs.map(log => (
                            <React.Fragment key={log.id}>
                                {formatMessage(log)}
                            </React.Fragment>
                        ))}
                    </div>
                )}
            </div>

            <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <span className="metric-label text-[8px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Shield className="w-3 h-3 text-gray-300" /> Immutable Ledger
                </span>
                <span className="metric-label text-[8px] text-gray-400 uppercase tracking-widest">
                    Last 50 Events
                </span>
            </div>
        </div>
    );
};
