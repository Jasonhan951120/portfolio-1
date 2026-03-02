import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ clinic }: { clinic: any }) {
  const navigate = useNavigate();

  const brandColor = clinic?.brand_color || "#E9F11E";
  const clinicName = clinic?.name || "London Smile";
  const clinicPhone = clinic?.phone || "020 7123 4567";
  const heroImage = clinic?.hero_image_url || "https://res.cloudinary.com/dvmxeaefb/image/upload/v1772027148/hf_20260225_133434_c1b0d960-4d3f-433a-9c28-6dcc11fa4614_1_t4ih8j.jpg";

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Cinematic Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroImage}
          alt={clinicName}
          className="w-full h-full object-cover scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Premium Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 z-10" />
      </motion.div>

      <div className="container mx-auto px-8 relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Removed the top badge to place it below the headline */}

            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-serif font-bold mb-8 leading-[0.9] text-white">
              {clinicName.split(' ')[0]} <br />
              <span className="text-accent italic font-medium lowercase tracking-tighter">Excellence</span> <br />
              {clinicName.split(' ').slice(1).join(' ') || "Dental Care"}
            </h1>

            {/* Social Proof - Trust Indicator (Moved below headline) */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/20 mb-8 shadow-2xl">
              <div className="flex gap-1">
                ⭐⭐⭐⭐⭐
              </div>
              <span className="text-white text-sm font-bold tracking-widest uppercase">
                Google Rating 4.9
              </span>
            </div>

            {clinic?.has_financing && (
              <div className="flex flex-col mb-8 animate-in fade-in slide-in-from-left-4 duration-1000 delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-white/60 text-xs font-bold uppercase tracking-[0.3em]">Exclusive Offer</span>
                </div>
                <div className="text-4xl md:text-5xl font-display font-black text-white mt-1">
                  0% APR <span className="text-accent">Over {clinic?.max_financing_months || 24}m</span>
                </div>
              </div>
            )}

            <p className="text-xl text-white/90 mb-12 max-w-lg leading-relaxed font-medium">
              Experience the pinnacle of dentistry at {clinicName}. Our clinical expertise meets artisanal precision to redefine your smile.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button
                onClick={() => {
                  const element = document.getElementById("lead-form");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/", { state: { scrollTo: "lead-form" } });
                  }
                }}
                className="btn-primary w-full sm:w-auto text-lg group flex items-center gap-3 !px-12 !py-6"
              >
                Book Your Consultation
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </button>

              <div className="flex flex-col">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Direct Clinical Line</span>
                <a
                  href={`tel:${clinicPhone}`}
                  className="text-white font-bold text-xl hover:text-accent transition-colors flex items-center gap-2"
                >
                  {clinicPhone}
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

    </section>
  );
}
