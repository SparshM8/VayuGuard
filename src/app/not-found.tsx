import Link from 'next/link';
import { ArrowLeft, Wind } from 'lucide-react';

/** Clean fallback page for unmatched routes. */
export default function NotFoundPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
          <Wind className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The page you requested does not exist. Return to the live Urban Air Quality Navigator.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}
