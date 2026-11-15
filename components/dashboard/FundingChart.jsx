'use client';
import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function FundingChart({ fundingTarget = 1500000, fundingRaised = 950000 }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Progression milestones
  const data = [
    { month: 'Jun', raised: Math.round(fundingRaised * 0.15), committed: Math.round(fundingRaised * 0.25) },
    { month: 'Jul', raised: Math.round(fundingRaised * 0.35), committed: Math.round(fundingRaised * 0.45) },
    { month: 'Aug', raised: Math.round(fundingRaised * 0.55), committed: Math.round(fundingRaised * 0.68) },
    { month: 'Sep', raised: Math.round(fundingRaised * 0.72), committed: Math.round(fundingRaised * 0.85) },
    { month: 'Oct', raised: Math.round(fundingRaised * 0.88), committed: Math.round(fundingRaised * 0.95) },
    { month: 'Nov (Current)', raised: fundingRaised, committed: Math.min(fundingTarget, fundingRaised + 250000) },
  ];

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-charcoal-muted">
        Loading analytics visualization...
      </div>
    );
  }

  const formatCurrency = (val) => `$${(val / 1000).toFixed(0)}k`;

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#19A77A" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#19A77A" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#145A46" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#145A46" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DDEBE3" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#636F6B' }}
            axisLine={{ stroke: '#DDEBE3' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatCurrency}
            tick={{ fontSize: 11, fill: '#636F6B' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #DDEBE3',
              boxShadow: '0 8px 24px rgba(20,90,70,0.1)',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="committed"
            name="Soft Commits"
            stroke="#145A46"
            strokeWidth={2}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#forestGrad)"
          />
          <Area
            type="monotone"
            dataKey="raised"
            name="Secured Wire Transfers"
            stroke="#19A77A"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#emeraldGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

