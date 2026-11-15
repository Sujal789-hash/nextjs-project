'use client';
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function CalendarView({ meetings = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Compute days in month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const getMeetingsForDay = (day) => {
    if (!day) return [];
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return meetings.filter((m) => m.date === dateStr);
  };

  return (
    <div className="bg-white rounded-3xl border border-sage/60 p-6 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-sage/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest text-white flex items-center justify-center shadow-sm">
            <CalendarIcon className="w-5 h-5 text-emerald" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal">
              {monthName} {year}
            </h3>
            <p className="text-xs text-charcoal-muted">Monthly Venture Pitch Calendar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl border border-sage hover:bg-sage-light text-charcoal transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl border border-sage hover:bg-sage-light text-charcoal transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold uppercase tracking-wider text-charcoal-muted py-2"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const dayMeetings = getMeetingsForDay(day);
          const hasMeetings = dayMeetings.length > 0;

          return (
            <div
              key={idx}
              className={`min-h-[90px] p-2 rounded-2xl border transition-all ${
                day
                  ? hasMeetings
                    ? 'bg-sage-light/60 border-emerald/30 shadow-sm'
                    : 'bg-ivory/30 border-sage/30 hover:border-sage'
                  : 'bg-transparent border-transparent'
              }`}
            >
              {day && (
                <>
                  <div className="flex items-center justify-between text-xs font-semibold text-charcoal mb-1">
                    <span>{day}</span>
                    {hasMeetings && (
                      <span className="w-2 h-2 rounded-full bg-emerald" />
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map((m) => (
                      <div
                        key={m._id}
                        className="text-[10px] p-1.5 rounded-lg bg-white border border-sage/80 shadow-xs truncate"
                        title={`${m.startTime} - ${m.agenda}`}
                      >
                        <p className="font-bold text-forest truncate">{m.startTime} {m.agenda}</p>
                        <span className={`inline-block text-[9px] font-semibold ${m.status === 'Accepted' ? 'text-emerald-hover' : 'text-amber-700'}`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                    {dayMeetings.length > 2 && (
                      <p className="text-[9px] text-charcoal-muted text-center font-medium">
                        +{dayMeetings.length - 2} more
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

