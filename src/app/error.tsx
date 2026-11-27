'use client';

import { useEffect } from 'react';
import { RotateCw, TriangleAlert } from 'lucide-react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Next.js App Router route-level error boundary ensuring graceful recovery from runtime errors. */
export default function ErrorBoundary({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div
        role="alert"
        className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 shadow-lg text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <TriangleAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
        <p className="text-sm text-slate-600">
          VayuGuard AI encountered an unexpected issue while rendering air quality insights.
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <RotateCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </main>
  );
}
