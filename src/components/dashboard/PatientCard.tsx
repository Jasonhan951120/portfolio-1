import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Send, MessageCircle, Shield, AlertTriangle, Sparkles, Users, Hand, CalendarCheck, ShieldCheck, FileText, Mail, FileCog } from 'lucide-react';
import { type ConsultationRequest } from "../../lib/supabase";
import { useDashboardStore } from "../../store/useDashboardStore";
import { INDUSTRY_TEMPLATES } from "../../lib/treatmentTemplates";
import { AnimatePresence } from 'motion/react';
import { calculateFuzzyMatch } from "../../lib/autoMatcher";

const getActionConfig = (status: string) => {
  switch (status) {
    case "New Lead":
      return { label: "Send Welcome", icon: Hand, text: "text-[#004d40]", bg: "bg-[#004d40]/5", hoverBg: "hover:bg-[#004d40]", border: "border-[#004d40]/10" };
    case "Booked":
    case "Consultation Done":
      return { label: "Confirm Appt", icon: CalendarCheck, text: "text-[#004d40]", bg: "bg-[#004d40]/5", hoverBg: "hover:bg-[#004d40]", border: "border-[#004d40]/10" };
    case "Visited":
    case "Proposal Sent":
      return { label: "Resend PT", icon: FileText, text: "text-[#88b399]", bg: "bg-[#88b399]/10", hoverBg: "hover:bg-[#88b399]", border: "border-[#88b399]/20" };
    case "Treated":
    case "Closed Won":
      return { label: "Send Care", icon: ShieldCheck, text: "text-[#1a1a1a]", bg: "bg-[#1a1a1a]/5", hoverBg: "hover:bg-[#1a1a1a]", border: "border-[#1a1a1a]/10" };
    default:
      return { label: "Contact Now", icon: MessageCircle, text: "text-[#1a1a1a]", bg: "bg-[#1a1a1a]/5", hoverBg: "hover:bg-[#1a1a1a]", border: "border-[#1a1a1a]/10" };
  }
};

interface PatientCardProps {
  id: string;
  lead: ConsultationRequest;
  setDepositModal: any;
  setSelectedLead: (lead: ConsultationRequest) => void;
  updateStatus: (id: string, status: string) => void;
  STAFF_LIST: string[];
  updateAssignedTo: (id: string, staff: string) => void;
  timeAgo: (date: string) => string;
  clinic: any;
  onAddToWaitlist?: (id: string) => void;
  onOpenPTMode: (lead: ConsultationRequest) => void;
  onOpenAudit: (lead: ConsultationRequest) => void;
  onOpenEmailModal: (lead: ConsultationRequest) => void;
  onOpenWhatsAppModal?: (lead: ConsultationRequest) => void;
  focusMode: string;
  currency?: string;
}

export const PatientCard = React.memo(function PatientCard({
  id,
  lead,
  setSelectedLead,
  timeAgo,
  clinic: clinicData,
  onAddToWaitlist,
  onOpenPTMode,
  onOpenAudit,
  onOpenEmailModal,
  onOpenWhatsAppModal,
  focusMode,
  setDepositModal,
  updateAssignedTo,
  currency = "£"
}: PatientCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isExiting, setIsExiting] = useState(false);
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const { clinicName, activeTreatments, templates, updateLead } = useDashboardStore();

  const searchService = (lead.service || '').toLowerCase();
  
  // High-End Auto-Matching Logic (Fuzzy Match)
  // Fallback to local templates if DB activeTreatments hasn't loaded
  const matcherSource = activeTreatments?.length > 0 ? activeTreatments : templates;
  const matchedTemplate = calculateFuzzyMatch(searchService, matcherSource);
  const isUnmapped = !matchedTemplate;
  const officialPrice = matchedTemplate?.potential_revenue || matchedTemplate?.price;
  const isPriceMismatch = matchedTemplate && lead.potential_value !== officialPrice && lead.potential_value != null && officialPrice != null;
  useEffect(() => {
    const created = new Date(lead.created_at).getTime();
    const now = Date.now();
    const diffSec = Math.floor((created + 15 * 60 * 1000 - now) / 1000);
    setTimeLeft(Math.max(0, diffSec));

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [lead.created_at]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });


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
        message = `Hi ${firstName}, checking in from ${clinicName || "Hanlan OC"}. How can we help you today?`;
    }
    
    return `https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
  };

  const hasPhone = !!lead.phone;
  const whatsappUrl = getWhatsAppLink();

  const isVIP = lead.name.toLowerCase().includes("vip");
  const timeLimit = isVIP ? 15 * 60 * 1000 : 86400000;
  const isOverdue = (lead.status === "New Lead" || lead.status === "Future Pipeline") && (Date.now() - new Date(lead.created_at).getTime()) > timeLimit;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "transform 400ms cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3 outline-none">
      <motion.div
        layout
        initial={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        whileDrag={{ rotate: 2, scale: 1.02 }}
        animate={isExiting ? { opacity: 0, scale: 0.8, x: 50, filter: "blur(4px)" } : {
          scale: isDragging ? 1.02 : 1,
          rotate: isDragging ? 2 : 0,
          boxShadow: isDragging
            ? "0 10px 30px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)"
            : isOverdue
              ? "0 0 10px rgba(230,57,70,0.1)"
              : "0 8px 30px rgba(0,0,0,0.02)",
          opacity: isDragging ? 0.95 : 1,
          backgroundColor: isDragging ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.95)",
          y: isDragging ? -10 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`rounded-2xl p-6 relative group focus:outline-none transition-all border backdrop-blur-xl
          ${isDragging ? 'border-slate-300 cursor-grabbing shadow-xl' :
            isOverdue ? 'border-rose-200 hover:border-rose-300 cursor-grab bg-white shadow-sm' :
              'border-slate-200/60 hover:border-slate-300 hover:shadow-md cursor-grab bg-white shadow-sm'
          }`}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 outline-none rounded-2xl" />

        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-5">
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-[15px] tracking-tight leading-tight truncate mr-2" data-hj-suppress>
                {lead.name}
              </h4>
              <div className="flex items-center gap-2">
                 <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Joined {timeAgo(lead.created_at)}</p>
                 <div className="w-1 h-1 rounded-full bg-slate-200" />
                 <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider truncate max-w-[80px]">{lead.service}</p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-[14px] font-bold text-slate-900 tracking-tighter tabular-nums">
                {currency}{(lead.potential_value ? lead.potential_value : (1000)).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 items-center">
            {isUnmapped && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/50">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none">
                    AI DRAFT
                  </span>
                </div>
            )}
            
            {lead.appointment_date && (
               <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100/50">
                 <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none">
                    Confirmed: {new Date(lead.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                 </span>
               </div>
            )}
          </div>
          
          <div className="space-y-2 pointer-events-auto">
            {/* AI GENERATE PT (Primary) */}
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (isUnmapped) {
                  setIsAIGenerating(true);
                  setTimeout(() => {
                      setIsAIGenerating(false);
                      window.open(`/pt/draft/${lead.id}?treatment=${encodeURIComponent(lead.service || 'New Treatment')}`);
                  }, 1500);
                  return;
                }
                onOpenPTMode?.(lead);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200/60 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200 group/pt"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">
                {isUnmapped ? "Draft Treatment Plan" : "Send Premium PT"}
              </span>
            </button>

            <div className="flex gap-2">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenEmailModal?.(lead);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200/60 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-widest leading-none">
                  Email
                </span>
              </button>

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenAudit?.(lead);
                }}
                className="px-3.5 py-2.5 bg-white border border-slate-200/60 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors duration-200"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}, (prev, next) => (
  prev.lead === next.lead && 
  prev.clinic === next.clinic && 
  prev.id === next.id &&
  prev.currency === next.currency &&
  prev.lead.status === next.lead.status &&
  prev.lead.phone === next.lead.phone
));
