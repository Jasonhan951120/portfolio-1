import React, { useState } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const BeforeAfter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  const cases = [
    {
      id: 1,
      patient: "Michael R.",
      proc: "Veneers",
      imgBefore: "https://picsum.photos/id/338/400/300", 
      imgAfter: "https://picsum.photos/id/349/400/300" 
    },
    {
      id: 2,
      patient: "Emily S.",
      proc: "Invisalign",
      imgBefore: "https://picsum.photos/id/129/400/300", 
      imgAfter: "https://picsum.photos/id/64/400/300" 
    },
    {
      id: 3,
      patient: "David L.",
      proc: "Implants",
      imgBefore: "https://picsum.photos/id/433/400/300", 
      imgAfter: "https://picsum.photos/id/447/400/300" 
    },
     {
      id: 4,
      patient: "Jessica M.",
      proc: "Whitening",
      imgBefore: "https://picsum.photos/id/531/400/300", 
      imgAfter: "https://picsum.photos/id/836/400/300" 
    }
  ];

  return (
    <section className="py-24 bg-page relative overflow-hidden" id="results">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal">
             <div className="max-w-2xl">
                <span className="text-smile-mid font-bold tracking-wider uppercase text-xs mb-3 block">Results</span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">Transformations</h2>
                <p className="text-slate-400 text-lg">See the life-changing results of precision dentistry.</p>
             </div>
             
             {/* Glass Tabs */}
             <div className="bg-white/5 border border-white/10 p-1.5 rounded-full flex gap-1 mt-6 md:mt-0 backdrop-blur-md">
                 <button 
                    onClick={() => setActiveTab('before')}
                    className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'before' ? 'bg-white text-page shadow-glow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                 >
                    Before
                 </button>
                 <button 
                    onClick={() => setActiveTab('after')}
                    className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 ${activeTab === 'after' ? 'bg-smile-mid text-black shadow-glow' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                 >
                    After
                 </button>
             </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 reveal delay-100">
           {cases.map((item) => (
             <div key={item.id} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 hover:border-smile-mid/50 transition-all duration-500 shadow-glass hover:shadow-glow hover:-translate-y-2">
                <div className="aspect-[3/4] w-full bg-slate-900 relative">
                    <img 
                        src={activeTab === 'before' ? item.imgBefore : item.imgAfter} 
                        alt={`${item.patient} Result`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-white/20 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full">
                        {activeTab}
                    </div>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                    <span className="text-smile-mid font-bold text-xs tracking-wide uppercase mb-1">{item.proc}</span>
                    <h3 className="text-white font-bold text-xl mb-2">{item.patient}</h3>
                    <div className="h-0 group-hover:h-6 overflow-hidden transition-all duration-300">
                         <p className="text-slate-300 text-xs flex items-center">View Case Study <ArrowRight size={12} className="ml-1 text-smile-mid" /></p>
                    </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;