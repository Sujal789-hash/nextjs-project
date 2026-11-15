'use client';
import React from 'react';

export default function Card({
  children,
  className = '',
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-sage/60 p-6 shadow-card transition-all duration-200 ${
        hoverable ? 'hover:shadow-card-hover hover:border-emerald/40 cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

