'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import FundingChart from '@/components/dashboard/FundingChart';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function FounderDashboard() {
  const [data, setData] = useState({
    user: null,
    startup: null,
    meetings: [],
    matches: [],
    decks: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [meRes, meetRes, matchRes, deckRes, notifRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/meetings'),
          fetch('/api/investors/match'),
          fetch('/api/pitch-decks'),
          fetch('/api/notifications'),
        ]);

        const me = meRes.ok ? await meRes.json() : {};
        const meets = meetRes.ok ? await meetRes.json() : { meetings: [] };
        const matches = matchRes.ok ? await matchRes.json() : { matches: [] };
        const decks = deckRes.ok ? await deckRes.json() : { decks: [] };
        const notifs = notifRes.ok ? await notifRes.json() : { notifications: [] };

        setData({
          user: me.user || null,
          startup: me.profile || null,
          meetings: meets.meetings || [],
          matches: matches.matches?.slice(0, 3) || [],
          decks: decks.decks || [],
          notifications: notifs.notifications?.slice(0, 4) || [],
        });
      } catch (err) {
        console.error('Founder dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const startup = data.startup || {
    startupName: 'Zenith AI',
    fundingRequired: 1500000,
    fundingRaised: 950000,
    currentValuation: 8500000,
  };

  const totalMeetings = data.meetings.length;
  const acceptedMeetings = data.meetings.filter((m) => m.status === 'Accepted').length;
  const pendingMeetings = data.meetings.filter((m) => m.status === 'Pending').length;

  const target = startup.fundingRequired || 1500000;
  const raised = startup.fundingRaised || 950000;
  const progressPercent = Math.round((raised / target) * 100);

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage/60 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald" />
            <span>Active Fundraising Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Welcome, {data.user?.fullName || 'Founder'}!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Managing syndicated allocations for{' '}
            <strong className="text-forest">{startup.startupName}</strong>. You have{' '}
            <span className="font-bold text-emerald-hover">{acceptedMeetings} confirmed pitch meetings</span> and{' '}
            <span className="font-bold text-amber-700">{pendingMeetings} pending requests</span>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/discover">
            <Button size="sm" variant="primary">
              <PlusCircle className="w-4 h-4 mr-1" />
              Request Pitch Slot
            </Button>
          </Link>
          <Link href="/pitch-decks">
            <Button size="sm" variant="secondary">
              <FileText className="w-4 h-4 mr-1" />
              Upload New Deck
            </Button>
          </Link>
          <Link href="/funding">
            <Button size="sm" variant="outline">
              <TrendingUp className="w-4 h-4 mr-1" />
              Funding Tracker
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Round Secured"
          value={`$${(raised / 1000).toFixed(0)}k`}
          subtitle={`Target: $${(target / 1000).toFixed(0)}k`}
          trend={`${progressPercent}% allocation`}
          trendPositive={true}
          icon={TrendingUp}
        />

        <StatCard
          title="Total Pitch Requests"
          value={totalMeetings}
          subtitle="All scheduled interactions"
          badgeText="Active Round"
          icon={Calendar}
        />

        <StatCard
          title="Confirmed Pitches"
          value={acceptedMeetings}
          subtitle="Calendar locked with VC"
          trend="High investor traction"
          trendPositive={true}
          icon={CheckCircle2}
        />

        <StatCard
          title="Pending Requests"
          value={pendingMeetings}
          subtitle="Awaiting partner RSVP"
          trend={pendingMeetings > 0 ? 'Review slots' : 'All clear'}
          trendPositive={pendingMeetings === 0}
          icon={Clock}
        />
      </div>

      {/* Charts & Pitch Deck Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Funding Progress Visualizer */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage/40">
            <div>
              <h3 className="text-base font-bold text-charcoal">Capital Mobilization Timeline</h3>
              <p className="text-xs text-charcoal-muted">Monthly closed commitments vs soft syndication targets</p>
            </div>
            <Badge variant="emerald" size="sm">
              ${(raised / 1000).toFixed(0)}k of ${(target / 1000).toFixed(0)}k
            </Badge>
          </div>

          <FundingChart fundingTarget={target} fundingRaised={raised} />

          <div className="p-4 rounded-2xl bg-ivory border border-sage/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-charcoal">Round Cap / Pre-Money Valuation:</span>
            <span className="font-extrabold text-forest text-sm">
              ${(startup.currentValuation / 1000000).toFixed(1)}M
            </span>
          </div>
        </Card>

        {/* Pitch Deck Status & Diligence */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-sage/40">
              <h3 className="text-base font-bold text-charcoal">Active Pitch Deck</h3>
              <Badge variant="gold" size="sm">Diligence v2</Badge>
            </div>

            {data.decks.length > 0 ? (
              <div className="p-4 rounded-2xl bg-ivory border border-sage/60 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-forest shrink-0" />
                  <span className="font-bold text-xs text-charcoal truncate">
                    {data.decks[0].title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-charcoal-muted pt-2 border-t border-sage/40">
                  <span>Views: {data.decks[0].viewsCount || 38}</span>
                  <span>Downloads: {data.decks[0].downloadsCount || 16}</span>
                </div>
                <a
                  href={data.decks[0].fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-hover hover:underline pt-1"
                >
                  <span>Preview PDF Deck</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="text-center py-6 bg-ivory/50 rounded-2xl border border-dashed border-sage">
                <FileText className="w-6 h-6 text-forest mx-auto mb-1 opacity-50" />
                <p className="text-xs font-semibold text-charcoal">No deck uploaded yet</p>
                <Link href="/pitch-decks" className="text-xs text-emerald-hover underline font-bold mt-1 block">
                  Upload Pitch Deck (PDF)
                </Link>
              </div>
            )}

            {/* Recent Notifications */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                Recent Alerts & Feedback
              </h4>
              <div className="space-y-2">
                {data.notifications.length === 0 ? (
                  <p className="text-xs text-charcoal-muted">No new alerts.</p>
                ) : (
                  data.notifications.map((n) => (
                    <div key={n._id} className="p-2.5 rounded-xl bg-sage-light text-xs border border-sage">
                      <p className="font-bold text-forest">{n.title}</p>
                      <p className="text-[11px] text-charcoal-muted line-clamp-1">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <Link href="/pitch-decks">
            <Button size="sm" variant="secondary" className="w-full">
              Manage Pitch Deck & Ratings
            </Button>
          </Link>
        </Card>
      </div>

      {/* Recommended Investors & Upcoming Meetings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Investors based on weighted matching */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage/40">
            <div>
              <h3 className="text-base font-bold text-charcoal">Recommended Investors</h3>
              <p className="text-xs text-charcoal-muted">Algorithm calculated compatibility fit</p>
            </div>
            <Link href="/discover" className="text-xs font-bold text-forest hover:text-emerald">
              See All ↗
            </Link>
          </div>

          <div className="space-y-3">
            {data.matches.map((item) => (
              <div
                key={item.investor._id}
                className="p-3.5 rounded-2xl bg-ivory border border-sage/60 hover:border-emerald/40 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-sm shrink-0 border border-emerald/40">
                    {item.investor.fullName?.charAt(0)}
                  </div>
                  <div className="truncate">
                    <h4 className="text-xs font-bold text-charcoal truncate">
                      {item.investor.fullName}
                    </h4>
                    <p className="text-[11px] text-charcoal-muted truncate">
                      {item.investor.organization} • {item.investor.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="emerald" size="sm">
                    {item.matchPercentage}% Fit
                  </Badge>
                  <Link href={`/discover`}>
                    <Button size="sm" variant="primary">
                      Pitch
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Meetings Calendar List */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage/40">
            <div>
              <h3 className="text-base font-bold text-charcoal">Upcoming Pitch Meetings</h3>
              <p className="text-xs text-charcoal-muted">Calendar slots with verified partners</p>
            </div>
            <Link href="/meetings" className="text-xs font-bold text-forest hover:text-emerald">
              Open Calendar ↗
            </Link>
          </div>

          <RecentMeetings meetings={data.meetings} role="startup" />
        </Card>
      </div>
    </div>
  );
}

