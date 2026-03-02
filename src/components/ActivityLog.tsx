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
            console.error('Error fetching audit logs:', err);
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
            <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 group">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest min-w-[100px]">
                    {time}
                </div>
                <div className="flex-1 text-sm text-white/60">
                    <span className="font-bold text-white/80">{log.user_name}</span>
                    <span className="mx-2 text-white/20">|</span>
                    <span>{actionText}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Shield className="w-3.5 h-3.5 text-white/10" />
                </div>
            </div>
        );
    };

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <History className="w-6 h-6 text-white/10 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-[#0f0f0f] border border-white/10 rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.01]">
                <div>
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">System Audit Trail</h3>
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] mt-1">GDPR / HIPAA Compliance Log</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                >
                    <History className="w-4 h-4 text-white/40" />
                </button>
            </div>

            <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                {logs.length === 0 ? (
                    <div className="text-center py-12">
                        <Shield className="w-12 h-12 text-white/5 mx-auto mb-4" />
                        <p className="text-sm text-white/20 font-medium">No activity logs recorded yet.</p>
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

            <div className="px-8 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="w-3 h-3" /> Encrypted & Immutable
                </span>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    Showing last 50 events
                </span>
            </div>
        </div>
    );
};
