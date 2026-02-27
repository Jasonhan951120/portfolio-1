import { motion } from "motion/react";
import { Link } from "react-router-dom";

const otherServices = [
  {
    title: "Composite Bonding",
    slug: "composite-bonding",
    description: "Enhance your smile in just one visit with minimally invasive cosmetic bonding to repair chips, gaps, and uneven edges.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965553/hf_20260224_194822_dbee3087-65d3-4e06-8769-5ae9acd1a02d_knmad9.jpg"
  },
  {
    title: "Dental Crowns",
    slug: "dental-crowns",
    description: "Restore strength and appearance to damaged teeth with custom-made crowns that look and feel completely natural.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965518/hf_20260224_200006_2409d25b-6837-41b8-a6df-76610032d5ae_azzouf.jpg"
  },
  {
    title: "Gum Contouring",
    slug: "gum-contouring",
    description: "Reshape and refine your gum line for a more balanced and aesthetically pleasing smile.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965515/hf_20260224_194846_7d5d1758-c976-4d65-90ba-0576f56488d9_1_eqsuqz.png"
  },
  {
    title: "Sedation Dentistry",
    slug: "sedation-dentistry",
    description: "Relax throughout your treatment with safe and comfortable sedation options designed for nervous patients.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965515/hf_20260224_200121_a1138bff-2f8f-4cfe-8812-97ba600000a3_1_xvip2y.png"
  },
  {
    title: "Preventive Dental Care",
    slug: "preventive-care",
    description: "Comprehensive check-ups and hygiene treatments to keep your smile healthy and problem-free long term.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965514/hf_20260224_194907_1b8f2485-20d1-44df-9100-699164d7dd9d_nf1esk.jpg"
  },
  {
    title: "Children’s Dentistry",
    slug: "childrens-dentistry",
    description: "Gentle, friendly dental care tailored specifically for children in a calm and welcoming environment.",
    image: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771965514/hf_20260224_200042_5152638d-c2b7-4464-9970-36c186bebc2d_awwpxx.jpg"
  }
];

export default function OtherServices() {
  return (
    <section className="py-32 bg-surface">
      <div className="container mx-auto px-8">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Extended Care</span>
            <div className="w-12 h-[1px] bg-black/10" />
          </div>
          <h2 className="text-6xl md:text-[100px] font-display font-bold mb-10 text-black tracking-tighter leading-none uppercase">
            What <span className="text-primary inline-block">We Do.</span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto font-medium">
            From restorative care to cosmetic treatments, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherServices.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[40px] mb-8 shadow-2xl border border-black/5">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-2">
                <h3 className="text-2xl font-display font-bold text-black mb-4 uppercase tracking-tight">{service.title}</h3>
                <p className="text-muted leading-relaxed font-medium mb-8">
                  {service.description}
                </p>
                <Link
                  to={`/treatment/${service.slug}`}
                  className="btn-yellow inline-block !px-6 !py-3 text-[10px] uppercase tracking-widest"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

