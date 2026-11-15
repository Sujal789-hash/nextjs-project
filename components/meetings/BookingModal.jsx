'use client';
import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

export default function BookingModal({
  isOpen,
  onClose,
  investor,
  onBookingSuccess,
}) {
  const [date, setDate] = useState(() => {
    // Default to 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState('10:00');
  const [duration, setDuration] = useState('30');
  const [agenda, setAgenda] = useState('Seed Round Overview & Product Demo');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const timeSlots = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!investor) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          investorId: investor._id,
          date,
          startTime,
          duration: Number(duration),
          agenda,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to request meeting');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onBookingSuccess) onBookingSuccess(data.meeting);
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!investor) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Investor Pitch Meeting"
      subtitle={`Booking session with ${investor.fullName} (${investor.organization})`}
    >
      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald/20 text-emerald flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-charcoal">Meeting Request Sent!</h4>
          <p className="text-xs text-charcoal-muted max-w-sm mx-auto">
            Your pitch request for {date} at {startTime} has been submitted. You will be notified when the partner accepts.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-sage/40 rounded-xl border border-sage flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-forest">{investor.fullName}</p>
              <p className="text-charcoal-muted">{investor.organization}</p>
            </div>
            <span className="text-[11px] font-semibold text-gold-dark bg-white px-2.5 py-1 rounded-lg border border-gold/40">
              Verified Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Meeting Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
            />

            <Select
              label="Preferred Slot (EST)"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              options={timeSlots.map((slot) => ({ value: slot, label: slot }))}
            />
          </div>

          <Input
            label="Meeting Agenda / Purpose"
            value={agenda}
            onChange={(e) => setAgenda(e.target.value)}
            placeholder="e.g. Series Seed Round Pitch & Live Product Demo"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
              Pitch Highlights & Focus Questions
            </label>
            <textarea
              rows={3}
              className="w-full bg-white border border-sage-dark/60 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
              placeholder="Briefly state your current traction, ARR, customer pilots, or specific topics you wish to review during this meeting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-sage/40 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={loading}
            >
              Submit Pitch Request
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

