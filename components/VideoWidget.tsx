import React, { useState, useRef, useEffect } from 'react';
import { X, Play } from 'lucide-react';

const VideoWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggerVideoRef = useRef<HTMLVideoElement>(null);

  const toggleWidget = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (videoRef.current) {
        if (isOpen) {
            videoRef.current.currentTime = 0;
            videoRef.current.muted = false;
            videoRef.current.play().catch(e => {
                console.log("Autoplay prevented", e);
            });
        } else {
            videoRef.current.pause();
        }
    }
  }, [isOpen]);

  return (
    <>
      <style>{`
        @keyframes widget-pulse {
            0% { box-shadow: 0 0 0 0 rgba(77, 182, 172, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(77, 182, 172, 0); }
            100% { box-shadow: 0 0 0 0 rgba(77, 182, 172, 0); }
        }
        .widget-pulse {
            animation: widget-pulse 2s infinite;
        }
      `}</style>
      
      <div className="relative inline-block align-middle ml-2 md:ml-6 align-sub z-50">
        {/* Trigger Bubble */}
        <div 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-white/90 shadow-2xl cursor-pointer overflow-hidden relative transform transition-transform hover:scale-105 widget-pulse bg-slate-900 group"
            onClick={toggleWidget}
        >
            <video 
                ref={triggerVideoRef}
                autoPlay 
                muted 
                loop 
                playsInline 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            >
                <source src="https://assets.mixkit.co/videos/preview/mixkit-man-working-in-an-office-1393-large.mp4" type="video/mp4" />
            </video>
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/40">
                    <Play size={14} fill="white" className="text-white ml-0.5" />
                 </div>
            </div>
        </div>

        {/* Expanded Player */}
        <div 
            className={`absolute top-1/2 -translate-y-1/2 left-full ml-6 w-[280px] md:w-[300px] aspect-[9/16] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-400 origin-left border border-white/10 ${
                isOpen ? 'opacity-100 scale-100 pointer-events-auto translate-x-0' : 'opacity-0 scale-75 pointer-events-none -translate-x-10'
            }`}
            style={{ zIndex: 100 }}
        >
            <button 
                onClick={toggleWidget}
                className="absolute top-4 right-4 z-20 bg-black/20 backdrop-blur-md text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors border border-white/10"
            >
                <X size={18} />
            </button>
            
            <video 
                ref={videoRef}
                playsInline 
                loop
                className="w-full h-full object-cover"
            >
                 <source src="https://assets.mixkit.co/videos/preview/mixkit-man-working-in-an-office-1393-large.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
                <h3 className="font-bold text-lg mb-1 text-white drop-shadow-md">Hi, I'm Dr. Mitchell! 👋</h3>
                <p className="text-sm text-white/90 mb-4 drop-shadow-md leading-relaxed">
                    Thanks for visiting. Can I help you create your dream smile today?
                </p>
                <a 
                    href="#offer" 
                    onClick={toggleWidget}
                    className="block w-full bg-smile-light hover:bg-smile-mid text-white text-center py-3 rounded-xl font-bold transition-colors shadow-lg text-sm"
                >
                    Book Free Strategy Call
                </a>
            </div>
        </div>
      </div>
    </>
  );
};

export default VideoWidget;