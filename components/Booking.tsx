import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Booking: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    treatment: 'General Consultation',
    date: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            treatment: formData.treatment,
            preferred_date: formData.date,
            message: formData.message || null
          }
        ]);

      if (error) throw error;

      setSubmitMessage({
        type: 'success',
        text: 'Your booking request has been successfully submitted! We will contact you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        treatment: 'General Consultation',
        date: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Booking error:', error);
      setSubmitMessage({
        type: 'error',
        text: 'An error occurred while submitting your booking. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-surface relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-smile-light rounded-full blur-[100px] pointer-events-none opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="bg-gradient-to-br from-smile-mid to-smile-dark rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl relative overflow-hidden">

          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>

          <div className="text-center mb-8 md:mb-12 relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">Book Your Visit</h2>
            <p className="text-blue-100 text-sm md:text-base">Fill out the form below and we will contact you to confirm your appointment.</p>
          </div>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-xl text-center font-medium ${submitMessage.type === 'success' ? 'bg-green-500/20 text-white' : 'bg-red-500/20 text-white'
              }`}>
              {submitMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-100 ml-2">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 md:py-4 text-white placeholder-blue-200/50 focus:outline-none focus:bg-white/20 focus:border-white transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-100 ml-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="010-1234-5678"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 md:py-4 text-white placeholder-blue-200/50 focus:outline-none focus:bg-white/20 focus:border-white transition-all"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-100 ml-2">Treatment Type</label>
                <select
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 md:py-4 text-white focus:outline-none focus:bg-white/20 focus:border-white transition-all appearance-none cursor-pointer"
                >
                  <option className="text-slate-900">General Consultation</option>
                  <option className="text-slate-900">Implant Consultation</option>
                  <option className="text-slate-900">Orthodontics</option>
                  <option className="text-slate-900">Teeth Whitening</option>
                  <option className="text-slate-900">Pain / Emergency</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-100 ml-2">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 md:py-4 text-white focus:outline-none focus:bg-white/20 focus:border-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-blue-100 ml-2">Message (Optional)</label>
              <textarea
                rows={4}
                placeholder="Tell us about your symptoms or questions..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-3 md:py-4 text-white placeholder-blue-200/50 focus:outline-none focus:bg-white/20 focus:border-white transition-all"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-smile-mid hover:bg-blue-50 text-lg font-bold py-4 md:py-5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 md:mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'} <Send size={20} />
            </button>
            <p className="text-center text-xs text-blue-200 mt-4">By submitting this form, you agree to our privacy policy.</p>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Booking;