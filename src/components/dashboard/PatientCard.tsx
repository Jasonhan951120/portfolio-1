import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Send, MessageCircle, Shield, AlertTriangle, Sparkles, Users, Hand, CalendarCheck, ShieldCheck, FileText, Mail, FileCog, HeartPulse, MessageSquare, Heart, X, Loader2 } from 'lucide-react';
import { supabase, type ConsultationRequest } from "../../lib/supabase";
import { useDashboardStore } from "../../store/useDashboardStore";
import { INDUSTRY_TEMPLATES } from "../../lib/treatmentTemplates";
import { calculateFuzzyMatch } from "../../lib/autoMatcher";
import { DraftPreviewModal } from "./DraftPreviewModal";

const generateUniversalAIPrompt = (type: string, service: string, patientName: string, draftContext: string = '', age?: number) => {
  const agePrompt = age ? `\nCurrent Patient Age: [${age}].\nMandate: You MUST adjust your tone of voice and the psychological benefits you highlight based on this age. \nExample: For a 70-year-old, don't talk about 'looking cool on social media'; talk about 'enjoying meals with family comfortably'.` : '';
  const baseInstruction = `You are an elite medical concierge AI. Use your expert medical knowledge to provide highly accurate, specialty-specific advice.${agePrompt}`;

  switch (type) {
    case 'DRAFT':
      return `${baseInstruction}\n\n[INTERNAL USE]\nAnalyze the case for ${patientName} regarding '${service}'. Generate a preliminary clinical strategy and a concise "Consultation Cheat Sheet" for the doctor/staff to use during the consultation. Focus on identifying clinical risks and opportunities for excellence.`;
    case 'PROPOSAL':
      return `${baseInstruction}\n\n[PSYCHOLOGICAL TRIGGER: AUTHORITY]\nFocus on "Personalized Strategy," "Clinical Precision," and "Visual Simulation." Build absolute trust through clinical logic. 
      Style: Formal, authoritative, structured with clear headers. 
      Goal: Make the patient feel, "This clinic has the only solution for me."
      Patient Name/Service: ${patientName} / ${service}
      MANDATE: Include clinical rationale for every step. 
      Include proposal link: ${window.location.origin}/proposal/[id]`;
    case 'FOLLOWUP':
      return `${baseInstruction}\n\n[PSYCHOLOGICAL TRIGGER: EMPATHY]\nStrategy: Remove friction (Cost, Fear, Doubt). DO NOT repeat the clinical plan verbatim. 
      Tone: Shorter, warmer, "Quiet Luxury" letter style. High white-space. 
      MANDATE: Use phrases like "I noticed you haven't started yet—is there anything we can clarify regarding pain management or financing?" 
      End with a soft question: "What is the biggest hurdle for you right now?"`;
    case 'POSTCARE':
      return `${baseInstruction}\n\n[PSYCHOLOGICAL TRIGGER: DELIGHT]\nStrategy: Lifetime Value & Referral. Recovery tips + Deep gratitude. 
      Emotional, celebratory, high-end appreciation. 
      MANDATE: Include "Your transformation is our pride." Reflect on the excellence of the results achieved for ${service}.`;
    default:
      return '';
  }
};

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

  // AI Preview Modal State
  const [aiModal, setAiModal] = useState<{ isOpen: boolean, type: string, content: string, isLoading: boolean }>({
    isOpen: false,
    type: '',
    content: '',
    isLoading: false
  });

  const handleOpenAIModal = (type: string) => {
    setAiModal({ isOpen: true, type, content: '', isLoading: true });

    // Simulate AI Generation
    setTimeout(() => {
      const generatedPrompt = generateUniversalAIPrompt(type, lead.service || 'General Treatment', lead.name, lead.ai_draft_context || '', lead.age);

      // We simulate sending exactly this prompt to the AI and getting a response back.
      let mockResponse = '';
      const patientAge = lead.age || 40;

      let toneAdaptation = '';
      if (patientAge < 40) {
        toneAdaptation = 'Focusing on fast, confident results to fit your busy, modern lifestyle.';
      } else if (patientAge < 60) {
        toneAdaptation = 'Focusing on long-term durability, efficiency, and restoring your optimal quality of life.';
      } else {
        toneAdaptation = 'Focusing on your health, safety, and ensuring a gentle, comfortable experience with long-lasting benefits.';
      }

      if (type === 'DRAFT') {
        mockResponse = `[CONFIDENTIAL - INTERNAL STRATEGY]\n\nPatient: ${lead.name} ${lead.age ? `(${lead.age}y)` : ''}\nTreatment: ${lead.service || 'General Treatment'}\n\nClinical Precision Engine Initialized. Priority: Accuracy & Authority.`;
      } else if (type === 'PROPOSAL') {
        const proposalUrl = `${window.location.origin}/proposal/${lead.id.substring(0, 8)}`;
        mockResponse = `Dear ${lead.name.split(' ')[0]},\n\n### Clinical Strategic Approach\nFollowing our review, we have prioritized a bespoke intervention for your ${lead.service || 'treatment'}. This protocol utilizes state-of-the-art diagnostic mapping to ensure absolute precision.\n\n### Visual Protocol Simulation\nWe have prepared a dedicated clinical portal detailing the predicted aesthetic outcomes and structural integrity of your transformation.\n\n✨ [Authorize My Clinical Protocol: ${proposalUrl}]\n\nBest regards,\nThe Hanlan Medical Team`;
      } else if (type === 'FOLLOWUP') {
        mockResponse = `Hi ${lead.name.split(' ')[0]},\n\nI noticed you haven't started your ${lead.service || 'transformation'} yet—is there anything we can clarify regarding pain management or financing? We believe in a Supportive Path that removes all friction.\n\nWhat is the biggest hurdle for you right now?\n\nWarmly, The Hanlan Care Team`;
      } else if (type === 'POSTCARE') {
        mockResponse = `Dear ${lead.name.split(' ')[0]},\n\nYour transformation is our pride! We are absolutely delighted with the excellence achieved during your ${lead.service || 'procedure'}.\n\nDeepest gratitude for trusting us, we look forward to your global radiance.\n\nWith celebratory care, The Hanlan Elite Team`;
      }

      setAiModal(prev => ({ ...prev, content: mockResponse, isLoading: false }));
    }, 1200);
  };
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
        className={`rounded-[24px] p-6 relative group focus:outline-none transition-all border
          ${isDragging ? 'border-transparent shadow-[0_20px_40px_rgba(0,0,0,0.1)] scale-105 z-50' :
            isOverdue ? 'border-rose-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02),0_15px_20px_-5px_rgba(230,57,70,0.08)]' :
              'border-slate-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02),0_20px_25px_-5px_rgba(0,0,0,0.03)] hover:shadow-[0_25px_30px_-5px_rgba(0,0,0,0.04)] cursor-grab'
          }`}
      >
        <div {...attributes} {...listeners} className="absolute inset-0 z-0 outline-none rounded-[24px]" />

        <div className="relative z-10 pointer-events-none">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-2">
              <h4 className="font-bold text-slate-900 text-sm tracking-tighter leading-none truncate mb-1.5" data-hj-suppress>
                {lead.name} {lead.age ? <span className="text-[10px] text-slate-400 font-medium tracking-widest align-bottom ml-1">({lead.age}y)</span> : ''}
              </h4>
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold leading-none truncate max-w-[140px]">{lead.service}</span>
              </div>
              {(lead.email || lead.phone) && (
                <div className="flex flex-col gap-0.5 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  {lead.email && <span className="text-[9px] text-slate-400 font-medium lowercase tracking-tight truncate leading-none">{lead.email}</span>}
                  {lead.phone && <span className="text-[9px] text-slate-400 font-medium tracking-tight leading-none">{lead.phone}</span>}
                </div>
              )}
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-sm font-bold text-slate-900 tracking-tighter tabular-nums">
                {currency}{(lead.potential_value ? lead.potential_value : (1000)).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6 items-center">
            {isUnmapped && (
              <div className="flex items-center px-3 py-1.5 rounded-full bg-indigo-50/50">
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest leading-none">
                  AI DRAFT
                </span>
              </div>
            )}

            {lead.appointment_date && (
              <div className="px-3 py-1.5 rounded-full bg-emerald-50/50">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest leading-none">
                  Confirmed: {new Date(lead.appointment_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2.5 pointer-events-auto">
            {/* Contextual Revenue-Driving Primary Button */}
            {(() => {
              let label = "AI DRAFT PT";
              let Icon = Sparkles;
              let action = () => {
                handleOpenAIModal('DRAFT');
              };

              if (lead.status === "Booked") {
                label = "SEND PT PLAN";
                Icon = Send;
                action = () => handleOpenAIModal('PROPOSAL');
              } else if (lead.status === "Visited") {
                label = "FOLLOW-UP CARE";
                Icon = HeartPulse;
                action = () => handleOpenAIModal('FOLLOWUP');
              } else if (lead.status === "Treated" || lead.status === "Closed Won") {
                label = "POST-CARE & THANKS";
                Icon = Heart;
                action = () => handleOpenAIModal('POSTCARE');
              }

              return (
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    action();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-slate-200/60 rounded-full hover:bg-slate-50 transition-colors duration-200 group/pt"
                >
                  <Icon className="w-4 h-4 text-slate-700" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-slate-700 uppercase tracking-widest">
                    {label}
                  </span>
                </button>
              );
            })()}

            <div className="flex gap-2.5">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenEmailModal?.(lead);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-transparent border border-slate-200/60 rounded-full hover:bg-slate-50 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest leading-none">
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
                className="w-12 flex items-center justify-center py-2.5 bg-transparent border border-slate-200/60 rounded-full hover:bg-slate-50 transition-colors duration-200"
              >
                <Shield className="w-4 h-4 text-slate-400" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <DraftPreviewModal 
        isOpen={aiModal.isOpen}
        onClose={() => setAiModal(prev => ({ ...prev, isOpen: false }))}
        lead={lead}
        type={aiModal.type}
        content={aiModal.content}
        isLoading={aiModal.isLoading}
        onContentChange={(content) => setAiModal(prev => ({ ...prev, content }))}
        onSave={() => {
          updateLead(lead.id, { ai_draft_context: aiModal.content });
          setAiModal(prev => ({ ...prev, isOpen: false }));
        }}
        onSendWhatsApp={() => {
          const testPhone = "821033951543";
          const patientName = lead.name || 'a patient';
          const treatmentName = lead.service || lead.treatment_name || 'treatment';
          
          let message = "";
          if (aiModal.type === 'PROPOSAL') {
            message = `Hello Hanlanoc Clinic, this is ${patientName}. ✨ I have reviewed my clinical strategy for ${treatmentName} at https://www.hanlanoc.com and I am ready to start my transformation! Please let me know the next steps for scheduling my first appointment.`;
          } else if (aiModal.type === 'FOLLOWUP') {
            message = `Hello Hanlanoc Clinic, this is ${patientName}. ✨ I noticed I haven't scheduled my follow-up yet for ${treatmentName}. I have a few questions regarding pain management or financing. Could we chat?`;
          } else if (aiModal.type === 'POSTCARE') {
            message = `Hello Hanlanoc Clinic, this is ${patientName}. ✨ Thank you for the amazing care during my ${treatmentName}! I'm recovering well and so happy with the results. See you for my check-up!`;
          } else {
            message = aiModal.content;
          }
          
          window.open(`https://wa.me/${testPhone}?text=${encodeURIComponent(message)}`, '_blank');
          setAiModal(prev => ({ ...prev, isOpen: false }));
        }}
        onSendEmail={async () => {
          const testEmail = "handonggyun18@gmail.com";
          let subject = "";
          if (aiModal.type === 'PROPOSAL') subject = `Bespoke Clinical Protocol - ${lead.name}`;
          else if (aiModal.type === 'FOLLOWUP') subject = `Clinical Follow-up & Care Guide - ${lead.name}`;
          else if (aiModal.type === 'POSTCARE') subject = `Recovery Protocol & Thank You - ${lead.name}`;

          try {
            await supabase.functions.invoke('send-pt-v2', {
              body: {
                lead_id: lead.id,
                name: lead.name,
                email: testEmail,
                subject: subject,
                service: lead.service || "Treatment",
                origin: window.location.origin,
                clinic_name: clinicData?.name || "Hanlan OC",
                personalized_note: aiModal.content
              }
            });
          } catch (err) {
            console.error("Email send error", err);
          }
          setAiModal(prev => ({ ...prev, isOpen: false }));
        }}
      />
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
