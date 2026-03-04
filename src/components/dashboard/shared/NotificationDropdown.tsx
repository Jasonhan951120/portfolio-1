import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface Notification {
    id: string;
    message: string;
    time: string;
    read: boolean;
}

interface NotificationDropdownProps {
    notifications: Notification[];
    onClose: () => void;
    onDismiss: (id: string) => void;
}

export function NotificationDropdown({ notifications, onClose, onDismiss }: NotificationDropdownProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-80 bg-white border border-gray-100 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 z-[100]"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Activity</h3>
                <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-lg text-gray-500">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                    <p className="text-[10px] text-gray-400 text-center py-8 italic">No new activity</p>
                ) : (
                    notifications.map((n) => (
                        <div key={n.id} className="relative p-4 bg-gray-50 border border-gray-100 rounded-2xl group transition-all">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDismiss(n.id);
                                }}
                                className="absolute top-3 right-3 p-1 rounded-md text-gray-400 hover:text-gray-900 transition-colors"
                                title="Dismiss"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                            <p className="text-[11px] text-gray-600 leading-relaxed mb-1 pr-6">{n.message}</p>
                            <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{n.time}</span>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
}
