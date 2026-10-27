import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Car, Lock, Mail, User, AlertCircle, ArrowRight, Gauge } from 'lucide-react';

export const Register = () => {
  const { register, login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Security policy requires at least 6 characters for passphrases.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      success('Client account created successfully! Authorizing session...');

      try {
        await login(email, password);
        navigate('/');
      } catch (loginErr) {
        navigate('/login');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setErrorMsg(msg);
      toastError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 w-full bg-[#0a0c10]">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-brand mb-4">
            <Car className="w-6 h-6 stroke-[2.3]" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Register Driver Account
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 flex items-center justify-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-brand-500" />
            Complete digital onboarding in under 2 minutes.
          </p>
        </div>

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
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alexander Vance"
                  className="w-full pl-10 pr-4 py-3 bg-[#161920] border border-white/10 rounded-2xl text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition"
                />
              </div>
            </div>

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
                Create Passphrase
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
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <Link to="/login" className="font-bold text-brand-400 hover:text-brand-300">
                Sign In to Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
