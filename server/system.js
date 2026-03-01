const os = require('os');
const { execSync } = require('child_process');

async function getSystemInfo() {
  const platform = os.platform();
  const arch = os.arch();

  let shell = process.env.SHELL || 'unknown';
  let terminalApp = process.env.TERM_PROGRAM || 'unknown';

  // Try to get more info
  let gitUser = null;
  let gitEmail = null;
  try {
    gitUser = execSync('git config --global user.name', { encoding: 'utf-8', timeout: 3000 }).trim();
    gitEmail = execSync('git config --global user.email', { encoding: 'utf-8', timeout: 3000 }).trim();
  } catch {}

  return {
    platform,
    arch,
    hostname: os.hostname(),
    username: os.userInfo().username,
    homeDir: os.homedir(),
    shell,
    terminalApp,
    nodeVersion: process.version,
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024 * 10) / 10,
    freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024 * 10) / 10,
    uptime: Math.round(os.uptime() / 3600 * 10) / 10,
    git: {
      user: gitUser,
      email: gitEmail,
    },
  };
}

module.exports = { getSystemInfo };
