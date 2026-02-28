#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const args = process.argv.slice(2);
const command = args[0] || 'serve';

switch (command) {
  case 'serve':
  case 'start':
    console.log('\n  ⬡ claude-lens\n');
    console.log('  Starting dashboard...\n');
    execSync('node server/index.js --production', {
      cwd: root,
      stdio: 'inherit',
    });
    break;

  case 'dev':
    execSync('npm run dev', {
      cwd: root,
      stdio: 'inherit',
    });
    break;

  case 'scan':
    import('../server/scanner.js').then(async ({ scanAll }) => {
      const data = await scanAll();
      console.log(JSON.stringify(data, null, 2));
    });
    break;

  default:
    console.log(`
  ⬡ claude-lens — local AI observability

  Commands:
    serve    Start the dashboard (default)
    dev      Start in development mode
    scan     Output scan results as JSON

  Usage:
    claude-lens serve     # http://localhost:3891
    claude-lens scan      # JSON output
    `);
}
