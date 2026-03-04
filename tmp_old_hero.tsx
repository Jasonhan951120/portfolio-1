import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img
          src="https://res.cloudinary.com/dvmxeaefb/image/upload/v1772027148/hf_20260225_133434_c1b0d960-4d3f-433a-9c28-6dcc11fa4614_1_t4ih8j.jpg"
          alt="Modern Dental Clinic"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40 z-10" />
      </motion.div>

      <div className="container mx-auto px-8 relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Removed the top badge to place it below the headline */}

            <h1 className="text-5xl md:text-7xl lg:text-[100px] font-display font-bold mb-8 leading-[0.9] text-white uppercase">
              London's <br />
              <span className="text-accent">Trusted</span> <br />
              Dental Care.
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

            <p className="text-xl text-white/90 mb-12 max-w-lg leading-relaxed font-medium">
              Achieve your perfect smile with the clinical expertise you deserve. Join thousands of patients who trust London Smile for their transformation.
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
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Call for emergency</span>
                <a
                  href="tel:+442071234567"
                  className="text-white font-bold text-xl hover:text-accent transition-colors flex items-center gap-2"
                >
                  020 7123 4567
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

    </section>
  );
}
