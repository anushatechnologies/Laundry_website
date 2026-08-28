import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Pooja Hegde',
      role: 'Product Designer, Bengaluru',
      rating: 5,
      comment:
        'The Per-KG wash and iron is unbelievable. They weighed my 4.5 KG load at the facility, sent me the exact scale photo, and everything was returned hanger-pressed the next evening without a single missing item!',
      service: 'Wash & Steam Iron (Per KG)',
    },
    {
      name: 'Karthik Raman',
      role: 'Senior Consultant, Koramangala',
      rating: 5,
      comment:
        'I trusted LaundryFresh with my wedding sherwani and my wife’s bridal lehenga. The anti-tarnish dry cleaning and tissue-wrap packaging were absolute luxury. 10/10 quality.',
      service: 'Bridal & Traditional Wear Dry Clean',
    },
    {
      name: 'Dr. Shalini Mehta',
      role: 'Pediatrician, Indiranagar',
      rating: 5,
      comment:
        'The baby & kids sensitive wash with organic detergents gives me total peace of mind. The real-time tracking timeline and OTP delivery ensure complete trust and security.',
      service: 'Baby & Kids Hypoallergenic Wash',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FCF9F7] border-t border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider bg-[#F0FDF4] px-3 py-1 rounded-full border border-emerald-200">
            Real Customer Reviews
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#241A21] tracking-tight font-poppins mt-2">
            Loved by 50,000+ Busy Families
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6F626A]">
            See why customers rate LaundryFresh 4.9/5 stars for quality and doorstep convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[16px] p-6 border border-[#E8DDE1] shadow-soft hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                    Verified Order
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#6F626A] leading-relaxed italic mb-4">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#241A21]">{r.name}</h4>
                  <p className="text-[11px] text-[#6F626A]">{r.role}</p>
                </div>
                <span className="text-[10px] text-[#6F626A] font-semibold text-right max-w-[120px] truncate">
                  {r.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
