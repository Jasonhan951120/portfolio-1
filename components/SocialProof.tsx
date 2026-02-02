import React from 'react';

const SocialProof: React.FC = () => {
  const logos = [
    { name: "stamps", css: "font-serif italic" },
    { name: "VENUER", css: "font-sans tracking-[0.2em] font-light" },
    { name: "manter.", css: "font-serif font-bold text-slate-400" },
    { name: "Adverus", css: "font-sans font-medium flex items-center gap-2" },
    { name: "spaced", css: "font-serif lowercase text-xl" }
  ];

  return (
    <section className="pb-16 pt-8 bg-page border-b border-white/5" id="trusted">
      <div className="container mx-auto px-6 text-center">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-10">Trusted by Top Professionals</h3>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 hover:opacity-100 transition-opacity duration-500">
           {logos.map((logo, idx) => (
             <div key={idx} className="group cursor-pointer">
                {logo.name === 'Adverus' ? (
                    <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        </div>
                        <span className="text-2xl font-medium tracking-tight">Adverus</span>
                    </div>
                ) : (
                    <span className={`text-2xl md:text-3xl text-white/70 group-hover:text-white transition-colors ${logo.css}`}>
                        {logo.name}
                    </span>
                )}
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;