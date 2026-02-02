import React from 'react';
import { ShieldCheck, Sparkles, Activity, User, ArrowRight } from 'lucide-react';

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
      highlight: true // Simulating the "Popular" card
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
    <section className="py-16 md:py-24 bg-surface relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">World-Class Treatments</h2>
          <p className="text-slate-600 text-base md:text-lg">Comprehensive care tailored to your unique needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`relative rounded-[2rem] p-6 md:p-8 transition-all duration-300 group shadow-card ${
                service.highlight 
                  ? 'bg-slate-900 border border-slate-900 shadow-xl transform md:-translate-y-4' 
                  : 'bg-white border border-slate-100 hover:border-smile-mid/30 hover:shadow-xl'
              }`}
            >
              {service.highlight && (
                <div className="absolute top-0 right-0 bg-smile-gold text-black text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-[1.8rem]">
                    Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                  service.highlight ? 'bg-smile-mid text-white' : 'bg-blue-50 text-smile-mid group-hover:bg-smile-mid group-hover:text-white'
              }`}>
                  {service.icon}
              </div>
              
              <h3 className={`text-2xl font-bold mb-4 ${service.highlight ? 'text-white' : 'text-slate-900'}`}>{service.title}</h3>
              <p className={`text-sm mb-8 leading-relaxed ${service.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {service.desc}
              </p>
              
              <div className="flex items-end gap-1 mb-8">
                 <span className={`text-3xl font-bold ${service.highlight ? 'text-white' : 'text-slate-900'}`}>{service.price}</span>
                 <span className={`text-sm mb-1 ${service.highlight ? 'text-slate-500' : 'text-slate-400'}`}>/ starting</span>
              </div>

              <a href="#booking" className={`block w-full text-center py-4 rounded-xl font-bold text-sm transition-all ${
                  service.highlight 
                    ? 'bg-smile-mid text-white hover:bg-white hover:text-black' 
                    : 'bg-slate-100 text-slate-900 hover:bg-smile-mid hover:text-white'
              }`}>
                  Book Consultation
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;