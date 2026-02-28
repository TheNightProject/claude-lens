import React, { useState } from 'react';

export default function AdBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="ad-banner mb-6 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="ad-banner-logo">
            <span className="text-lg">✉</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-semibold text-lens-text">MailJunky</span>
              <span className="ad-sponsor-tag">Sponsor</span>
            </div>
            <p className="text-xs text-lens-muted truncate">
              Email API with AI-powered workflows. Describe automations in plain English, send with one API call. No bloat.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://mailjunky.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="ad-cta"
          >
            Learn more
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-lens-muted hover:text-lens-text transition-colors text-xs p-1"
            aria-label="Dismiss ad"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
