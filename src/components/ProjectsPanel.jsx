import React, { useState } from 'react';

function formatPath(p) {
  return p.replace(/^\/home\/[^/]+/, '~');
}

const FILE_BADGES = {
  'CLAUDE.md': 'badge-orange',
  'settings.json': 'badge-blue',
  'settings.local.json': 'badge-purple',
  'mcp_servers.json': 'badge-green',
};

export default function ProjectsPanel({ projects, compact }) {
  const [expandedProject, setExpandedProject] = useState(null);

  // Group by project
  const grouped = {};
  for (const p of projects) {
    if (!grouped[p.project]) {
      grouped[p.project] = { path: p.projectPath, files: [] };
    }
    grouped[p.project].files.push(p);
  }

  const projectNames = Object.keys(grouped);
  const displayed = compact ? projectNames.slice(0, 5) : projectNames;

  if (projects.length === 0) {
    return (
      <div>
        <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2 mb-4">
          <span className="text-lens-blue">◧</span>
          Project Files
          <span className="text-lens-muted font-mono text-xs">(0)</span>
        </h2>
        <div className="card text-center py-8">
          <div className="text-3xl mb-3 opacity-30">◧</div>
          <p className="text-sm text-lens-muted">No project-level CLAUDE.md files found</p>
          <p className="text-xs text-lens-muted/60 font-mono mt-1">
            Scanned ~/Projects, ~/dev, ~/code, ~/repos, ~/src
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2 mb-4">
        <span className="text-lens-blue">◧</span>
        Project Files
        <span className="text-lens-muted font-mono text-xs">
          ({projectNames.length} projects, {projects.length} files)
        </span>
      </h2>

      <div className="space-y-2">
        {displayed.map((name) => {
          const proj = grouped[name];
          const isExpanded = expandedProject === name;

          return (
            <div key={name} className="card !p-0 overflow-hidden">
              <button
                onClick={() => setExpandedProject(isExpanded ? null : name)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📂</span>
                  <div>
                    <h3 className="text-sm font-semibold font-mono">{name}</h3>
                    <span className="text-[11px] text-lens-muted font-mono">
                      {formatPath(proj.path)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {proj.files.map((f, i) => (
                    <span
                      key={i}
                      className={`badge ${FILE_BADGES[f.file] || 'badge-blue'}`}
                    >
                      {f.file}
                    </span>
                  ))}
                  <span className={`text-lens-muted text-xs transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    ▸
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-lens-border p-4 space-y-4">
                  {proj.files.map((file, i) => (
                    <div key={i}>
                      <div className="flex items-center gap-2 text-xs font-mono text-lens-muted mb-2">
                        <span className={`badge ${FILE_BADGES[file.file] || 'badge-blue'}`}>
                          {file.file}
                        </span>
                        <span>{(file.size / 1024).toFixed(1)}KB</span>
                        {file.truncated && (
                          <span className="text-lens-yellow">(truncated)</span>
                        )}
                      </div>
                      <div className="code-block text-xs leading-relaxed max-h-64 overflow-auto">
                        <pre className="whitespace-pre-wrap">{file.content}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {compact && projectNames.length > 5 && (
        <p className="text-xs text-lens-muted font-mono mt-3 text-center">
          +{projectNames.length - 5} more projects →
        </p>
      )}
    </div>
  );
}
