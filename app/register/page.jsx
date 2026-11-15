'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Mail, Phone, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'startup',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError('');

    // Client side check
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors) {
          const flat = {};
          Object.keys(data.errors).forEach((k) => {
            flat[k] = data.errors[k][0];
          });
          setErrors(flat);
        } else {
          setServerError(data.message || 'Registration failed');
        }
        return;
      }

      // Redirect by role
      const role = data.user.role;
      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'investor') {
        router.push('/dashboard/investor');
      } else {
        router.push('/dashboard/founder');
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
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
          Join the Emerald Luxe Network
        </h2>
        <p className="text-xs text-charcoal-muted">
          Connect directly with accredited investors and institutional founders.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-sage/60 space-y-6">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              name="fullName"
              placeholder="e.g. Sarah Chen"
              icon={User}
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+1 415 555 0100"
              icon={Phone}
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
            />

            <Select
              label="Account Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'startup', label: 'Startup Founder (Fundraising)' },
                { value: 'investor', label: 'Accredited Investor / VC' },
                { value: 'admin', label: 'Platform Administrator' },
              ]}
              error={errors.role}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full shadow-md mt-2"
              isLoading={loading}
            >
              Create PitchConnect Account
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="text-center text-xs text-charcoal-muted pt-2 border-t border-sage/40">
            Already registered on PitchConnect?{' '}
            <Link href="/login" className="text-forest font-bold hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

