import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ExpertModeContent } from './ExpertModeContent';

interface ExpertModeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPMSLogs?: () => void;
  onOpenClinicMeta?: () => void;
}

export function ExpertModeDrawer({ isOpen, onClose, onOpenPMSLogs, onOpenClinicMeta }: ExpertModeDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#F8F9FA] z-[160] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] overflow-y-auto custom-scrollbar"
          >
            <div className="sticky top-0 bg-[#F8F9FA]/80 backdrop-blur-md p-6 flex justify-end z-10">
              <button 
                onClick={onClose}
                className="p-3 bg-black/5 hover:bg-black/10 rounded-2xl transition-all"
              >
                <X className="w-6 h-6 text-gray-900" />
              </button>
            </div>
            
            <div className="px-12 pb-24">
              <ExpertModeContent 
                onOpenPMSLogs={onOpenPMSLogs}
                onOpenClinicMeta={onOpenClinicMeta}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
