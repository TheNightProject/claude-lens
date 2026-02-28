import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const HOME = os.homedir();

// Define all known config locations for Claude and AI tools
const CONFIG_TARGETS = [
  {
    id: 'claude-global-settings',
    name: 'Claude Global Settings',
    tool: 'Claude Code',
    category: 'config',
    paths: [
      path.join(HOME, '.claude.json'),
      path.join(HOME, '.claude', 'settings.json'),
      path.join(HOME, '.claude', 'settings.local.json'),
    ],
    icon: '⚙️',
  },
  {
    id: 'claude-credentials',
    name: 'Claude Credentials',
    tool: 'Claude Code',
    category: 'auth',
    paths: [
      path.join(HOME, '.claude', 'credentials.json'),
    ],
    icon: '🔑',
    sensitive: true,
  },
  {
    id: 'claude-projects',
    name: 'Claude Projects Config',
    tool: 'Claude Code',
    category: 'config',
    paths: [
      path.join(HOME, '.claude', 'projects'),
    ],
    isDirectory: true,
    icon: '📁',
  },
  {
    id: 'claude-mcp-global',
    name: 'MCP Servers (Global)',
    tool: 'MCP',
    category: 'mcp',
    paths: [
      path.join(HOME, '.claude', 'mcp_servers.json'),
      path.join(HOME, '.config', 'claude', 'mcp_servers.json'),
      path.join(HOME, '.claude.json'),
    ],
    icon: '🔌',
  },
  {
    id: 'cursor-settings',
    name: 'Cursor Settings',
    tool: 'Cursor',
    category: 'config',
    paths: [
      path.join(HOME, '.cursor', 'settings.json'),
      path.join(HOME, '.cursor', 'mcp.json'),
    ],
    icon: '📐',
  },
  {
    id: 'copilot-settings',
    name: 'GitHub Copilot Settings',
    tool: 'Copilot',
    category: 'config',
    paths: [
      path.join(HOME, '.config', 'github-copilot', 'hosts.json'),
      path.join(HOME, '.config', 'github-copilot', 'versions.json'),
    ],
    icon: '🤖',
  },
  {
    id: 'continue-config',
    name: 'Continue.dev Config',
    tool: 'Continue',
    category: 'config',
    paths: [
      path.join(HOME, '.continue', 'config.json'),
      path.join(HOME, '.continue', 'config.ts'),
    ],
    icon: '▶️',
  },
  {
    id: 'aider-config',
    name: 'Aider Config',
    tool: 'Aider',
    category: 'config',
    paths: [
      path.join(HOME, '.aider.conf.yml'),
      path.join(HOME, '.aider.model.settings.yml'),
    ],
    icon: '🛠️',
  },
  {
    id: 'cline-config',
    name: 'Cline / Roo Config',
    tool: 'Cline',
    category: 'config',
    paths: [
      path.join(HOME, '.vscode', 'extensions'),
    ],
    isDirectory: true,
    filterPattern: /saoud.*cline|roo-cline/i,
    icon: '🔶',
  },
  {
    id: 'openai-config',
    name: 'OpenAI API Config',
    tool: 'OpenAI',
    category: 'auth',
    paths: [
      path.join(HOME, '.config', 'openai', 'config.json'),
    ],
    icon: '🧠',
    sensitive: true,
  },
];

// Scan a single config target
async function scanTarget(target) {
  const result = {
    ...target,
    found: false,
    files: [],
    error: null,
  };

  for (const filePath of target.paths) {
    try {
      const stat = await fs.stat(filePath);

      if (target.isDirectory && stat.isDirectory()) {
        const entries = await fs.readdir(filePath, { withFileTypes: true });
        let items = entries;

        if (target.filterPattern) {
          items = entries.filter(e => target.filterPattern.test(e.name));
        }

        result.found = items.length > 0;
        result.files.push({
          path: filePath,
          type: 'directory',
          entries: items.slice(0, 20).map(e => ({
            name: e.name,
            isDirectory: e.isDirectory(),
          })),
          totalEntries: items.length,
          size: null,
          modifiedAt: stat.mtime.toISOString(),
        });
      } else if (stat.isFile()) {
        let content = null;
        let parsed = null;

        try {
          const raw = await fs.readFile(filePath, 'utf-8');
          // Don't expose sensitive file contents, just metadata
          if (target.sensitive) {
            content = '[REDACTED - sensitive]';
            try {
              const p = JSON.parse(raw);
              parsed = {
                _redacted: true,
                keys: Object.keys(p),
                keyCount: Object.keys(p).length,
              };
            } catch {}
          } else {
            content = raw;
            try {
              parsed = JSON.parse(raw);
            } catch {}
          }
        } catch (readErr) {
          content = `[unreadable: ${readErr.code}]`;
        }

        result.found = true;
        result.files.push({
          path: filePath,
          type: 'file',
          size: stat.size,
          modifiedAt: stat.mtime.toISOString(),
          content,
          parsed,
        });
      }
    } catch {
      // File/dir doesn't exist, skip
    }
  }

  return result;
}

// Scan for project-level CLAUDE.md files in common project directories
async function scanProjectFiles() {
  const projectDirs = [
    path.join(HOME, 'Projects'),
    path.join(HOME, 'projects'),
    path.join(HOME, 'dev'),
    path.join(HOME, 'Development'),
    path.join(HOME, 'code'),
    path.join(HOME, 'Code'),
    path.join(HOME, 'repos'),
    path.join(HOME, 'src'),
    path.join(HOME, 'workspace'),
    HOME,
  ];

  const claudeFiles = [];

  for (const dir of projectDirs) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        const projectPath = path.join(dir, entry.name);

        // Check for CLAUDE.md
        for (const fname of ['CLAUDE.md', '.claude/settings.json', '.claude/settings.local.json', '.claude/mcp_servers.json']) {
          const fpath = path.join(projectPath, fname);
          try {
            const stat = await fs.stat(fpath);
            if (stat.isFile()) {
              const content = await fs.readFile(fpath, 'utf-8');
              claudeFiles.push({
                project: entry.name,
                projectPath,
                file: fname,
                filePath: fpath,
                size: stat.size,
                modifiedAt: stat.mtime.toISOString(),
                content: content.slice(0, 5000), // Truncate large files
                truncated: content.length > 5000,
              });
            }
          } catch {}
        }
      }
    } catch {}
  }

  return claudeFiles;
}

// Scan for installed CLI tools
async function scanInstalledTools() {
  const { execSync } = await import('child_process');
  const tools = [
    { name: 'claude', command: 'claude --version', tool: 'Claude Code' },
    { name: 'cursor', command: 'cursor --version', tool: 'Cursor' },
    { name: 'aider', command: 'aider --version', tool: 'Aider' },
    { name: 'gh', command: 'gh --version', tool: 'GitHub CLI' },
    { name: 'node', command: 'node --version', tool: 'Node.js' },
    { name: 'npx', command: 'npx --version', tool: 'npx' },
  ];

  const results = [];
  for (const t of tools) {
    try {
      const version = execSync(t.command, { timeout: 5000, encoding: 'utf-8' }).trim();
      results.push({ ...t, installed: true, version });
    } catch {
      results.push({ ...t, installed: false, version: null });
    }
  }
  return results;
}

// Main scan function
export async function scanAll() {
  const [configs, projects, tools] = await Promise.all([
    Promise.all(CONFIG_TARGETS.map(scanTarget)),
    scanProjectFiles(),
    scanInstalledTools(),
  ]);

  const found = configs.filter(c => c.found);
  const missing = configs.filter(c => !c.found);

  // Extract MCP servers from found configs (mcp_servers.json style)
  const mcpServers = [];
  for (const config of found) {
    if (config.category === 'mcp') {
      for (const file of config.files) {
        if (file.parsed && !file.parsed._redacted) {
          // Skip ~/.claude.json here — its per-project mcpServers are extracted below
          if (file.path.endsWith('.claude.json')) continue;

          const servers = file.parsed.mcpServers || file.parsed;
          for (const [name, serverConfig] of Object.entries(servers)) {
            mcpServers.push({
              name,
              source: config.tool,
              sourceFile: file.path,
              config: serverConfig,
            });
          }
        }
      }
    }
  }

  // Extract MCP servers from ~/.claude.json per-project mcpServers
  try {
    const claudeJsonPath = path.join(HOME, '.claude.json');
    const raw = await fs.readFile(claudeJsonPath, 'utf-8');
    const claudeJson = JSON.parse(raw);
    if (claudeJson.projects) {
      for (const [projectPath, projectConfig] of Object.entries(claudeJson.projects)) {
        if (projectConfig.mcpServers && Object.keys(projectConfig.mcpServers).length > 0) {
          for (const [name, serverConfig] of Object.entries(projectConfig.mcpServers)) {
            mcpServers.push({
              name,
              source: 'Claude Code',
              sourceFile: claudeJsonPath,
              projectPath,
              config: serverConfig,
            });
          }
        }
      }
    }
  } catch {
    // ~/.claude.json doesn't exist or isn't parseable
  }

  return {
    timestamp: new Date().toISOString(),
    homeDir: HOME,
    summary: {
      totalTargets: configs.length,
      found: found.length,
      missing: missing.length,
      mcpServers: mcpServers.length,
      projectFiles: projects.length,
      installedTools: tools.filter(t => t.installed).length,
    },
    configs: found,
    missing,
    mcpServers,
    projects,
    tools,
  };
}
