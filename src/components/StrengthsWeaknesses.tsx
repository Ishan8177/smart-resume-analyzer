import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb, ShieldAlert } from 'lucide-react';
import { AtsScoreResult } from '../types';

interface StrengthsWeaknessesProps {
  atsResult: AtsScoreResult;
}

export const StrengthsWeaknesses: React.FC<StrengthsWeaknessesProps> = ({ atsResult }) => {
  const { strengths, weaknesses, formattingIssues } = atsResult;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
      {/* Strengths Card */}
      <div className="glass-panel" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Resume Strengths</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{strengths.length} items passing ATS checks</p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {strengths.map((str, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
              <span style={{ color: '#34d399', fontWeight: 800, marginTop: '2px' }}>✓</span>
              <span style={{ color: 'var(--text-main)' }}>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses Card */}
      <div className="glass-panel" style={{ padding: '20px', borderTop: '4px solid #f59e0b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Areas for Improvement</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{weaknesses.length} items flagged for polish</p>
          </div>
        </div>

        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {weaknesses.map((weak, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem' }}>
              <span style={{ color: '#fbbf24', fontWeight: 800, marginTop: '2px' }}>!</span>
              <span style={{ color: 'var(--text-main)' }}>{weak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Formatting & Parser Alerts */}
      {formattingIssues.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px', borderTop: '4px solid #f43f5e', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', color: '#f87171' }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f87171' }}>Formatting Warnings</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Issues that might cause ATS parsing failures</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {formattingIssues.map((issue, idx) => (
              <span key={idx} className="badge-red" style={{ fontSize: '0.85rem' }}>
                ⚠️ {issue}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
