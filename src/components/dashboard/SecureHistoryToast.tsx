import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// COUNT-UP HOOK  (casino slot feel)
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(to: number, from: number, duration = 0.55): React.ReactNode {
    const motionVal = useMotionValue(from);
    const rounded   = useTransform(motionVal, v => `£${Math.round(v).toLocaleString()}`);
    const [display, setDisplay] = React.useState(`£${Math.round(from).toLocaleString()}`);

    useEffect(() => {
        motionVal.set(from);
        const controls = animate(motionVal, to, {
            duration,
            ease: [0.16, 1, 0.3, 1], // expo-out — fast start, smooth land
        });
        const unsub = motionVal.on('change', v => setDisplay(`£${Math.round(v).toLocaleString()}`));
        return () => { controls.stop(); unsub(); };
    }, [to, from]);

    return display;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
interface SecureHistoryToastProps {
    /** Individual amount just secured */
    amount: number;
    /** Running total including this amount */
    total: number;
    /** Previous total (before this amount) — used for count-up start */
    prevTotal: number;
    /** Whether toast is visible */
    visible: boolean;
    /** Called when auto-dismiss completes */
    onDone: () => void;
}

export function SecureHistoryToast({ amount, total, prevTotal, visible, onDone }: SecureHistoryToastProps) {
    const totalDisplay = useCountUp(total, prevTotal);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (visible) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(onDone, 1800); // auto-dismiss after 1.8s
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [visible, onDone]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    key="secure-toast"
                    initial={{ opacity: 0, y: -28, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    className="
                        flex items-center gap-4 px-6 py-4
                        bg-[#121212]/80 backdrop-blur-xl
                        border-[0.5px] border-emerald-500/30
                        rounded-2xl shadow-[0_4px_32px_rgba(16,185,129,0.20)]
                        pointer-events-none
                    "
                >
                    {/* Icon */}
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-400" strokeWidth={2.5} />
                    </div>

                    {/* Text */}
                    <div className="text-left">
                        <p className="text-[11px] text-slate-300 leading-tight">
                            <span className="font-bold text-white">+£{amount.toLocaleString()}</span>
                            {' '}Secured.
                        </p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            Total:{' '}
                            <span className="text-emerald-400 font-bold tabular-nums">
                                {totalDisplay}
                            </span>
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
