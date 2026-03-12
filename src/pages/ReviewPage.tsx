import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare, ArrowLeft, CheckCircle2, Send, Globe } from "lucide-react";

const GOOGLE_REVIEW_URL = "https://g.page/r/YOUR_GOOGLE_REVIEW_LINK"; // Replace with real URL

export default function ReviewPage() {
    const [params] = useSearchParams();
    const rating = parseInt(params.get("rating") ?? "0", 10);
    const leadId = params.get("id") ?? "";
    const [feedbackSent, setFeedbackSent] = useState(false);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // High rating → redirect to Google if URL is set
    useEffect(() => {
        if (rating >= 4 && GOOGLE_REVIEW_URL !== "https://g.page/r/YOUR_GOOGLE_REVIEW_LINK") {
            const timer = setTimeout(() => {
                window.location.href = GOOGLE_REVIEW_URL;
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [rating]);

    async function submitFeedback() {
        if (!feedback.trim()) return;
        setSubmitting(true);
        if (leadId) {
            await supabase
                .from("consultation_requests")
                .update({ notes: `[Internal Feedback ⭐${rating}]: ${feedback}` })
                .eq("id", leadId);
        }
        setFeedbackSent(true);
        setSubmitting(false);
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    // High rating — show thank you + Google link
    if (rating >= 4) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans selection:bg-emerald-500 selection:text-white">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative max-w-lg w-full bg-white border border-slate-200 rounded-[40px] p-10 md:p-12 text-center shadow-xl"
                >
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                        >
                            <Star className="w-10 h-10 text-emerald-500 fill-emerald-500" />
                        </motion.div>
                        <div className="absolute inset-0 rounded-full border border-emerald-200 animate-ping opacity-20" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-6 uppercase tracking-tight">
                        Thank You <br />
                        <span className="text-emerald-500 underline decoration-slate-200 underline-offset-8">So Much.</span>
                    </h1>

                    <p className="text-slate-500 text-base leading-relaxed mb-10 font-medium">
                        We're thrilled you had a great experience! Your feedback means the world to our team and helps other patients find the right care.
                    </p>

                    <div className="space-y-4">
                        <a
                            href={GOOGLE_REVIEW_URL === "https://g.page/r/YOUR_GOOGLE_REVIEW_LINK" ? "#" : GOOGLE_REVIEW_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-center gap-3 w-full py-5 bg-slate-900 text-white font-bold uppercase tracking-widest text-sm rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-sm"
                        >
                            <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            Leave a Google Review
                        </a>

                        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors py-4">
                            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
                        </Link>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
                            London Smile Dental · Harley Street
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Feedback Sent View
    if (feedbackSent) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white border border-slate-200 rounded-[40px] p-12 text-center shadow-xl"
                >
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-slate-900 mb-4 uppercase tracking-tight">Feedback Received</h1>
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
                        Thank you for being honest with us. Our clinical director will personally review your comments and reach out to make things right.
                    </p>
                    <Link to="/" className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center">
                        Return to Site
                    </Link>
                </motion.div>
            </div>
        );
    }

    // Low rating — internal feedback form
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative max-w-lg w-full bg-white border border-slate-200 rounded-[40px] p-8 md:p-12 shadow-xl"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-400" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-slate-900 mb-3 uppercase tracking-tight">We Value Your Input</h1>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        We're sorry your visit wasn't perfect. Please tell us how we can improve our service.
                    </p>
                </div>

                <div className="flex gap-2 justify-center mb-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`w-6 h-6 ${i < rating ? "text-emerald-500 fill-emerald-500" : "text-slate-200"}`}
                        />
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 ml-2">Your Feedback</label>
                        <textarea
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            placeholder="What could we have done better?"
                            className="w-full min-h-[160px] bg-slate-50 border border-slate-200 rounded-3xl p-6 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-300 resize-none"
                        />
                    </div>

                    <button
                        onClick={submitFeedback}
                        disabled={submitting || !feedback.trim()}
                        className="group flex items-center justify-center gap-3 w-full py-5 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-2xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                    >
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                Submit Feedback
                                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <Link to="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">
                            Skip for now
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
