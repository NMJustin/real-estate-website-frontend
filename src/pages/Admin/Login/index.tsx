import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Nihohange</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Real Estate<br />
            <span className="text-emerald-400">Admin Portal</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Manage properties, agents, inquiries, and everything your real estate business needs — all in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Properties', desc: 'Listings managed' },
            { label: 'Agents', desc: 'Team members' },
            { label: 'Inquiries', desc: 'Client requests' },
            { label: 'Viewings', desc: 'Scheduled tours' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <p className="text-emerald-400 font-semibold">{item.label}</p>
              <p className="text-slate-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <span className="text-white font-bold text-xl">Nihohange Admin</span>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome back</h2>
            <p className="text-slate-400 mt-2">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nihohange.com"
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full pl-11 pr-12 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in to Admin Portal'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
