import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Clock, Smile, Shield, ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Category = "All" | "Invisalign" | "Veneers" | "Whitening" | "Implants" | "Bonding";

interface Case {
    id: number;
    category: Exclude<Category, "All">;
    patient: string;
    age: string;
    occupation: string;
    problem: string;
    solution: string;
    duration: string;
    visits: string;
    pain: string;
    quote: string;
    rating: number;
    beforeImg: string;
    afterImg: string;
    ctaLabel: string;
    ctaService: string;
}

const CASES: Case[] = [
    {
        id: 1,
        category: "Invisalign",
        patient: "Sarah M.",
        age: "28",
        occupation: "Marketing Director",
        problem: "Crowded front teeth made me cover my mouth every time I smiled at work.",
        solution: "Clear aligner therapy + composite bonding on upper laterals",
        duration: "7 months",
        visits: "6 sessions",
        pain: "None",
        quote: "I finally walk into client meetings with confidence. Best decision I've ever made.",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        ctaLabel: "Check my alignment — free",
        ctaService: "Invisalign",
    },
    {
        id: 2,
        category: "Invisalign",
        patient: "Priya S.",
        age: "31",
        occupation: "Software Engineer",
        problem: "An overbite that made closing my lips feel unnatural and uncomfortable.",
        solution: "Full Invisalign Comprehensive + interproximal reduction",
        duration: "11 months",
        visits: "8 sessions",
        pain: "Very mild",
        quote: "The aligners were invisible — my colleagues didn't even notice until I was done!",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        ctaLabel: "Start my Invisalign journey",
        ctaService: "Invisalign",
    },
    {
        id: 3,
        category: "Veneers",
        patient: "James K.",
        age: "35",
        occupation: "Architect",
        problem: "Years of coffee staining and chipped edges left my teeth looking worn.",
        solution: "Ultra-thin porcelain veneers, 8 upper teeth",
        duration: "3 weeks",
        visits: "3 sessions",
        pain: "Very mild",
        quote: "The result looks so natural — nobody knows they're veneers. Stunning work.",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        ctaLabel: "Design my smile consultation",
        ctaService: "Veneers",
    },
    {
        id: 4,
        category: "Veneers",
        patient: "Anya P.",
        age: "42",
        occupation: "TV Presenter",
        problem: "Noticeably uneven teeth that made me very self-conscious on camera.",
        solution: "10 IPS e.max porcelain veneers with gum contouring",
        duration: "5 weeks",
        visits: "4 sessions",
        pain: "None",
        quote: "Honestly the best thing I've ever done for my career. Absolutely flawless.",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200",
        ctaLabel: "Book a veneer consultation",
        ctaService: "Veneers",
    },
    {
        id: 5,
        category: "Whitening",
        patient: "Emily R.",
        age: "24",
        occupation: "Nurse",
        problem: "Stubborn tea staining that no over-the-counter product could fix.",
        solution: "In-clinic power whitening + custom take-home trays",
        duration: "1 session",
        visits: "1 session",
        pain: "None",
        quote: "8 shades whiter in two hours. I can't stop taking photos of myself!",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200",
        ctaLabel: "Book a whitening session",
        ctaService: "Whitening",
    },
    {
        id: 6,
        category: "Whitening",
        patient: "Marcus L.",
        age: "44",
        occupation: "Solicitor",
        problem: "Decades of red wine had left a stubborn grey-yellow tinge to my smile.",
        solution: "Zoom! chairside whitening + 2-week home kit follow-up",
        duration: "1 session + 2 weeks",
        visits: "1 session",
        pain: "Mild sensitivity",
        quote: "People keep asking if I had new veneers. Nope — just whitening!",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200",
        ctaLabel: "See whitening options",
        ctaService: "Whitening",
    },
    {
        id: 7,
        category: "Implants",
        patient: "David T.",
        age: "52",
        occupation: "Finance Manager",
        problem: "Lost two molars in an accident — eating had become genuinely painful.",
        solution: "Two titanium implants with zirconia crowns",
        duration: "4 months",
        visits: "5 sessions",
        pain: "Mild",
        quote: "I forgot what it felt like to eat a steak properly. Life-changing.",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200",
        ctaLabel: "Explore implant options",
        ctaService: "Implants",
    },
    {
        id: 8,
        category: "Implants",
        patient: "Helen W.",
        age: "60",
        occupation: "Retired Teacher",
        problem: "Full upper denture that slipped constantly — I dreaded speaking in public.",
        solution: "All-on-4 fixed implant bridge, upper arch",
        duration: "6 months",
        visits: "6 sessions",
        pain: "Managed with medication",
        quote: "I threw my adhesive in the bin on the day of fitting. I genuinely cried with joy.",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1609142721641-9b1ba65283c5?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        ctaLabel: "Ask about All-on-4",
        ctaService: "Implants",
    },
    {
        id: 9,
        category: "Bonding",
        patient: "Liam C.",
        age: "22",
        occupation: "University Student",
        problem: "Chipped front tooth from a football injury. I hated smiling in photos.",
        solution: "Composite bonding on upper central incisors",
        duration: "1 session",
        visits: "1 session",
        pain: "None — no anaesthetic needed",
        quote: "Done in 90 minutes and it looks completely natural. Amazing value too.",
        rating: 5,
        beforeImg: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1200",
        afterImg: "https://images.unsplash.com/photo-1629909613654-2871b7c02b11?q=80&w=1200",
        ctaLabel: "Fix my chipped tooth",
        ctaService: "Bonding",
    },
];

const CATEGORIES: Category[] = ["All", "Invisalign", "Veneers", "Whitening", "Implants", "Bonding"];

type StatDef = { target: number; suffix: string; label: string; decimals?: number };

const CATEGORY_STATS: Record<Category, StatDef[]> = {
    All: [
        { target: 1400, suffix: "+", label: "Cases Completed" },
        { target: 4.9, suffix: " / 5", label: "Patient Rating", decimals: 1 },
        { target: 98, suffix: "%", label: "Would Recommend" },
        { target: 2, suffix: " week wait", label: "Avg Wait Time" },
    ],
    Invisalign: [
        { target: 480, suffix: "+", label: "Invisalign Cases" },
        { target: 4.9, suffix: " / 5", label: "Patient Rating", decimals: 1 },
        { target: 8, suffix: " months avg", label: "Treatment Duration" },
        { target: 96, suffix: "%", label: "Complete on Schedule" },
    ],
    Veneers: [
        { target: 320, suffix: "+", label: "Veneer Cases" },
        { target: 5.0, suffix: " / 5", label: "Patient Rating", decimals: 1 },
        { target: 3, suffix: " week avg", label: "Treatment Time" },
        { target: 99, suffix: "%", label: "Satisfaction Rate" },
    ],
    Whitening: [
        { target: 600, suffix: "+", label: "Whitening Sessions" },
        { target: 8, suffix: " shades avg", label: "Whiteness Improvement" },
        { target: 1, suffix: " session", label: "Treatment Time" },
        { target: 97, suffix: "%", label: "Would Recommend" },
    ],
    Implants: [
        { target: 210, suffix: "+", label: "Implants Placed" },
        { target: 4.8, suffix: " / 5", label: "Patient Rating", decimals: 1 },
        { target: 5, suffix: " months avg", label: "Full Treatment Time" },
        { target: 98, suffix: "%", label: "10-Year Success Rate" },
    ],
    Bonding: [
        { target: 390, suffix: "+", label: "Bonding Cases" },
        { target: 4.9, suffix: " / 5", label: "Patient Rating", decimals: 1 },
        { target: 90, suffix: " mins avg", label: "Per Session" },
        { target: 100, suffix: "%", label: "Pain-Free Cases" },
    ],
};

// ─── Count-Up Hook (animates on mount — re-triggers via key reset) ─────────────

function useCountUp(target: number, duration = 1000, decimals = 0) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let rafId: number;
        let start: number | null = null;
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(parseFloat((eased * target).toFixed(decimals)));
            if (progress < 1) rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [target, duration, decimals]);

    return count;
}

// ─── Stat Block ───────────────────────────────────────────────────────────────

function StatBlock({ target, suffix, label, decimals = 0 }: StatDef) {
    const count = useCountUp(target, 1000, decimals);
    const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

    return (
        <div>
            <p className="text-3xl font-display font-bold text-black tabular-nums">
                {display}{suffix}
            </p>
            <p className="text-[11px] font-black uppercase tracking-widest text-muted mt-1">{label}</p>
        </div>
    );
}

// ─── Interactive Slider ───────────────────────────────────────────────────────

function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
    const [pos, setPos] = useState(50);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const clamp = (v: number) => Math.min(Math.max(v, 2), 98);

    const moveToX = useCallback((clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setPos(clamp(((clientX - rect.left) / rect.width) * 100));
    }, []);

    const onMouseMove = (e: React.MouseEvent) => { if (dragging) moveToX(e.clientX); };
    const onTouchMove = (e: React.TouchEvent) => moveToX(e.touches[0].clientX);

    useEffect(() => {
        const up = () => setDragging(false);
        window.addEventListener("mouseup", up);
        return () => window.removeEventListener("mouseup", up);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full rounded-[28px] overflow-hidden cursor-ew-resize select-none shadow-xl"
            onMouseMove={onMouseMove}
            onMouseDown={() => setDragging(true)}
            onTouchMove={onTouchMove}
        >
            <img src={after} alt="After" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
                <img
                    src={before}
                    alt="Before"
                    className="absolute inset-0 h-full object-cover"
                    style={{ width: `calc(100% * (100 / ${pos}))` }}
                />
            </div>
            <div className="absolute inset-y-0 z-10 w-[2px] bg-white/60 pointer-events-none" style={{ left: `${pos}%` }} />
            <div className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: `${pos}%` }}>
                <motion.div animate={{ scale: dragging ? 1.15 : 1 }} className="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center gap-1">
                    <ChevronLeft className="w-3 h-3 text-black/60" />
                    <ChevronRight className="w-3 h-3 text-black/60" />
                </motion.div>
                {!dragging && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-black uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full"
                    >
                        Drag
                    </motion.div>
                )}
            </div>
            <div className="absolute bottom-4 left-4 z-10 bg-black/70 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">Before</div>
            <div className="absolute bottom-4 right-4 z-10 bg-white text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">After</div>
        </div>
    );
}

// ─── Story Card ───────────────────────────────────────────────────────────────

function StoryCard({ c, onCTA }: { c: Case; onCTA: () => void }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-black shrink-0">
                    {c.patient[0]}
                </div>
                <div className="min-w-0">
                    <p className="font-black text-black text-sm">{c.patient}</p>
                    <p className="text-[11px] text-muted font-medium">{c.age} yrs · {c.occupation}</p>
                </div>
                <div className="ml-auto flex gap-0.5 shrink-0">
                    {Array.from({ length: c.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                </div>
            </div>

            <blockquote className="text-muted leading-relaxed text-sm italic mb-5 border-l-2 border-primary pl-4">
                &ldquo;{c.problem}&rdquo;
            </blockquote>

            <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                    { icon: <Smile className="w-3.5 h-3.5" />, label: "Treatment", value: c.solution },
                    { icon: <Clock className="w-3.5 h-3.5" />, label: "Duration", value: c.duration },
                    { icon: <Shield className="w-3.5 h-3.5" />, label: "Pain Level", value: c.pain },
                ].map(({ icon, label, value }) => (
                    <div key={label} className="bg-[#FBFBFB] rounded-2xl p-3 border border-black/5">
                        <div className="text-primary mb-1">{icon}</div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-0.5">{label}</p>
                        <p className="text-[11px] font-bold text-black leading-tight">{value}</p>
                    </div>
                ))}
            </div>

            <p className="text-sm font-medium text-black/70 italic mb-5 leading-relaxed flex-1">
                &ldquo;{c.quote}&rdquo;
            </p>

            <button
                onClick={onCTA}
                className="w-full bg-black text-white font-black uppercase tracking-wider text-xs py-4 px-6 rounded-2xl flex items-center justify-between group hover:bg-primary transition-colors"
            >
                <span>{c.ctaLabel}</span>
                <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </button>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const filtered = CASES.filter(c => activeCategory === "All" || c.category === activeCategory);

    useEffect(() => { setActiveIndex(0); }, [activeCategory]);

    const activeCase = filtered[activeIndex] ?? CASES[0];

    const handleCTA = (service: string) => {
        navigate(`/contact?service=${encodeURIComponent(service)}`);
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            <Navbar />

            {/* ── Hero ── */}
            <section className="pt-36 pb-12 container mx-auto px-8">
                <div className="flex items-end justify-between flex-wrap gap-6 mb-4">
                    <div>
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Patient Transformations</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-none text-black">
                            Real Results.<br />
                            <span className="text-primary">Real People.</span>
                        </h1>
                    </div>
                    <p className="text-muted font-medium max-w-xs leading-relaxed text-sm">
                        Every smile here belongs to a real patient who chose to take that first step. Yours could be next.
                    </p>
                </div>

                {/* Stats bar — changes per selected category */}
                <motion.div
                    key={activeCategory}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex gap-12 mt-10 pt-10 border-t border-black/10 flex-wrap"
                >
                    {CATEGORY_STATS[activeCategory].map(s => (
                        <StatBlock key={activeCategory + s.label} {...s} />
                    ))}
                </motion.div>
            </section>

            {/* ── Filter Pills ── */}
            <section className="container mx-auto px-8 mb-10">
                <div className="flex gap-3 flex-wrap">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeCategory === cat
                                ? "bg-black text-white shadow-lg"
                                : "bg-white text-black/50 border border-black/10 hover:border-black hover:text-black"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Main: Slider + Story (equal height) ── */}
            <section className="container mx-auto px-8 mb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeCategory}-${activeIndex}`}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="grid lg:grid-cols-2 gap-6"
                        style={{ alignItems: "stretch" }}
                    >
                        {/* Left: Slider column */}
                        <div className="flex flex-col gap-4">
                            {/* The slider itself — grows to fill available height */}
                            <div className="flex-1 min-h-[360px]">
                                <BeforeAfterSlider before={activeCase.beforeImg} after={activeCase.afterImg} />
                            </div>
                            {/* Thumbnail strip */}
                            {filtered.length > 1 && (
                                <div className="flex gap-2">
                                    {filtered.map((c, i) => (
                                        <button
                                            key={c.id}
                                            onClick={() => setActiveIndex(i)}
                                            className={`relative flex-1 aspect-[3/2] rounded-xl overflow-hidden border-2 transition-all ${i === activeIndex ? "border-black" : "border-transparent opacity-40 hover:opacity-70"}`}
                                        >
                                            <img src={c.afterImg} alt={c.patient} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Story Card — matches left height */}
                        <div className="bg-white rounded-[32px] p-8 border border-black/5 shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-6 shrink-0">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">
                                    Case {activeIndex + 1} of {filtered.length}
                                </span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white bg-black px-3 py-1 rounded-full">
                                    {activeCase.category}
                                </span>
                            </div>
                            <div className="flex-1">
                                <StoryCard c={activeCase} onCTA={() => handleCTA(activeCase.ctaService)} />
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                {filtered.length > 1 && (
                    <div className="flex justify-center gap-4 mt-8">
                        <button
                            onClick={() => setActiveIndex(i => (i - 1 + filtered.length) % filtered.length)}
                            className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            {filtered.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-black w-5" : "bg-black/20"}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveIndex(i => (i + 1) % filtered.length)}
                            className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </section>

            {/* ── Bottom CTA ── */}
            <section className="bg-black py-20">
                <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em] mb-3">Your Turn</p>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-tight leading-tight">
                            Ready for <span className="text-primary">your</span><br />transformation?
                        </h2>
                    </div>
                    <button
                        onClick={() => navigate("/contact")}
                        className="shrink-0 bg-primary hover:bg-accent text-black font-black uppercase tracking-wider text-sm py-5 px-10 rounded-2xl flex items-center gap-4 group transition-colors"
                    >
                        Book a Free Consultation
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </section>
        </div>
    );
}
