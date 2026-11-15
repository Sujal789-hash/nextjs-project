'use client';
import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Briefcase,
  Calendar,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import VerificationTable from '@/components/admin/VerificationTable';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    try {
      const [statsRes, verRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/verify'),
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData.stats);
        setUsersList(sData.usersList || []);
      }

      if (verRes.ok) {
        const vData = await verRes.json();
        setVerifications(vData.verifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleReviewVerification = async (verificationId, status) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationId, status, adminNotes: `Reviewed via Admin Command Console.` }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Verification ${status.toLowerCase()} successfully.`);
        setTimeout(() => setMessage(''), 3000);
        loadAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSeedDatabase = async () => {
    try {
      setMessage('Seeding database records...');
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      setMessage(data.message);
      setTimeout(() => setMessage(''), 4000);
      loadAdminData();
    } catch (e) {
      setMessage('Seed operation failed: ' + e.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sage/60 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest text-white text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
            <span>Platform Governance & Compliance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
            Supervise accredited investor compliance, verify founder credentials, monitor live deal flow, and audit platform security.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button size="sm" variant="outline" onClick={handleSeedDatabase}>
            Reset / Seed Demo Data
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald/15 border border-emerald/30 text-emerald-hover text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{message}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats?.totalUsers || 7}
          subtitle="Founders, VCs, and Staff"
          icon={Users}
        />

        <StatCard
          title="Startup Profiles"
          value={stats?.totalStartups || 3}
          subtitle={`Total Target: $${((stats?.totalFundingRequired || 5250000) / 1000000).toFixed(1)}M`}
          icon={Building2}
        />

        <StatCard
          title="Active Investors"
          value={stats?.totalInvestors || 3}
          subtitle="Institutional check writers"
          icon={Briefcase}
        />

        <StatCard
          title="Platform Meetings"
          value={stats?.totalMeetings || 3}
          subtitle={`${stats?.acceptedMeetings || 2} accepted / confirmed`}
          icon={Calendar}
        />
      </div>

      {/* Verifications Section */}
      <div id="verifications" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-charcoal">Credential Verification Queue</h3>
            <p className="text-xs text-charcoal-muted">
              Audit corporate filings and SEC accredited investor submissions
            </p>
          </div>
          <Badge variant="gold">
            {stats?.pendingVerifications || verifications.filter((v) => v.status === 'Pending').length} Pending
          </Badge>
        </div>

        <VerificationTable
          verifications={verifications}
          onReview={handleReviewVerification}
        />
      </div>

      {/* Platform User Management Table */}
      <Card className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-sage/40">
          <div>
            <h3 className="text-base font-bold text-charcoal">Registered Platform Accounts</h3>
            <p className="text-xs text-charcoal-muted">Full user directory with role-based permissions</p>
          </div>
          <Badge variant="forest">{usersList.length} Accounts</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-ivory border-b border-sage/60 text-charcoal-muted uppercase font-bold tracking-wider">
                <th className="p-3.5">Name</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Accreditation</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage/40">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-ivory/30">
                  <td className="p-3.5 font-bold text-charcoal">{user.fullName}</td>
                  <td className="p-3.5 text-charcoal-muted">{user.email}</td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        user.role === 'admin'
                          ? 'forest'
                          : user.role === 'investor'
                          ? 'gold'
                          : 'emerald'
                      }
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-3.5">
                    {user.isVerified ? (
                      <span className="text-emerald-hover font-bold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    ) : (
                      <span className="text-charcoal-muted">Unverified</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald/15 text-emerald-hover">
                      {user.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-3.5 text-charcoal-muted">
                    {new Date(user.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

