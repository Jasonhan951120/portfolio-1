import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate } from "motion/react";
import { ChevronLeft, ChevronRight, Quote, Star, Users, Award } from "lucide-react";

function Counter({ value, duration = 2, decimals = 0, suffix = "" }: { value: number, duration?: number, decimals?: number, suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        onUpdate: (latest) => setDisplayValue(latest),
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

const reviews = [
  { name: "Simone P.", text: "Definitely the place to go for dental care. Awesome staff. They display genuine care and respect." },
  { name: "James W.", text: "Incredible experience. Invisalign changed my life! The team made me feel so comfortable." },
  { name: "Sarah L.", text: "Pain-free implants. The team is amazing. I can finally smile with confidence again." },
];

export default function Reviews({ clinic }: { clinic: any }) {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32 py-16 border-y border-black/5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-6xl md:text-8xl font-display font-bold text-black mb-4 tracking-tighter">
                <Counter value={10000} suffix="+" />
              </div>
              <div className="text-xs font-bold text-muted uppercase tracking-[0.4em]">Visited Customers</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-6xl md:text-8xl font-display font-bold text-black mb-4 tracking-tighter">
                <Counter value={4.8} decimals={1} />
              </div>
              <div className="text-xs font-bold text-muted uppercase tracking-[0.4em]">Google Reviews</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-6xl md:text-8xl font-display font-bold text-black mb-4 tracking-tighter">
                <Counter value={4.7} decimals={1} />
              </div>
              <div className="text-xs font-bold text-muted uppercase tracking-[0.4em]">Satisfaction Survey</div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-12 h-[1px] bg-black/10" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Testimonials</span>
              </div>
              <h2 className="text-6xl md:text-[100px] font-display font-bold mb-12 text-black tracking-tighter leading-[0.85] uppercase">
                Patient <br />
                <span className="text-primary inline-block">Stories.</span>
              </h2>
              <p className="text-xl text-muted mb-16 font-medium leading-relaxed max-w-md">
                We take pride in delivering exceptional care. Read about the experiences of our patients and their journey to a better smile.
              </p>

              <div className="flex items-center gap-6">
                <button
                  onClick={prev}
                  className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-all text-black shadow-lg shadow-accent/20"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-all text-black shadow-lg shadow-accent/20"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-[40px] p-12 md:p-16 shadow-2xl relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="flex gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-black fill-black" />
                      ))}
                    </div>
                    <p className="text-2xl md:text-3xl font-display font-bold text-black leading-tight mb-10 uppercase tracking-tight">
                      "{reviews[current].text}"
                    </p>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center font-display text-2xl text-white font-bold">
                        {reviews[current].name[0]}
                      </div>
                      <div>
                        <p className="text-xl font-bold text-black tracking-tight uppercase">{reviews[current].name}</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-muted">Verified Patient</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
