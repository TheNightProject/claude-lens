import React from 'react';

export default function EmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6 opacity-20">⬡</div>
        <h2 className="text-xl font-semibold mb-2">No data yet</h2>
        <p className="text-sm text-lens-muted mb-6">
          claude-lens couldn't find any AI tool configurations on your system.
          Make sure you have Claude Code, Cursor, or other AI tools installed.
        </p>
        <div className="code-block text-xs text-left">
          <div className="text-lens-muted"># Install Claude Code</div>
          <div><span className="text-lens-accent">$</span> npm install -g @anthropic-ai/claude-code</div>
          <div className="mt-2 text-lens-muted"># Then rescan</div>
          <div><span className="text-lens-accent">$</span> claude-lens serve</div>
        </div>
      </div>
    </div>
  );
}
