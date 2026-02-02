import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Doctors', href: '#doctors' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Location', href: '#location' },
  ];

  return (
    <>
      <header 
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <a href="#home" className={`font-heading font-bold text-2xl tracking-tight flex items-center gap-2 transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                <div className={`w-8 h-8 rounded-tr-xl rounded-bl-xl flex items-center justify-center font-bold text-lg ${isScrolled ? 'bg-smile-mid text-white' : 'bg-white text-smile-mid'}`}>S</div>
                <span>Smile<span className={isScrolled ? 'text-smile-mid' : 'text-white/80'}>Craft</span></span>
              </a>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className={`font-medium text-sm transition-colors uppercase tracking-wide hover:text-smile-mid ${isScrolled ? 'text-slate-600' : 'text-slate-200 hover:text-white'}`}
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-6">
                <a href="tel:02-1234-5678" className={`flex items-center gap-2 font-bold transition-colors hover:text-smile-mid ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                    <Phone size={18} className="fill-current" />
                    02-1234-5678
                </a>
                <a href="#booking" className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-glow transform hover:scale-105 ${isScrolled ? 'bg-smile-mid text-white hover:bg-smile-dark' : 'bg-white text-smile-mid hover:bg-slate-100'}`}>
                    Book Now
                </a>
            </div>

            {/* Mobile Toggle */}
            <button 
              className={`lg:hidden transition-colors ${isScrolled ? 'text-slate-900' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-6 animate-fade-in flex flex-col items-center">
           <div className="flex flex-col space-y-8 text-center w-full max-w-sm">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-2xl font-heading font-bold text-slate-900 hover:text-smile-mid transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <hr className="border-slate-200" />
            <a href="tel:02-1234-5678" className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <Phone size={20} /> 02-1234-5678
            </a>
            <a 
              href="#booking"
              className="w-full bg-smile-mid text-white py-4 rounded-xl font-bold text-lg shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;