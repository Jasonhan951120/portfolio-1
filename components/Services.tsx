import React from 'react';
import { ShieldCheck, Sparkles, Activity, ArrowRight } from 'lucide-react';

const Services: React.FC = () => {
  const services = [
    {
      icon: <ShieldCheck size={32} />,
      title: "Dental Implants",
      desc: "Restore your smile with permanent, natural-looking artificial teeth.",
      price: "$1,200",
      highlight: false
    },
    {
      icon: <Activity size={32} />,
      title: "Orthodontics",
      desc: "Straighten teeth discreetly with clear aligners or traditional braces.",
      price: "$3,500",
      highlight: true // Popular
    },
    {
      icon: <Sparkles size={32} />,
      title: "Whitening",
      desc: "Professional laser whitening for a smile up to 8 shades brighter.",
      price: "$299",
      highlight: false
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-page relative">
      {/* Decor */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-smile-mid font-bold tracking-wider uppercase text-sm mb-3 block">Our Expertise</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-darkText mb-6">World-Class Treatments</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            Comprehensive care tailored to your unique needs, delivering precision results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className={`relative rounded-[2rem] p-8 transition-all duration-300 group flex flex-col ${service.highlight
                  ? 'bg-white shadow-xl ring-2 ring-smile-mid md:-translate-y-4'
                  : 'bg-white shadow-soft hover:shadow-xl hover:-translate-y-2 border border-slate-100'
                }`}
            >
              {service.highlight && (
                <div className="absolute top-0 right-0 bg-smile-accent text-darkText text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-[1.8rem] shadow-sm">
                  Most Popular
                </div>
              )}

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors ${service.highlight
                  ? 'bg-smile-mid text-white shadow-lg shadow-smile-mid/30'
                  : 'bg-blue-50 text-smile-mid group-hover:bg-smile-mid group-hover:text-white transition-all duration-300'
                }`}>
                {service.icon}
              </div>

              <h3 className="text-2xl font-heading font-bold mb-4 text-darkText">{service.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">
                {service.desc}
              </p>

              <div className="flex items-end gap-1 mb-8">
                <span className="text-3xl font-bold text-darkText">{service.price}</span>
                <span className="text-sm mb-1 text-slate-400">/ starting</span>
              </div>

              <a href="#booking" className={`block w-full text-center py-4 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${service.highlight
                  ? 'bg-smile-accent text-darkText hover:bg-[#F59E0B]'
                  : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-smile-mid hover:text-smile-mid'
                }`}>
                Book Consultation <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;