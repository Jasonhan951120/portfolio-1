import React from 'react';
import { MapPin, Clock, Car, Bus } from 'lucide-react';

const Location: React.FC = () => {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Map Area */}
            <div className="lg:w-1/2 h-[400px] lg:h-auto bg-slate-100 rounded-[2rem] overflow-hidden relative border border-slate-200 shadow-inner group">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.924849887019!2d127.02761031531103!3d37.49794297981068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca15a3177695b%3A0x6335193297594950!2sGangnam%20Station!5e0!3m2!1sen!2skr!4v1626244726294!5m2!1sen!2skr" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy"
                    className="opacity-90 group-hover:opacity-100 transition-opacity"
                ></iframe>
                <div className="absolute bottom-6 left-6 bg-white text-slate-900 px-4 py-2 rounded-lg font-bold shadow-lg pointer-events-none border border-slate-100">
                    SmileCraft Dental
                </div>
            </div>

            {/* Info Area */}
            <div className="lg:w-1/2 space-y-8">
                <div>
                    <span className="text-smile-mid font-bold tracking-wider uppercase text-xs mb-2 block">Visit Us</span>
                    <h2 className="font-heading text-4xl font-bold text-slate-900 mb-6">Location & Hours</h2>
                    <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-smile-mid">
                             <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-slate-900 text-xl font-bold">123 Teheran-ro, Gangnam-gu</p>
                            <p className="text-slate-500">Seoul, South Korea (Building A, 4th Floor)</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-surface border border-slate-100 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Car className="text-smile-mid" />
                            <h4 className="text-slate-900 font-bold">Parking</h4>
                        </div>
                        <p className="text-sm text-slate-500">Free valet parking available at the B1 entrance.</p>
                    </div>
                    <div className="bg-surface border border-slate-100 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <Bus className="text-smile-mid" />
                            <h4 className="text-slate-900 font-bold">Public Transit</h4>
                        </div>
                        <p className="text-sm text-slate-500">Gangnam Station Exit 1 (Subway Line 2), 2 min walk.</p>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="text-smile-mid" />
                        <h4 className="text-slate-900 font-bold">Clinic Hours</h4>
                    </div>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Mon - Fri</span>
                            <span className="text-slate-900 font-bold">10:00 AM - 7:00 PM</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Saturday</span>
                            <span className="text-slate-900 font-bold">10:00 AM - 2:00 PM</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-100 pb-2">
                            <span>Lunch Break</span>
                            <span className="text-slate-900 font-bold">1:00 PM - 2:00 PM</span>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
};

export default Location;