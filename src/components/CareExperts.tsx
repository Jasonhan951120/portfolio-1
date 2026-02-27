import { motion } from "motion/react";

const experts = [
  {
    role: "Dental Hygienist",
    name: "Emma Thompson",
    desc: "Dedicated to preventive care and patient education for long-term oral health."
  },
  {
    role: "Patient Coordinator",
    name: "Michael Chen",
    desc: "Ensuring your journey from consultation to final result is seamless and comfortable."
  },
  {
    role: "Clinical Assistant",
    name: "Sophia Loren",
    desc: "Providing expert chairside support and ensuring the highest standards of sterilization."
  }
];

export default function CareExperts() {
  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-black/10" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Support Team</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-[100px] font-display font-bold mb-12 text-black tracking-tighter leading-[0.85] uppercase">
              Your Dedicated <br />
              <span className="text-primary inline-block">Care Experts.</span>
            </h2>
            <p className="text-xl text-muted mb-16 font-medium leading-relaxed max-w-md">
              Behind every great smile is a team of dedicated professionals committed to your comfort and care.
            </p>
          </div>

          <div className="space-y-8">
            {experts.map((expert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-white p-10 rounded-[40px] shadow-xl border border-black/5 flex flex-col md:flex-row gap-8 items-start md:items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center text-white font-display text-2xl font-bold shrink-0">
                  {expert.name[0]}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">{expert.role}</p>
                  <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-2">{expert.name}</h3>
                  <p className="text-muted font-medium text-sm leading-relaxed">{expert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
