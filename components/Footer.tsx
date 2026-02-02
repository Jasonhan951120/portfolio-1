import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-12 md:pt-20 pb-10 border-t border-slate-800">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          
          {/* Brand & Social */}
          <div>
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-tr-lg rounded-bl-lg flex items-center justify-center font-bold text-lg bg-smile-mid text-white">
                    S
                </div>
                <span className="font-heading font-bold text-2xl text-white tracking-tight">
                    Smile<span className="text-smile-mid">Craft</span>
                </span>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed text-sm">
                Redefining the dental experience with precision technology and a human touch.
            </p>
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-smile-mid hover:text-white transition-colors border border-white/5">
                    <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-smile-mid hover:text-white transition-colors border border-white/5">
                    <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-smile-mid hover:text-white transition-colors border border-white/5">
                    <Twitter size={18} />
                </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                    <MapPin className="text-smile-mid shrink-0 mt-1" size={16} />
                    <span>123 Dental Ave, Suite 400<br/>San Francisco, CA 94103</span>
                </li>
                <li className="flex items-center gap-3">
                    <Phone className="text-smile-mid shrink-0" size={16} />
                    <a href="tel:5551234567" className="hover:text-white transition-colors">(555) 123-4567</a>
                </li>
                <li className="flex items-center gap-3">
                    <Mail className="text-smile-mid shrink-0" size={16} />
                    <a href="mailto:hello@smilecraft.com" className="hover:text-white transition-colors">hello@smilecraft.com</a>
                </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-6">Hours</h4>
            <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Monday - Friday</span>
                    <span className="text-white">8:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Saturday</span>
                    <span className="text-white">9:00 AM - 3:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                    <span>Sunday</span>
                    <span className="text-smile-mid">Closed</span>
                </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <div className="w-full h-40 bg-slate-800 rounded-2xl overflow-hidden relative border border-white/10 group">
                {/* Simulated Map */}
                <div className="absolute inset-0 bg-slate-800"></div>
                <img 
                    src="https://picsum.photos/id/10/400/300" 
                    alt="Map Location" 
                    className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white hover:text-slate-900 transition-colors">
                        Get Directions
                    </button>
                </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} SmileCraft Dentistry. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;