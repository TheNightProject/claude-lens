import express from 'express';
import cors from 'cors';
import { scanAll } from './scanner.js';
import { getSystemInfo } from './system.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.CLAUDE_LENS_PORT || 3891;
const isProduction = process.argv.includes('--production');

app.use(cors());
app.use(express.json());

// In production, serve the built frontend
if (isProduction) {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
}

// API Routes
app.get('/api/scan', async (req, res) => {
  try {
    const results = await scanAll();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/system', async (req, res) => {
  try {
    const info = await getSystemInfo();
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Catch-all for production SPA routing
if (isProduction) {
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\n  ⬡ claude-lens`);
  console.log(`  ├─ API:       http://localhost:${PORT}/api`);
  if (!isProduction) {
    console.log(`  ├─ Frontend:  http://localhost:5173`);
  } else {
    console.log(`  ├─ Dashboard: http://localhost:${PORT}`);
  }
  console.log(`  └─ Scanning local AI configs...\n`);
});
