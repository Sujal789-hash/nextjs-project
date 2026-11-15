'use client';
import React from 'react';

export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  ...props
}) {
  const inputId = id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-muted">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-white border ${
            error ? 'border-red-500 focus:ring-red-500' : 'border-sage-dark/60 focus:border-forest focus:ring-forest/20'
          } rounded-xl py-2.5 ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 text-sm text-charcoal placeholder-charcoal-muted/60 transition-all focus:outline-none focus:ring-2 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
      {helperText && !error && <p className="mt-1 text-xs text-charcoal-muted">{helperText}</p>}
    </div>
  );
}

