import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { adminLogin } from '../../services/api';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both admin email and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await adminLogin({ email: email.trim(), password });
      if (res.success) {
        toast.success('Authenticated successfully!');
        navigate('/admin');
      } else {
        toast.error(res.message || 'Authentication failed. Check your credentials.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFCE1] text-[#0B1849] flex items-center justify-center p-6">
      <div className="bg-[#0B1849] text-[#FFFCE1] border border-[#FFFCE1]/20 rounded-sm p-8 sm:p-10 max-w-md w-full space-y-8 shadow-2xl">
        
        {/* Header Badge */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#FFFCE1]/10 border border-[#FFFCE1]/20 text-[#FFDE74] flex items-center justify-center mx-auto shadow-md">
            <ShieldCheck size={28} />
          </div>
          <span className="text-[10px] font-sans font-bold text-[#FFDE74] uppercase tracking-[0.2em] block">
            Hotel Raama Control Panel
          </span>
          <h1 className="text-3xl font-serif text-[#FFFCE1]">Admin Login</h1>
          <p className="text-xs font-sans text-[#FFFCE1]/70">
            Enter authorized management credentials to access live operations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 font-sans text-xs">
          <div>
            <label className="block font-bold text-[#FFFCE1]/80 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-[#FFFCE1]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFFCE1]/5 border border-[#FFFCE1]/20 rounded-sm pl-10 pr-4 py-2.5 text-xs text-[#FFFCE1] focus:border-[#FFDE74] focus:outline-none transition-colors"
                required
                placeholder="Enter registered admin email..."
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#FFFCE1]/80 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-[#FFFCE1]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFFCE1]/5 border border-[#FFFCE1]/20 rounded-sm pl-10 pr-4 py-2.5 text-xs text-[#FFFCE1] focus:border-[#FFDE74] focus:outline-none transition-colors"
                required
                placeholder="Enter password..."
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-sm bg-[#FFFCE1] text-[#0B1849] hover:bg-[#FFDE74] font-sans font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Authenticate & Sign In'} <ArrowRight size={15} />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-[#FFFCE1]/10 text-[10px] font-sans text-[#FFFCE1]/50">
          Protected JWT HTTP-Only Cookie Session
        </div>
      </div>
    </div>
  );
};
