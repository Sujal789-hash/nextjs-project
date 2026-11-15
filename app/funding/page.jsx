'use client';
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import DashboardLayout from '@/app/dashboard/layout';
import FundingChart from '@/components/dashboard/FundingChart';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function FundingTrackerPage() {
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setStartup(
            data.profile || {
              startupName: 'Zenith AI',
              startupStage: 'Seed',
              fundingRequired: 1500000,
              fundingRaised: 950000,
              currentValuation: 8500000,
            }
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const target = startup?.fundingRequired || 1500000;
  const secured = startup?.fundingRaised || 950000;
  const remaining = Math.max(target - secured, 0);
  const progressPercent = Math.min(Math.round((secured / target) * 100), 100);

  const milestones = [
    {
      title: 'Angel Syndicate Kickoff & Term Sheet',
      amount: '$300,000',
      status: 'Completed',
      date: 'Aug 2026',
      notes: 'Executed lead SAFE notes with initial strategic advisors and angels.',
    },
    {
      title: 'Institutional Lead Commitment',
      amount: '$650,000',
      status: 'Completed',
      date: 'Oct 2026',
      notes: 'Emerald Capital Partners signed lead investor commitment with 1 board seat.',
    },
    {
      title: 'Strategic Syndicate Tranche (Current)',
      amount: '$350,000',
      status: 'In Progress',
      date: 'Nov 2026',
      notes: 'Finalizing co-investor participation from enterprise fintech syndicates.',
    },
    {
      title: 'Round Close & Regulatory Filings',
      amount: '$200,000',
      status: 'Pending',
      date: 'Dec 2026',
      notes: 'Final closing wire transfers and SEC Form D compliance lodgement.',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2">
              <span>Institutional Funding Progress Tracker</span>
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Real-time monitoring of secured wire transfers, remaining allocation tranches, and syndicate closing milestones.
            </p>
          </div>

          <Badge variant="emerald" size="lg">
            Round: {startup?.startupStage || 'Seed'} Stage
          </Badge>
        </div>

        {/* Regulatory Governance Banner */}
        <div className="p-4 rounded-2xl bg-ivory border border-sage/80 flex items-start gap-3 text-xs text-charcoal">
          <ShieldAlert className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Regulatory Protocol:</strong> In accordance with financial communications integrity standards, only executed term sheets and verified bank wires are categorized as <em>Funding Secured</em>. Pitch discussions and proposed syndicate commitments are tracked strictly as soft commits.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-sage/70 space-y-1">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Total Target Round Ask
            </span>
            <p className="text-3xl font-extrabold text-charcoal tracking-tight">
              ${(target / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-charcoal-muted mt-2">
              Based on Pre-Money Valuation of ${(startup?.currentValuation / 1000000 || 8.5).toFixed(1)}M
            </p>
          </Card>

          <Card className="border-emerald/40 bg-emerald/5 space-y-1">
            <span className="text-xs font-semibold text-emerald-hover uppercase tracking-wider">
              Capital Secured / Executed
            </span>
            <p className="text-3xl font-extrabold text-emerald tracking-tight">
              ${(secured / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-emerald-hover font-bold mt-2">
              {progressPercent}% of round allocation closed
            </p>
          </Card>

          <Card className="border-sage/70 space-y-1">
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Remaining Open Allocation
            </span>
            <p className="text-3xl font-extrabold text-forest tracking-tight">
              ${(remaining / 1000).toFixed(0)}k
            </p>
            <p className="text-xs text-charcoal-muted mt-2">
              Available for accredited syndicate participants
            </p>
          </Card>
        </div>

        {/* Big Progress Bar */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-charcoal">
            <span>Overall Round Mobilization</span>
            <span className="text-emerald text-sm font-extrabold">{progressPercent}% Closed</span>
          </div>

          <div className="w-full bg-sage-light h-4 rounded-full overflow-hidden p-0.5 border border-sage">
            <div
              className="bg-emerald h-full rounded-full transition-all duration-500 shadow-emerald-glow"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-charcoal-muted pt-1">
            <span>$0</span>
            <span>$500k</span>
            <span>$1.0M</span>
            <span>$1.5M (Full Target)</span>
          </div>
        </Card>

        {/* Capital Mobilization Area Chart */}
        <Card className="space-y-4">
          <div className="pb-3 border-b border-sage/40">
            <h3 className="text-base font-bold text-charcoal">Tranche Progression Timeline</h3>
            <p className="text-xs text-charcoal-muted">Monthly closed capital versus prospective pipeline commits</p>
          </div>

          <FundingChart fundingTarget={target} fundingRaised={secured} />
        </Card>

        {/* Milestones Roadmap */}
        <Card className="space-y-6">
          <div className="pb-3 border-b border-sage/40">
            <h3 className="text-base font-bold text-charcoal">Funding Round Milestones</h3>
            <p className="text-xs text-charcoal-muted">Track progress through structural stages of the syndicate</p>
          </div>

          <div className="space-y-4">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-ivory border border-sage/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-charcoal">{m.title}</span>
                    <Badge
                      variant={
                        m.status === 'Completed'
                          ? 'emerald'
                          : m.status === 'In Progress'
                          ? 'gold'
                          : 'sage'
                      }
                      size="sm"
                    >
                      {m.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-charcoal-muted">{m.notes}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:text-right">
                  <div>
                    <span className="text-sm font-extrabold text-forest block">{m.amount}</span>
                    <span className="text-[10px] text-charcoal-muted">{m.date}</span>
                  </div>
                  {m.status === 'Completed' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

