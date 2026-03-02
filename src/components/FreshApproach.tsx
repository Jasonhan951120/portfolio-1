import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function FreshApproach({ clinic }: { clinic: any }) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="rounded-[40px] overflow-hidden aspect-[4/5] bg-surface flex items-center justify-center p-12 shadow-2xl border border-black/5">
              <img
                src="https://res.cloudinary.com/dvmxeaefb/image/upload/v1771951963/hf_20260224_163715_43d0ab97-911f-4dda-b3e4-69b481b8589d_1_c9qbwa.png"
                alt="A New Standard in Dental Care"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-black/10" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Our Philosophy</span>
            </div>
            <h2 className="text-6xl md:text-[100px] font-display font-bold mb-10 text-black tracking-tighter leading-[0.85] uppercase">
              Our <br />
              <span className="text-primary inline-block mt-2 underline decoration-black/10 underline-offset-8">Philosophy.</span>
            </h2>
            <p className="text-xl text-muted mb-12 leading-relaxed font-medium">
              At London Smile Excellence, we’re changing the way you experience dental visits.
              From routine cleanings and Invisalign to crowns, our skilled team provides
              top-quality care in a welcoming, judgment-free environment, with convenient
              locations throughout London.
            </p>

            <button className="btn-yellow flex items-center gap-4 group">
              Learn More <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
