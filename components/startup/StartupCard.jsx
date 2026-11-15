'use client';
import React from 'react';
import { Building, TrendingUp, DollarSign, Users, FileText, CheckCircle2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function StartupCard({
  startup,
  isSelected = false,
  onToggleSelect,
  onViewDeck,
}) {
  const fundingTargetFormatted = `$${(startup.fundingRequired / 1000).toFixed(0)}k`;
  const valuationFormatted = `$${(startup.currentValuation / 1000000).toFixed(1)}M`;

  return (
    <Card className="flex flex-col justify-between hover:shadow-card-hover border-sage/60 transition-all duration-300 relative group">
      <div>
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-sage/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-forest-dark overflow-hidden border border-emerald/40 shadow-sm shrink-0">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.startupName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-emerald">
                  {startup.startupName?.charAt(0)}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-bold text-charcoal group-hover:text-forest transition-colors">
                  {startup.startupName}
                </h4>
                {startup.isVerified && (
                  <Badge variant="gold" size="sm">
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-xs text-charcoal-muted mt-0.5">
                by {startup.founderName} • {startup.location}
              </p>
            </div>
          </div>

          {/* Select for comparison */}
          {onToggleSelect && (
            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-charcoal bg-ivory px-2.5 py-1.5 rounded-xl border border-sage hover:border-emerald">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(startup)}
                className="rounded text-forest focus:ring-forest"
              />
              <span className="hidden sm:inline">Compare</span>
            </label>
          )}
        </div>

        {/* Industry & Stage Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge variant="emerald" size="sm">
            {startup.industry}
          </Badge>
          <Badge variant="forest" size="sm">
            {startup.startupStage}
          </Badge>
          <Badge variant="sage" size="sm">
            {startup.businessModel}
          </Badge>
        </div>

        <p className="text-xs text-charcoal-muted mt-3 line-clamp-3 leading-relaxed">
          {startup.description}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-ivory rounded-2xl border border-sage/60 text-xs">
          <div>
            <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block">Target Round</span>
            <span className="font-extrabold text-forest text-sm">{fundingTargetFormatted}</span>
          </div>
          <div>
            <span className="text-[10px] text-charcoal-muted uppercase tracking-wider block">Valuation</span>
            <span className="font-extrabold text-charcoal text-sm">{valuationFormatted}</span>
          </div>
          {startup.revenueInfo && (
            <div className="col-span-2 pt-2 border-t border-sage/40 flex items-center justify-between text-[11px]">
              <span className="text-charcoal-muted">ARR / Trajectory:</span>
              <span className="font-bold text-emerald-hover">
                ${(startup.revenueInfo.arr / 1000).toFixed(0)}k ({startup.revenueInfo.growthRate})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-5 pt-3 border-t border-sage/40 flex items-center justify-between">
        <span className="text-xs text-charcoal-muted flex items-center gap-1">
          <Users className="w-3.5 h-3.5 text-forest" />
          {startup.teamSize} team members
        </span>

        {startup.pitchDeckUrl && (
          <a
            href={startup.pitchDeckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-emerald transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Deck (PDF)</span>
          </a>
        )}
      </div>
    </Card>
  );
}

