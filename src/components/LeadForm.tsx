import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Loader2, Sparkles, ChevronDown, ArrowRight, ArrowLeft } from "lucide-react";

import { supabase } from "../lib/supabase";

const SERVICES = [
  "General Inquiry",
  "Dental Implants",
  "Teeth Whitening",
  "Invisalign / Aligners",
  "Veneers",
  "Composite Bonding",
  "Dental Crown",
  "Emergency Appointment",
  "Other",
];

const QUESTIONS = [
  { id: "name", question: "What should we call you?", subtext: "Enter your full name", type: "text", placeholder: "e.g. James Smith" },
  { id: "contact", question: "How can we reach you?", subtext: "Email and Phone are required for confirmation", type: "contact" },
  { id: "service", question: "Which treatment interests you?", subtext: "Select your primary concern", type: "select", options: SERVICES },
  { id: "time", question: "When would you like to visit?", subtext: "We'll do our best to match your preference", type: "appointment" },
  { id: "notes", question: "Any specific concerns?", subtext: "Tell us anything else we should know (Optional)", type: "textarea", placeholder: "I'm interested in..." },
];

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "General Inquiry",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [step, setStep] = useState(0); // 0 to 4
  const [patientId, setPatientId] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  const nextStep = async () => {
    // Save draft periodically
    if (step === 0 && formData.name) {
      saveStepData();
    }
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const saveStepData = async () => {
    if (!formData.name) return;
    if (!patientId) {
      const { data, error } = await supabase.from('consultation_requests').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        status: 'New',
        notes: formData.notes
      }).select().single();

      if (data) {
        setPatientId(data.id);
        setAppointmentId(data.id);
      }
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
    if (appointmentId) {
      const { error } = await supabase.from('consultation_requests').update({
        status: 'New',
        notes: `Selected treatment: ${formData.service}\n${formData.notes || ''}`
      }).eq('id', appointmentId);

      if (error) {
        setStatus("error");
        return;
      }
    }

    setStatus("success");
    // Fire-and-forget: send admin alert
    fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY },
      body: JSON.stringify({ ...formData }),
    }).catch(console.warn);
  };

  return (
    <section id="lead-form" className="min-h-screen bg-white flex flex-col justify-center py-20 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-5xl font-display font-bold text-black uppercase tracking-tighter mb-4">You're All Set.</h2>
              <p className="text-xl text-black/40 font-medium max-w-md mx-auto mb-12">
                Our treatment coordinator will reach out within 24 hours to confirm your priority consultation.
              </p>
              <button
                onClick={() => { setStatus("idle"); setStep(0); setFormData({ name: "", email: "", phone: "", service: "General Inquiry", notes: "" }); }}
                className="text-sm font-bold uppercase tracking-widest text-black/20 hover:text-black transition-colors"
              >
                Send another request
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {/* Question Index */}
              <div className="flex items-center gap-3 mb-12">
                <span className="text-xs font-bold text-black/20 uppercase tracking-[0.3em]">Question {step + 1} / {QUESTIONS.length}</span>
                <div className="h-px flex-1 bg-black/5" />
              </div>

              {/* Question Header */}
              <div className="mb-12">
                <h3 className="text-4xl md:text-6xl font-display font-bold text-black uppercase tracking-tighter leading-none mb-4">
                  {QUESTIONS[step].question}
                </h3>
                <p className="text-lg text-black/40 font-medium italic">
                  {QUESTIONS[step].subtext}
                </p>
              </div>

              {/* Inputs */}
              <div className="mb-16">
                {QUESTIONS[step].type === "text" && (
                  <input
                    type="text"
                    autoFocus
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && formData.name && nextStep()}
                    className="w-full bg-transparent border-b-2 border-black/10 py-6 text-2xl md:text-4xl font-medium focus:outline-none focus:border-black transition-colors placeholder:text-black/5"
                    placeholder={QUESTIONS[step].placeholder}
                  />
                )}

                {QUESTIONS[step].type === "contact" && (
                  <div className="space-y-8">
                    <input
                      type="tel"
                      autoFocus
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b-2 border-black/10 py-6 text-2xl md:text-3xl font-medium focus:outline-none focus:border-black transition-colors placeholder:text-black/5"
                      placeholder="Phone Number (+44 20...)"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && formData.phone && formData.email && nextStep()}
                      className="w-full bg-transparent border-b-2 border-black/10 py-6 text-2xl md:text-3xl font-medium focus:outline-none focus:border-black transition-colors placeholder:text-black/5"
                      placeholder="Email Address (james@example.com)"
                    />
                  </div>
                )}

                {QUESTIONS[step].type === "select" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {QUESTIONS[step].options?.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => { setFormData({ ...formData, service: opt }); nextStep(); }}
                        className={`p-6 rounded-2xl text-left text-lg font-bold transition-all border ${formData.service === opt
                          ? "bg-black text-white border-black"
                          : "bg-white border-black/10 text-black/40 hover:border-black hover:text-black"
                          }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {QUESTIONS[step].type === "appointment" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-4 gap-4">
                      {['MON', 'TUE', 'WED', 'THU'].map((d, i) => (
                        <div key={d} className={`p-6 text-center rounded-2xl border transition-all ${i === 1 ? 'bg-black text-white border-black' : 'bg-white border-black/10 text-black/40 hover:border-black hover:text-black'}`}>
                          <span className="text-[10px] block mb-2 font-bold tracking-widest">{d}</span>
                          <span className="text-2xl font-bold">{12 + i}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {['09:00', '14:00', '17:00'].map((t, i) => (
                        <div key={t} className={`p-4 text-center rounded-xl border text-sm font-bold transition-all ${i === 1 ? 'bg-black text-white border-black' : 'bg-white border-black/10 text-black/40 hover:border-black hover:text-black'}`}>
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {QUESTIONS[step].type === "textarea" && (
                  <textarea
                    autoFocus
                    rows={1}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-transparent border-b-2 border-black/10 py-6 text-xl md:text-2xl font-medium focus:outline-none focus:border-black transition-colors placeholder:text-black/5 resize-none"
                    placeholder={QUESTIONS[step].placeholder}
                  />
                )}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-6">
                <button
                  onClick={nextStep}
                  disabled={
                    (step === 0 && !formData.name) ||
                    (step === 1 && (!formData.phone || !formData.email)) ||
                    status === "loading"
                  }
                  className="px-10 py-6 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-2xl"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : step === QUESTIONS.length - 1 ? "Complete Booking" : "Next Step"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {step > 0 && (
                  <button onClick={prevStep} className="p-6 text-black/20 hover:text-black transition-colors rounded-full hover:bg-black/5">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}

                <div className="flex-1" />
                <span className="hidden md:block text-[10px] font-bold text-black/20 uppercase tracking-widest">
                  Press <span className="text-black/40">Enter ↵</span> to continue
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
