'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  LayoutDashboard,
  Compass,
  FileText,
  Calendar,
  MessageSquare,
  TrendingUp,
  Columns,
  User,
  ShieldCheck,
  X,
  LogOut,
  CheckCircle2,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function Sidebar({ user, isOpen, onClose }) {
  const pathname = usePathname();
  const role = user?.role || 'startup';

  const founderLinks = [
    { label: 'Dashboard', href: '/dashboard/founder', icon: LayoutDashboard },
    { label: 'Discover Investors', href: '/discover', icon: Compass },
    { label: 'Pitch Deck & Reviews', href: '/pitch-decks', icon: FileText },
    { label: 'Meetings Calendar', href: '/meetings', icon: Calendar },
    { label: 'In-App Messages', href: '/messages', icon: MessageSquare },
    { label: 'Funding Tracker', href: '/funding', icon: TrendingUp },
    { label: 'Startup Matrix', href: '/compare', icon: Columns },
    { label: 'Startup Profile', href: '/profile', icon: User },
  ];

  const investorLinks = [
    { label: 'Investor Dashboard', href: '/dashboard/investor', icon: LayoutDashboard },
    { label: 'Discover Startups', href: '/discover', icon: Compass },
    { label: 'Pitch Matrix Compare', href: '/compare', icon: Columns },
    { label: 'Pitch Review Hub', href: '/pitch-decks', icon: FileText },
    { label: 'Meeting Requests', href: '/meetings', icon: Calendar },
    { label: 'Founder Messages', href: '/messages', icon: MessageSquare },
    { label: 'Investment Thesis', href: '/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Admin Command', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Discover Startups', href: '/discover', icon: Compass },
    { label: 'Pitch Review Log', href: '/pitch-decks', icon: FileText },
    { label: 'All Platform Meetings', href: '/meetings', icon: Calendar },
    { label: 'Investor Verification', href: '/dashboard/admin#verifications', icon: ShieldCheck },
    { label: 'Profile Settings', href: '/profile', icon: User },
  ];

  const links = role === 'admin' ? adminLinks : role === 'investor' ? investorLinks : founderLinks;

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-forest text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-forest-dark shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-6 border-b border-forest-light flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-forest-dark border border-emerald/50 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-emerald" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Pitch<span className="text-emerald">Connect</span>
                </span>
                <span className="block text-[9px] tracking-widest uppercase font-semibold text-gold">
                  Emerald Luxe Venture
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-sage/80 hover:text-white hover:bg-forest-light"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Badge Info */}
          <div className="px-6 py-4 bg-forest-dark/40 border-b border-forest-light/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald/20 border border-emerald/40 overflow-hidden flex items-center justify-center text-emerald font-bold text-sm">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="truncate">
                <p className="text-sm font-semibold text-white truncate max-w-[130px]">
                  {user?.fullName || 'Active User'}
                </p>
                <span className="inline-block text-[11px] text-sage/75 capitalize">
                  {role === 'startup' ? 'Founder' : role}
                </span>
              </div>
            </div>
            {user?.isVerified && (
              <Badge variant="gold" size="sm">
                <CheckCircle2 className="w-3 h-3 text-gold-dark" />
                Verified
              </Badge>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-250px)]">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald text-white shadow-emerald-glow font-semibold'
                      : 'text-sage/90 hover:bg-forest-light hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sage'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-forest-light space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-sage/80 hover:text-white hover:bg-forest-light transition-colors"
          >
            <span>Platform Landing Page</span>
            <span className="text-[10px] text-emerald">Live ↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

