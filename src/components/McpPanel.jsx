import React from 'react';
import JsonViewer from './JsonViewer';

function getServerType(config) {
  if (config.type) return config.type;
  if (config.command) return 'stdio';
  if (config.url) return 'sse';
  return 'unknown';
}

function getServerCommand(config) {
  if (config.command) {
    const args = config.args ? ` ${config.args.join(' ')}` : '';
    return `${config.command}${args}`;
  }
  if (config.url) return config.url;
  return '—';
}

export default function McpPanel({ servers, compact }) {
  const displayed = compact ? servers.slice(0, 4) : servers;

  if (servers.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2 mb-4">
          <span className="text-lens-accent">⬡</span>
          MCP Servers
          <span className="text-lens-muted font-mono text-xs">(0)</span>
        </h2>
        <div className="card text-center py-8">
          <div className="text-3xl mb-3 opacity-30">⬡</div>
          <p className="text-sm text-lens-muted">No MCP servers configured</p>
          <p className="text-xs text-lens-muted/60 font-mono mt-1">
            Add servers via Claude Code or ~/.claude/mcp_servers.json
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2 mb-4">
        <span className="text-lens-accent">⬡</span>
        MCP Servers
        <span className="text-lens-muted font-mono text-xs">({servers.length})</span>
      </h2>

      <div className="space-y-3">
        {displayed.map((server, i) => {
          const type = getServerType(server.config);
          const command = getServerCommand(server.config);

          return (
            <div key={`${server.name}-${i}`} className="card">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-lens-accentDim border border-lens-accent/20 flex items-center justify-center text-lens-accent text-xs font-bold font-mono">
                    {server.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold font-mono">{server.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge ${type === 'stdio' ? 'badge-blue' : 'badge-purple'}`}>
                        {type}
                      </span>
                      <span className="text-[11px] text-lens-muted font-mono">
                        {server.projectPath
                          ? server.projectPath.split('/').pop()
                          : server.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="code-block text-xs mt-3 flex items-start gap-2">
                <span className="text-lens-accent select-none">$</span>
                <span className="text-lens-text/80 break-all">{command}</span>
              </div>

              {server.config.env && !compact && (
                <div className="mt-2 text-xs font-mono text-lens-muted">
                  <span className="text-lens-yellow">env:</span>{' '}
                  {Object.keys(server.config.env).map((k) => (
                    <span key={k} className="mr-2">
                      {k}=<span className="text-lens-muted/40">•••</span>
                    </span>
                  ))}
                </div>
              )}

              {!compact && (
                <JsonViewer data={server.config} label="Full config" />
              )}
            </div>
          );
        })}
      </div>

      {compact && servers.length > 4 && (
        <p className="text-xs text-lens-muted font-mono mt-3 text-center">
          +{servers.length - 4} more servers →
        </p>
      )}
    </div>
  );
}
