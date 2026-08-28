'use client';

import { useEffect } from 'react';

export default function AdminRedirect() {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

  useEffect(() => {
    window.location.href = adminUrl;
  }, [adminUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#241A21] text-white">
      <div className="text-center space-y-4 p-8">
        <div className="w-12 h-12 rounded-xl bg-[#16A34A] text-white text-2xl flex items-center justify-center mx-auto animate-bounce">
          🧺
        </div>
        <h1 className="text-xl font-bold">Redirecting to LaundryFresh Admin Console...</h1>
        <p className="text-xs text-slate-400">Opening Admin Portal on Port 3001</p>
        <a
          href={adminUrl}
          className="inline-block px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-lg shadow-md transition-all"
        >
          Click here if not redirected automatically →
        </a>
      </div>
    </div>
  );
}
