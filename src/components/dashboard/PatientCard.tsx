import React, { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Users, FileText, Sparkles, 
  Monitor, MessageCircle 
} from 'lucide-react';
import { type ConsultationRequest } from "../../lib/supabase";
import { useDashboardStore } from "../../store/useDashboardStore";
import { AICaseNotePopover } from "./AICaseNotePopover";

interface PatientCardProps {
  id: string;
  lead: ConsultationRequest;
  setDepositModal: any;
  setSelectedLead: (lead: ConsultationRequest) => void;
  updateStatus: (id: string, status: string) => void;
  STAFF_LIST: string[];
  updateAssignedTo: (id: string, staff: string) => void;
  timeAgo: (date: string, region: 'UK' | 'US') => string;
  clinic: any;
  onAddToWaitlist?: (id: string) => void;
  onOpenPTMode: (lead: ConsultationRequest) => void;
  focusMode: string;
  onOpenAudit: (lead: ConsultationRequest) => void;
}

export const PatientCard = React.memo(function PatientCard({
  id,
  lead,
  setDepositModal,
  setSelectedLead,
  timeAgo,
  clinic: clinicData,
  onAddToWaitlist,
  onOpenPTMode,
  focusMode,
  onOpenAudit
}: PatientCardProps) {
  const [isCaseNoteVisible, setIsCaseNoteVisible] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isExiting, setIsExiting] = useState(false);

  const baseline = useMemo(() => lead.importedAt || new Date(lead.created_at).getTime(), [lead.importedAt, lead.created_at]);
  const isVIP = lead.is_vip || (lead.potential_value || 0) >= 1500;
  const isNewLead = lead.status === "New Lead";
  const minutesInNew = Math.floor((Date.now() - baseline) / 60000);
  const isExpiring = isNewLead && minutesInNew >= 15;
  const showVIPPulse = isExpiring;

  const isMatchingFocus = useMemo(() => {
    if (focusMode === "All") return true;
    const category = lead.category || "";
    return category.toLowerCase() === focusMode.toLowerCase();
  }, [focusMode, lead.category]);

  const region = useDashboardStore.getState().region;

  useEffect(() => {
    const now = Date.now();
    const diffSec = Math.floor((baseline + 15 * 60 * 1000 - now) / 1000);
    setTimeLeft(Math.max(0, diffSec));
    const interval = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(interval);
  }, [baseline]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handleWaitlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExiting(true);
    setTimeout(() => {
      onAddToWaitlist?.(lead.id);
    }, 400);
  };

  const getWhatsAppLink = () => {
    const phoneNum = lead.phone || "+447700900000"; // Fallback for prototype data
    
    let message = "";
    const firstName = lead.name.split(' ')[0];
    
    switch (lead.status) {
      case "New Lead":
        message = `Hi ${firstName}, we received your inquiry. Would you like to schedule a quick consultation with Dr. Hanlan?`;
        break;
      case "Visited":
        message = `Hi ${firstName}, it was great seeing you! Do you have any further questions regarding your treatment plan?`;
        break;
      case "Treated":
      case "Closed Won":
        message = `Hi ${firstName}, hope you are recovering well! If you loved your experience, we'd appreciate a quick Google review: https://g.page/r/hanlan-oc/review`;
        break;
      default:
        message = `Hi ${firstName}, checking in from Hanlan OC. How can we help you today?`;
    }
    
    return `https://wa.me/${phoneNum.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const hasPhone = true; // Force enable for all pipeline stages
  const whatsappUrl = getWhatsAppLink();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "transform 400ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    zIndex: isDragging ? 50 : 1,
  };

  const isOverdue = (lead.status === "New Lead") && (Date.now() - baseline) > 86400000;

  return (
    <div ref={setNodeRef} style={style} className="outline-none px-1 h-[210px] transition-all">
      <motion.div
        layout
        initial={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        animate={isExiting ? { opacity: 0, scale: 0.8, x: 50, filter: "blur(4px)" } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`relative flex flex-col gap-3 h-full bg-white/80 backdrop-blur-md border border-white/20 shadow-xl shadow-slate-200/50 rounded-2xl p-5 overflow-hidden group transition-all duration-200
          ${isDragging ? 'opacity-50 ring-2 ring-emerald-500 shadow-xl' : ''} 
          ${isOverdue ? 'ring-1 ring-red-200/50' : ''}
          ${showVIPPulse ? 'ring-2 ring-red-400 animate-pulse' : ''}
          ${lead.intent_score > 90 ? 'glow-high-intent ring-1 ring-emerald-400/30' : ''}
          ${!isMatchingFocus && focusMode !== "All" ? 'grayscale opacity-30 scale-[0.98]' : ''}
          hover:shadow-md hover:ring-1 hover:ring-slate-200/50
        `}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 cursor-grab" />
        
        <div className="relative z-10 flex flex-col h-full w-full pointer-events-none overflow-hidden">
          {/* Top Section: Name & Metadata */}
          <div className="flex justify-between items-start w-full mb-1">
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 w-full min-w-0 break-words">
                <h4 className="text-base font-bold text-slate-900 tracking-tight truncate flex-1 min-w-0 break-words">{lead.name}</h4>
                {isVIP && (
                  <span className="shrink-0 text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400/20 to-amber-600/20 text-amber-700 border border-amber-200/50 uppercase tracking-widest">
                    VIP
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-slate-500 break-words">{timeAgo(lead.created_at, region)}</span>
            </div>
            
            <div className="flex items-center gap-1 shrink-0 ml-2 pointer-events-auto">
               <button 
                onClick={() => onOpenAudit(lead)} 
                className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                title="Security & Audit Trail"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <div className="relative group/popover">
                <button 
                  onMouseEnter={(e) => {
                    setAnchorRect(e.currentTarget.getBoundingClientRect());
                    setIsCaseNoteVisible(true);
                  }}
                  onMouseLeave={() => setIsCaseNoteVisible(false)}
                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                  title="AI Value Reasoning"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <AICaseNotePopover lead={lead} isVisible={isCaseNoteVisible} anchorRect={anchorRect} />
              </div>
            </div>
          </div>

          {/* Middle Section: AI Insight & Service Tag */}
          <div className="flex flex-wrap items-center gap-2 my-1">
            <div className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 fill-emerald-700/20" />
              {lead.intent_score || 0}% AI INTENT
            </div>
            <span className="shrink-0 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
              {lead.service}
            </span>
          </div>

          {/* Fixed Footer: Price & WhatsApp */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center w-full pointer-events-auto">
            <div className="flex flex-col">
              <span className="text-slate-900 font-bold tracking-tight text-lg leading-tight">
                {region === 'UK' ? '£' : '$'}
                {(lead.potential_value || 1000).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasPhone && whatsappUrl) {
                    window.open(whatsappUrl, '_blank');
                  }
                }}
                disabled={!hasPhone}
                className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-sm border border-emerald-100 hover:bg-emerald-100 transition-colors shrink-0
                  ${!hasPhone ? 'text-slate-300 bg-slate-100 border border-slate-200 cursor-not-allowed opacity-50' : ''}
                `}
              >
                <MessageCircle className="w-4 h-4 fill-current" strokeWidth={2.5} />
                WhatsApp
              </button>
              
              {lead.status === "New Lead" && (
                <button
                  onClick={handleWaitlistClick}
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all shrink-0"
                  title="Move to Waitlist"
                >
                  <Users className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}, (prev, next) => (
  prev.lead.id === next.lead.id && 
  prev.lead.status === next.lead.status && 
  prev.lead.intent_score === next.lead.intent_score &&
  prev.focusMode === next.focusMode &&
  prev.lead.phone === next.lead.phone
));
