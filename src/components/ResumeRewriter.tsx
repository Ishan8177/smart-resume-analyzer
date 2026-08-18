import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { AiAnalysisResult } from '../types';

interface ResumeRewriterProps {
  aiResult?: AiAnalysisResult;
  onRefreshAi: () => void;
  isLoading: boolean;
}

export const ResumeRewriter: React.FC<ResumeRewriterProps> = ({
  aiResult,
  onRefreshAi,
  isLoading,
}) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!aiResult) {
    return (
      <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center' }}>
        <Sparkles size={40} color="var(--primary)" style={{ marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>AI Resume Bullet Enhancer</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
          Upload a resume to automatically generate AI bullet rewrites and ATS optimization suggestions.
        </p>
        <button className="btn-primary" onClick={onRefreshAi} disabled={isLoading}>
          <RefreshCw size={16} className={isLoading ? 'spin-loader' : ''} />
          <span>{isLoading ? 'Generating Suggestions...' : 'Generate AI Bullet Enhancements'}</span>
        </button>
      </div>
    );
  }

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleCopyAll = () => {
    const allImproved = aiResult.rephrasedBullets.map(b => `• ${b.improved}`).join('\n\n');
    navigator.clipboard.writeText(allImproved);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '12px', borderRadius: '14px', background: 'var(--primary)', color: '#fff' }}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Resume Bullet Optimizer</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {aiResult.summaryReview}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-secondary" onClick={handleCopyAll}>
              {copiedAll ? <Check size={16} color="#34d399" /> : <Copy size={16} />}
              <span>{copiedAll ? 'Copied All!' : 'Copy All Enhanced Bullets'}</span>
            </button>

            <button className="btn-primary" onClick={onRefreshAi} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? 'spin-loader' : ''} />
              <span>Re-analyze</span>
            </button>
          </div>
        </div>

        {/* Non-hallucination guarantee pill */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', width: 'fit-content' }}>
          <ShieldCheck size={16} />
          <span><strong>Fact-Preserving AI Policy:</strong> Suggestions enhance action-verb impact without fabricating experience or titles.</span>
        </div>
      </div>

      {/* Rephrased Bullets Diff Viewer */}
      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
        Suggested Bullet Point Enhancements ({aiResult.rephrasedBullets.length})
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {aiResult.rephrasedBullets.map((item, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '20px' }}>
            {/* Diff Comparison Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '14px' }}>
              {/* Original Bullet */}
              <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Original Bullet Point
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
                  • {item.original}
                </p>
              </div>

              {/* Improved Bullet */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '14px', borderRadius: 'var(--radius-md)', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ✨ AI ATS-Optimized Bullet
                  </span>
                  <button
                    onClick={() => handleCopyBullet(item.improved, idx)}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedIdx === idx ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                    {copiedIdx === idx ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', fontWeight: 600, marginTop: '6px', lineHeight: '1.5' }}>
                  • {item.improved}
                </p>
              </div>
            </div>

            {/* Reason Pill */}
            <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowRight size={14} color="var(--primary)" />
              <span><strong>Why this helps ATS:</strong> {item.reason}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tailored Recommendations */}
      {aiResult.tailoredSuggestions && aiResult.tailoredSuggestions.length > 0 && (
        <div className="glass-panel" style={{ padding: '24px', borderTop: '4px solid var(--primary)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            Actionable Strategic Recommendations
          </h4>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
            {aiResult.tailoredSuggestions.map((sug, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>📌</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
