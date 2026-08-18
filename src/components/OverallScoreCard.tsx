import React from 'react';
import { AtsScoreResult } from '../types';
import { ScoreMeter } from './ScoreMeter';
import { FileText, Clock, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface OverallScoreCardProps {
  atsResult: AtsScoreResult;
  fileName: string;
}

export const OverallScoreCard: React.FC<OverallScoreCardProps> = ({ atsResult, fileName }) => {
  const { overallScore, tier, subScores, wordCount, readingTimeMinutes } = atsResult;

  const subScoreList = [
    subScores.impactVerbs,
    subScores.keywords,
    subScores.quantifiableMetrics,
    subScores.structure,
    subScores.formatting,
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Current Resume
          </span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{fileName}</h3>
        </div>
        <span className={tier === 'Excellent' ? 'badge-green' : tier === 'Good' ? 'badge-amber' : 'badge-red'}>
          {tier}
        </span>
      </div>

      {/* Main Score Radial Gauge */}
      <div style={{ padding: '16px 0', borderBottom: '1px solid var(--border-card)', marginBottom: '20px' }}>
        <ScoreMeter score={overallScore} label="Overall ATS Score" sublabel={`Tier: ${tier}`} />
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FileText size={18} color="#818cf8" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Word Count</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{wordCount} words</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Clock size={18} color="#38bdf8" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reading Time</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>~{readingTimeMinutes} min</div>
          </div>
        </div>
      </div>

      {/* Sub-scores Progress Bars */}
      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
        ATS Dimension Breakdown
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {subScoreList.map((sub, idx) => (
          <div key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{sub.label}</span>
              <span style={{ fontWeight: 700, color: sub.score >= 75 ? '#34d399' : sub.score >= 50 ? '#fbbf24' : '#f87171' }}>
                {sub.score}%
              </span>
            </div>
            <div style={{ height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${sub.score}%`,
                  background: sub.score >= 75 ? 'var(--accent-emerald)' : sub.score >= 50 ? 'var(--accent-amber)' : 'var(--accent-rose)',
                  borderRadius: '4px',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
