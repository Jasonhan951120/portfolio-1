import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { ExpertModeContent } from './ExpertModeContent';

interface ExpertModeDrawerProps {
  isOpen: boolean;
  onClose?: () => void;
  onOpenPMSLogs?: () => void;
  onOpenClinicMeta?: () => void;
}

class DiagnosticErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("DIAGNOSTIC ERROR CAUGHT:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#fee2e2',
          border: '4px solid #ef4444',
          borderRadius: '24px',
          margin: '20px',
          color: '#b91c1c',
          fontFamily: 'monospace',
          overflow: 'auto',
          maxHeight: '90vh',
          zIndex: 9999,
          position: 'relative'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>🚨 RUNTIME ERROR CAUGHT</h1>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Message: {this.state.error?.message}</p>
          <pre style={{ 
            backgroundColor: '#ffffff', 
            padding: '16px', 
            borderRadius: '8px', 
            fontSize: '11px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all'
          }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: '16px',
              padding: '12px 24px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function ExpertModeDrawer({ 
  isOpen, 
  onClose = () => {}, 
  onOpenPMSLogs = () => {}, 
  onOpenClinicMeta = () => {} 
}: ExpertModeDrawerProps) {
  if (!isOpen) return null;

  return (
    <DiagnosticErrorBoundary>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { if (typeof onClose === 'function') onClose?.(); }}
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
                  onClick={() => { if (typeof onClose === 'function') onClose?.(); }}
                  className="p-3 bg-black/5 hover:bg-black/10 rounded-2xl transition-all"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>
              
              <div className="px-12 pb-24">
                <ExpertModeContent 
                  onOpenPMSLogs={() => { if (typeof onOpenPMSLogs === 'function') onOpenPMSLogs?.(); }}
                  onOpenClinicMeta={() => { if (typeof onOpenClinicMeta === 'function') onOpenClinicMeta?.(); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </DiagnosticErrorBoundary>
  );
}

export default ExpertModeDrawer;
