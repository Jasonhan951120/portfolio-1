import { motion } from "motion/react";

const insuranceLogos = [
  "BlueCross BlueShield", "Aetna", "Cigna", "Delta Dental", "Guardian",
  "Humana", "MetLife", "Principal", "United Concordia", "United Healthcare"
];

export default function Insurance() {
  return (
    <section className="py-48 bg-[#FBFBFB]">
      <div className="container mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-10 h-[1px] bg-sage" />
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage">Partnerships</span>
          <div className="w-10 h-[1px] bg-sage" />
        </div>
        <h2 className="text-6xl md:text-8xl font-serif font-light mb-24 text-primary tracking-tight leading-none">
          Insurance <span className="italic font-normal">& Plans.</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-32 max-w-6xl mx-auto">
          {insuranceLogos.map((logo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
              className="bg-white rounded-[32px] h-32 flex items-center justify-center p-8 border border-black/5 shadow-2xl shadow-black/[0.02] hover:shadow-black/[0.05] transition-all group"
            >
              <span className="text-primary/40 group-hover:text-primary transition-colors font-medium text-[10px] text-center uppercase tracking-[0.2em] leading-tight">{logo}</span>
            </motion.div>
          ))}
        </div>

        <div className="bg-primary rounded-[60px] p-16 md:p-24 max-w-5xl mx-auto relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sage/10 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10">
            <h3 className="text-4xl md:text-5xl font-serif font-light mb-8 text-white">London Smile Plus</h3>
            <p className="text-lg text-slate-400 mb-12 leading-relaxed font-light max-w-2xl mx-auto">
              A simple, affordable care plan designed for those without traditional insurance. 
              Includes cleanings, exams, and significant savings on all specialist procedures.
            </p>
            <button className="btn-accent">
              Explore Membership
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
