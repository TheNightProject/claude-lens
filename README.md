# ⬡ claude-lens
<img width="1329" height="1351" alt="image" src="https://github.com/user-attachments/assets/84fc0f30-9f19-4f54-9e5f-cb131f5bb968" />


**Local observability dashboard for Claude & AI developer tooling.**

See what's configured, what's running, and what's connected — all from one place.

![claude-lens](https://img.shields.io/badge/version-0.1.0-orange) ![License](https://img.shields.io/badge/license-MIT-blue) ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

---

## What it does

`claude-lens` scans your local machine for AI tool configurations and presents them in a clean dashboard. No data leaves your machine — everything runs locally.

### Currently detects

| Tool | What it finds |
|---|---|
| **Claude Code** | Global settings, credentials (redacted), project configs |
| **MCP Servers** | All configured MCP servers, their transport type and args |
| **Cursor** | Settings, MCP configuration |
| **GitHub Copilot** | Host configuration |
| **Continue.dev** | Config files (JSON/TS) |
| **Aider** | Config and model settings |
| **Cline / Roo** | VS Code extension detection |
| **OpenAI** | API config (redacted) |

It also scans for **project-level** `CLAUDE.md` files and `.claude/` directories across your common project folders.

---

## Quick Start

```bash
# Clone
git clone https://github.com/thenightproject/claude-lens.git
cd claude-lens

# Install
npm install

# Run
npm run dev
```

Then open **http://localhost:5173**

### Production mode

```bash
npm run build
npm run serve
# → http://localhost:3891
```

### CLI-only scan (JSON output)

```bash
node bin/cli.js scan
```

---

## Architecture

```
claude-lens/
├── server/
│   ├── index.js          # Express API server
│   ├── scanner.js        # Filesystem scanner for AI configs
│   └── system.js         # System info collector
├── src/
│   ├── App.jsx           # Main dashboard
│   ├── components/
│   │   ├── Header.jsx       # Top bar with scan controls
│   │   ├── SummaryBar.jsx   # Metric cards
│   │   ├── ConfigPanel.jsx  # Config file viewer
│   │   ├── McpPanel.jsx     # MCP server dashboard
│   │   ├── ProjectsPanel.jsx # Project-level configs
│   │   ├── ToolsPanel.jsx   # Installed tools grid
│   │   ├── SystemPanel.jsx  # System info
│   │   ├── JsonViewer.jsx   # Syntax-highlighted JSON
│   │   └── EmptyState.jsx   # Zero-state
│   ├── main.jsx
│   └── index.css
├── bin/
│   └── cli.js            # CLI entry point
└── package.json
```

**Backend:** Node.js + Express — scans `$HOME` for known config paths, detects installed CLI tools, finds project-level Claude files.

**Frontend:** React + Vite + Tailwind — dark, terminal-inspired dashboard with tabs for configs, MCP servers, projects, and tools.

---

## Privacy & Security

- **Zero network calls** — all scanning is local filesystem reads
- **Sensitive files are redacted** — credentials and API keys show only key names, never values
- **No telemetry** — nothing phones home, ever
- **You control the port** — set `CLAUDE_LENS_PORT` to change from default 3891

---

## Roadmap

- [ ] **Watch mode** — live-reload when configs change (fs.watch)
- [ ] **TUI mode** — `claude-lens status` for quick terminal summary
- [ ] **Cost tracking** — parse Claude Code usage logs for token/cost data
- [ ] **MCP health checks** — ping configured servers to check connectivity
- [ ] **Config editor** — edit settings.json and mcp_servers.json from the dashboard
- [ ] **Diff view** — show what changed between scans
- [ ] **Export** — dump full config audit as JSON/Markdown
- [ ] **Plugin system** — add custom scanners for new tools
- [ ] **VS Code extension** — sidebar panel version

---

## Contributing

PRs welcome. The scanner is designed to be extensible — adding a new tool is as simple as adding an entry to `CONFIG_TARGETS` in `server/scanner.js`.

```js
{
  id: 'my-tool',
  name: 'My AI Tool',
  tool: 'MyTool',
  category: 'config',
  paths: [path.join(HOME, '.mytool', 'config.json')],
  icon: '🔧',
}
```

---

## License

MIT — [The Night Project](https://github.com/thenightproject)
