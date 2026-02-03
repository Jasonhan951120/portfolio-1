import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-smile-dark text-slate-300 pt-16 md:pt-24 pb-12 border-t border-slate-800/50">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">

                    {/* Brand & Social */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl bg-smile-mid text-white shadow-lg shadow-smile-mid/20">
                                S
                            </div>
                            <span className="font-heading font-bold text-2xl text-white tracking-tight">
                                Smile<span className="text-smile-mid">Craft</span>
                            </span>
                        </div>
                        <p className="text-slate-400 mb-8 leading-relaxed text-sm pr-4">
                            Redefining the dental experience with precision technology and a human touch. Your smile is our masterpiece.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-smile-mid hover:text-white transition-all transform hover:-translate-y-1 border border-white/5">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-smile-mid hover:text-white transition-all transform hover:-translate-y-1 border border-white/5">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-smile-mid hover:text-white transition-all transform hover:-translate-y-1 border border-white/5">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-smile-mid"></span> Contact
                        </h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex items-start gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-smile-mid group-hover:text-white transition-colors">
                                    <MapPin size={14} />
                                </div>
                                <span>123 Dental Ave, Suite 400<br />San Francisco, CA 94103</span>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-smile-mid group-hover:text-white transition-colors">
                                    <Phone size={14} />
                                </div>
                                <a href="tel:5551234567" className="hover:text-smile-mid transition-colors">(555) 123-4567</a>
                            </li>
                            <li className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-smile-mid group-hover:text-white transition-colors">
                                    <Mail size={14} />
                                </div>
                                <a href="mailto:hello@smilecraft.com" className="hover:text-smile-mid transition-colors">hello@smilecraft.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-8 flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-smile-mid"></span> Hours
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">Mon - Fri</span>
                                <span className="text-white font-medium">8:00 AM - 6:00 PM</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">Saturday</span>
                                <span className="text-white font-medium">9:00 AM - 3:00 PM</span>
                            </li>
                            <li className="flex justify-between border-b border-white/5 pb-3">
                                <span className="text-slate-400">Sunday</span>
                                <span className="text-smile-mid font-bold">Closed</span>
                            </li>
                        </ul>
                    </div>

                    {/* Map */}
                    <div>
                        <div className="w-full h-48 bg-slate-800 rounded-3xl overflow-hidden relative border border-white/10 group shadow-lg">
                            {/* Simulated Map */}
                            <div className="absolute inset-0 bg-slate-900"></div>
                            <img
                                src="https://picsum.photos/id/122/400/300"
                                alt="Map Location"
                                className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-all duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-white hover:text-slate-900 transition-all shadow-lg transform group-hover:-translate-y-1">
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} SmileCraft Dentistry. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
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