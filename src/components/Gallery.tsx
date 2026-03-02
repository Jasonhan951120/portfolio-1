import { motion } from "motion/react";

const images = [
  { src: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771075774/hf_20260214_011522_45251a61-bfe4-40cb-8c5a-c6cf03ae5b96_1_1_ur6zaf.png", className: "col-span-1 row-span-2" },
  { src: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771077626/hf_20260214_135629_c9b18a81-a842-45f4-ad1e-4da9f2e16c1c_1_j7r4gc.png", className: "col-span-2 row-span-2" },
  { src: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771088916/hf_20260214_165746_192a1873-867f-41e8-b417-388bc6d730d7_1_olxwd2.png", className: "col-span-1 row-span-2" },
  { src: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771075534/hf_20260214_130947_a92869f2-773e-4a7c-a59c-8275e70715be_2_yjcifk.png", className: "col-span-1 row-span-2" },
  { src: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771346599/hf_20260217_161448_6a99ed95-9389-4487-a68d-1b621228e2dc_1_hqy9u1.png", className: "col-span-2 row-span-2" },
  { src: "https://res.cloudinary.com/dvmxeaefb/image/upload/v1771270807/hf_20260216_191842_7e69bacc-29b8-48ef-a76a-a7b74c73f48b_1_yjb1ci.png", className: "col-span-1 row-span-2" },
];

export default function Gallery({ clinic }: { clinic: any }) {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-black/10" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">The Clinic</span>
            <div className="w-12 h-[1px] bg-black/10" />
          </div>
          <h2 className="text-6xl md:text-[100px] font-display font-bold mb-10 text-black tracking-tighter leading-none uppercase">
            A Space for <span className="text-primary inline-block">Excellence.</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[250px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className={`relative rounded-[40px] overflow-hidden shadow-2xl border border-black/5 ${img.className}`}
            >
              <img
                src={img.src}
                alt={`Clinic Interior ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
