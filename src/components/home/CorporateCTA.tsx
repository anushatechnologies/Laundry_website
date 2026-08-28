import React from 'react';
import Link from 'next/link';
import { Building2, ArrowRight, CheckCircle } from 'lucide-react';

export const CorporateCTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-[#FCF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#241A21] text-white rounded-[20px] p-8 sm:p-12 border border-slate-800 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>Enterprise & B2B Solutions</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-poppins text-white">
                Bulk Laundry & Contract Linen Care for Businesses
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Tailored commercial laundry solutions for Hotels, PGs, Hospitals, Salons, Fitness Centers, and Corporate Offices with dedicated RFID tagging, monthly GST invoices, and SLA guarantees.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Custom Tiered Rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>RFID Linen Barcode</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority Daily Van Run</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                href="/corporate"
                className="w-full py-3.5 px-6 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-[10px] text-center shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Request B2B Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full py-3 px-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs rounded-[10px] text-center transition-all"
              >
                Schedule Facility Audit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CorporateCTA;
