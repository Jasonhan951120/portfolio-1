import { motion } from "motion/react";

const services = [
  {
    title: "New Patient Special",
    desc: "Skip the stress. Enjoy a seamless first visit with a team that truly cares. Your best smile starts here.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771946506/hf_20260224_151749_3de2a6c0-90c0-4902-9cfd-1ce20cf8c437_uvtxfi.jpg",
  },
  {
    title: "Teeth Whitening",
    desc: "Brighter. Faster. Results you'll want to show off. Professional whitening that actually works.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771948285/hf_20260224_154924_46b8f778-f5be-4742-bbea-e005b5f4a077_vfsryh.jpg",
  },
  {
    title: "Routine Cleaning",
    desc: "Keep your smile healthy all year round. Quick, gentle, and thorough — because prevention is everything.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771946506/hf_20260224_151726_2a01ca53-fc0c-453b-88d6-dfad58fa4a37_enrxry.jpg",
  },
];

export default function Services({ clinic }: { clinic: any }) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-[1px] bg-accent" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Our Expertise</span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-[100px] font-display font-bold text-black uppercase leading-[0.85] tracking-tighter">
              Our <br />
              <span className="text-primary inline-block mt-2 underline decoration-black/10 underline-offset-8">Treatments.</span>
            </h2>
          </div>
          <p className="text-xl text-muted max-w-sm font-medium leading-relaxed">
            From routine checkups to advanced cosmetic transformations, we provide personalized care for every patient.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-[40px] overflow-hidden aspect-[4/5] mb-8 shadow-2xl border border-black/5">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="px-2">
                <h3 className="text-3xl font-display font-bold mb-4 text-black uppercase tracking-tight">{service.title}</h3>
                <p className="text-muted leading-relaxed mb-8 font-medium">{service.desc}</p>

                <button className="btn-yellow !px-6 !py-3 text-xs uppercase tracking-widest">
                  Book Treatment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
