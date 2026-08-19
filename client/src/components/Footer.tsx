import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, MessageSquare, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B1849] text-[#FFFCE1] border-t border-[#FFFCE1]/10 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Col 1: Brand & Editorial Statement */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFFCE1] text-[#0B1849] flex items-center justify-center font-serif text-sm font-semibold">
              HR
            </div>
            <span className="text-xl font-serif font-medium tracking-tight text-[#FFFCE1]">HOTEL RAAMA</span>
          </div>
          <p className="text-xs font-sans text-[#FFFCE1]/70 leading-relaxed max-w-sm">
            A sanctuary of quiet luxury, refined South Indian dining at Swaad, executive spirits at Liquid Lounge, and grand celebrations at Sambhrama Banquet in Hassan, Karnataka.
          </p>
          <a
            href="https://wa.me/918172257001"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-sans font-semibold uppercase tracking-wider px-4 py-2 rounded-sm bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-300"
          >
            <MessageSquare size={13} /> WhatsApp Reception
          </a>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FFDE74] font-bold block mb-4">
            Navigation
          </span>
          <ul className="space-y-2.5 text-xs font-sans text-[#FFFCE1]/80">
            <li><Link to="/" className="hover:text-[#FFDE74] transition-colors">Home Portal</Link></li>
            <li><Link to="/rooms" className="hover:text-[#FFDE74] transition-colors">Room Tariffs & Booking</Link></li>
            <li><Link to="/dining" className="hover:text-[#FFDE74] transition-colors">Swaad Pure Veg Restaurant</Link></li>
            <li><Link to="/dining" className="hover:text-[#FFDE74] transition-colors">Non-Veg Specialities</Link></li>
            <li><Link to="/dining" className="hover:text-[#FFDE74] transition-colors">Liquid Lounge Bar (LLB)</Link></li>
            <li><Link to="/party-hall" className="hover:text-[#FFDE74] transition-colors">Sambhrama Party Hall</Link></li>
            <li><Link to="/attractions" className="hover:text-[#FFDE74] transition-colors">Hassan Sights & Belur</Link></li>
          </ul>
        </div>

        {/* Col 3: Location & Embedded Mini Map */}
        <div className="bg-[#FFFCE1]/5 p-5 rounded-sm border border-[#FFFCE1]/10 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FFDE74] font-bold flex items-center gap-1.5">
              <MapPin size={14} /> Location & Directions
            </span>

            {/* Embedded Mini Map */}
            <div className="relative w-full h-32 rounded-sm overflow-hidden border border-[#FFFCE1]/20 shadow-inner group">
              <iframe
                title="Hotel Raama Mini Map"
                src="https://maps.google.com/maps?q=Hotel%20Raama%20BM%20Road%20Hassan%20Karnataka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.05) saturate(0.95)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs font-sans text-[#FFFCE1]/90 leading-snug font-medium pt-1">
              B.M. Road, Thanneeruhalla, Opp. S.D.M. Ayurvedic Hospital, Hassan, Karnataka - 573201
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#FFFCE1]/10 text-[11px] font-sans">
            <div className="flex justify-between items-center text-[#FFFCE1]/70">
              <span>📍 Opp. SDM Ayurvedic Hospital</span>
            </div>
            <div className="flex justify-between items-center text-[#FFFCE1]/80 font-medium">
              <span>📞 <a href="tel:08172257001" className="text-[#FFDE74] font-bold hover:underline">081722 57001</a></span>
              <span>✉️ <a href="mailto:reservations@hotelraama.com" className="text-[#FFDE74] hover:underline">Email Us</a></span>
            </div>

            <a
              href="https://maps.google.com/?q=Hotel+Raama+Hassan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-sm bg-[#FFFCE1] text-[#0B1849] font-sans font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#FFDE74] transition-all duration-300 mt-2"
            >
              Get Directions on Google Maps <ArrowUpRight size={13} />
            </a>
          </div>
        </div>

        {/* Col 4: Stay Details & Timings */}
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#FFDE74] font-bold block mb-4">
            Guest Information
          </span>
          <ul className="space-y-3 text-xs font-sans text-[#FFFCE1]/80">
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-[#FFDE74]" /> Check-In: 12:00 PM
            </li>
            <li className="flex items-center gap-2">
              <Clock size={14} className="text-[#FFDE74]" /> Check-Out: 11:00 AM
            </li>
            <li className="text-[11px] text-[#FFFCE1]/50 pt-3 border-t border-[#FFFCE1]/10 leading-relaxed">
              Contactless room reservations and instant digital receipt verification.
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#FFFCE1]/10 flex flex-col md:flex-row items-center justify-between text-[11px] font-sans text-[#FFFCE1]/60 gap-4">
        <div>
          © {new Date().getFullYear()} Hotel Raama, Hassan. All rights reserved.
        </div>
        <div className="flex gap-6 uppercase tracking-wider text-[10px]">
          <Link to="/location" className="hover:text-[#FFFCE1]">Privacy Policy</Link>
          <Link to="/location" className="hover:text-[#FFFCE1]">Terms of Booking</Link>
          <Link to="/admin/login" className="hover:text-[#FFDE74]">Staff Portal</Link>
        </div>
      </div>
    </footer>
  );
};
