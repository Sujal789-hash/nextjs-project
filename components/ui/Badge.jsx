'use client';
import React from 'react';

export default function Badge({
  children,
  variant = 'forest',
  size = 'md',
  className = '',
  icon: Icon,
}) {
  const variants = {
    forest: 'bg-forest/10 text-forest border border-forest/20',
    emerald: 'bg-emerald/15 text-emerald-hover border border-emerald/30',
    gold: 'bg-gold/20 text-gold-dark border border-gold/40 font-semibold',
    sage: 'bg-sage text-charcoal border border-sage-dark/40',
    charcoal: 'bg-charcoal text-white',
    amber: 'bg-amber-100 text-amber-800 border border-amber-300',
    red: 'bg-red-100 text-red-700 border border-red-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg font-medium',
    lg: 'text-sm px-3 py-1.5 rounded-xl font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 transition-colors ${variants[variant] || variants.forest} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

