import React from 'react';
import { Sparkles, History, FileText, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';
import { BackendHealthResponse } from '../types';

interface HeaderProps {
  health: BackendHealthResponse | null;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({ health, onOpenHistory, historyCount }) => {
  return (
    <header className="glass-panel" style={{ padding: '16px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
          }}>
            <FileText size={24} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(90deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Smart Resume Analyzer
              </h1>
              <span className="glass-pill" style={{ fontSize: '0.75rem', padding: '2px 8px', color: '#818cf8', borderColor: 'rgba(129, 140, 248, 0.3)' }}>
                PRO AI
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              ATS Resume Scoring, Job Matcher & Bullet Enhancer
            </p>
          </div>
        </div>

        {/* Status Indicators & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* AI Backend Status Badge */}
          <div className="glass-pill" style={{ fontSize: '0.82rem' }}>
            <Cpu size={15} color={health?.aiAvailable ? '#10b981' : '#f59e0b'} />
            <span>AI Backend:</span>
            {health?.aiAvailable ? (
              <span style={{ color: '#34d399', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Active (Gemini Connected)
              </span>
            ) : (
              <span style={{ color: '#fbbf24', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={13} /> Local Deterministic Mode
              </span>
            )}
          </div>

          {/* History Button */}
          <button className="btn-secondary" onClick={onOpenHistory}>
            <History size={16} />
            <span>History</span>
            {historyCount > 0 && (
              <span style={{
                background: 'var(--primary)',
                color: '#fff',
                borderRadius: '9999px',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}>
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
