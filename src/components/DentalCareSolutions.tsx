import { motion } from "motion/react";
import { Shield, Zap, Heart, Sparkles } from "lucide-react";

const solutions = [
  {
    icon: Shield,
    title: "Preventive Care",
    desc: "Advanced diagnostics and hygiene protocols to protect your natural smile."
  },
  {
    icon: Zap,
    title: "Digital Dentistry",
    desc: "3D scanning and AI-driven treatment planning for unmatched precision."
  },
  {
    icon: Heart,
    title: "Patient Comfort",
    desc: "Sedation options and a calming environment designed for your peace of mind."
  },
  {
    icon: Sparkles,
    title: "Artistic Results",
    desc: "Bespoke cosmetic enhancements that blend perfectly with your features."
  }
];

export default function DentalCareSolutions() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Innovation</span>
            <div className="w-12 h-[1px] bg-black/10" />
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-10 text-black tracking-tighter leading-none uppercase">
            Dental Care <span className="text-primary inline-block">Solutions.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="p-12 rounded-[40px] bg-surface border border-black/5 hover:bg-black hover:text-white transition-all duration-500 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 shadow-lg group-hover:bg-primary transition-colors">
                <item.icon className="w-8 h-8 text-black group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-muted group-hover:text-white/70 font-medium leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
