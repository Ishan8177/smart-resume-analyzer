import React from 'react';
import { X, History, Trash2, Calendar, FileText, ArrowUpRight, Award } from 'lucide-react';
import { AnalysisSession } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisSession[];
  onSelectSession: (session: AnalysisSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectSession,
  onDeleteSession,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: 'var(--bg-dark)',
          borderLeft: '1px solid var(--border-card)',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={20} color="var(--primary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analysis History</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Clear All Option */}
        {history.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <span>{history.length} saved sessions</span>
            <button
              onClick={onClearAll}
              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={14} /> Clear History
            </button>
          </div>
        )}

        {/* Sessions List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <FileText size={36} style={{ marginBottom: '12px', opacity: 0.5 }} />
              <p>No analysis history yet.</p>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>Upload a resume to save your first report!</p>
            </div>
          ) : (
            history.map((session) => (
              <div
                key={session.id}
                className="glass-panel"
                style={{ padding: '16px', cursor: 'pointer', position: 'relative' }}
                onClick={() => {
                  onSelectSession(session);
                  onClose();
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {session.fileName}
                      <ArrowUpRight size={14} color="var(--primary)" />
                    </h4>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {new Date(session.createdAt).toLocaleDateString()}
                      </span>
                      <span>• {session.fileType.toUpperCase()}</span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: session.atsResult.overallScore >= 75 ? '#34d399' : session.atsResult.overallScore >= 50 ? '#fbbf24' : '#f87171',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                  }}>
                    {session.atsResult.overallScore}%
                  </span>
                </div>

                {/* Job Match pill if present */}
                {session.jobMatchResult && session.jobMatchResult.matchScore > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '0.78rem', color: 'var(--accent-cyan)' }}>
                    🎯 Job Match: {session.jobMatchResult.matchScore}%
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-dim)',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
