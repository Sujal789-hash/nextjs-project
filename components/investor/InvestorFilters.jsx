'use client';
import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function InvestorFilters({
  filters,
  onChange,
  onReset,
}) {
  const industries = [
    'All',
    'FinTech',
    'AI & Machine Learning',
    'CleanTech & Energy',
    'SaaS & Enterprise',
    'HealthTech',
    'Cybersecurity',
    'EdTech',
    'BioTech',
  ];

  const stages = ['All', 'Ideation', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'];

  const locations = ['All', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'Boston, MA'];

  return (
    <div className="bg-white p-5 rounded-2xl border border-sage/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-forest" />
          Filter & Discovery Engine
        </h4>
        <button
          onClick={onReset}
          className="text-xs text-charcoal-muted hover:text-forest flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input
          placeholder="Search partner or firm..."
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          icon={Search}
        />

        <Select
          value={filters.industry}
          onChange={(e) => onChange('industry', e.target.value)}
          options={industries.map((ind) => ({
            value: ind,
            label: ind === 'All' ? 'All Industries' : ind,
          }))}
        />

        <Select
          value={filters.stage}
          onChange={(e) => onChange('stage', e.target.value)}
          options={stages.map((stg) => ({
            value: stg,
            label: stg === 'All' ? 'All Stages' : stg,
          }))}
        />

        <Select
          value={filters.location}
          onChange={(e) => onChange('location', e.target.value)}
          options={locations.map((loc) => ({
            value: loc,
            label: loc === 'All' ? 'All Locations' : loc,
          }))}
        />
      </div>
    </div>
  );
}

