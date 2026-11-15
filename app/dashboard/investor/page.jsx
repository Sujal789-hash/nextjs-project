'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Bookmark,
  Calendar,
  Clock,
  Sparkles,
  PieChart as PieIcon,
  FileText,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import IndustryPieChart from '@/components/dashboard/IndustryPieChart';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function InvestorDashboard() {
  const [data, setData] = useState({
    user: null,
    investor: null,
    startups: [],
    meetings: [],
    favorites: [],
    decks: [],
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [meRes, stpRes, meetRes, favRes, deckRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/startups'),
        fetch('/api/meetings'),
        fetch('/api/favorites'),
        fetch('/api/pitch-decks'),
      ]);

      const me = meRes.ok ? await meRes.json() : {};
      const stp = stpRes.ok ? await stpRes.json() : { startups: [] };
      const meets = meetRes.ok ? await meetRes.json() : { meetings: [] };
      const favs = favRes.ok ? await favRes.json() : { favorites: [] };
      const decks = deckRes.ok ? await deckRes.json() : { decks: [] };

      setData({
        user: me.user || null,
        investor: me.profile || null,
        startups: stp.startups || [],
        meetings: meets.meetings || [],
        favorites: favs.favorites || [],
        decks: decks.decks || [],
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateMeetingStatus = async (meetingId, status) => {
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const incomingPitchRequests = data.meetings.filter((m) => m.status === 'Pending').length;
  const acceptedMeetings = data.meetings.filter((m) => m.status === 'Accepted').length;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage/60 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald" />
            <span>Accredited General Partner Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Deal Flow Console // {data.user?.fullName || 'Investor Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Review incoming founder pitches, track diligence documents, and screen verified early-stage ventures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link href="/discover">
            <Button size="sm" variant="primary">
              <Building2 className="w-4 h-4 mr-1" />
              Screen Startups
            </Button>
          </Link>
          <Link href="/compare">
            <Button size="sm" variant="secondary">
              Comparison Matrix
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Verified Startups"
          value={data.startups.length}
          subtitle="Qualified pipeline candidates"
          badgeText="Active Pipeline"
          icon={Building2}
        />

        <StatCard
          title="Incoming Pitch Requests"
          value={incomingPitchRequests}
          subtitle="Awaiting partner decision"
          trend={incomingPitchRequests > 0 ? 'Requires attention' : 'Inbox zero'}
          trendPositive={incomingPitchRequests === 0}
          icon={Clock}
        />

        <StatCard
          title="Scheduled Pitch Meetings"
          value={acceptedMeetings}
          subtitle="Calendar confirmed"
          trend="Strong pipeline flow"
          trendPositive={true}
          icon={Calendar}
        />

        <StatCard
          title="Bookmarked Startups"
          value={data.favorites.length}
          subtitle="Shortlisted for thesis review"
          trend="Saved to watch-list"
          trendPositive={true}
          icon={Bookmark}
        />
      </div>

      {/* Analytics & Pitch Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Industry Allocation Chart */}
        <Card className="lg:col-span-1 space-y-4">
          <div className="pb-3 border-b border-sage/40">
            <h3 className="text-base font-bold text-charcoal">Portfolio Sector Fit</h3>
            <p className="text-xs text-charcoal-muted">Targeted deployment across tech verticals</p>
          </div>

          <IndustryPieChart />

          <div className="pt-2 border-t border-sage/40 text-center">
            <span className="text-[11px] text-charcoal-muted font-medium">
              Emerald Luxe Capital Allocation Model
            </span>
          </div>
        </Card>

        {/* Incoming Pitch Requests with Accept/Reject Controls */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage/40">
            <div>
              <h3 className="text-base font-bold text-charcoal">Incoming Pitch Requests</h3>
              <p className="text-xs text-charcoal-muted">Review founders requesting partner time</p>
            </div>
            <Link href="/meetings" className="text-xs font-bold text-forest hover:text-emerald">
              Manage All ({data.meetings.length}) ↗
            </Link>
          </div>

          <RecentMeetings
            meetings={data.meetings}
            role="investor"
            onUpdateStatus={handleUpdateMeetingStatus}
          />
        </Card>
      </div>

      {/* Recently Uploaded Pitch Decks & Discovery Quick Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage/40">
            <div>
              <h3 className="text-base font-bold text-charcoal">Recent Pitch Decks (Diligence)</h3>
              <p className="text-xs text-charcoal-muted">Institutional memos available for review</p>
            </div>
            <Link href="/pitch-decks" className="text-xs font-bold text-forest hover:text-emerald">
              Review Hub ↗
            </Link>
          </div>

          <div className="space-y-3">
            {data.decks.map((deck) => (
              <div
                key={deck._id}
                className="p-3.5 rounded-2xl bg-ivory border border-sage/60 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-9 h-9 rounded-xl bg-forest text-white flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-emerald" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-charcoal truncate">{deck.title}</p>
                    <p className="text-[10px] text-charcoal-muted">
                      {(deck.fileSize / 1000000).toFixed(2)} MB • Version {deck.version}
                    </p>
                  </div>
                </div>

                <a
                  href={deck.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest-light shrink-0"
                >
                  View PDF
                </a>
              </div>
            ))}
          </div>
        </Card>

        {/* Shortlist & Quick Discovery */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sage/40">
            <div>
              <h3 className="text-base font-bold text-charcoal">Pipeline Startups</h3>
              <p className="text-xs text-charcoal-muted">Fast screen seed and Series A profiles</p>
            </div>
            <Link href="/discover" className="text-xs font-bold text-forest hover:text-emerald">
              Browse Directory ↗
            </Link>
          </div>

          <div className="space-y-3">
            {data.startups.slice(0, 3).map((s) => (
              <div
                key={s._id}
                className="p-3 rounded-2xl bg-ivory border border-sage/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-charcoal">{s.startupName}</h4>
                  <p className="text-[11px] text-charcoal-muted">
                    {s.industry} • Ask: ${(s.fundingRequired / 1000).toFixed(0)}k
                  </p>
                </div>
                <Link href={`/compare`}>
                  <Button size="sm" variant="secondary">
                    Compare
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

