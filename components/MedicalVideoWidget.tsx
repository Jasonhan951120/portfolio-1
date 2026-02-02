import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, X } from 'lucide-react';

const MedicalVideoWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleWidget = () => {
    if (isOpen) {
      // Close
      setIsOpen(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      // Open
      setIsOpen(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        setIsMuted(false);
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play prevented
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play();
            }
          });
        }
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <>
      <style>{`
        .premium-widget-root {
            --widget-primary: #0f172a;
            --widget-accent: #c0a062;
            --widget-text: #ffffff;
            --widget-width: 320px;
            --widget-height: 560px;
            font-family: 'Inter', sans-serif;
            z-index: 9999;
        }

        /* The Bubble (Minimized State) */
        .video-widget-trigger {
            width: 85px;
            height: 85px;
            border-radius: 50%;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            border: 3px solid #fff;
            position: relative;
            transition: transform 0.4s ease;
            animation: pulse-ring 3s infinite;
        }
        
        /* Online Status */
        .video-widget-trigger::after {
            content: '';
            position: absolute;
            bottom: 5px;
            right: 12px;
            width: 12px;
            height: 12px;
            background: #22c55e;
            border: 2px solid #fff;
            border-radius: 50%;
            z-index: 10;
        }

        .video-widget-trigger:hover {
            transform: scale(1.05);
        }

        /* The Expanded Player */
        .video-widget-player {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: var(--widget-width);
            height: var(--widget-height);
            background: #000;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0);
            transform-origin: bottom right;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0;
            pointer-events: none;
            z-index: 10000;
        }

        .video-widget-player.is-open {
            transform: scale(1);
            opacity: 1;
            pointer-events: all;
        }

        /* CTA Button */
        .video-cta-btn {
            background: var(--widget-accent);
            color: #0f172a;
            border: none;
            padding: 16px;
            border-radius: 4px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            width: 100%;
            transition: all 0.3s;
            text-decoration: none;
            text-align: center;
            display: block;
            box-sizing: border-box;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 4px 20px rgba(192, 160, 98, 0.4);
        }

        .video-cta-btn:hover {
            background: #d4b475;
            transform: translateY(-2px);
        }

        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }

        @media (max-width: 480px) {
            .video-widget-player {
                bottom: 0;
                right: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 0;
            }
        }
      `}</style>

      <div className="premium-widget-root fixed bottom-8 right-8 z-[9999]">
        
        {/* 1. The Minimized Bubble */}
        <div 
          className={`video-widget-trigger ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
          onClick={toggleWidget}
        >
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="w-full h-full object-cover"
            >
                <source src="https://cdn.pixabay.com/video/2016/09/21/5186-183713601_large.mp4" type="video/mp4" />
            </video>
        </div>

        {/* 2. The Expanded Player */}
        <div className={`video-widget-player ${isOpen ? 'is-open' : ''}`}>
            <div className="relative w-full h-full">

                {/* Premium Brand Badge */}
                <div className="absolute top-6 left-6 text-white text-sm font-semibold tracking-wide flex items-center gap-2 z-20 drop-shadow-md">
                   <span className="text-[#c0a062]">LUMIERE DENTAL</span>
                </div>

                {/* Side Controls */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
                    <button 
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105"
                        onClick={toggleWidget}
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                    <button 
                        className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all hover:scale-105"
                        onClick={toggleMute}
                        title="Toggle Sound"
                    >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                </div>

                {/* Main Video */}
                <video 
                    ref={videoRef}
                    loop 
                    playsInline 
                    className="w-full h-full object-cover"
                >
                    <source src="https://cdn.pixabay.com/video/2016/09/21/5186-183713601_large.mp4" type="video/mp4" />
                </video>

                {/* Overlay & Content */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent via-60% to-black/90 flex flex-col justify-end p-6 text-white">
                    <div className="mb-5">
                        <h3 className="font-heading text-2xl font-bold mb-2 leading-tight">Your Smile.<br/>Perfected.</h3>
                        <p className="text-sm font-light opacity-90 leading-relaxed">
                            We specialize in invisible alignment and cinematic restorative dentistry.
                        </p>
                    </div>

                    <a href="#offer" onClick={toggleWidget} className="video-cta-btn">
                        Book Consultation
                    </a>
                </div>
            </div>
        </div>

      </div>
    </>
  );
};

export default MedicalVideoWidget;