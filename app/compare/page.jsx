'use client';
import React, { useState, useEffect } from 'react';
import { Columns, Sparkles, Building2, Check, Plus, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/app/dashboard/layout';
import StartupComparisonTable from '@/components/startup/StartupComparisonTable';
import StartupCard from '@/components/startup/StartupCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function ComparePage() {
  const [startups, setStartups] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['stp_1', 'stp_2']); // default 2 startups selected
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStartups() {
      try {
        const res = await fetch('/api/startups');
        if (res.ok) {
          const data = await res.json();
          setStartups(data.startups || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchStartups();
  }, []);

  const handleToggleSelect = (startup) => {
    const id = startup._id;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        alert('You can compare a maximum of 3 startups simultaneously.');
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemove = (id) => {
    setSelectedIds(selectedIds.filter((item) => item !== id));
  };

  const selectedStartups = startups.filter((s) => selectedIds.includes(s._id));

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2">
              <span>Startup Comparison Matrix</span>
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Side-by-side quantitative benchmarking of target round sizes, ARR growth rates, and business models.
            </p>
          </div>

          <Badge variant="gold">
            {selectedIds.length} of 3 Selected
          </Badge>
        </div>

        {/* Matrix Comparison Table */}
        <StartupComparisonTable
          startups={selectedStartups}
          onRemove={handleRemove}
        />

        {/* Directory Selector to add to Matrix */}
        <div className="space-y-4 pt-6 border-t border-sage/60">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-charcoal">Available Startups for Benchmarking</h3>
              <p className="text-xs text-charcoal-muted">
                Click "Compare" on any startup card below to toggle inclusion in the matrix above (max 3).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {startups.map((startup) => (
              <StartupCard
                key={startup._id}
                startup={startup}
                isSelected={selectedIds.includes(startup._id)}
                onToggleSelect={handleToggleSelect}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

