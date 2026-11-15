'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-forest hover:bg-forest-light text-white shadow-sm focus:ring-forest',
    emerald: 'bg-emerald hover:bg-emerald-hover text-white shadow-emerald-glow focus:ring-emerald',
    gold: 'bg-gold hover:bg-gold-dark text-white shadow-gold-glow focus:ring-gold',
    secondary: 'bg-sage hover:bg-sage-dark text-forest focus:ring-forest',
    outline: 'border-2 border-forest text-forest hover:bg-forest hover:text-white focus:ring-forest',
    ghost: 'text-charcoal hover:bg-sage-light focus:ring-forest',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 shadow-md',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}

