'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Calendar,
  MessageSquare,
  FileText,
  DollarSign,
  ChevronDown,
  Building,
  CheckCircle2,
  Users,
  Award,
  Compass,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const stats = [
    { label: 'Institutional Capital Deployed', value: '$840M+' },
    { label: 'Active Syndicate Partners', value: '450+' },
    { label: 'Verified Startup Founders', value: '1,200+' },
    { label: 'Pitch Meeting Success Rate', value: '78%' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Curate Startup Thesis',
      desc: 'Build your institutional company profile, upload your audited pitch deck, and set your funding targets with transparent valuation metrics.',
    },
    {
      step: '02',
      title: 'Smart Weighted Matching',
      desc: 'Our transparent 0-100 compatibility engine evaluates industry sweet spots, check size parameters, and stage fit to match you with leading partners.',
    },
    {
      step: '03',
      title: 'Book Direct Pitch Meetings',
      desc: 'Request synchronized calendar slots with zero email friction, integrated Google Meet rooms, and automated double-booking prevention.',
    },
    {
      step: '04',
      title: 'Syndicate & Secure Allocation',
      desc: 'Receive structural deck reviews, monitor round progress with real-time milestone trackers, and close early-stage investment tranches.',
    },
  ];

  const featuredInvestors = [
    {
      name: 'David Sterling',
      role: 'Managing Partner',
      firm: 'Emerald Capital Partners',
      location: 'New York, NY',
      checkRange: '$500k – $2.5M',
      focus: ['FinTech', 'AI & Machine Learning'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Victoria Zhao',
      role: 'Founding Partner',
      firm: 'Apex Horizon Ventures',
      location: 'San Francisco, CA',
      checkRange: '$1.0M – $5.0M',
      focus: ['CleanTech', 'Energy Storage'],
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Aravind Patel',
      role: 'General Partner',
      firm: 'Catalyst Seed Collective',
      location: 'Austin, TX',
      checkRange: '$100k – $750k',
      focus: ['B2B SaaS', 'Developer Tools'],
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const featuredStartups = [
    {
      name: 'Zenith AI',
      founder: 'Sarah Chen',
      industry: 'AI & Machine Learning',
      stage: 'Seed',
      ask: '$1.5M ($950k Secured)',
      val: '$8.5M',
      traction: '$420k ARR (28% MoM)',
    },
    {
      name: 'GreenPulse Energy',
      founder: 'Marcus Vance',
      industry: 'CleanTech & Energy',
      stage: 'Series A',
      ask: '$3.0M ($2.1M Secured)',
      val: '$16.0M',
      traction: '$1.1M ARR (19% MoM)',
    },
    {
      name: 'NovaPay Global',
      founder: 'Elena Rostova',
      industry: 'FinTech Infrastructure',
      stage: 'Pre-Seed',
      ask: '$750k ($300k Secured)',
      val: '$4.5M',
      traction: '$95k ARR (35% MoM)',
    },
  ];

  const testimonials = [
    {
      quote: 'PitchConnect bypassed the endless cold email labyrinth. Within 12 days, we booked 7 partner meetings and closed our $1.5M Seed round lead.',
      name: 'Sarah Chen',
      title: 'Founder & CEO, Zenith AI',
      round: 'Closed $1.5M Seed',
    },
    {
      quote: 'The weighted thesis matching and verified pitch deck reviews save our investment committee over 20 hours per week of low-signal screening.',
      name: 'David Sterling',
      title: 'Managing General Partner, Emerald Capital',
      round: 'Deploys $40M Fund',
    },
  ];

  const faqs = [
    {
      q: 'How does the PitchConnect Smart Matching Algorithm work?',
      a: 'We evaluate three transparent criteria: sector alignment (35%), funding target against investor check sweet-spot (35%), and stage suitability (30%). We do not use black-box claims; you receive full visibility into why each partner is recommended.',
    },
    {
      q: 'Who can access startup pitch decks?',
      a: 'Pitch decks are securely hosted with authenticated, role-based access. Only accredited and verified investors can view and download full documentation.',
    },
    {
      q: 'Can founders book meetings directly with partners?',
      a: 'Yes. Investors define their weekly availability windows. When a founder requests a slot with a specific agenda, the system checks real-time availability to eliminate double-booking.',
    },
    {
      q: 'Is PitchConnect free to explore for early-stage founders?',
      a: 'Founders can register, assemble their profile, test match scores, and upload pitch decks completely free during active fundraising cycles.',
    },
  ];

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Soft background accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-sage/50 via-emerald/10 to-ivory rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sage shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald animate-ping" />
            <span className="text-xs font-bold text-forest">The Emerald Luxe Venture Ecosystem</span>
            <span className="text-xs font-semibold text-gold-dark">• Series Seed to Series A</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-charcoal tracking-tight max-w-5xl mx-auto leading-[1.12]">
            Where Ambitious Startups Meet <span className="text-forest underline decoration-emerald decoration-wavy decoration-from-font">Visionary Investors.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-charcoal-muted max-w-2xl mx-auto leading-relaxed">
            Eliminate cold outreach chaos. PitchConnect unites elite early-stage founders with accredited venture capitalists through smart thesis matching, verified deck diligence, and instant calendar booking.
          </p>

          {/* Call to actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-lg hover:shadow-emerald-glow">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto border border-sage-dark/50">
                <Compass className="w-4 h-4 mr-1 text-forest" />
                Explore Investors
              </Button>
            </Link>
          </div>

          {/* Attractive Dashboard Preview Card */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-sage/80 relative">
              <div className="flex items-center justify-between pb-4 border-b border-sage/40 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald" />
                  <span className="text-xs font-bold text-charcoal ml-2">PitchConnect Protocol // Live Founder Terminal</span>
                </div>
                <Badge variant="gold" size="sm">Emerald Luxe v2.6</Badge>
              </div>

              {/* Mock Dashboard Interior */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
                <div className="p-4 rounded-2xl bg-ivory border border-sage/60">
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase">Round Status</span>
                  <p className="text-2xl font-extrabold text-forest mt-1">$950k / $1.5M</p>
                  <div className="w-full bg-sage-dark/40 h-2 rounded-full mt-3 overflow-hidden">
                    <div className="bg-emerald h-full rounded-full w-[63%]" />
                  </div>
                  <span className="text-[10px] text-emerald-hover font-semibold mt-1.5 block">63% of Seed Round Secured</span>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-sage/60">
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase">Pitch Meetings</span>
                  <p className="text-2xl font-extrabold text-charcoal mt-1">14 Confirmed</p>
                  <p className="text-xs text-charcoal-muted mt-2">Next: David Sterling (Emerald Capital) – Today 10:30 AM</p>
                </div>

                <div className="p-4 rounded-2xl bg-ivory border border-sage/60">
                  <span className="text-[11px] font-bold text-charcoal-muted uppercase">Thesis Match Rate</span>
                  <p className="text-2xl font-extrabold text-emerald mt-1">94% Compatibility</p>
                  <p className="text-xs text-charcoal-muted mt-2">FinTech Infrastructure & Enterprise AI criteria match</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-12 bg-forest text-white border-y border-forest-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((st, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-light tracking-tight">{st.value}</p>
                <p className="text-xs sm:text-sm text-sage/80 font-medium">{st.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <Badge variant="forest">Streamlined Protocol</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            How PitchConnect Elevates Fundraising
          </h2>
          <p className="text-sm text-charcoal-muted">
            From verified thesis submission to booked syndicate partner slots in four transparent steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <Card key={step.step} className="border-sage/70 hover:border-emerald/40 relative">
              <span className="text-3xl font-extrabold text-gold block mb-2">{step.step}</span>
              <h3 className="text-base font-bold text-charcoal mb-2">{step.title}</h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Investors */}
      <section className="py-20 bg-ivory-dark/40 border-y border-sage/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <Badge variant="gold">Accredited Network</Badge>
              <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-2">
                Featured Venture Capital Partners
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Active institutional check writers deploying capital this quarter.
              </p>
            </div>
            <Link href="/discover" className="mt-4 sm:mt-0">
              <Button size="sm" variant="outline">
                View All Partners
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredInvestors.map((inv, idx) => (
              <Card key={idx} className="hover:shadow-card-hover border-sage/70">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={inv.image}
                    alt={inv.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald/30 shadow-sm"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-charcoal">{inv.name}</h3>
                    <p className="text-xs font-semibold text-emerald-hover">{inv.role} • {inv.firm}</p>
                    <p className="text-[11px] text-charcoal-muted">{inv.location}</p>
                  </div>
                </div>

                <div className="p-3 bg-ivory rounded-xl border border-sage/60 text-xs mb-3 flex items-center justify-between">
                  <span className="text-charcoal font-medium">Typical Check:</span>
                  <span className="font-bold text-forest">{inv.checkRange}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {inv.focus.map((f) => (
                    <Badge key={f} variant="sage" size="sm">{f}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <Badge variant="emerald">Deal Flow Pipeline</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-2">
              Featured Verified Startups
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
              High-traction venture candidates with institutional deck diligence ready.
            </p>
          </div>
          <Link href="/compare" className="mt-4 sm:mt-0">
            <Button size="sm" variant="secondary">
              Open Comparison Matrix
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredStartups.map((stp, idx) => (
            <Card key={idx} className="border-sage/70 hover:shadow-card-hover">
              <div className="flex items-center justify-between pb-3 border-b border-sage/40">
                <h3 className="text-base font-bold text-charcoal">{stp.name}</h3>
                <Badge variant="forest" size="sm">{stp.stage}</Badge>
              </div>
              <p className="text-xs text-charcoal-muted mt-2">Founded by {stp.founder} • {stp.industry}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-ivory rounded-xl border border-sage/60 text-xs">
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block">Round Ask</span>
                  <span className="font-extrabold text-forest">{stp.ask}</span>
                </div>
                <div>
                  <span className="text-[10px] text-charcoal-muted uppercase block">Valuation</span>
                  <span className="font-extrabold text-charcoal">{stp.val}</span>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-emerald-hover mt-3">
                Current Traction: {stp.traction}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="features" className="py-20 bg-forest-dark text-white border-t border-forest">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <Badge variant="gold">Platform Capabilities</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed For High-Stakes Venture Allocations
            </h2>
            <p className="text-xs sm:text-sm text-sage/80">
              Built on Next.js App Router and Mongoose with enterprise grade security and responsive controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-forest border border-forest-light space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald/20 flex items-center justify-center text-emerald">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Tier RBAC Security</h3>
              <p className="text-xs text-sage/80 leading-relaxed">
                Distinct operational dashboards for Founders, Investors, and Admin supervisors with password confirmation and JWT HTTP-only credentials.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest border border-forest-light space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald/20 flex items-center justify-center text-emerald">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Double-Booking Prevention</h3>
              <p className="text-xs text-sage/80 leading-relaxed">
                Server-side calendar slot validation prevents slot collisions and generates synchronized meeting rooms for approved agendas.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-forest border border-forest-light space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald/20 flex items-center justify-center text-emerald">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Real-Time Funding Tracker</h3>
              <p className="text-xs text-sage/80 leading-relaxed">
                Dynamic visual tracking of targeted vs secured capital with Recharts milestones and structured investor review scorecards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="forest">Founder & Investor Endorsements</Badge>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-2">
            Proven Results in Early-Stage Syndication
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="border-sage/70 p-8 space-y-4">
              <p className="text-sm text-charcoal leading-relaxed italic">"{t.quote}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-sage/40">
                <div>
                  <h4 className="text-sm font-bold text-charcoal">{t.name}</h4>
                  <p className="text-xs text-charcoal-muted">{t.title}</p>
                </div>
                <Badge variant="gold" size="sm">{t.round}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-ivory-dark/30 border-t border-sage/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="forest">Answers & Protocol</Badge>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-sage/60 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-5 flex items-center justify-between font-bold text-sm text-charcoal hover:text-forest"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-forest transition-transform ${
                      openFaq === idx ? 'rotate-180 text-emerald' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-charcoal-muted leading-relaxed border-t border-sage/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

