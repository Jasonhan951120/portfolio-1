// Static rendering only - AntiGravity removal of performance-heavy animations

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export function AnimatedNumber({ value, className, prefix = "", suffix = "" }: AnimatedNumberProps) {
    const displayValue = prefix + value.toLocaleString() + suffix;

    return <span className={`tabular-nums ${className}`}>{displayValue}</span>;
}
