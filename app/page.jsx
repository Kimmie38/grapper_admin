'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to admin dashboard on load
    router.push('/admin');
  }, [router]);

  return null;
}
