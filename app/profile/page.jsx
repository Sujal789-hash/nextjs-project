'use client';
import React, { useState, useEffect } from 'react';
import {
  User,
  Building,
  DollarSign,
  Globe,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '@/app/dashboard/layout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileType, setProfileType] = useState('startup'); // 'startup' or 'investor'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Startup form fields
  const [startupForm, setStartupForm] = useState({
    startupName: '',
    founderName: '',
    industry: 'AI & Machine Learning',
    description: '',
    website: '',
    location: '',
    foundedYear: 2024,
    teamSize: '5-10',
    startupStage: 'Seed',
    businessModel: 'B2B SaaS',
    targetAudience: '',
    fundingRequired: 1500000,
    currentValuation: 8500000,
  });

  // Investor form fields
  const [investorForm, setInvestorForm] = useState({
    fullName: '',
    organization: '',
    title: 'Managing Partner',
    biography: '',
    location: '',
    checkSizeMin: 250000,
    checkSizeMax: 2000000,
    preferredIndustries: ['AI & Machine Learning', 'FinTech'],
    preferredStages: ['Seed', 'Series A'],
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setProfileType(data.user.role === 'investor' ? 'investor' : 'startup');

          if (data.profile) {
            if (data.user.role === 'investor') {
              setInvestorForm({
                fullName: data.profile.fullName || data.user.fullName,
                organization: data.profile.organization || '',
                title: data.profile.title || 'Partner',
                biography: data.profile.biography || '',
                location: data.profile.location || '',
                checkSizeMin: data.profile.checkSizeMin || 250000,
                checkSizeMax: data.profile.checkSizeMax || 2000000,
                preferredIndustries: data.profile.preferredIndustries || ['AI & Machine Learning'],
                preferredStages: data.profile.preferredStages || ['Seed'],
              });
            } else {
              setStartupForm({
                startupName: data.profile.startupName || '',
                founderName: data.profile.founderName || data.user.fullName,
                industry: data.profile.industry || 'AI & Machine Learning',
                description: data.profile.description || '',
                website: data.profile.website || '',
                location: data.profile.location || '',
                foundedYear: data.profile.foundedYear || 2024,
                teamSize: data.profile.teamSize || '5-10',
                startupStage: data.profile.startupStage || 'Seed',
                businessModel: data.profile.businessModel || 'B2B SaaS',
                targetAudience: data.profile.targetAudience || '',
                fundingRequired: data.profile.fundingRequired || 1500000,
                currentValuation: data.profile.currentValuation || 8500000,
              });
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleStartupSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/startups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(startupForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update startup profile');
      }

      setMessage('Startup institutional profile saved successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInvestorSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/investors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investorForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update investor thesis');
      }

      setMessage('Investor thesis and ticket parameters saved successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const industriesList = [
    'AI & Machine Learning',
    'FinTech',
    'CleanTech & Energy',
    'SaaS & Enterprise',
    'HealthTech',
    'Cybersecurity',
    'EdTech',
    'BioTech',
    'E-Commerce & Retail',
    'AgriTech',
    'Other',
  ];

  const stagesList = ['Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight">
              {profileType === 'investor' ? 'Investor Thesis & Profile' : 'Startup Venture Profile'}
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              {profileType === 'investor'
                ? 'Configure your investment ticket range, stage preferences, and sector thesis.'
                : 'Manage verified business model metrics, valuation caps, and company information.'}
            </p>
          </div>

          <Badge variant="gold" size="lg">
            <ShieldCheck className="w-4 h-4 text-gold-dark" />
            Verified Accreditation
          </Badge>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald/15 border border-emerald/30 text-emerald-hover text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Content */}
        {profileType === 'investor' ? (
          /* Investor Form */
          <form onSubmit={handleInvestorSave} className="space-y-6">
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-sage/40">
                Partner Identity & Firm Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={investorForm.fullName}
                  onChange={(e) => setInvestorForm({ ...investorForm, fullName: e.target.value })}
                  required
                />

                <Input
                  label="Venture Capital Firm / Syndicate"
                  value={investorForm.organization}
                  onChange={(e) => setInvestorForm({ ...investorForm, organization: e.target.value })}
                  placeholder="e.g. Apex Horizon Ventures"
                  required
                />

                <Input
                  label="Partner Title"
                  value={investorForm.title}
                  onChange={(e) => setInvestorForm({ ...investorForm, title: e.target.value })}
                  required
                />

                <Input
                  label="Headquarters / Location"
                  value={investorForm.location}
                  onChange={(e) => setInvestorForm({ ...investorForm, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Investment Biography & Thesis Summary
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-sage-dark/60 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  value={investorForm.biography}
                  onChange={(e) => setInvestorForm({ ...investorForm, biography: e.target.value })}
                  required
                />
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-sage/40">
                Deployment Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Minimum Check Size ($ USD)"
                  type="number"
                  value={investorForm.checkSizeMin}
                  onChange={(e) => setInvestorForm({ ...investorForm, checkSizeMin: Number(e.target.value) })}
                  required
                />

                <Input
                  label="Maximum Check Size ($ USD)"
                  type="number"
                  value={investorForm.checkSizeMax}
                  onChange={(e) => setInvestorForm({ ...investorForm, checkSizeMax: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
                  Preferred Sectors
                </label>
                <div className="flex flex-wrap gap-2">
                  {industriesList.map((ind) => {
                    const isSelected = investorForm.preferredIndustries.includes(ind);
                    return (
                      <button
                        type="button"
                        key={ind}
                        onClick={() => {
                          const updated = isSelected
                            ? investorForm.preferredIndustries.filter((i) => i !== ind)
                            : [...investorForm.preferredIndustries, ind];
                          setInvestorForm({ ...investorForm, preferredIndustries: updated });
                        }}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-forest text-white border-forest shadow-xs'
                            : 'bg-white text-charcoal border-sage hover:border-emerald'
                        }`}
                      >
                        {ind}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={saving}>
                <Save className="w-4 h-4 mr-1" />
                Save Investor Thesis
              </Button>
            </div>
          </form>
        ) : (
          /* Startup Founder Form */
          <form onSubmit={handleStartupSave} className="space-y-6">
            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-sage/40">
                Company & Founder Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Startup Name"
                  value={startupForm.startupName}
                  onChange={(e) => setStartupForm({ ...startupForm, startupName: e.target.value })}
                  placeholder="e.g. Zenith AI"
                  required
                />

                <Input
                  label="Founder / CEO Name"
                  value={startupForm.founderName}
                  onChange={(e) => setStartupForm({ ...startupForm, founderName: e.target.value })}
                  required
                />

                <Select
                  label="Industry Vertical"
                  value={startupForm.industry}
                  onChange={(e) => setStartupForm({ ...startupForm, industry: e.target.value })}
                  options={industriesList.map((i) => ({ value: i, label: i }))}
                />

                <Select
                  label="Current Startup Stage"
                  value={startupForm.startupStage}
                  onChange={(e) => setStartupForm({ ...startupForm, startupStage: e.target.value })}
                  options={stagesList.map((s) => ({ value: s, label: s }))}
                />

                <Input
                  label="Website URL"
                  value={startupForm.website}
                  onChange={(e) => setStartupForm({ ...startupForm, website: e.target.value })}
                  placeholder="https://zenithai.com"
                />

                <Input
                  label="Headquarters Location"
                  value={startupForm.location}
                  onChange={(e) => setStartupForm({ ...startupForm, location: e.target.value })}
                  placeholder="e.g. San Francisco, CA"
                  required
                />

                <Input
                  label="Founded Year"
                  type="number"
                  value={startupForm.foundedYear}
                  onChange={(e) => setStartupForm({ ...startupForm, foundedYear: Number(e.target.value) })}
                  required
                />

                <Input
                  label="Team Size"
                  value={startupForm.teamSize}
                  onChange={(e) => setStartupForm({ ...startupForm, teamSize: e.target.value })}
                  placeholder="e.g. 8-15"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
                  Executive Description
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-sage-dark/60 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
                  value={startupForm.description}
                  onChange={(e) => setStartupForm({ ...startupForm, description: e.target.value })}
                  placeholder="Describe your core product, enterprise problem, and differentiation..."
                  required
                />
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-sm font-bold text-charcoal uppercase tracking-wider pb-2 border-b border-sage/40">
                Capital Ask & Valuation Framework
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Funding Target / Round Ask ($ USD)"
                  type="number"
                  value={startupForm.fundingRequired}
                  onChange={(e) => setStartupForm({ ...startupForm, fundingRequired: Number(e.target.value) })}
                  required
                />

                <Input
                  label="Current Pre-Money Valuation ($ USD)"
                  type="number"
                  value={startupForm.currentValuation}
                  onChange={(e) => setStartupForm({ ...startupForm, currentValuation: Number(e.target.value) })}
                  required
                />

                <Input
                  label="Business Model"
                  value={startupForm.businessModel}
                  onChange={(e) => setStartupForm({ ...startupForm, businessModel: e.target.value })}
                  placeholder="e.g. B2B SaaS / Enterprise"
                  required
                />

                <Input
                  label="Target Audience"
                  value={startupForm.targetAudience}
                  onChange={(e) => setStartupForm({ ...startupForm, targetAudience: e.target.value })}
                  placeholder="e.g. Mid-market fintechs and banks"
                  required
                />
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="lg" isLoading={saving}>
                <Save className="w-4 h-4 mr-1" />
                Save Startup Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}

