import { motion } from "motion/react";

const reasons = [
  {
    title: "Precision Technology",
    desc: "We use the latest 3D imaging and digital workflows to ensure every treatment is accurate and minimally invasive."
  },
  {
    title: "Artistic Approach",
    desc: "Our dentists are artists at heart, focusing on the subtle details that make a smile look natural and beautiful."
  },
  {
    title: "Patient-First Care",
    desc: "From the moment you walk in, your comfort and peace of mind are our absolute priorities."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="aspect-square rounded-[60px] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern Clinic" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-accent rounded-[40px] p-10 shadow-2xl hidden md:block">
              <p className="text-5xl font-display font-bold text-black mb-2">15+</p>
              <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Years of Excellence</p>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-3 mb-8">
              <div className="w-12 h-[1px] bg-black/10" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">The Difference</span>
            </div>
            <h2 className="text-6xl md:text-[80px] font-display font-bold mb-12 text-black tracking-tighter leading-[0.9] uppercase">
              Why Choose <br />
              <span className="text-primary inline-block">London Smile.</span>
            </h2>
            
            <div className="space-y-12">
              {reasons.map((reason, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                >
                  <h3 className="text-2xl font-display font-bold text-black mb-4 uppercase tracking-tight">{reason.title}</h3>
                  <p className="text-muted leading-relaxed font-medium max-w-md">
                    {reason.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
