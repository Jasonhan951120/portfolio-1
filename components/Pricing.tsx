import React from 'react';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const plans = [
    {
      name: "Basic Care",
      price: "$99",
      period: "per visit",
      desc: "Essential preventative care for maintaining optimal oral health.",
      features: [
        "Comprehensive Exam",
        "Digital X-Rays (Bitewing)",
        "Professional Cleaning",
        "Fluoride Treatment",
        "Oral Cancer Screening"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Cosmetic",
      price: "$499",
      period: "starting at",
      desc: "Aesthetic treatments to brighten and enhance your smile.",
      features: [
        "Everything in Basic Care",
        "Zoom! Teeth Whitening",
        "Cosmetic Bonding",
        "Desensitizing Treatment",
        "Take-home Whitening Kit",
        "Priority Booking"
      ],
      cta: "Book Cosmetic",
      popular: true
    },
    {
      name: "Surgical",
      price: "$1,200",
      period: "starting at",
      desc: "Advanced restoration for complex dental needs.",
      features: [
        "Everything in Cosmetic",
        "Titanium Dental Implants",
        "Porcelain Veneers",
        "Invisalign Consultation",
        "3D CT Scan Analysis",
        "Lifetime Warranty"
      ],
      cta: "Consult Specialist",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-page relative">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-full h-1/2 bg-white skew-y-3 transform origin-bottom-right z-0"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <span className="text-smile-mid font-bold tracking-wider uppercase text-sm mb-3 block">Simple Pricing</span>
          <h2 className="font-heading text-4xl font-bold text-darkText mb-4">Transparent Care Plans</h2>
          <p className="text-slate-500 text-lg">Choose the care plan that fits your needs. No hidden fees.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-xl ${plan.popular
                  ? 'border-smile-mid shadow-lg bg-white ring-4 ring-blue-50 transform md:-translate-y-4'
                  : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
            >
              {plan.popular && (
                <div className="absolute top-6 right-6 bg-smile-accent text-darkText text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-darkText mb-2 font-heading">{plan.name}</h3>

              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-5xl font-bold text-darkText tracking-tight">{plan.price}</span>
                <span className="text-slate-400 font-medium text-sm">{plan.period}</span>
              </div>

              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                {plan.desc}
              </p>

              <a
                href="#booking"
                className={`block w-full text-center py-4 rounded-xl font-bold transition-all mb-10 shadow-md flex items-center justify-center gap-2 ${plan.popular
                    ? 'bg-smile-mid text-white hover:bg-[#0284C7] shadow-smile-mid/30'
                    : 'bg-white border-2 border-slate-100 text-slate-600 hover:border-smile-mid hover:text-smile-mid hover:bg-blue-50'
                  }`}
              >
                {plan.cta}
              </a>

              <div className="mt-auto pt-6 border-t border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Features</p>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${plan.popular ? 'bg-smile-mid' : 'bg-slate-200'}`}>
                        <Check size={12} className="text-white stroke-[3]" />
                      </div>
                      <span className="text-sm text-slate-600 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;