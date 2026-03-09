import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, Sparkles, ChevronDown, ArrowRight, ArrowLeft, ShieldCheck, Star } from "lucide-react";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";

const SERVICES = [
  "General Inquiry",
  "Dental Implants",
  "Teeth Whitening",
  "Invisalign / Aligners",
  "Veneers",
  "Composite Bonding",
  "Dental Crown",
  "Emergency Appointment",
];

const QUESTIONS = [
  { id: "service", question: "어떤 고민이 있으신가요?", subtext: "가장 관심 있는 진료 분야를 선택해 주세요.", type: "select", options: SERVICES },
  { id: "name", question: "성함이 어떻게 되시나요?", subtext: "정확한 상담을 위해 성함을 입력해 주세요.", type: "text", placeholder: "예: 김한란" },
  { id: "contact", question: "연락처를 남겨주시겠어요?", subtext: "예약 확정 및 안내를 위해 필요합니다.", type: "contact" },
  { id: "notes", question: "더 궁금하신 점이 있나요?", subtext: "상담 시 참고할 내용을 적어주세요 (선택 사항)", type: "textarea", placeholder: "예: 앞니가 벌어져서 고민이에요..." },
];

export default function LeadForm({ clinic }: { clinic: any }) {
  const clinicName = clinic?.name || "Hanlan OC";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "General Inquiry",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step, setStep] = useState(0);
  const [patientId, setPatientId] = useState<string | null>(null);

  // ── Marketing Attribution Tracking ───────────────────────────────────────
  const [attribution, setAttribution] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    referrer: "",
    fbclid: "",
  });

  useEffect(() => {
    // Capture UTM params from URL (e.g. ?utm_source=google&utm_medium=cpc)
    const params = new URLSearchParams(window.location.search);
    const ref = document.referrer;

    setAttribution({
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      referrer: ref,
      fbclid: params.get("fbclid") || "",
    });
  }, []);

  // Postel's Law: Simple phone auto-formatting
  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    let formatted = cleaned;
    if (cleaned.length > 3 && cleaned.length <= 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else if (cleaned.length > 7) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
    setFormData({ ...formData, phone: formatted });
  };

  const nextStep = async () => {
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
      if (step === 1 && formData.name) saveStepData();
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const saveStepData = async () => {
    if (!formData.name) return;
    if (!patientId) {
      const { data } = await supabase.from('consultation_requests').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        status: 'New',
        notes: formData.notes,
        clinic_id: clinic?.id,
        // Marketing Attribution
        utm_source: attribution.utm_source || null,
        utm_medium: attribution.utm_medium || null,
        utm_campaign: attribution.utm_campaign || null,
        utm_term: attribution.utm_term || null,
        referrer: attribution.referrer || null,
        fbclid: attribution.fbclid || null,
      }).select().single();
      if (data) setPatientId(data.id);
    } else {
      await supabase.from('consultation_requests').update({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        notes: formData.notes
      }).eq('id', patientId);
    }
  };

  const handleSubmit = async () => {
    setStatus("loading");
    const { error } = await supabase.from('consultation_requests').update({
      status: 'New',
      notes: formData.notes,
      // Ensure attribution is always persisted (safety net for direct submits)
      utm_source: attribution.utm_source || null,
      utm_medium: attribution.utm_medium || null,
      utm_campaign: attribution.utm_campaign || null,
      utm_term: attribution.utm_term || null,
      referrer: attribution.referrer || null,
      fbclid: attribution.fbclid || null,
    }).eq('id', patientId || '');

    if (error) {
      setStatus("error");
      return;
    }

    setStatus("success");
    trackEvent('lead_form_submit_success', {
      service: formData.service,
      clinic_id: clinic?.id
    });
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ ...formData, clinic_id: clinic?.id }),
    }).catch(console.warn);
  };

  const isStepValid = () => {
    if (step === 0) return !!formData.service;
    if (step === 1) return formData.name.length >= 2;
    if (step === 2) return formData.phone.length >= 10;
    return true;
  };

  return (
    <section id="lead-form" className="min-h-screen bg-[#121212] text-white flex flex-col justify-center py-20 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-2xl relative">
        {/* Progress Bar - Minimalist */}
        <div className="absolute top-0 left-6 right-6 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-[#2AF598]/10 rounded-[24px] flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-[#2AF598]" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">상담 예약이 접수되었습니다.</h2>
              <p className="text-[#A0A0A0] font-medium max-w-sm mx-auto mb-10 leading-relaxed">
                {clinicName}의 전문 상담 실장이 24시간 이내에 안내 전화를 드릴 예정입니다. 잠시만 기다려 주세요.
              </p>
              <button
                onClick={() => { setStatus("idle"); setStep(0); setFormData({ name: "", email: "", phone: "", service: "General Inquiry", notes: "" }); }}
                className="text-xs font-bold uppercase tracking-widest text-white/30 hover:text-[#2AF598] transition-colors"
              >
                닫기
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Clinical Luxury Step {step + 1}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
                  {QUESTIONS[step].question}
                </h3>
                <p className="text-sm text-[#A0A0A0] font-medium">
                  {QUESTIONS[step].subtext}
                </p>
              </div>

              <div className="mb-12">
                {QUESTIONS[step].type === "text" && (
                  <div className="relative group">
                    <input
                      type="text"
                      autoFocus
                      value={formData.name}
                      data-hj-suppress
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && isStepValid() && nextStep()}
                      className="w-full bg-[#1E1E1E] border-[1.5px] border-white/5 rounded-[12px] px-6 py-5 text-xl font-bold text-white focus:outline-none focus:border-[#2AF598]/30 transition-all placeholder:text-white/5"
                      placeholder={QUESTIONS[step].placeholder}
                    />
                  </div>
                )}

                {QUESTIONS[step].type === "contact" && (
                  <div className="space-y-4">
                    <input
                      type="tel"
                      autoFocus
                      value={formData.phone}
                      data-hj-suppress
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full bg-[#1E1E1E] border-[1.5px] border-white/5 rounded-[12px] px-6 py-5 text-xl font-bold text-white focus:outline-none focus:border-[#2AF598]/30 transition-all placeholder:text-white/10"
                      placeholder="휴대폰 번호 (예: 010-1234-5678)"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-[#A0A0A0] font-medium px-2">
                      <ShieldCheck className="w-3 h-3 text-[#2AF598]" /> 정보는 보안 서버에 안전하게 보관됩니다. (Postel's Law 적용)
                    </div>
                  </div>
                )}

                {QUESTIONS[step].type === "select" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {QUESTIONS[step].options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setFormData({ ...formData, service: opt }); setTimeout(nextStep, 200); }}
                        className={`p-5 rounded-[12px] text-left text-sm font-bold transition-all border-[1.5px] ${formData.service === opt
                          ? "bg-[#2AF598]/10 text-[#2AF598] border-[#2AF598]/30"
                          : "bg-[#1E1E1E] border-white/5 text-white/40 hover:border-white/10 hover:text-white"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {QUESTIONS[step].type === "textarea" && (
                  <textarea
                    autoFocus
                    rows={4}
                    value={formData.notes}
                    data-hj-suppress
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-[#1E1E1E] border-[1.5px] border-white/5 rounded-[12px] px-6 py-5 text-lg font-bold text-white focus:outline-none focus:border-[#2AF598]/30 transition-all placeholder:text-white/5 resize-none"
                    placeholder={QUESTIONS[step].placeholder}
                  />
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button onClick={prevStep} className="p-4 text-white/20 hover:text-white transition-colors rounded-xl bg-white/5">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                ) : <div />}

                <motion.button
                  animate={isStepValid() ? {
                    boxShadow: ["0 0 0px rgba(91,164,207,0)", "0 0 20px rgba(91,164,207,0.2)", "0 0 0px rgba(91,164,207,0)"]
                  } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                  onClick={nextStep}
                  disabled={!isStepValid() || status === "loading"}
                  className="w-[180px] h-[48px] bg-harmony-gradient text-white rounded-[12px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-[0_10px_25px_rgba(91,164,207,0.2)]"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : step === QUESTIONS.length - 1 ? "Book Consultation" : "Next Step"}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
