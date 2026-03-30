import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Send, MessageCircle, Shield, AlertTriangle, Sparkles, Users, Hand, CalendarCheck, ShieldCheck, FileText, Mail } from 'lucide-react';
import { type ConsultationRequest } from "../../lib/supabase";
import { useDashboardStore } from "../../store/useDashboardStore";

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
  const { clinicName } = useDashboardStore();

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
        whileHover={{ scale: 1.02 }}
        animate={isExiting ? { opacity: 0, scale: 0.8, x: 50, filter: "blur(4px)" } : {
          scale: isDragging ? 1.02 : 1,
          rotate: isDragging ? 2 : 0,
          boxShadow: isDragging
            ? "0 10px 30px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)"
            : isOverdue
              ? "0 0 10px rgba(230,57,70,0.2)"
              : "0 2px 10px rgba(0,0,0,0.02), 0 4px 20px rgba(0,0,0,0.02)",
          opacity: isDragging ? 0.95 : 1,
          backgroundColor: isDragging ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,1)",
          y: isDragging ? -10 : 0
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className={`rounded-2xl p-6 relative group focus:outline-none transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)] border
          ${isDragging ? 'border-[#1a1a1a]/10 cursor-grabbing bg-white' :
            isOverdue ? 'border-[#E63946]/50 hover:border-[#E63946]/80 cursor-grab animate-pulse bg-white' :
              'border-[#1a1a1a]/5 hover:border-[#88b399]/20 cursor-grab bg-white'
          }`}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 outline-none rounded-2xl" />

        {/* Patient Journey Viz */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-100 rounded-t-2xl overflow-hidden z-0">
          <div 
            className="h-full bg-gradient-to-r from-slate-300 to-[#88b399]" 
            style={{ width: `${lead.intent_score || Math.min(100, (lead.potential_value || 1000) / 100)}%` }}
          />
        </div>

        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-black text-[#1a1a1a] text-sm tracking-tighter truncate mr-2 flex items-center gap-2" data-hj-suppress>
                {lead.name}
              </h4>
              <p className="text-[11px] text-[#4f4f4f] font-semibold mt-0 tracking-tight">Joined {timeAgo(lead.created_at)}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[14px] font-bold text-[#1a1a1a] tracking-tight tabular-nums font-montserrat">
                {currency}{(lead.potential_value ? lead.potential_value : (1000)).toLocaleString()}
              </span>
              {isOverdue && (
                <span className="text-[9px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-2 h-2" strokeWidth={1.5} /> Urgent
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-1 items-center">
            {lead.intent_score && (
              <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-tight flex items-center gap-1 border ${lead.intent_score >= 80 ? 'text-[#1a1a1a] bg-[#88b399]/20 border-transparent' :
                lead.intent_score >= 50 ? 'text-[#1a1a1a] bg-[#c5a059]/30 border-transparent' :
                  'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20'
                }`}>
                <Sparkles className="w-2.5 h-2.5" strokeWidth={1.5} /> AI {lead.intent_score}%
              </span>
            )}
            <span className="text-[11px] font-semibold text-[#1a1a1a] font-inter px-2 py-1 rounded uppercase tracking-tight bg-slate-50 border border-slate-100">
              {lead.service}
            </span>
            {lead.appointment_date && !isNaN(new Date(lead.appointment_date).getTime()) && (
              <span className="text-[11px] font-semibold text-[#004d40] bg-[#004d40]/5 px-2 py-1 border border-[#004d40]/10 rounded uppercase tracking-tight">
                {new Date(lead.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {lead.status === "Consultation Done" && (
              <span className="text-[11px] font-semibold text-[#004d40] bg-[#004d40]/10 border border-[#004d40]/20 px-2 py-1 rounded tracking-tight">
                Consulted
              </span>
            )}
          </div>
          
          <div className="mt-5 pt-5 border-t border-[#1a1a1a]/[0.03] flex flex-col gap-2 pointer-events-auto transition-all duration-300">
            <div className="flex flex-col gap-2 w-full">
              {/* Context-Aware Primary Action Button */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const { label } = getActionConfig(lead.status);
                  console.log(`[ACTION] Top Button triggering: ${label}`);
                  
                  if (hasPhone) {
                    onOpenWhatsAppModal?.(lead);
                  } else {
                    alert("⚠️ CANNOT CONNECT: This lead is missing a registered phone number. Please update the patient records.");
                  }
                }}
                className={`group/main flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl transition-all border backdrop-blur-sm relative overflow-hidden w-full
                  ${hasPhone 
                    ? `${getActionConfig(lead.status).text} ${getActionConfig(lead.status).bg} hover:text-white ${getActionConfig(lead.status).hoverBg} ${getActionConfig(lead.status).border}` 
                    : 'text-[#4f4f4f] bg-slate-50 border-slate-200 cursor-not-allowed opacity-50'
                  }`}
              >
                <div className="absolute inset-0 bg-white/40 pointer-events-none group-hover/main:opacity-0 transition-opacity" />
                {React.createElement(getActionConfig(lead.status).icon, { className: "w-3.5 h-3.5 relative z-10", strokeWidth: 1.5 })}
                <span className="text-[10px] font-bold uppercase tracking-tight font-inter relative z-10">
                  {getActionConfig(lead.status).label}
                </span>
              </button>

              <div className="flex gap-2">
                {(lead.status === "Treated" || lead.status === "Closed Won") && (
                   <button
                     onPointerDown={(e) => e.stopPropagation()}
                     onClick={(e) => {
                       e.preventDefault();
                       e.stopPropagation();
                       onOpenEmailModal?.(lead);
                     }}
                     className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-transparent border border-slate-200 rounded-xl text-[#004d40] border-[#004d40]/30 hover:border-[#004d40] hover:bg-[#004d40]/5 transition-all duration-300 font-inter backdrop-blur-sm relative overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-white/40 pointer-events-none group-hover/btn:opacity-0 transition-opacity" />
                     <Mail className="w-3.5 h-3.5 relative z-10" strokeWidth={1.5} />
                     <span className="text-[10px] font-bold uppercase tracking-tight relative z-10">Post-Op</span>
                   </button>
                )}
                {/* Context-Aware Email Button */}
                {!(lead.status === "Treated" || lead.status === "Closed Won") && (
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const { label } = getActionConfig(lead.status);
                      console.log(`[ACTION] Email triggering: ${label}`);
                      onOpenEmailModal?.(lead);
                    }}
                    className="group/email flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/30 pointer-events-none group-hover/email:opacity-0 transition-opacity" />
                    <Mail className="w-3.5 h-3.5 text-slate-400 group-hover/email:text-slate-700 transition-colors relative z-10" strokeWidth={1.5} />
                    <span className="text-[10px] font-bold uppercase tracking-tight font-inter relative z-10">
                      Email
                    </span>
                  </button>
                )}

                {/* Audit Button */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenAudit?.(lead);
                  }}
                  className="px-3 py-1.5 text-slate-400 hover:text-[#1a1a1a] bg-white rounded-xl transition-all border border-slate-200 hover:border-slate-300 flex items-center justify-center relative overflow-hidden"
                  title="View Security Audit Trail"
                >
                  <Shield className="w-3.5 h-3.5 relative z-10" strokeWidth={1.5} />
                </button>
              </div>
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
