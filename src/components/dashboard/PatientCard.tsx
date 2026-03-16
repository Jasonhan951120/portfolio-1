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
    if (!lead.phone) return null;
    
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
    
    return `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const hasPhone = !!lead.phone;
  const whatsappUrl = getWhatsAppLink();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "transform 400ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    zIndex: isDragging ? 50 : 1,
  };

  const isOverdue = (lead.status === "New Lead") && (Date.now() - baseline) > 86400000;

  return (
    <div ref={setNodeRef} style={style} className="mb-4 outline-none px-1 h-[148px] transition-luxury">
      <motion.div
        layout
        initial={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        animate={isExiting ? { opacity: 0, scale: 0.8, x: 50, filter: "blur(4px)" } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`h-full rounded-3xl p-4 relative group transition-all bg-white border-[0.5px] border-slate-200/60 shadow-luxury hover:shadow-luxury-hover active:scale-[0.98]
          ${isDragging ? 'opacity-50' : ''} 
          ${isOverdue ? 'border-red-500/30' : ''}
          ${showVIPPulse ? 'ring-2 ring-red-400 animate-pulse' : ''}
          ${!isMatchingFocus && focusMode !== "All" ? 'grayscale opacity-50 scale-[0.9] translate-y-4' : 'ring-2 ring-emerald-400/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]'}
        `}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 cursor-grab" />
        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="font-bold text-[13px] text-slate-900 truncate w-32">{lead.name}</h4>
                {isVIP && (
                  <span className="text-[8px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                    VIP
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-slate-600/80">{timeAgo(lead.created_at, region)}</p>
            </div>
            <span className="text-[14px] metric-authority">
              {region === 'UK' ? '£' : '$'}
              {(lead.potential_value || 1000).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black tabular-nums tracking-tighter ${lead.intent_score && lead.intent_score >= 80 ? 'text-emerald-600' : 'text-slate-900'}`}>
                {lead.intent_score || 0}%
              </span>
              <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-widest opacity-70">AI Intent</span>
              {lead.intent_score && lead.intent_score >= 80 && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-tight shadow-sm border border-emerald-200/50">
                  🔥 High Intent
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 uppercase w-fit">{lead.service}</span>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all">
            
            {/* Dynamic WhatsApp Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (hasPhone && whatsappUrl) {
                  window.open(whatsappUrl, '_blank');
                }
              }}
              disabled={!hasPhone}
              className={`p-1.5 rounded-lg transition-all btn-tactile flex items-center gap-1.5 px-2 relative
                ${hasPhone 
                  ? 'text-[#25D366] hover:bg-[#25D366]/5 shadow-sm hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]' 
                  : 'text-slate-300 cursor-not-allowed opacity-50'
                }
                ${lead.intent_score && lead.intent_score >= 80 ? 'ring-2 ring-emerald-400 ring-offset-2 animate-pulse-gentle' : ''}
              `}
              title={hasPhone ? "Contact via WhatsApp" : "Phone number required"}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">WhatsApp</span>
            </button>

            <button 
              onClick={() => onOpenAudit(lead)} 
              className="p-1.5 text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 hover:scale-110 rounded-lg transition-all btn-tactile"
              title="Security & Audit Trail"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <div className="relative group/popover">
              <button 
                onMouseEnter={(e) => {
                  setAnchorRect(e.currentTarget.getBoundingClientRect());
                  setIsCaseNoteVisible(true);
                }}
                onMouseLeave={() => setIsCaseNoteVisible(false)}
                onClick={(e) => {
                  setAnchorRect(e.currentTarget.getBoundingClientRect());
                  setIsCaseNoteVisible(!isCaseNoteVisible);
                }}
                className="p-1.5 text-slate-600 hover:text-indigo-500 hover:bg-indigo-50 hover:scale-110 rounded-lg transition-all btn-tactile"
                title="AI Value Reasoning"
              >
                <FileText className="w-3.5 h-3.5" />
              </button>
              <AICaseNotePopover lead={lead} isVisible={isCaseNoteVisible} anchorRect={anchorRect} />
            </div>
            
            {lead.status === "New Lead" && (
                <button
                  onClick={handleWaitlistClick}
                  className="p-1.5 text-slate-600 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all btn-tactile"
                  title="Move to Waitlist"
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
              )}
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
