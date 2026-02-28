import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SummaryBar from './components/SummaryBar';
import ConfigPanel from './components/ConfigPanel';
import McpPanel from './components/McpPanel';
import ProjectsPanel from './components/ProjectsPanel';
import ToolsPanel from './components/ToolsPanel';
import SystemPanel from './components/SystemPanel';
import EmptyState from './components/EmptyState';
import AdBanner from './components/AdBanner';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'configs', label: 'Configs', icon: '⚙' },
  { id: 'mcp', label: 'MCP Servers', icon: '⬡' },
  { id: 'projects', label: 'Projects', icon: '◧' },
  { id: 'tools', label: 'Tools', icon: '▣' },
];

export default function App() {
  const [scanData, setScanData] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastScan, setLastScan] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scanRes, sysRes] = await Promise.all([
        fetch('/api/scan'),
        fetch('/api/system'),
      ]);

      if (!scanRes.ok || !sysRes.ok) throw new Error('API request failed');

      const scan = await scanRes.json();
      const sys = await sysRes.json();

      setScanData(scan);
      setSystemData(sys);
      setLastScan(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="card max-w-md w-full text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Connection Failed</h2>
          <p className="text-lens-muted text-sm mb-4">
            Could not connect to the claude-lens API server.
            <br />Make sure the server is running on port 3891.
          </p>
          <code className="code-block text-xs block mb-4">npm run dev:server</code>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-lens-accent text-black rounded-lg font-medium text-sm hover:bg-orange-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="noise-overlay" />

      <Header lastScan={lastScan} onRefresh={fetchData} loading={loading} />

      {loading && !scanData ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 text-lens-accent font-mono text-sm">
              <span className="animate-scan-line">▊</span>
              Scanning local configs...
            </div>
          </div>
        </div>
      ) : scanData ? (
        <main className="max-w-7xl mx-auto px-6 pt-6 pb-12">
          <SummaryBar summary={scanData.summary} />

          <AdBanner />

          {/* Tab navigation */}
          <nav className="flex items-center gap-1 mb-6 border-b border-lens-border pb-px overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-lens-accent'
                    : 'text-lens-muted hover:text-lens-text'
                }`}
              >
                <span className="text-xs">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-lens-accent" />
                )}
              </button>
            ))}
          </nav>

          {/* Tab content */}
          <div className="animate-fade-in">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <ConfigPanel configs={scanData.configs} homeDir={scanData.homeDir} compact />
                  <McpPanel servers={scanData.mcpServers} compact />
                </div>
                <div className="space-y-6">
                  <ToolsPanel tools={scanData.tools} compact />
                  <ProjectsPanel projects={scanData.projects} compact />
                  <SystemPanel system={systemData} />
                </div>
              </div>
            )}

            {activeTab === 'configs' && (
              <ConfigPanel configs={scanData.configs} missing={scanData.missing} homeDir={scanData.homeDir} />
            )}

            {activeTab === 'mcp' && (
              <McpPanel servers={scanData.mcpServers} />
            )}

            {activeTab === 'projects' && (
              <ProjectsPanel projects={scanData.projects} />
            )}

            {activeTab === 'tools' && (
              <ToolsPanel tools={scanData.tools} />
            )}
          </div>
        </main>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
