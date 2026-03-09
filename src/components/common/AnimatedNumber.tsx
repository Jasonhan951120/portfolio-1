import { useEffect, useRef } from "react";
import { useMotionValue, motion, useTransform, animate } from "motion/react";

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function AnimatedNumber({ value, className, prefix = "", suffix = "" }: AnimatedNumberProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        return prefix + Math.floor(latest).toLocaleString() + suffix;
    });

    useEffect(() => {
        const controls = animate(count, value, {
            duration: 2,
            ease: [0.33, 1, 0.68, 1], // Custom slot-machine style easing
        });
        return controls.stop;
    }, [value, count]);

    return <motion.span className={className}>{rounded}</motion.span>;
}
