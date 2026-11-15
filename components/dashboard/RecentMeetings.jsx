'use client';
import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Video, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

export default function RecentMeetings({
  meetings = [],
  role = 'startup',
  onUpdateStatus,
}) {
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Accepted':
        return 'emerald';
      case 'Pending':
        return 'amber';
      case 'Rejected':
        return 'red';
      case 'Cancelled':
        return 'red';
      case 'Completed':
        return 'sage';
      default:
        return 'forest';
    }
  };

  if (!meetings || meetings.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-ivory/50 rounded-2xl border border-dashed border-sage">
        <Calendar className="w-8 h-8 text-forest mx-auto mb-2 opacity-50" />
        <p className="text-sm font-semibold text-charcoal">No meetings scheduled yet</p>
        <p className="text-xs text-charcoal-muted mt-1 max-w-xs mx-auto">
          {role === 'startup'
            ? 'Explore active investors and request your first 30-min pitch session.'
            : 'You will see incoming pitch booking requests from verified founders here.'}
        </p>
        {role === 'startup' && (
          <Link href="/discover" className="inline-block mt-4">
            <Button size="sm" variant="primary">
              Discover Investors
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <div
          key={meeting._id}
          className="p-4 rounded-2xl bg-white border border-sage/60 hover:border-emerald/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-charcoal">{meeting.agenda}</span>
              <Badge variant={getBadgeVariant(meeting.status)} size="sm">
                {meeting.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-forest" />
                {meeting.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-forest" />
                {meeting.startTime} - {meeting.endTime} ({meeting.duration || 30} mins)
              </span>
            </div>

            {meeting.description && (
              <p className="text-xs text-charcoal-muted line-clamp-1 italic">
                "{meeting.description}"
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {meeting.status === 'Accepted' && meeting.meetingLink && (
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-forest text-white hover:bg-forest-light shadow-sm transition-colors"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Join Google Meet</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            {meeting.status === 'Pending' && role === 'investor' && onUpdateStatus && (
              <>
                <Button
                  size="sm"
                  variant="emerald"
                  onClick={() => onUpdateStatus(meeting._id, 'Accepted')}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => onUpdateStatus(meeting._id, 'Rejected')}
                >
                  <XCircle className="w-3.5 h-3.5 mr-1" />
                  Decline
                </Button>
              </>
            )}

            {meeting.status === 'Pending' && role === 'startup' && (
              <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                Awaiting Investor Confirmation
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

