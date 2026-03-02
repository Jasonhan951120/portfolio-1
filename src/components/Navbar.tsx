import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowUpRight } from "lucide-react";

interface NavItem {
  label: string;
  href?: string;
  dropdownItems?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    dropdownItems: [
      { label: "Overview", href: "/services" },
      { label: "Treatments", href: "/what-we-do" },
      { label: "Specialized Care", href: "/care-solutions" },
    ],
  },
  {
    label: "Results",
    dropdownItems: [
      { label: "Before & After", href: "/results" },
      { label: "Patient Stories", href: "/testimonials" },
    ],
  },
  {
    label: "Meet the Team",
    href: "/specialists",
    dropdownItems: [
      { label: "Our Specialists", href: "/specialists" },
      { label: "Clinical Staff", href: "/experts" },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];


const Navbar = ({ clinic }: { clinic: any }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const brandColor = clinic?.brand_color || "#E9F11E";
  const clinicName = clinic?.name || "LONDON SMILE";
  const clinicLogo = clinic?.logo_url;


  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveDropdown(null);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-black/5">
      <div className="container mx-auto px-8 h-20 flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-display font-bold tracking-tighter text-black flex items-center gap-2 cursor-pointer group"
        >
          {clinicLogo ? (
            <img src={clinicLogo} alt={clinicName} className="h-8 w-auto" />
          ) : (
            <>
              {clinicName.split(' ')[0]}
              <span className="underline decoration-accent underline-offset-4">
                {clinicName.split(' ').slice(1).join(' ') || "SMILE"}
              </span>
            </>
          )}
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setActiveDropdown(item.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {item.href && !item.dropdownItems ? (
                <Link
                  to={item.href}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-all flex items-center gap-1.5 py-8 relative"
                >
                  {item.label}
                </Link>
              ) : (
                <button className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60 hover:text-black transition-all flex items-center gap-1.5 py-8 relative">
                  {item.label}
                  {item.dropdownItems && (
                    <ChevronDown className={`w-3 h-3 transition-transform duration-500 ${activeDropdown === item.label ? "rotate-180 text-accent" : "text-black/30"}`} />
                  )}
                  {activeDropdown === item.label && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-[24px] left-0 right-0 h-0.5 bg-accent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </button>
              )}


              <AnimatePresence>
                {activeDropdown === item.label && item.dropdownItems && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-full left-[-20px] w-72 bg-white border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden p-3"
                  >
                    <div className="grid gap-1">
                      {item.dropdownItems.map((subItem) => (
                        subItem.href.startsWith("#") ? (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            onClick={(e) => {
                              if (window.location.pathname === "/") {
                                scrollToSection(e, subItem.href);
                              }
                            }}
                            className="flex items-center justify-between px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-black/50 hover:text-black hover:bg-surface transition-all rounded-xl group/item"
                          >
                            <span className="relative">
                              {subItem.label}
                              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover/item:w-full" />
                            </span>
                            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:translate-x-0 transition-all duration-300 text-accent" />
                          </a>
                        ) : (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="flex items-center justify-between px-5 py-4 text-[11px] font-bold uppercase tracking-widest text-black/50 hover:text-black hover:bg-surface transition-all rounded-xl group/item"
                          >
                            <span className="relative">
                              {subItem.label}
                              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover/item:w-full" />
                            </span>
                            <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-1 translate-x-1 group-hover/item:opacity-100 group-hover/item:translate-y-0 group-hover/item:translate-x-0 transition-all duration-300 text-accent" />
                          </Link>
                        )
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (window.location.pathname === "/") {
                const element = document.getElementById("lead-form");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              } else {
                navigate("/", { state: { scrollTo: "lead-form" } });
              }
            }}
            className="px-6 py-2.5 bg-accent text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-105 transition-all shadow-[0_4px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
          >
            Book Appointment
          </button>

          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-transform">
            <ChevronDown className="w-5 h-5" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
