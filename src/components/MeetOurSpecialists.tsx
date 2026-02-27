import { motion } from "motion/react";

const specialists = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Lead Cosmetic Dentist",
    image: "https://images.unsplash.com/photo-1559839734-2b71f153678f?auto=format&fit=crop&q=80&w=800",
    bio: "Specializing in smile makeovers and advanced porcelain veneers with over 15 years of experience."
  },
  {
    name: "Dr. James Wilson",
    role: "Orthodontic Specialist",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800",
    bio: "Expert in Invisalign and complex alignment cases, dedicated to creating perfectly balanced smiles."
  },
  {
    name: "Dr. Elena Rodriguez",
    role: "Implant Surgeon",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800",
    bio: "Renowned for precision implantology and restorative surgery using the latest digital workflows."
  }
];

export default function MeetOurSpecialists() {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">The Experts</span>
            <div className="w-12 h-[1px] bg-black/10" />
          </div>
          <h2 className="text-6xl md:text-8xl font-display font-bold mb-10 text-black tracking-tighter leading-none uppercase">
            Meet Our <span className="text-primary inline-block">Specialists.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {specialists.map((person, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-[40px] mb-8 shadow-2xl border border-black/5">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>
              <h3 className="text-2xl font-display font-bold text-black mb-2 uppercase tracking-tight">{person.name}</h3>
              <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{person.role}</p>
              <p className="text-muted leading-relaxed font-medium">{person.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
