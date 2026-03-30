import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from "react-router-dom";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Reviews from "./components/Reviews";
import BeforeAfter from "./components/BeforeAfter";
import Services from "./components/Services";
import LeadForm from "./components/LeadForm";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminOnboarding from "./components/AdminOnboarding";
import CampaignSetupPage from "./pages/CampaignSetupPage";
import ApiIntegrationPage from "./pages/ApiIntegrationPage";
import PricingPage from "./pages/PricingPage";
import { SubscriptionGuard } from "./components/SubscriptionGuard";
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
import PTDiscoveryMode from "./pages/PTDiscoveryMode";
import VisitTrackingPage from "./pages/VisitTrackingPage";
import MobileStickyCTA from "./components/MobileStickyCTA";
import WhatsAppWidget from "./components/WhatsAppWidget";
import ScrollToTop from "./components/ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { motion, useScroll, useSpring } from "motion/react";
import { ChevronDown, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import VerifyUI from "./components/VerifyUI";
import SecurityComplianceCenter from "./pages/SecurityComplianceCenter";
import TermsPage from "./pages/TermsPage";
import DPAPage from "./pages/DPAPage";
import SecurityPolicyPage from "./pages/SecurityPolicyPage";
import { AIChatWidget } from "./components/dashboard/AIChatWidget";


function LandingPage({ clinic }: { clinic: any }) {
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
        className="fixed top-0 left-0 right-0 h-1 bg-accent z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar clinic={clinic} />
      <MobileStickyCTA clinic={clinic} />
      <WhatsAppWidget clinic={clinic} />

      <main className="overflow-hidden">
        <Hero clinic={clinic} />
        <Gallery clinic={clinic} />
        <div id="services">
          <Services clinic={clinic} />
        </div>
        <Reviews clinic={clinic} />
        <FreshApproach clinic={clinic} />
        <div id="results">
          <BeforeAfter clinic={clinic} />
        </div>
        <OtherServices clinic={clinic} />
        <div id="lead-form" className="bg-[#FBFBFB]">
          <LeadForm clinic={clinic} />
        </div>
      </main>

      <footer className="bg-surface text-black py-32 border-t border-black/5">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="lg:col-span-1">
              <div className="text-3xl font-display font-bold tracking-tighter mb-8 text-black flex items-center gap-3">
                {clinic?.logo_url ? (
                  <img src={clinic.logo_url} alt={clinic.name} className="h-10 w-auto" />
                ) : (
                  <>
                    {clinic?.name?.split(' ')[0] || "LONDON"}
                    <span className="underline decoration-accent underline-offset-4">
                      {clinic?.name?.split(' ').slice(1).join(' ') || "SMILE"}
                    </span>
                  </>
                )}
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
                  <span>{clinic?.phone || "020 7123 4567"}</span>
                </li>
                <li>{clinic?.address || "123 Harley Street, London, W1G 6AB"}</li>
                <li>{clinic?.email || "info@londonsmile.com"}</li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-muted text-xs font-bold uppercase tracking-widest">
              © 2026 {clinic?.name || "London Smile Excellence"}. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-10 gap-y-4 text-muted text-[10px] font-bold uppercase tracking-widest">
              <Link to="/privacy" target="_blank" className="hover:text-black transition-colors">Privacy Policy</Link>
              <Link to="/terms" target="_blank" className="hover:text-black transition-colors">Terms of Service</Link>
              <Link to="/dpa" target="_blank" className="hover:text-black transition-colors">DPA</Link>
              <Link to="/security" target="_blank" className="hover:text-black transition-colors">Security Policy</Link>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}

import { AuthProvider } from "./contexts/AuthContext";
import { AnalyticsProvider } from "./context/AnalyticsContext";
import { CookieConsent } from "./components/common/CookieConsent";
import { ProtectedRoute } from "./components/GuardComponents";
import { useTrafficTracker } from "./hooks/useTrafficTracker";

export default function App() {
  const [clinic, setClinic] = useState<any>(null);

  // Initialize silent traffic tracking
  useTrafficTracker();

  useEffect(() => {
    async function loadClinic() {
      // For this master template, we fetch the first clinic or by slug if we had routing for it
      const { data } = await supabase.from('clinics').select('*').limit(1).single();
      if (data) {
        setClinic(data);
        // Inject brand color into CSS variables
        if (data.brand_color) {
          document.documentElement.style.setProperty('--accent-color', data.brand_color);
        }
      }
    }
    loadClinic();

    // Zero-Trace Protocol: Clear sensitive session data on abrupt tab closure
    const handleUnload = () => sessionStorage.clear();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <AuthProvider>
      <AnalyticsProvider>
        <Router>
          <ScrollToTop />
          <CookieConsent />
          <AIChatWidget />
          <Routes>
            <Route path="/" element={<ProtectedRoute><SubscriptionGuard><AdminDashboard /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/landing" element={<LandingPage clinic={clinic} />} />
            <Route path="/services" element={<ServicesPage clinic={clinic} />} />
            <Route path="/contact" element={<ContactPage clinic={clinic} />} />
            <Route path="/specialists" element={<SpecialistsPage clinic={clinic} />} />
            <Route path="/experts" element={<ExpertsPage clinic={clinic} />} />
            <Route path="/portfolio/:id" element={<PortfolioPage clinic={clinic} />} />
            <Route path="/what-we-do" element={<WhatWeDoPage clinic={clinic} />} />
            <Route path="/care-solutions" element={<CareSolutionsPage clinic={clinic} />} />
            <Route path="/results" element={<ResultsPage clinic={clinic} />} />
            <Route path="/testimonials" element={<TestimonialsPage clinic={clinic} />} />
            <Route path="/treatment/:slug" element={<TreatmentDetailPage clinic={clinic} />} />
            <Route path="/pt/:id" element={<PTDiscoveryMode />} />
            <Route path="/view/:id" element={<PTDiscoveryMode />} />
            <Route path="/visit/:clinicId" element={<VisitTrackingPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><SubscriptionGuard><AdminDashboard /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><SubscriptionGuard><AdminDashboard /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><SubscriptionGuard><AdminDashboard /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/admin/campaign-setup" element={<ProtectedRoute><SubscriptionGuard><CampaignSetupPage /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/admin/integrations" element={<ProtectedRoute><SubscriptionGuard><ApiIntegrationPage /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute><SubscriptionGuard><SecurityComplianceCenter /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/admin/onboarding" element={<ProtectedRoute><SubscriptionGuard><AdminOnboarding /></SubscriptionGuard></ProtectedRoute>} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/dpa" element={<DPAPage />} />
            <Route path="/security" element={<SecurityPolicyPage />} />
            <Route path="/verify-ui" element={<VerifyUI />} />

            {/* Safe Fallbacks to prevent Guard Loops */}
            <Route path="/index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AnalyticsProvider>
    </AuthProvider>
  );
}
