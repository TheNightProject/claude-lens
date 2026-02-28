import React, { useState } from 'react';

function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }

  const lines = json.split('\n');
  return lines.map((line, i) => {
    const highlighted = line
      .replace(/"([^"]+)"(?=\s*:)/g, '"<span class="key">$1</span>"')
      .replace(/:\s*"([^"]*)"(?=[,\n\r}]|$)/g, ': "<span class="string">$1</span>"')
      .replace(/:\s*(\d+\.?\d*)(?=[,\n\r}]|$)/g, ': <span class="number">$1</span>')
      .replace(/:\s*(true|false|null)(?=[,\n\r}]|$)/g, ': <span class="boolean">$1</span>');

    return (
      <div key={i} className="flex">
        <span className="select-none text-lens-muted/30 w-8 text-right mr-3 flex-shrink-0">
          {i + 1}
        </span>
        <span dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    );
  });
}

export default function JsonViewer({ data, label, maxHeight = '300px' }) {
  const [expanded, setExpanded] = useState(false);
  const json = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  const lineCount = json.split('\n').length;

  return (
    <div className="mt-3">
      {label && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-xs font-mono text-lens-muted hover:text-lens-text transition-colors mb-2"
        >
          <span className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
            ▸
          </span>
          {label}
          <span className="text-lens-muted/50">{lineCount} lines</span>
        </button>
      )}
      {(expanded || !label) && (
        <div
          className="code-block text-xs leading-relaxed overflow-auto"
          style={{ maxHeight }}
        >
          {syntaxHighlight(json)}
        </div>
      )}
    </div>
  );
}
