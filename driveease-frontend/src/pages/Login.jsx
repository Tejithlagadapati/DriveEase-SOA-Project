import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Car, Lock, Mail, AlertCircle, ArrowRight, Shield, User, Crown, Gauge } from 'lucide-react';

export const Login = () => {
  const { login, loginAsDemo } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const loggedInUser = await login(email, password);
      success(`Welcome back, ${loggedInUser.name}`);
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid email credentials or password';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const loggedInUser = await loginAsDemo(role);
      success(`Authorized as ${role === 'ADMIN' ? 'Fleet Administrator' : 'Verified Client'}`);
      if (role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toastError('Authorization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 w-full bg-[#0a0c10]">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-brand mb-4">
            <Car className="w-6 h-6 stroke-[2.3]" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Sign In to DriveEase
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-brand-500" />
            Access your reservation itinerary, fleet dashboard, and keys.
          </p>
        </div>

        {/* Demo Fast Login Box */}
        <div className="bg-[#12151b] border border-white/[0.08] rounded-3xl p-5 text-xs space-y-3 shadow-2xl">
          <div className="flex items-center justify-between font-bold text-white">
            <span className="flex items-center gap-1.5 text-brand-400">
              <Crown className="w-4 h-4 text-brand-500" />
              1-Click Demo Profiles
            </span>
            <span className="text-[10px] text-slate-500 font-mono">TEST ACCESS</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Quickly authenticate without typing credentials:
          </p>
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="py-2.5 px-3 bg-brand-500/15 hover:bg-brand-500/25 text-brand-400 border border-brand-500/30 font-bold text-xs rounded-xl text-center shadow-sm flex items-center justify-center gap-1.5 transition uppercase tracking-wider"
            >
              <Shield className="w-3.5 h-3.5" />
              Fleet Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('CUSTOMER')}
              className="py-2.5 px-3 bg-white/[0.05] hover:bg-white/10 text-slate-200 border border-white/10 font-bold text-xs rounded-xl text-center flex items-center justify-center gap-1.5 transition"
            >
              <User className="w-3.5 h-3.5 text-brand-400" />
              Client Driver
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#12151b] rounded-3xl border border-white/[0.08] p-8 shadow-2xl">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@domain.com"
                  className="w-full pl-10 pr-4 py-3 bg-[#161920] border border-white/10 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-[#161920] border border-white/10 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-brand flex items-center justify-center gap-2 transition hover:-translate-y-0.5"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400">
              New client to the fleet?{' '}
              <Link to="/register" className="font-bold text-brand-400 hover:text-brand-300">
                Register Driver Profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
