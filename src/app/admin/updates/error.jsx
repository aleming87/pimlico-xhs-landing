"use client";

export default function UpdatesError({ error, reset }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800/80 rounded-2xl border border-red-500/30 p-8 max-w-lg w-full text-center">
        <span className="text-4xl mb-4 block">⚠️</span>
        <h2 className="text-xl font-medium text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-4">
          {error?.message || 'An unexpected error occurred in the Email Updates page.'}
        </p>
        <pre className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-red-400 mb-6 text-left overflow-auto max-h-40">
          {error?.stack || String(error)}
        </pre>
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-500 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
