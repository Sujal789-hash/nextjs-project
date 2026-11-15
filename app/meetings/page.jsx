'use client';
import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Building,
  PlusCircle,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '@/app/dashboard/layout';
import CalendarView from '@/components/meetings/CalendarView';
import RecentMeetings from '@/components/dashboard/RecentMeetings';
import BookingModal from '@/components/meetings/BookingModal';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function MeetingsPage() {
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'list'
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  const loadMeetings = async () => {
    try {
      const [meRes, meetRes, invRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/meetings'),
        fetch('/api/investors'),
      ]);

      const me = meRes.ok ? await meRes.json() : {};
      const meetData = meetRes.ok ? await meetRes.json() : { meetings: [] };
      const invData = invRes.ok ? await invRes.json() : { investors: [] };

      setUser(me.user || null);
      setMeetings(meetData.meetings || []);
      setInvestors(invData.investors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  const handleUpdateStatus = async (meetingId, status) => {
    try {
      const res = await fetch(`/api/meetings/${meetingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Meeting marked as ${status}`);
        setTimeout(() => setActionMessage(''), 3000);
        loadMeetings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartBooking = () => {
    if (investors.length > 0) {
      setSelectedInvestor(investors[0]);
      setBookingOpen(true);
    }
  };

  const pendingCount = meetings.filter((m) => m.status === 'Pending').length;
  const acceptedCount = meetings.filter((m) => m.status === 'Accepted').length;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sage/60">
          <div>
            <h1 className="text-2xl font-extrabold text-charcoal tracking-tight flex items-center gap-2">
              <span>Pitch Meeting & Calendar Synchronizer</span>
            </h1>
            <p className="text-xs text-charcoal-muted mt-1">
              Synchronize direct pitch slots with automated double-booking prevention and Google Meet integration.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="bg-white border border-sage rounded-xl p-1 flex items-center text-xs">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'calendar' ? 'bg-forest text-white' : 'text-charcoal hover:bg-sage/40'
                }`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  viewMode === 'list' ? 'bg-forest text-white' : 'text-charcoal hover:bg-sage/40'
                }`}
              >
                List View ({meetings.length})
              </button>
            </div>

            {user?.role === 'startup' && (
              <Button size="sm" variant="primary" onClick={handleStartBooking}>
                <PlusCircle className="w-4 h-4 mr-1" />
                Schedule Pitch
              </Button>
            )}
          </div>
        </div>

        {actionMessage && (
          <div className="p-4 rounded-2xl bg-emerald/15 border border-emerald/30 text-emerald-hover text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Stats Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-sage/60 text-xs shadow-sm">
            <span className="text-[10px] text-charcoal-muted uppercase block">Total Sessions</span>
            <span className="text-xl font-extrabold text-charcoal mt-0.5 block">{meetings.length}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-sage/60 text-xs shadow-sm">
            <span className="text-[10px] text-emerald-hover uppercase block">Accepted / Confirmed</span>
            <span className="text-xl font-extrabold text-emerald mt-0.5 block">{acceptedCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-sage/60 text-xs shadow-sm">
            <span className="text-[10px] text-amber-700 uppercase block">Awaiting Decision</span>
            <span className="text-xl font-extrabold text-amber-600 mt-0.5 block">{pendingCount}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-sage/60 text-xs shadow-sm">
            <span className="text-[10px] text-forest uppercase block">Protocol Security</span>
            <span className="text-xs font-bold text-forest mt-1.5 block">Anti-Collision Locked</span>
          </div>
        </div>

        {/* Calendar or List View */}
        {viewMode === 'calendar' ? (
          <div className="space-y-6">
            <CalendarView meetings={meetings} />

            <div className="space-y-3">
              <h3 className="text-base font-bold text-charcoal">Session Queue Details</h3>
              <RecentMeetings
                meetings={meetings}
                role={user?.role || 'startup'}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </div>
        ) : (
          <Card className="space-y-4">
            <div className="pb-3 border-b border-sage/40">
              <h3 className="text-base font-bold text-charcoal">All Scheduled Meetings</h3>
              <p className="text-xs text-charcoal-muted">Filterable log of all investor interactions</p>
            </div>
            <RecentMeetings
              meetings={meetings}
              role={user?.role || 'startup'}
              onUpdateStatus={handleUpdateStatus}
            />
          </Card>
        )}

        {/* Booking Modal */}
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          investor={selectedInvestor}
          onBookingSuccess={() => {
            loadMeetings();
          }}
        />
      </div>
    </DashboardLayout>
  );
}

