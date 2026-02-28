import React from 'react';

const TOOL_ICONS = {
  'Claude Code': '⬡',
  'Cursor': '📐',
  'Aider': '🛠️',
  'GitHub CLI': '🐙',
  'Node.js': '💚',
  'npx': '📦',
};

const TOOL_COLORS = {
  'Claude Code': 'from-orange-500/20 to-orange-600/5 border-orange-500/20',
  'Cursor': 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
  'Aider': 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/20',
  'GitHub CLI': 'from-gray-500/20 to-gray-600/5 border-gray-500/20',
  'Node.js': 'from-green-500/20 to-green-600/5 border-green-500/20',
  'npx': 'from-blue-500/20 to-blue-600/5 border-blue-500/20',
};

export default function ToolsPanel({ tools, compact }) {
  const displayed = compact ? tools : tools;

  return (
    <div>
      <h2 className="text-sm font-semibold text-lens-text flex items-center gap-2 mb-4">
        <span className="text-lens-purple">▣</span>
        Installed Tools
        <span className="text-lens-muted font-mono text-xs">
          ({tools.filter(t => t.installed).length}/{tools.length})
        </span>
      </h2>

      <div className={compact ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'}>
        {displayed.map((tool) => (
          <div
            key={tool.name}
            className={`card !p-3 bg-gradient-to-br ${
              tool.installed
                ? TOOL_COLORS[tool.tool] || 'from-gray-500/10 to-gray-600/5 border-gray-500/10'
                : 'from-transparent to-transparent opacity-40'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-lg">
                {TOOL_ICONS[tool.tool] || '◇'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold truncate">{tool.tool}</div>
                {tool.installed ? (
                  <div className="text-[11px] font-mono text-lens-muted truncate">
                    {tool.version?.split('\n')[0]?.slice(0, 40)}
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-lens-muted/50">
                    not installed
                  </div>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                tool.installed ? 'bg-lens-green' : 'bg-lens-muted/30'
              }`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
