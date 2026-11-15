'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function IndustryPieChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = [
    { name: 'AI & Machine Learning', value: 38, color: '#145A46' }, // Forest
    { name: 'CleanTech & Energy', value: 24, color: '#19A77A' }, // Emerald
    { name: 'FinTech & Settlement', value: 20, color: '#C9A96E' }, // Gold
    { name: 'SaaS & Enterprise', value: 12, color: '#252B29' }, // Charcoal
    { name: 'HealthTech & Bio', value: 6, color: '#88A89A' }, // Sage accent
  ];

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-charcoal-muted">
        Loading portfolio industry distribution...
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value}% Allocation`, 'Sector Share']}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #DDEBE3',
              boxShadow: '0 8px 24px rgba(20,90,70,0.1)',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

