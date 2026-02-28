import React, { useState } from 'react';
import JsonViewer from './JsonViewer';

function formatPath(p, homeDir) {
  return p.replace(homeDir || '', '~');
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TOOL_COLORS = {
  'Claude Code': 'badge-orange',
  'MCP': 'badge-blue',
  'Cursor': 'badge-purple',
  'Copilot': 'badge-green',
  'Continue': 'badge-green',
  'Aider': 'badge-yellow',
  'Cline': 'badge-red',
  'OpenAI': 'badge-green',
};

function ConfigCard({ config, homeDir }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <div>
            <h3 className="text-sm font-semibold">{config.name}</h3>
            <span className={`badge ${TOOL_COLORS[config.tool] || 'badge-blue'} mt-1`}>
              {config.tool}
            </span>
          </div>
        </div>
        <span className="badge badge-green">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
          found
        </span>
      </div>

      {config.files.map((file, i) => (
        <div key={i} className="mt-3">
          <div className="flex items-center gap-3 text-xs font-mono text-lens-muted">
            <span className="text-lens-text/60">{formatPath(file.path, homeDir)}</span>
            <span>·</span>
            <span>{formatSize(file.size)}</span>
            {file.modifiedAt && (
              <>
                <span>·</span>
                <span>{timeAgo(file.modifiedAt)}</span>
              </>
            )}
          </div>

          {file.type === 'directory' && (
            <div className="mt-2 text-xs font-mono text-lens-muted">
              <span className="text-lens-muted/60">{file.totalEntries} items</span>
              <div className="mt-1.5 space-y-0.5">
                {file.entries.slice(0, 8).map((e, j) => (
                  <div key={j} className="flex items-center gap-1.5 text-lens-text/50">
                    <span className="text-[10px]">{e.isDirectory ? '📁' : '📄'}</span>
                    <span className="truncate">{e.name}</span>
                  </div>
                ))}
                {file.totalEntries > 8 && (
                  <div className="text-lens-muted/50 pt-0.5">+{file.totalEntries - 8} more</div>
                )}
              </div>
            </div>
          )}

          {file.parsed && !file.parsed._redacted && (
            <JsonViewer data={file.parsed} label="View contents" />
          )}

          {file.parsed?._redacted && (
            <div className="mt-2 text-xs font-mono text-lens-yellow/70 flex items-center gap-2">
              <span>🔒</span>
              Sensitive file — {file.parsed.keyCount} keys: [{file.parsed.keys.join(', ')}]
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MissingCard({ config, homeDir }) {
  return (
    <div className="card opacity-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl grayscale">{config.icon}</span>
          <div>
            <h3 className="text-sm font-medium text-lens-muted">{config.name}</h3>
            <span className="text-[11px] font-mono text-lens-muted/60">{config.tool}</span>
          </div>
        </div>
        <span className="badge badge-red">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400/50" />
          not found
        </span>
      </div>
      <div className="mt-2 text-[11px] font-mono text-lens-muted/50">
        {config.paths.map((p, i) => (
          <div key={i}>{formatPath(p, homeDir)}</div>
        ))}
      </div>
    </div>
  );
}

export default function ConfigPanel({ configs, missing, compact, homeDir }) {
  const displayed = compact ? configs.slice(0, 4) : configs;
  const missingDisplayed = compact ? [] : (missing || []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2">
          <span className="text-lens-accent">⚙</span>
          Configuration Files
          <span className="text-lens-muted font-mono text-xs">({configs.length})</span>
        </h2>
      </div>

      <div className="space-y-3">
        {displayed.map((config) => (
          <ConfigCard key={config.id} config={config} homeDir={homeDir} />
        ))}
      </div>

      {compact && configs.length > 4 && (
        <p className="text-xs text-lens-muted font-mono mt-3 text-center">
          +{configs.length - 4} more configs →
        </p>
      )}

      {missingDisplayed.length > 0 && (
        <>
          <div className="glow-line my-6" />
          <h3 className="text-xs font-mono text-lens-muted mb-3 uppercase tracking-wider">
            Not Detected
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {missingDisplayed.map((config) => (
              <MissingCard key={config.id} config={config} homeDir={homeDir} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
