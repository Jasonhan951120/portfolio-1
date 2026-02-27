import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Reviews from "./components/Reviews";
import BeforeAfter from "./components/BeforeAfter";
import Services from "./components/Services";
import LeadForm from "./components/LeadForm";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import Gallery from "./components/Gallery";
import FreshApproach from "./components/FreshApproach";
import OtherServices from "./components/OtherServices";
import ServicesPage from "./pages/ServicesPage";
import ContactPage from "./pages/ContactPage";
import SpecialistsPage from "./pages/SpecialistsPage";
import ExpertsPage from "./pages/ExpertsPage";
import PortfolioPage from "./pages/PortfolioPage";
import WhatWeDoPage from "./pages/WhatWeDoPage";
import CareSolutionsPage from "./pages/CareSolutionsPage";
import ResultsPage from "./pages/ResultsPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import TreatmentDetailPage from "./pages/TreatmentDetailPage";
import ClientPTPage from "./pages/ClientPTPage";
import MobileStickyCTA from "./components/MobileStickyCTA";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ScrollToTop from "./components/ScrollToTop";


import { motion, useScroll, useSpring } from "motion/react";
import { ChevronDown, Phone } from "lucide-react";
import { useEffect } from "react";


function LandingPage() {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
      const element = document.getElementById((location.state as any).scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="relative">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      <MobileStickyCTA />
      <WhatsAppWidget />



      <main className="overflow-hidden">
        <Hero />
        <Gallery />
        <div id="services">
          <Services />
        </div>
        <Reviews />
        <FreshApproach />
        <div id="results">
          <BeforeAfter />
        </div>
        <OtherServices />
        <div id="lead-form" className="bg-[#FBFBFB]">
          <LeadForm />
        </div>
      </main>


      <footer className="bg-surface text-black py-32 border-t border-black/5">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-1">
              <div className="text-3xl font-display font-bold tracking-tighter mb-8 text-black">
                LONDON<span className="underline decoration-black/10 underline-offset-4">SMILE</span>
              </div>
              <p className="text-muted leading-relaxed font-medium mb-8">
                Redefining the dental experience through precision, artistry, and a commitment to excellence.
              </p>
              <div className="flex gap-4">
                {['Instagram', 'Facebook', 'Twitter'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all text-black">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current rounded-sm" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-black mb-10">Quick Links</h4>
              <ul className="space-y-6">
                {['About Us', 'Our Services', 'Patient Stories', 'Locations'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted hover:text-black transition-colors font-medium uppercase tracking-widest text-xs">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-black mb-10">Treatments</h4>
              <ul className="space-y-6">
                {['Invisalign', 'Teeth Whitening', 'Dental Crowns', 'Composite Bonding'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted hover:text-black transition-colors font-medium uppercase tracking-widest text-xs">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-black mb-10">Contact</h4>
              <ul className="space-y-6 text-muted font-medium text-sm">
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-black" />
                  <span>020 7123 4567</span>
                </li>
                <li>123 Harley Street,<br />London, W1G 6AB</li>
                <li>info@londonsmile.com</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-muted text-xs font-bold uppercase tracking-widest">
              © 2026 London Smile Excellence. All rights reserved.
            </p>
            <div className="flex gap-10 text-muted text-xs font-bold uppercase tracking-widest">
              <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/specialists" element={<SpecialistsPage />} />
        <Route path="/experts" element={<ExpertsPage />} />
        <Route path="/portfolio/:id" element={<PortfolioPage />} />
        <Route path="/what-we-do" element={<WhatWeDoPage />} />
        <Route path="/care-solutions" element={<CareSolutionsPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/treatment/:slug" element={<TreatmentDetailPage />} />
        <Route path="/pt/:id" element={<ClientPTPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

