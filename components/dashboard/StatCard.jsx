'use client';
import React from 'react';
import Card from '@/components/ui/Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  badgeText,
}) {
  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-card-hover border-sage/60">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight font-sans">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-2xl bg-sage-light border border-sage flex items-center justify-center text-forest shadow-sm shrink-0">
            <Icon className="w-6 h-6 text-forest" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-sage/40 flex items-center justify-between text-xs">
        {subtitle && <span className="text-charcoal-muted font-medium">{subtitle}</span>}
        {trend && (
          <span
            className={`font-semibold ${
              trendPositive ? 'text-emerald-hover' : 'text-amber-700'
            }`}
          >
            {trend}
          </span>
        )}
        {badgeText && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold-dark border border-gold/40">
            {badgeText}
          </span>
        )}
      </div>
    </Card>
  );
}

