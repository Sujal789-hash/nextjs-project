'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Bell, Search, Check, Sparkles, ExternalLink } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function DashboardHeader({ user, onMenuToggle }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-ivory/80 backdrop-blur-md border-b border-sage/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left items */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-forest hover:bg-sage/40 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-charcoal tracking-tight flex items-center gap-2">
            <span>Welcome back, {user?.fullName?.split(' ')[0] || 'Venture Partner'}</span>
          </h2>
          <p className="text-xs text-charcoal-muted hidden sm:block">
            {user?.role === 'startup'
              ? 'Institutional fundraising hub & pitch performance'
              : user?.role === 'investor'
              ? 'Deal flow pipeline & startup discovery'
              : 'Global platform supervision & audit console'}
          </p>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick link to Discover */}
        <Link
          href="/discover"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sage/60 text-forest hover:bg-sage transition-colors border border-sage-dark/40"
        >
          <Search className="w-3.5 h-3.5" />
          <span>{user?.role === 'investor' ? 'Explore Startups' : 'Find Investors'}</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2.5 rounded-xl bg-white border border-sage/60 text-charcoal hover:border-emerald/50 hover:bg-sage/20 transition-all shadow-sm"
          >
            <Bell className="w-4 h-4 text-forest" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-sage/60 z-50 p-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-sage/40">
                <span className="text-sm font-bold text-charcoal">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-emerald font-semibold hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center py-6 text-charcoal-muted">
                    No active notifications.
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <Link
                      key={notif._id}
                      href={notif.link || '/dashboard'}
                      onClick={() => setShowNotifMenu(false)}
                      className={`block p-3 rounded-xl transition-all border ${
                        notif.isRead
                          ? 'bg-ivory/50 border-transparent'
                          : 'bg-sage-light border-emerald/20 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-charcoal">{notif.title}</span>
                        <span className="text-[10px] text-charcoal-muted">
                          {new Date(notif.createdAt).toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal-muted mt-1 leading-snug">
                        {notif.message}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Pill */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-white border border-sage/60 hover:border-emerald/50 shadow-sm transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center font-bold text-xs">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <span className="text-xs font-semibold text-charcoal hidden sm:block">
            {user?.fullName?.split(' ')[0] || 'Profile'}
          </span>
        </Link>
      </div>
    </header>
  );
}

