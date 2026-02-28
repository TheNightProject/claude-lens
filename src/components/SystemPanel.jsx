import React from 'react';

export default function SystemPanel({ system }) {
  if (!system) return null;

  const items = [
    { label: 'Platform', value: `${system.platform} / ${system.arch}` },
    { label: 'User', value: system.username },
    { label: 'Shell', value: system.shell },
    { label: 'Node', value: system.nodeVersion },
    { label: 'CPUs', value: system.cpus },
    { label: 'Memory', value: `${system.freeMemory}GB free / ${system.totalMemory}GB` },
    { label: 'Uptime', value: `${system.uptime}h` },
    ...(system.git.user ? [{ label: 'Git', value: `${system.git.user} <${system.git.email}>` }] : []),
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2 mb-4">
        <span className="text-lens-muted">⊡</span>
        System
      </h2>

      <div className="card !p-0 overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={`flex items-center justify-between px-4 py-2.5 text-xs ${
              i !== items.length - 1 ? 'border-b border-lens-border/50' : ''
            }`}
          >
            <span className="text-lens-muted">{item.label}</span>
            <span className="font-mono text-lens-text/80">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
