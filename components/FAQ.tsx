import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does the teeth whitening procedure cause sensitivity?",
      a: "Our advanced Zoom! Whitening technology includes desensitizing agents to minimize discomfort. 95% of our patients report little to no sensitivity during or after the treatment."
    },
    {
      q: "Do you accept my dental insurance?",
      a: "We work with most major PPO insurance providers including Delta Dental, Cigna, MetLife, and Aetna. Our team will handle all the paperwork to maximize your benefits."
    },
    {
      q: "How long do dental implants last?",
      a: "With proper care and maintenance, dental implants are designed to be a permanent solution and can last a lifetime. We offer a 10-year warranty on all implant procedures."
    },
    {
      q: "Can I get financing for cosmetic procedures?",
      a: "Absolutely! We offer flexible monthly payment plans through CareCredit and LendingClub, often with 0% interest for up to 24 months."
    },
    {
      q: "What if I have dental anxiety?",
      a: "You are not alone. We specialize in sedation dentistry and offer nitrous oxide, oral sedation, and a comfort menu (blankets, noise-canceling headphones) to ensure you are completely relaxed."
    }
  ];

  return (
    <section className="py-24 bg-page" id="faq">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Common Questions</h2>
          <p className="text-slate-400">Everything you need to know before your visit.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === idx ? 'bg-white/5 border border-smile-mid/30 shadow-glow' : 'bg-transparent border border-white/10 hover:border-white/20'}`}>
              <button 
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className={`font-bold text-lg pr-4 transition-colors ${openIndex === idx ? 'text-smile-mid' : 'text-slate-200'}`}>{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === idx ? 'bg-smile-mid text-black' : 'bg-white/5 text-slate-400 border border-white/10'}`}>
                    {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-6 pt-0 text-slate-400 leading-relaxed max-w-3xl">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;