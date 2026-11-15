'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 800);
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
          Reset Your Access Password
        </h2>
        <p className="text-xs text-charcoal-muted">
          We will transmit verified reset credentials to your authorized email address.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-sage/60 space-y-6">
          {sent ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald/20 text-emerald flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-charcoal">Recovery Dispatch Sent</h4>
              <p className="text-xs text-charcoal-muted">
                If an authorized account is registered for <strong className="text-charcoal">{email}</strong>, you will receive single-use authentication instructions.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="outline" size="sm" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Corporate / Personal Email"
                type="email"
                icon={Mail}
                placeholder="founder@venture.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full shadow-md"
                isLoading={loading}
              >
                Send Password Reset Instructions
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-forest hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

