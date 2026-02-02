import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatWidget: React.FC = () => {
  return (
    <div className="fixed bottom-6 right-6 z-40 group">
      <div className="absolute bottom-full right-0 mb-4 bg-slate-900/90 backdrop-blur-xl shadow-glass border border-white/10 rounded-2xl p-4 w-64 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
         <p className="text-sm text-slate-200 font-medium">👋 Hi there! Need help booking your visit? We're online!</p>
         <button className="mt-3 w-full bg-smile-mid text-black text-xs font-bold py-2 rounded-lg hover:bg-white transition-colors shadow-glow">Start Chat</button>
      </div>
      <button className="bg-smile-mid hover:bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all hover:scale-110 flex items-center justify-center border border-white/20">
        <MessageCircle size={28} />
      </button>
    </div>
  );
};

export default ChatWidget;