import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'motion/react';
import { CheckCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// COUNT-UP HOOK  (casino-slot snap: decelerates exponentially)
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(to: number, from: number, duration = 0.5) {
    const motionVal = useMotionValue(from);
    const [display, setDisplay] = React.useState(`£${Math.round(from).toLocaleString()}`);

    useEffect(() => {
        motionVal.set(from);
        const controls = animate(motionVal, to, {
            duration,
            ease: [0.22, 1, 0.36, 1], // sharp expo-out – slot-machine snap
        });
        const unsub = motionVal.on('change', v =>
            setDisplay(`£${Math.round(v).toLocaleString()}`)
        );
        return () => { controls.stop(); unsub(); };
    }, [to, from]);

    return display;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface SecureHistoryToastProps {
    amount: number;
    total: number;
    prevTotal: number;
    visible: boolean;
    onDone: () => void;
}

export function SecureHistoryToast({ amount, total, prevTotal, visible, onDone }: SecureHistoryToastProps) {
    const totalDisplay = useCountUp(total, prevTotal);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (visible) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(onDone, 1900);
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [visible, onDone]);

    return (
        <>
            {/* Keyframe for metallic diagonal sweep */}
            <style>{`
                @keyframes shimmer-sweep {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .toast-shimmer {
                    background: linear-gradient(
                        105deg,
                        transparent 30%,
                        rgba(255,255,255,0.09) 50%,
                        transparent 70%
                    );
                    background-size: 300% 100%;
                    animation: shimmer-sweep 1.4s ease-in-out infinite;
                }
            `}</style>

            <AnimatePresence>
                {visible && (
                    <motion.div
                        key="secure-toast"
                        initial={{ opacity: 0, y: -32, scale: 0.91 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -24, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 460, damping: 32 }}
                        className="relative overflow-hidden flex items-center gap-4 px-7 py-4
                            bg-[#0D1F1A]/85 backdrop-blur-2xl
                            border-[0.5px] border-emerald-500/35
                            rounded-2xl shadow-[0_8px_40px_rgba(16,185,129,0.28),0_0_0_1px_rgba(16,185,129,0.08)]
                            pointer-events-none"
                    >
                        {/* ── METALLIC SHIMMER OVERLAY ── */}
                        <div className="toast-shimmer absolute inset-0 rounded-2xl pointer-events-none z-0" />

                        {/* Icon */}
                        <div className="relative z-10 w-9 h-9 rounded-full bg-emerald-500/20
                            border border-emerald-500/30 flex items-center justify-center flex-shrink-0
                            shadow-[0_0_12px_rgba(16,185,129,0.35)]">
                            <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                        </div>

                        {/* Text */}
                        <div className="relative z-10 text-left">
                            <p className="text-[12px] text-slate-300 leading-tight">
                                <span className="font-bold text-white tracking-tight">+£{amount.toLocaleString()}</span>
                                {' '}
                                <span className="text-slate-400">Secured.</span>
                            </p>
                            <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                                Running Total:{' '}
                                <span className="text-emerald-400 font-black tabular-nums tracking-tighter">
                                    {totalDisplay}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
