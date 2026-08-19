import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  Users,
  FileText,
  LogOut,
  ShieldCheck,
  Building2,
  QrCode,
} from 'lucide-react';
import { adminLogout } from '../../services/api';
import { toast } from 'sonner';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Kitchen Orders', path: '/admin/orders', icon: UtensilsCrossed },
    { name: 'Room Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'QR Code Directory', path: '/admin/qr-codes', icon: QrCode },
    { name: 'Customer History', path: '/admin/customers', icon: Users },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] flex font-sans">
      {/* Left Sidebar - Midnight Navy */}
      <aside className="w-64 bg-[#0B1849] text-[#FFFCE1] border-r border-[#FFFCE1]/15 flex flex-col justify-between shrink-0 shadow-lg">
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-[#FFFCE1]/10">
            <div className="w-9 h-9 rounded-full bg-[#FFFCE1] text-[#0B1849] font-bold font-serif flex items-center justify-center text-sm shadow-sm">
              HR
            </div>
            <div>
              <span className="font-serif font-medium text-white block text-sm tracking-tight">HOTEL RAAMA</span>
              <span className="text-[9px] text-[#FFDE74] uppercase font-sans font-bold tracking-[0.2em] block">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-sans font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#FFFCE1] text-[#0B1849] font-bold shadow-md'
                      : 'text-[#FFFCE1]/70 hover:bg-[#FFFCE1]/10 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-[#FFFCE1]/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-[#FFFCE1]/10 hover:bg-red-900/40 text-[#FFFCE1]/80 hover:text-red-200 text-xs font-sans font-bold uppercase tracking-wider border border-[#FFFCE1]/15 transition-colors cursor-pointer"
          >
            <LogOut size={15} /> Sign Out Admin
          </button>
        </div>
      </aside>

      {/* Main View Area - Warm Ivory */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-20 bg-[#FFFCE1]/90 backdrop-blur-md border-b border-[#0B1849]/15 px-8 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h2 className="text-xl font-serif text-[#0B1849]">Management Dashboard</h2>
            <span className="text-xs font-sans text-[#596277]">Hotel Raama, Hassan • Live Operations</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-sans font-bold text-[#0B1849] hover:underline flex items-center gap-1.5 uppercase tracking-wider"
            >
              <Building2 size={15} /> Open Guest Site
            </Link>

            <div className="flex items-center gap-2 bg-[#0B1849] text-[#FFFCE1] px-3.5 py-1.5 rounded-sm text-xs font-sans font-bold tracking-wide shadow-sm">
              <ShieldCheck size={14} className="text-[#FFDE74]" /> Active Admin Session
            </div>
          </div>
        </header>

        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
