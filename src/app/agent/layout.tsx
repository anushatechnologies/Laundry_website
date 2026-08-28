'use client';

import { useEffect } from 'react';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001';

/** Agent operations belong to the authenticated admin console, not the public customer site. */
export default function AgentHandoffLayout({ children: _children }: { children: React.ReactNode }) {
  useEffect(() => {
    const path = window.location.pathname.replace(/^\/agent/, '') || '/';
    window.location.replace(`${ADMIN_URL.replace(/\/$/, '')}/agent${path}`);
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4fbfa] px-6 text-center">
      <div className="max-w-sm rounded-3xl border border-[#d8ece9] bg-white p-8 shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0F766E]">Operations workspace</p>
        <h1 className="mt-3 text-xl font-black text-[#092F2B]">Opening the secure admin console…</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Agent tools are available only to verified operations staff.</p>
      </div>
    </main>
  );
}
