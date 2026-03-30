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
      return { label: "Send Welcome", icon: Hand, color: "bg-[#10B981]" };
    case "Booked":
      return { label: "Confirm Appt", icon: CalendarCheck, color: "bg-[#6366F1]" };
    case "Visited":
    case "Proposal Sent":
      return { label: "Send PT (Plan)", icon: FileText, color: "bg-[#87A96B]" };
    case "Treated":
    case "Closed Won":
      return { label: "Send Care Instructions", icon: ShieldCheck, color: "bg-[#0F172A]" };
    default:
      return { label: "Contact Now", icon: MessageCircle, color: "bg-slate-800" };
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
            ? "0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)"
            : isOverdue
              ? "0 0 15px rgba(230,57,70,0.6)"
              : "0 10px 30px -10px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.05)",
          opacity: isDragging ? 0.95 : 1,
          backgroundColor: isDragging ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,1)",
          y: isDragging ? -10 : 0
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20 }}
        className={`rounded-2xl p-4 relative group focus:outline-none transition-all
          ${isDragging ? 'border-emerald-500/30 cursor-grabbing bg-white shadow-2xl' :
            isOverdue ? 'border-[#E63946]/50 hover:border-[#E63946]/80 cursor-grab animate-pulse bg-white shadow-lg' :
              'border-slate-200/60 hover:border-emerald-500/20 cursor-grab bg-white shadow-sm'
          }`}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 outline-none rounded-2xl" />

        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-black text-base tracking-tight text-slate-900 truncate mr-2 flex items-center gap-2" data-hj-suppress>
                {lead.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-bold mt-0.5 uppercase tracking-tighter">Joined {timeAgo(lead.created_at)}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[14px] font-black text-[#10B981] tracking-tight tabular-nums">
                {currency}{(lead.potential_value ? lead.potential_value : (1000)).toLocaleString()}
              </span>
              {isOverdue && (
                <span className="text-[9px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 border border-[#FF3B30]/20 px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="w-2 h-2" strokeWidth={1.5} /> Urgent
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-1 items-center">
            {lead.intent_score && (
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 border ${lead.intent_score >= 80 ? 'text-[#00FFA3] bg-[#00FFA3]/10 border-[#00FFA3]/20' :
                lead.intent_score >= 50 ? 'text-[#C5A059] bg-[#C5A059]/10 border-[#C5A059]/20' :
                  'text-[#FF3B30] bg-[#FF3B30]/10 border-[#FF3B30]/20'
                }`}>
                <Sparkles className="w-2 h-2" /> AI {lead.intent_score}%
              </span>
            )}
            <span className="text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-tighter">
              {lead.service}
            </span>
            {lead.appointment_date && !isNaN(new Date(lead.appointment_date).getTime()) && (
              <span className="text-[11px] font-bold text-slate-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-tighter">
                {new Date(lead.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {lead.status === "Consultation Done" && (
              <span className="text-[10px] font-bold text-[#0A0F1E] bg-[#10B981] px-2 py-0.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                Consulted
              </span>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex flex-col gap-2 w-full">
              {/* Context-Aware WhatsApp Button */}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const { label } = getActionConfig(lead.status);
                  console.log(`[ACTION] WhatsApp triggering: ${label}`);
                  
                  if (hasPhone) {
                    onOpenWhatsAppModal?.(lead);
                  } else {
                    alert("⚠️ CANNOT CONNECT: This lead is missing a registered phone number. Please update the patient records.");
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-xl transition-all border
                  ${hasPhone 
                    ? `${getActionConfig(lead.status).color} text-white border-transparent hover:scale-[1.02] active:scale-95 shadow-md shadow-black/5` 
                    : 'text-zinc-400 bg-slate-50 border-slate-200 cursor-not-allowed opacity-50'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  {React.createElement(getActionConfig(lead.status).icon, { className: "w-3.5 h-3.5", strokeWidth: 2.5 })}
                  <span className="text-[10px] font-black uppercase tracking-widest font-inter">
                    {getActionConfig(lead.status).label}
                  </span>
                </div>
                <MessageCircle className="w-3.5 h-3.5 opacity-50" strokeWidth={2} />
              </button>

              <div className="flex gap-2">
                {/* Context-Aware Email Button */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const { label } = getActionConfig(lead.status);
                    console.log(`[ACTION] Email triggering: ${label}`);
                    onOpenEmailModal?.(lead);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 group/email"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400 group-hover/email:text-slate-900 transition-colors" strokeWidth={2} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-900 font-inter">
                    Email {getActionConfig(lead.status).label.replace("Send ", "")}
                  </span>
                </button>

                {/* Audit Button */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenAudit?.(lead);
                  }}
                  className="p-2 text-slate-400 hover:text-purple-600 bg-slate-50 hover:bg-purple-50 rounded-xl transition-all border border-slate-200 hover:border-purple-200"
                  title="View Security Audit Trail"
                >
                  <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
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
