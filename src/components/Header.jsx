import React from 'react';

export default function Header({ lastScan, onRefresh, loading }) {
  return (
    <header className="sticky top-0 z-40 bg-lens-bg/80 backdrop-blur-xl border-b border-lens-border" style={{ WebkitAppRegion: 'drag' }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between pl-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lens-accent to-orange-600 flex items-center justify-center text-black font-bold text-sm">
              ⬡
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-lens-green border-2 border-lens-bg" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">
              claude-lens
            </h1>
            <p className="text-[11px] text-lens-muted font-mono -mt-0.5">
              local AI observability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastScan && (
            <span className="text-xs text-lens-muted font-mono hidden sm:block">
              scanned {lastScan.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{ WebkitAppRegion: 'no-drag' }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium font-mono
              border border-lens-border hover:border-lens-accent/40 hover:bg-lens-accentDim
              transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={loading ? 'animate-spin' : ''}>⟳</span>
            {loading ? 'Scanning...' : 'Rescan'}
          </button>
        </div>
      </div>
    </header>
  );
}
