import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, Calendar, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Hide public navbar on admin screens
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms & Rates', path: '/rooms' },
    { name: 'Dining & Bar', path: '/dining' },
    { name: 'Sambhrama Party Hall', path: '/party-hall' },
    { name: 'Local Sightseeing', path: '/attractions' },
    { name: 'My Bookings & Orders', path: '/my-bookings-orders' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFCE1]/95 backdrop-blur-md border-b border-[#0B1849]/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Hotel Brand - Cormorant Garamond */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-[#0B1849] text-[#FFFCE1] font-serif flex items-center justify-center text-sm font-semibold tracking-tighter group-hover:bg-[#FFDE74] group-hover:text-[#0B1849] transition-all duration-300">
              HR
            </div>
            <div>
              <span className="text-xl font-serif font-medium tracking-tight text-[#0B1849] group-hover:opacity-80 transition-opacity block leading-none">
                HOTEL RAAMA
              </span>
              <span className="block text-[9px] font-sans text-[#596277] tracking-[0.2em] font-semibold uppercase mt-0.5">
                Hassan · Luxury Boutique
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Manrope */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-[11px] font-sans font-semibold uppercase tracking-[0.14em] transition-all duration-300 relative py-1 ${
                    isActive
                      ? 'text-[#0B1849] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1.5px] after:bg-[#0B1849]'
                      : 'text-[#596277] hover:text-[#0B1849]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              to="/rooms"
              className="px-5 py-2.5 rounded-sm bg-[#0B1849] text-[#FFFCE1] font-sans font-semibold text-xs uppercase tracking-wider hover:bg-[#0B1849]/90 transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <Calendar size={13} /> Book Room
            </Link>

            <Link
              to="/admin/login"
              className="p-2 text-[#596277] hover:text-[#0B1849] transition-colors"
              title="Admin Staff Portal"
            >
              <ShieldCheck size={17} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#0B1849]"
            >
              {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFCE1] border-b border-[#0B1849]/10 px-6 pt-3 pb-8 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs font-sans font-semibold uppercase tracking-[0.14em] text-[#0B1849] hover:text-[#596277]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-[#0B1849]/10">
            <Link
              to="/rooms"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-sm bg-[#0B1849] text-[#FFFCE1] font-sans font-semibold text-xs uppercase tracking-wider"
            >
              Book Room Now
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs text-[#596277] hover:text-[#0B1849]"
            >
              Admin Staff Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
