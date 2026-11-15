'use client';
import React from 'react';
import { Check, X, FileText, Sparkles, Building2, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function StartupComparisonTable({ startups = [], onRemove }) {
  if (startups.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-sage/60">
        <Sparkles className="w-8 h-8 text-forest mx-auto mb-2 opacity-50" />
        <h4 className="text-base font-bold text-charcoal">No startups selected for matrix comparison</h4>
        <p className="text-xs text-charcoal-muted mt-1 max-w-md mx-auto">
          Select up to 3 candidate companies from the Discovery directory to evaluate financial metrics, round sizes, and business models side-by-side.
        </p>
      </div>
    );
  }

  const rows = [
    { label: 'Founder & HQ', render: (s) => `${s.founderName} • ${s.location}` },
    { label: 'Industry Sector', render: (s) => <Badge variant="emerald" size="sm">{s.industry}</Badge> },
    { label: 'Current Stage', render: (s) => <Badge variant="forest" size="sm">{s.startupStage}</Badge> },
    { label: 'Funding Target', render: (s) => <span className="font-extrabold text-forest text-sm">${(s.fundingRequired / 1000).toFixed(0)}k</span> },
    { label: 'Pre-Money Valuation', render: (s) => <span className="font-bold text-charcoal text-sm">${(s.currentValuation / 1000000).toFixed(1)}M</span> },
    { label: 'Business Model', render: (s) => s.businessModel },
    { label: 'Team Size', render: (s) => `${s.teamSize} members` },
    {
      label: 'Growth Metrics',
      render: (s) =>
        s.revenueInfo ? (
          <div>
            <span className="font-bold text-emerald">${(s.revenueInfo.arr / 1000).toFixed(0)}k ARR</span>
            <span className="text-[11px] text-charcoal-muted block">Growth: {s.revenueInfo.growthRate}</span>
          </div>
        ) : (
          <span className="text-charcoal-muted">Pre-revenue / stealth</span>
        ),
    },
    {
      label: 'Pitch Deck Status',
      render: (s) =>
        s.pitchDeckUrl ? (
          <a
            href={s.pitchDeckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-emerald"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Verified PDF</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-charcoal-muted text-xs">Deck on Request</span>
        ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-sage/60 overflow-hidden shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ivory border-b border-sage/60">
              <th className="p-5 text-xs font-bold uppercase tracking-wider text-charcoal-muted w-1/4">
                Comparison Dimension
              </th>
              {startups.map((startup) => (
                <th key={startup._id} className="p-5 text-left border-l border-sage/40 min-w-[220px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-xs">
                        {startup.startupName?.charAt(0)}
                      </div>
                      <span className="font-bold text-sm text-charcoal">{startup.startupName}</span>
                    </div>
                    {onRemove && (
                      <button
                        onClick={() => onRemove(startup._id)}
                        className="text-charcoal-muted hover:text-red-600 p-1 rounded-lg"
                        title="Remove from matrix"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-sage/40 text-xs">
            {rows.map((row, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-ivory/20'}>
                <td className="p-4 font-semibold text-charcoal">{row.label}</td>
                {startups.map((s) => (
                  <td key={s._id} className="p-4 border-l border-sage/40 text-charcoal">
                    {row.render(s)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

