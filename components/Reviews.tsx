import React from 'react';
import { Star } from 'lucide-react';

const Reviews: React.FC = () => {
  const reviews = [
    {
      name: "Ashley Landazo",
      role: "CEO & Co-Founder, EQ3",
      text: "We don't just make your life better, we improve your overall experience. From a mobile app that streamlines onboarding to a modern experience that lets employees sign up for benefits online.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "Director, TechFlow",
      text: "The precision and care I received were unmatched. The team explained every step of the implant process, making me feel completely at ease throughout the entire journey.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Jessica Miller",
      role: "Marketing Head, Adverus",
      text: "I was hesitant about veneers for years, but Dr. Mitchell changed everything. The results are so natural that even my close friends can't tell—they just say I look great!",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mb-16">
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Patient Stories</h2>
            <p className="text-slate-500">See what our community has to say.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
                <div key={i} className="bg-surface rounded-[2rem] p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                    {/* Quote Text */}
                    <p className="text-slate-600 text-lg leading-relaxed mb-10 flex-grow font-light italic">
                        "{review.text}"
                    </p>

                    {/* Profile Section */}
                    <div className="flex items-center gap-4 mt-auto">
                        <img 
                            src={review.image} 
                            alt={review.name} 
                            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" 
                        />
                        <div>
                            <h4 className="font-bold text-slate-900 uppercase text-sm tracking-wide">{review.name}</h4>
                            <p className="text-slate-400 text-xs mb-1">{review.role}</p>
                            <div className="flex text-smile-gold">
                                {[1,2,3,4,5].map(star => <Star key={star} size={14} fill="currentColor" />)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;