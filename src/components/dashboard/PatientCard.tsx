import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Users, RefreshCw, FileText, Sparkles, 
  AlertTriangle, Monitor, Send, MessageCircle 
} from 'lucide-react';
import { type ConsultationRequest } from "../../lib/supabase";

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
}

export const PatientCard = React.memo(function PatientCard({
  id,
  lead,
  setSelectedLead,
  timeAgo,
  clinic: clinicData,
  onAddToWaitlist,
  onOpenPTMode
}: PatientCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

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

  const handleSendEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSendingEmail(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-pt-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          lead_id: lead.id,
          name: lead.name,
          email: lead.email,
          service: lead.service,
          origin: window.location.origin,
          clinic_name: clinicData?.name,
          clinic_logo: clinicData?.logo_url,
          brand_color: clinicData?.brand_color,
          clinic_phone: clinicData?.phone,
          clinic_address: clinicData?.address,
          clinic_email: clinicData?.email
        })
      });

      if (!response.ok) throw new Error("Failed to send email");
      alert(`PT Link successfully sent to ${lead.email}!`);
    } catch (err) {
      console.error(err);
      alert("Error sending email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

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
          ${isDragging ? 'border-emerald-500/30 cursor-grabbing bg-[#0A0F1E]/80 backdrop-blur-3xl shadow-2xl' :
            isOverdue ? 'border-[#E63946]/50 hover:border-[#E63946]/80 cursor-grab animate-pulse bg-white/5 backdrop-blur-xl' :
              'border-white/10 hover:border-emerald-500/20 cursor-grab hover:bg-white/[0.08] bg-white/5 backdrop-blur-xl shadow-lg'
          }`}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 outline-none rounded-2xl" />

        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-bold text-[14px] tracking-[-0.02em] text-white truncate mr-2 flex items-center gap-2" data-hj-suppress>
                {lead.name}
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium mt-1 lowercase">Joined {timeAgo(lead.created_at)}</p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[14px] font-black text-[#10B981] tracking-tight tabular-nums">
                £{(lead.potential_value ? lead.potential_value : (1000)).toLocaleString()}
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
            <span className="text-[10px] font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-md border border-white/10 uppercase tracking-tighter">
              {lead.service}
            </span>
            {lead.appointment_date && !isNaN(new Date(lead.appointment_date).getTime()) && (
              <span className="text-[10px] font-bold text-[#87A96B] bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {new Date(lead.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {lead.status === "Consultation Done" && (
              <span className="text-[10px] font-bold text-[#0A0F1E] bg-[#10B981] px-2 py-0.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                Consulted
              </span>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-white/[0.05] flex justify-between items-center pointer-events-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex gap-2 w-full justify-end">
              {lead.status === "New Lead" && (
                <button
                  onClick={handleWaitlistClick}
                  className="px-3 py-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 self-center mr-1"
                  title="Move to Waitlist"
                >
                  <Users className="w-3 h-3" strokeWidth={1.5} /> Waitlist
                </button>
              )}

              {/* Dynamic WhatsApp Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasPhone && whatsappUrl) {
                    window.open(whatsappUrl, '_blank');
                  }
                }}
                disabled={!hasPhone}
                className={`p-1.5 rounded-lg transition-all border flex items-center justify-center
                  ${hasPhone 
                    ? 'text-[#25D366] bg-[#25D366]/10 border-[#25D366]/20 hover:bg-[#25D366]/20 hover:shadow-[0_0_15px_rgba(37,211,102,0.4)]' 
                    : 'text-zinc-600 bg-white/5 border-white/5 cursor-not-allowed opacity-50'
                  }`}
                title={hasPhone ? "Contact via WhatsApp" : "Phone number required"}
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPTMode(lead);
                }}
                className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-all border border-emerald-500/20 shadow-lg shadow-emerald-500/5"
                title="Open Tablet PT Consultation Mode"
              >
                <Monitor className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedLead(lead);
                }}
                className="p-1.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
                title="View Inquiry details"
              >
                <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
              </button>

              <button
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="p-1.5 text-[#87A96B] hover:text-[#87A96B]/80 bg-[#87A96B]/10 hover:bg-[#87A96B]/20 rounded-lg transition-all border border-[#87A96B]/20 disabled:opacity-50"
                title="Send PT Link via Email"
              >
                {isSendingEmail ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#87A96B]" strokeWidth={1.5} /> : <Send className="w-3.5 h-3.5" strokeWidth={1.5} />}
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
  prev.lead.status === next.lead.status &&
  prev.lead.phone === next.lead.phone
));
