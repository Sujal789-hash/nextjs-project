'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardDispatcher() {
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data?.user) {
          router.push('/login');
          return;
        }
        const role = data.user.role;
        if (role === 'admin') {
          router.replace('/dashboard/admin');
        } else if (role === 'investor') {
          router.replace('/dashboard/investor');
        } else {
          router.replace('/dashboard/founder');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-charcoal-muted">
      Redirecting to your role dashboard...
    </div>
  );
}

