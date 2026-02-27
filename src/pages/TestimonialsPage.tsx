import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, ArrowRight, Quote, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, MessageCircleHeart } from "lucide-react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Tag = "All" | "Implants" | "Veneers" | "Invisalign" | "Whitening" | "Bonding";

interface Testimonial {
    id: number;
    tag: Exclude<Tag, "All">;
    name: string;
    age: string;
    occupation: string;
    rating: number;
    title: string;
    short: string;      // one-line hook
    full: string;       // extended story shown on expand
    image: string;
    verified: boolean;
    platform: "Google" | "Trustpilot" | "Direct";
}

const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        tag: "Implants",
        name: "Margaret T.",
        age: "58",
        occupation: "Retired Head Teacher",
        rating: 5,
        title: "I finally feel comfortable eating with people again",
        short: "I wore dentures for over 20 years. They slipped constantly and I'd started turning down dinner invitations because I was embarrassed.",
        full: "I wore dentures for over 20 years. They slipped when I ate, when I laughed, sometimes just when I talked. I started turning down dinner invitations because I was embarrassed. A friend suggested I book a free consultation here — I expected to be told I wasn't a good candidate because of my age. Instead the dentist sat with me for nearly 30 minutes, showed me scans, and explained exactly why implants would work for me. The treatment took about four months across five appointments. The healing was straightforward and I barely needed over-the-counter painkillers. The day they fitted the final crowns I went directly to a restaurant with my daughter. I had a steak. I chewed on both sides without thinking about it. That sounds like nothing — until you haven't been able to do it for two decades.",
        image: "https://randomuser.me/api/portraits/women/62.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 2,
        tag: "Whitening",
        name: "Yuki S.",
        age: "26",
        occupation: "Graduate Nurse",
        rating: 5,
        title: "I passed my interview — and I know why",
        short: "Years of tea-stained teeth made me cover my mouth any time I was happy.",
        full: "Years of tea-stained teeth made me cover my mouth any time I was happy. I'd practised my interview answers in the mirror but always noticed my teeth, not my words. One 90-minute whitening session later I smiled differently in the mirror. My panel commented on how 'warm and confident' I was. I got the job. Small thing, enormous difference.",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 3,
        tag: "Invisalign",
        name: "Daniel L.",
        age: "34",
        occupation: "Litigation Solicitor",
        rating: 5,
        title: "My colleagues still don't know I had aligners",
        short: "I'd been told by two other clinics that braces were my only option at my age.",
        full: "I'd been told by two other clinics that braces were my only option at my age. The thought of standing in court with metal brackets at 34 was mortifying. Eight months of Invisalign later — completely undetected by anyone at work — and my teeth are straighter than they've ever been. The free consultation took fifteen minutes. I wish I'd done it five years ago.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        verified: true,
        platform: "Trustpilot",
    },
    {
        id: 4,
        tag: "Veneers",
        name: "Anya P.",
        age: "41",
        occupation: "Television Presenter",
        rating: 5,
        title: "People ask if I had veneers — I tell them yes, proudly",
        short: "Being on screen means every imperfection is magnified. I was exhausted from hiding my smile.",
        full: "Being on screen means every imperfection is magnified. Chipped, uneven, discoloured — I was exhausted from hiding my smile in every take. Ten IPS e.max veneers and three weeks later, I walked back onto set. My director asked what was different. When I told him, he said 'worth every penny.' For once I agreed without hesitation.",
        image: "https://randomuser.me/api/portraits/women/29.jpg",
        verified: true,
        platform: "Direct",
    },
    {
        id: 5,
        tag: "Implants",
        name: "David M.",
        age: "49",
        occupation: "Operations Manager",
        rating: 5,
        title: "Back to steak — and I don't take it for granted",
        short: "A sports injury took two of my molars. Eating became a strategy, not a pleasure.",
        full: "A sports injury took two of my molars. Eating became a strategy, not a pleasure — avoid the right side, cut everything small, skip the foods I loved. Four months of treatment, two titanium implants, and I ordered a ribeye the day after my fit-out appointment. My wife said I looked ten years younger just from smiling properly again.",
        image: "https://randomuser.me/api/portraits/men/55.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 6,
        tag: "Bonding",
        name: "Lila R.",
        age: "22",
        occupation: "Fashion Student",
        rating: 5,
        title: "90 minutes and zero pain — I had no idea it was this easy",
        short: "A chipped front tooth from a fall. I'd lived with it for two years because I assumed it meant a crown.",
        full: "A chipped front tooth from a fall. I'd lived with it for two years because I assumed it meant a crown, drilling, pain — the whole ordeal. The consultation took ten minutes and the bonding took less than two hours. No injection, no discomfort, and I left with a tooth I genuinely can't distinguish from the natural ones. I tell everyone who'll listen.",
        image: "https://randomuser.me/api/portraits/women/19.jpg",
        verified: true,
        platform: "Trustpilot",
    },
    {
        id: 7,
        tag: "Invisalign",
        name: "Priya K.",
        age: "29",
        occupation: "Product Designer",
        rating: 5,
        title: "The wedding photos made me cry for the right reason",
        short: "I started Invisalign eight months before my wedding with no idea if the timing would work.",
        full: "I started Invisalign eight months before my wedding with no idea if the timing would work. It did — with five weeks to spare. When I saw the first gallery proofs I zoomed straight into my smile, and for the first time ever I didn't flinch. My mum asked me what treatment I'd had. I said 'patience.' She didn't believe me, but the photos don't lie.",
        image: "https://randomuser.me/api/portraits/women/48.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 8,
        tag: "Whitening",
        name: "James F.",
        age: "43",
        occupation: "Business Development Director",
        rating: 5,
        title: "First impressions matter — I'd been giving the wrong one",
        short: "Client lunches, pitches, board presentations. I'd been unaware of how much my smile was communicating.",
        full: "Client lunches, pitches, board presentations. I'd been unaware of how much a greyed-out smile communicates before you've said a word. A single Zoom® session. Eight shades lighter. My next pitch went differently — the client told me I 'seemed very assured.' Nothing changed except the teeth. I now maintain with home trays every quarter.",
        image: "https://randomuser.me/api/portraits/men/42.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 9,
        tag: "Veneers",
        name: "Clara M.",
        age: "37",
        occupation: "Interior Architect",
        rating: 5,
        title: "I design beautiful spaces — now my smile finally matches",
        short: "I work with beauty every day and yet I was deeply embarrassed by my own teeth.",
        full: "I work with beauty every day — proportion, harmony, finish. And yet I was deeply embarrassed by my own teeth. Stained, chipped, uneven. I'd avoided smiling in client photos for six years. Six veneers later and I genuinely don't recognise my reflection in the best possible way. My clients comment on my 'energy.' I know exactly what changed.",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 10,
        tag: "Implants",
        name: "Tom R.",
        age: "62",
        occupation: "Retired Fire Officer",
        rating: 5,
        title: "I was terrified. I had no reason to be.",
        short: "I put off coming for three years. Needles, drills, the full anxiety spiral.",
        full: "I put off coming for three years. Needles, drills, the full anxiety spiral. When I finally walked in I told them straight away I was scared. They didn't dismiss it — they talked me through every single step before it happened. Two implants, no pain I couldn't manage, and I was back home the same afternoon. I feel foolish for waiting so long.",
        image: "https://randomuser.me/api/portraits/men/71.jpg",
        verified: true,
        platform: "Trustpilot",
    },
    {
        id: 11,
        tag: "Invisalign",
        name: "Amara O.",
        age: "19",
        occupation: "University Student",
        rating: 5,
        title: "My first year at uni — I actually wanted to be in the photos",
        short: "Starting university with crowded teeth I'd been self-conscious about since secondary school.",
        full: "Starting university with crowded teeth I'd been self-conscious about since secondary school. My parents got me a consultation as a leaving gift. Seven months later, during my first year, my teeth were straighter than they'd ever been and I was actually asking to be in photos rather than stepping aside. Tiny thing. Massive difference to how I moved through the world.",
        image: "https://randomuser.me/api/portraits/women/26.jpg",
        verified: true,
        platform: "Direct",
    },
    {
        id: 12,
        tag: "Bonding",
        name: "Ravi P.",
        age: "31",
        occupation: "Software Engineer",
        rating: 5,
        title: "A gap I'd had since childhood — closed in one visit",
        short: "I assumed closing a childhood diastema required braces and months of treatment.",
        full: "I assumed closing a childhood diastema required braces and months of treatment. I mentioned it almost as an afterthought during my hygiene appointment. Within a week I was back in the chair. Forty-five minutes. No anaesthetic. The gap I'd had my entire life was simply gone. My mum still can't believe it. Neither can I.",
        image: "https://randomuser.me/api/portraits/men/37.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 13,
        tag: "Whitening",
        name: "Sophie B.",
        age: "33",
        occupation: "Secondary School Teacher",
        rating: 5,
        title: "Students notice everything. Now they notice my smile.",
        short: "Teaching teenagers who comment on literally everything made my stained teeth a source of daily anxiety.",
        full: "Teaching teenagers who comment on literally everything made my stained teeth a source of daily anxiety. I'd catch myself turning away when I wrote on the board so they couldn't see me smile. After one whitening session a student told me I seemed 'different — like, happier.' I was. I'm not hiding anymore.",
        image: "https://randomuser.me/api/portraits/women/52.jpg",
        verified: true,
        platform: "Google",
    },
    {
        id: 14,
        tag: "Veneers",
        name: "George H.",
        age: "55",
        occupation: "Barrister",
        rating: 5,
        title: "Thirty years of courtrooms — I finally look as confident as I sound",
        short: "I argue cases for a living. My voice projects authority. My teeth never did.",
        full: "I argue cases for a living. My voice projects authority. My teeth never did — worn down, grey, small. A colleague half my age had porcelain veneers and I noticed immediately how much more commanding his presence felt. Eight veneers later and my junior barristers treat me differently. Presence is everything in court. I have it now.",
        image: "https://randomuser.me/api/portraits/men/60.jpg",
        verified: true,
        platform: "Trustpilot",
    },
    {
        id: 15,
        tag: "Implants",
        name: "Nadia E.",
        age: "44",
        occupation: "Restaurateur",
        rating: 5,
        title: "I cook food for a living — and I couldn't taste it properly",
        short: "A failed root canal left me with a gap at the back that changed how I chewed everything.",
        full: "A failed root canal left me with a gap at the back that changed how I chewed everything — and when you taste food professionally, that matters enormously. One implant, four months of healing, and I can taste my own tasting menus again. My head chef noticed before I said anything. 'You've been eating differently,' he said. He was right.",
        image: "https://randomuser.me/api/portraits/women/38.jpg",
        verified: true,
        platform: "Direct",
    },
    {
        id: 16,
        tag: "Bonding",
        name: "Ethan C.",
        age: "27",
        occupation: "Graphic Designer",
        rating: 5,
        title: "My portfolio went live — I finally wanted my photo on it",
        short: "I'd been avoiding putting a headshot on my freelance website for two years.",
        full: "I'd been avoiding putting a headshot on my freelance website for two years. Design is visual — clients judge you by your aesthetic sense, and mine felt undermined by a chipped incisor. Two hours of composite bonding, zero discomfort, and the same afternoon I updated my website with a proper photo. My inquiry rate went up. Correlation isn't causation, but I believe it.",
        image: "https://randomuser.me/api/portraits/men/19.jpg",
        verified: true,
        platform: "Google",
    },
];

const TAGS: Tag[] = ["All", "Implants", "Veneers", "Invisalign", "Whitening", "Bonding"];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function Stars({ n }: { n: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: n }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
            ))}
        </div>
    );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({ t }: { t: Testimonial }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            layout
            className="bg-white rounded-[28px] p-8 border border-black/5 shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow"
        >
            {/* Top row */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-[#f5f5f5] text-black/60 px-3 py-1.5 rounded-full">
                    {t.tag}
                </span>
                <Stars n={t.rating} />
            </div>

            {/* Quote icon + title */}
            <div>
                <Quote className="w-6 h-6 text-primary/30 mb-3" />
                <h3 className="text-lg font-display font-bold text-black leading-snug">
                    {t.title}
                </h3>
            </div>

            {/* Body */}
            <AnimatePresence initial={false}>
                <motion.p
                    key={expanded ? "full" : "short"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-sm text-black/60 leading-relaxed flex-1"
                >
                    &ldquo;{expanded ? t.full : t.short}&rdquo;
                </motion.p>
            </AnimatePresence>

            <button
                onClick={() => setExpanded(v => !v)}
                className="text-[11px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors self-start"
            >
                {expanded ? "Read less ↑" : "Read full story →"}
            </button>

            {/* Divider */}
            <div className="border-t border-black/5 pt-5 flex items-center gap-3">
                <img
                    src={t.image}
                    alt={t.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-black/5"
                />
                <div className="flex-1 min-w-0">
                    <p className="font-black text-black text-sm">{t.name}</p>
                    <p className="text-[11px] text-muted font-medium">{t.age} · {t.occupation}</p>
                </div>
                {t.verified && (
                    <div className="flex items-center gap-1 text-[10px] text-black/30 font-bold uppercase tracking-widest shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                        {t.platform}
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// ─── Featured Quote (hero-size) ───────────────────────────────────────────────

const FEATURED = TESTIMONIALS[0];

function FeaturedTestimonial() {
    return (
        <div className="bg-black rounded-[40px] p-12 md:p-16 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-3 relative z-10">
                <Stars n={5} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Featured Story</span>
            </div>
            <blockquote className="text-2xl md:text-3xl font-display font-bold text-white leading-snug relative z-10 max-w-2xl">
                &ldquo;{FEATURED.title}&rdquo;
            </blockquote>
            <p className="text-white/50 leading-relaxed text-sm relative z-10 max-w-xl">
                &ldquo;{FEATURED.full}&rdquo;
            </p>
            <div className="flex items-center gap-4 relative z-10 pt-2">
                <img src={FEATURED.image} alt={FEATURED.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/10" />
                <div>
                    <p className="font-black text-white text-sm">{FEATURED.name}</p>
                    <p className="text-[11px] text-white/40 font-medium">{FEATURED.age} · {FEATURED.occupation}</p>
                </div>
            </div>
        </div>
    );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────

const TRUST = [
    { value: "4.9", sub: "Google Rating", icon: "★" },
    { value: "320+", sub: "Verified Reviews", icon: "✦" },
    { value: "98%", sub: "Would Return", icon: "↩" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TestimonialsPage() {
    const [activeTag, setActiveTag] = useState<Tag>("All");
    const navigate = useNavigate();

    const filtered = TESTIMONIALS.filter(t => activeTag === "All" || t.tag === activeTag);

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            <Navbar />

            {/* ── Hero ── */}
            <section className="pt-36 pb-16 container mx-auto px-8">
                <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
                    <div>
                        <div className="inline-flex items-center gap-2 mb-5">
                            <MessageCircleHeart className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Patient Stories</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter uppercase leading-none text-black">
                            Words that<br />
                            <span className="text-primary">changed</span> us.
                        </h1>
                    </div>
                    <p className="text-muted font-medium max-w-xs leading-relaxed text-sm">
                        These aren't marketing copy. They're unedited words from real patients — the moments that reminded us why we chose this work.
                    </p>
                </div>

                {/* Trust bar */}
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-12">
                    {TRUST.map(t => (
                        <div key={t.sub} className="bg-white rounded-2xl p-6 border border-black/5 text-center shadow-sm">
                            <p className="text-2xl font-display font-bold text-black">{t.value}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted mt-1">{t.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Featured */}
                <FeaturedTestimonial />
            </section>

            {/* ── Filter tabs ── */}
            <section className="container mx-auto px-8 mb-10">
                <div className="flex gap-3 flex-wrap">
                    {TAGS.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all ${activeTag === tag
                                ? "bg-black text-white shadow-lg"
                                : "bg-white text-black/50 border border-black/10 hover:border-black hover:text-black"
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Cards grid ── */}
            <section className="container mx-auto px-8 mb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTag}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map(t => (
                            <TestimonialCard key={t.id} t={t} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </section>

            {/* ── Emotional CTA ── */}
            <section className="bg-black py-24 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[80px]" />
                </div>
                <div className="container mx-auto px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 mb-6">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Your story starts here</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white uppercase tracking-tight leading-tight mb-4">
                        Every one of these<br />patients was <span className="text-primary">nervous.</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto mb-10 leading-relaxed">
                        The first step is always the hardest. A free, no-obligation consultation costs you nothing — except the moment you choose to take it.
                    </p>
                    <button
                        onClick={() => navigate("/contact")}
                        className="bg-primary hover:bg-accent text-black font-black uppercase tracking-wider text-sm py-5 px-12 rounded-2xl inline-flex items-center gap-4 group transition-colors"
                    >
                        Book My Free Consultation
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                            <ArrowRight className="w-4 h-4" />
                        </div>
                    </button>
                    <p className="text-white/20 text-[11px] font-black uppercase tracking-widest mt-5">
                        No commitment · No pressure · Just a conversation
                    </p>
                </div>
            </section>
        </div>
    );
}
