import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const doctors = [
  {
    id: 1,
    name: "Dr. James Mitchell",
    role: "Lead Implant Specialist",
    image: "https://img.freepik.com/free-photo/portrait-smiling-male-doctor-with-stethoscope_171337-1532.jpg?w=800",
    exp: 15,
    bio1: "We believe in a holistic approach to healthcare that emphasizes the interconnectedness of the body's systems. By gaining a deep understanding of how various physiological processes interact, we are able to provide personalized care tailored to each patient's unique needs.",
    bio2: "Using state-of-the-art diagnostic tools and techniques, Dr. Mitchell meticulously analyzes the body's functions to identify underlying issues and develop comprehensive treatment plans for complex restorative cases.",
    reviews: "+3k"
  },
  {
    id: 2,
    name: "Dr. Sarah Connors",
    role: "Senior Orthodontist",
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg?w=800",
    exp: 12,
    bio1: "Dr. Connors specializes in creating perfect alignments using both traditional methods and modern invisible aligner technology. Her philosophy focuses on facial harmony and long-term stability, ensuring your smile looks natural and beautiful.",
    bio2: "With a gentle touch and a keen eye for detail, she has transformed over 3,000 smiles, helping patients of all ages achieve the confidence they deserve through precision orthodontics.",
    reviews: "+2.5k"
  },
  {
    id: 3,
    name: "Dr. David Chen",
    role: "Cosmetic Dentist",
    image: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg?w=800",
    exp: 9,
    bio1: "Passionate about the art of dentistry, Dr. Chen combines technical expertise with an artistic eye to craft stunning veneers and bonding treatments. He is dedicated to minimally invasive procedures that preserve your natural tooth structure.",
    bio2: "He stays at the forefront of cosmetic dental trends to ensure every patient receives the most advanced treatments available today, creating Hollywood-ready smiles for our community.",
    reviews: "+1.8k"
  }
];

const Team: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const nextDoctor = () => {
    setCurrentIndex((prev) => (prev + 1) % doctors.length);
  };

  const prevDoctor = () => {
    setCurrentIndex((prev) => (prev - 1 + doctors.length) % doctors.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextDoctor();
    }
    if (isRightSwipe) {
      prevDoctor();
    }
  };

  const doctor = doctors[currentIndex];

  return (
    <section className="py-16 md:py-32 bg-white relative overflow-hidden" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Navigation Header (Mobile/Tablet visible) */}
        <div className="flex justify-between items-center mb-10 lg:hidden">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Meet Our Team</h2>
            <div className="flex gap-3">
                <button onClick={prevDoctor} className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                    <ChevronLeft size={20} className="text-slate-900" />
                </button>
                <button onClick={nextDoctor} className="p-2.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                    <ChevronRight size={20} className="text-slate-900" />
                </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-12 lg:gap-24">
          
          {/* Left: Image with Badges */}
          <div className="lg:w-1/2 relative flex justify-center lg:justify-end animate-fade-in key={currentIndex}">
             
             {/* Circular Background Decoration */}
             <div className="absolute inset-0 border border-slate-100 rounded-full scale-150 opacity-50"></div>
             <div className="absolute inset-0 border border-slate-100 rounded-full scale-125 opacity-50"></div>
             
             <div className="relative">
                 {/* Main Doctor Image */}
                 <div className="w-[280px] h-[350px] md:w-[400px] md:h-[500px] rounded-full overflow-hidden border-[6px] md:border-[8px] border-white shadow-2xl relative z-10 bg-slate-50 transition-all duration-500">
                    <img 
                       src={doctor.image} 
                       alt={doctor.name} 
                       className="w-full h-full object-cover"
                    />
                 </div>

                 {/* Trusted Badge (Top Right) */}
                 <div className="absolute top-6 right-0 md:top-10 md:-right-10 z-20 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 animate-[fadeUp_1s_ease-out_0.5s_forwards] scale-90 md:scale-100 origin-top-right">
                    <div className="flex text-[#2563EB] mb-1 justify-center text-lg">
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                        <Star size={14} fill="currentColor" />
                    </div>
                    <div className="text-slate-900 font-bold text-xs text-center">Trusted by patient</div>
                    <div className="flex -space-x-2 mt-2 justify-center">
                        {[1,2,3].map(i => (
                             <img key={i} src={`https://randomuser.me/api/portraits/men/${i+20}.jpg`} className="w-8 h-8 rounded-full border-2 border-white" alt="Patient" />
                        ))}
                        <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs border-2 border-white font-bold">{doctor.reviews}</div>
                    </div>
                 </div>

                 {/* Experience Badge (Bottom Left) */}
                 <div className="absolute bottom-4 -left-2 md:bottom-0 md:-left-6 z-20 bg-[#0055FF] text-white p-4 md:p-6 rounded-3xl shadow-xl max-w-[140px] md:max-w-[180px] scale-90 md:scale-100 origin-bottom-left">
                    <span className="block text-3xl md:text-5xl font-bold mb-1">{doctor.exp}</span>
                    <span className="text-sm md:text-lg leading-tight font-medium opacity-90">Years of Experience</span>
                 </div>
                 
                 {/* Functional Previous Arrow (Was Next) - Desktop only */}
                 <button 
                    onClick={prevDoctor}
                    className="hidden md:flex absolute top-1/2 -right-16 transform -translate-y-1/2 w-20 h-20 bg-[#0055FF] rounded-full items-center justify-center text-white shadow-[0_10px_40px_-10px_rgba(0,85,255,0.5)] z-30 hover:bg-[#0044CC] transition-all hover:scale-110 cursor-pointer group"
                    aria-label="Previous Doctor"
                 >
                    <ArrowLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
                 </button>

                 <div className="absolute bottom-10 right-20 w-6 h-6 bg-[#0055FF] rounded-full hidden md:block"></div>
             </div>
          </div>

          {/* Right: Content */}
          <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left animate-fade-in key={currentIndex}">
            <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-50 text-[#0055FF] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                    {doctor.role}
                </span>
                
                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-2 ml-auto">
                    <button onClick={prevDoctor} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextDoctor} className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#0F172A] mb-6 md:mb-8">{doctor.name}</h2>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
                {doctor.bio1}
            </p>
            
            <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-8 md:mb-10">
                {doctor.bio2}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <a href="#booking" className="inline-flex items-center gap-2 bg-[#0055FF] text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-lg hover:bg-[#0044CC] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 w-full sm:w-auto justify-center">
                    Book An Appointment
                </a>
                
                <div className="flex gap-2">
                    {doctors.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-[#0055FF] w-8' : 'bg-slate-200 hover:bg-slate-300'}`}
                            aria-label={`Go to doctor ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Team;