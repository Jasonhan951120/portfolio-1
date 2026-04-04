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

const generateUniversalAIPrompt = (type: string, service: string, patientName: string, draftContext: string = '', age?: number) => {
  const agePrompt = age ? `\nCurrent Patient Age: [${age}].\nMandate: You MUST adjust your tone of voice and the psychological benefits you highlight based on this age. \nExample: For a 70-year-old, don't talk about 'looking cool on social media'; talk about 'enjoying meals with family comfortably'.` : '';
  const baseInstruction = `You are an elite medical concierge AI. Use your expert medical knowledge to provide highly accurate, specialty-specific advice. For example: If '${service}' involves surgery (like Wisdom Tooth), mention cold packs and soft food. If it involves skin (like Acne Laser), mention sunblock and hydration.${agePrompt}`;

  switch (type) {
    case 'DRAFT':
      return `${baseInstruction}\n\n[INTERNAL USE]\nAnalyze the case for ${patientName} regarding '${service}'. Generate a preliminary clinical strategy and a concise "Consultation Cheat Sheet" for the doctor/staff to use during the consultation.`;
    case 'PROPOSAL':
      if (draftContext) {
        return `You are writing a high-end, personalized medical email. 
      SOURCE MATERIAL: [${draftContext}]${agePrompt}
      MANDATE: Every recommendation in this email must be a 'translation' of the internal strategy into patient-friendly language. 
      DO NOT use generic templates. Use the specific clinical objectives and patient concerns found in the SOURCE MATERIAL.
      IMPORTANT: You must include a call-to-action to "View Your Personal Proposal" which links to the following secure clinical portal: ${window.location.origin}/proposal/[id]`;
      }
      return `${baseInstruction}\n\n[EXTERNAL USE]\nGenerate a high-end, premium patient-facing proposal for ${patientName} regarding '${service}'. Focus on the treatment benefits and articulate "The Dream" vision (e.g., renewed confidence, perfect smile, flawless skin). Include the secure proposal link: ${window.location.origin}/proposal/[id]`;
    case 'FOLLOWUP':
      return `${baseInstruction}\n\n[EXTERNAL USE]\nGenerate a reassuring follow-up guide for ${patientName} after their consultation for '${service}'. Address common fears (pain, cost, downtime) with empathy, and instill absolute medical confidence.`;
    case 'POSTCARE':
      return `${baseInstruction}\n\n[EXTERNAL USE]\nGenerate a personalized thank-you note and a strict, treatment-specific recovery protocol (precautions) for ${patientName} safely recovering from '${service}'.`;
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
        mockResponse = `[CONFIDENTIAL - INTERNAL STRATEGY]\n\nPatient: ${lead.name} ${lead.age ? `(${lead.age}y)` : ''}\nTreatment: ${lead.service || 'General Treatment'}\n\n1. Clinical Objective: Assess candidacy for the procedure. ${toneAdaptation}\n2. Key Value Points to Emphasize:\n   - Rapid recovery timeline\n   - Long-term aesthetic and functional benefits\n3. Anticipated Questions:\n   - "How much will this hurt?" -> Reassure with modern anesthetic protocols.\n   - "What is the total cost?" -> Present financing options immediately.\n\n[RECOMMENDATION]: Build rapport quickly, as intent score indicates high readiness to proceed.`;
      } else if (type === 'PROPOSAL') {
        const firstName = lead.name.split(' ')[0];
        const draft = lead.ai_draft_context || '';
        
        // Simulation of the "Anchor" Logic: Extracting pain points and translating
        let customOpener = `Following our review of your case, we are thrilled to present your personalized treatment plan for ${lead.service || 'your treatment'}. ${toneAdaptation}`;
        
        if (draft.toLowerCase().includes("recovery")) {
          customOpener = `We've tailored a plan to ensure your recovery is as fast and comfortable as possible, as we discussed. Our focus is on getting you back to your routine with a perfect result. ${toneAdaptation}`;
        } else if (draft.toLowerCase().includes("pain") || draft.toLowerCase().includes("anxiety")) {
          customOpener = `Based on our consultation, we have designed a protocol that prioritizes your absolute comfort. We use modern anesthetic protocols to ensure a gentle and worry-free experience for your ${lead.service || 'treatment'}. ${toneAdaptation}`;
        }

        const proposalUrl = `${window.location.origin}/proposal/${lead.id.substring(0, 8)}`;
        mockResponse = `Dear ${firstName},\n\n${customOpener}\n\nOur goal is to help you achieve the absolute best results. This highly specialized procedure uses state-of-the-art technology to ensure precision, minimal discomfort, and an exceptional outcome.\n\nWe have prepared a dedicated, high-fidelity landing page detailing every aspect of your case, from clinical diagnostics to my predicted aesthetic outcomes.\n\n✨ [View Your Personal Proposal: ${proposalUrl}]\n\nBy moving forward, you are investing in a lasting transformation that will restore your confidence and enhance your well-being.\n\nBest regards,\nThe Hanlanoc Team`;
      } else if (type === 'FOLLOWUP') {
        mockResponse = `Hi ${lead.name.split(' ')[0]},\n\nIt was a pleasure seeing you for your consultation regarding ${lead.service || 'your treatment'}. ${toneAdaptation}\n\nWe understand that making a medical decision involves careful consideration. Please rest assured that our clinic uses the most advanced techniques to minimize any discomfort and ensure a swift recovery.\n\nIf you have any lingering concerns about the procedure or financing options, we are here to support you every step of the way.\n\nBest regards,\nThe Hanlan OC Care Team`;
      } else if (type === 'POSTCARE') {
        mockResponse = `Dear ${lead.name.split(' ')[0]},\n\nThank you for trusting Hanlan OC with your care! We are delighted with the success of your ${lead.service || 'procedure'}. ${toneAdaptation}\n\n**Vital Recovery Protocol:**\n- Please get plenty of rest for the next 24-48 hours.\n- Maintain hydration and avoid strenuous activity.\n- Follow the custom medication schedule provided to you.\n- If your procedure involved sensitive areas or surgery, utilize cold compresses as directed.\n\nShould you need anything, please do not hesitate to contact us. We look forward to seeing your final results!\n\nWith gratitude,\nDr. Hanlan`;
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

      {/* ── Quiet Luxury AI Preview Modal ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {aiModal.isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                onClick={(e) => { e.stopPropagation(); setAiModal(prev => ({ ...prev, isOpen: false })); }}
              />
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-[24px] p-6 flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />
                    <h3 className="text-sm font-bold text-slate-900 tracking-tighter uppercase">
                      {aiModal.type === 'DRAFT' && `AI Consultation Draft - ${lead.name} ${lead.age ? `(${lead.age}y)` : ''}`}
                      {aiModal.type === 'PROPOSAL' && `AI Premium Proposal - ${lead.name} ${lead.age ? `(${lead.age}y)` : ''}`}
                      {aiModal.type === 'FOLLOWUP' && `AI Reassurance Guide - ${lead.name} ${lead.age ? `(${lead.age}y)` : ''}`}
                      {aiModal.type === 'POSTCARE' && `AI Post-Care Protocol - ${lead.name} ${lead.age ? `(${lead.age}y)` : ''}`}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setAiModal(prev => ({ ...prev, isOpen: false })); }}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 min-h-[250px] relative">
                  {aiModal.isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" strokeWidth={1.5} />
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center animate-pulse">
                        Synthesizing Knowledge...<br />
                        <span className="text-[9px] text-slate-300">Targeting {lead.service || 'Treatment'} Details</span>
                      </p>
                    </div>
                  ) : (
                    <textarea
                      value={aiModal.content}
                      onChange={(e) => setAiModal(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full h-[250px] bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 font-medium resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all custom-scrollbar leading-relaxed"
                    />
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end w-full">
                  {aiModal.type === 'DRAFT' ? (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        updateLead(lead.id, { ai_draft_context: aiModal.content });
                        setAiModal(prev => ({ ...prev, isOpen: false })); 
                      }}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center min-w-[120px]"
                      disabled={aiModal.isLoading}
                    >
                      Save Draft
                    </button>
                  ) : (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button
                          onClick={(e) => {
                              e.stopPropagation();
                              if (aiModal.isLoading) return;
                              const testPhone = "821033951543";
                              const whatsappUrl = `https://wa.me/${testPhone}?text=${encodeURIComponent(aiModal.content)}`;
                              window.open(whatsappUrl, '_blank');
                              setAiModal(prev => ({ ...prev, isOpen: false }));
                          }}
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-bold text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                          disabled={aiModal.isLoading}
                        >
                          <MessageCircle className="w-3.5 h-3.5" /> 💬 Send via WhatsApp
                        </button>
                        <button
                          onClick={async (e) => {
                              e.stopPropagation();
                              if (aiModal.isLoading) return;
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
                          className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2 shadow-sm"
                          disabled={aiModal.isLoading}
                        >
                          <Mail className="w-3.5 h-3.5" /> 📧 Send via Email
                        </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
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
