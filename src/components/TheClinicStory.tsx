import { motion } from "motion/react";

export default function TheClinicStory() {
  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Our Heritage</span>
            <div className="w-12 h-[1px] bg-black/10" />
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-12 text-black tracking-tighter leading-none uppercase">
            The Clinic <span className="text-primary inline-block">Story.</span>
          </h2>
          
          <div className="space-y-8 text-xl text-muted font-medium leading-relaxed">
            <p>
              Founded in the heart of Harley Street, London Smile was born from a vision to transform dental care from a clinical necessity into a luxury experience.
            </p>
            <p>
              Our journey began with a single chair and a commitment to combining the latest medical advancements with the fine artistry of cosmetic dentistry. Today, we are proud to be one of London's premier destinations for smile transformations.
            </p>
            <p>
              Every patient who walks through our doors becomes part of our story—a story of confidence restored and lives changed through the power of a perfect smile.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white rounded-[40px] shadow-xl border border-black/5">
              <p className="text-4xl font-display font-bold text-black mb-2">2010</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Established</p>
            </div>
            <div className="p-10 bg-white rounded-[40px] shadow-xl border border-black/5">
              <p className="text-4xl font-display font-bold text-black mb-2">10k+</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Smiles Created</p>
            </div>
            <div className="p-10 bg-white rounded-[40px] shadow-xl border border-black/5">
              <p className="text-4xl font-display font-bold text-black mb-2">25+</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Awards Won</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
