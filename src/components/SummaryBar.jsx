import React from 'react';

const metrics = [
  { key: 'found', label: 'Configs Found', icon: '◈', color: 'text-lens-green' },
  { key: 'mcpServers', label: 'MCP Servers', icon: '⬡', color: 'text-lens-accent' },
  { key: 'projectFiles', label: 'Project Files', icon: '◧', color: 'text-lens-blue' },
  { key: 'installedTools', label: 'AI Tools', icon: '▣', color: 'text-lens-purple' },
  { key: 'missing', label: 'Not Found', icon: '○', color: 'text-lens-muted' },
];

export default function SummaryBar({ summary }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
      {metrics.map((m, i) => (
        <div
          key={m.key}
          className={`card flex items-center gap-3 opacity-0 animate-slide-up stagger-${i + 1}`}
        >
          <span className={`text-lg ${m.color}`}>{m.icon}</span>
          <div>
            <div className="text-xl font-semibold font-mono">{summary[m.key]}</div>
            <div className="text-[11px] text-lens-muted">{m.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
