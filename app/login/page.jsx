'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const role = data.user.role;
      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'investor') {
        router.push('/dashboard/investor');
      } else {
        router.push('/dashboard/founder');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (role) => {
    if (role === 'founder') {
      setEmail('sarah.chen@zenithai.com');
      setPassword('founder123');
    } else if (role === 'investor') {
      setEmail('david@emeraldventures.vc');
      setPassword('investor123');
    } else if (role === 'admin') {
      setEmail('admin@pitchconnect.com');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-forest flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-emerald" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-forest">
            Pitch<span className="text-emerald">Connect</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold text-charcoal tracking-tight">
          Sign In to Your Portfolio
        </h2>
        <p className="text-xs text-charcoal-muted">
          Access verified pitch decks, calendar slots, and deal flow.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-sage/60 space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="founder@venture.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-emerald-hover hover:underline font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-md"
              isLoading={loading}
            >
              Sign In to Terminal
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Logins for Instant Testing */}
          <div className="pt-4 border-t border-sage/40 space-y-3">
            <div className="text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-muted bg-ivory px-3 py-1 rounded-full border border-sage/60">
                1-Click Quick Demo Sign-In
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDemoAccount('founder')}
                className="p-2 rounded-xl text-center border border-sage hover:border-emerald hover:bg-sage-light text-xs font-semibold text-charcoal transition-all"
              >
                <span className="block text-[10px] text-emerald-hover font-bold">Founder</span>
                Sarah Chen
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('investor')}
                className="p-2 rounded-xl text-center border border-sage hover:border-emerald hover:bg-sage-light text-xs font-semibold text-charcoal transition-all"
              >
                <span className="block text-[10px] text-gold-dark font-bold">Investor</span>
                David S.
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('admin')}
                className="p-2 rounded-xl text-center border border-sage hover:border-emerald hover:bg-sage-light text-xs font-semibold text-charcoal transition-all"
              >
                <span className="block text-[10px] text-forest font-bold">Admin</span>
                Alexandra
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-charcoal-muted pt-2 border-t border-sage/30">
            Don't have an account yet?{' '}
            <Link href="/register" className="text-forest font-bold hover:underline">
              Register as Founder or Investor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

