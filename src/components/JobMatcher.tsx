import React, { useState } from 'react';
import { Target, Search, CheckCircle, AlertCircle, XCircle, Sparkles, ArrowRight } from 'lucide-react';
import { JobMatchResult } from '../types';
import { ScoreMeter } from './ScoreMeter';

interface JobMatcherProps {
  resumeText: string;
  onAnalyzeJobMatch: (jobDescriptionText: string) => void;
  jobMatchResult?: JobMatchResult;
  isAnalyzing: boolean;
}

export const JobMatcher: React.FC<JobMatcherProps> = ({
  resumeText,
  onAnalyzeJobMatch,
  jobMatchResult,
  isAnalyzing,
}) => {
  const [jobText, setJobText] = useState(jobMatchResult?.jobDescriptionText || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobText.trim()) {
      onAnalyzeJobMatch(jobText.trim());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Input Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
            <Target size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Job Description Comparison</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Paste a target job posting to analyze skill gaps and keyword overlap.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            rows={6}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste Job Title and Full Job Description text here (e.g. Senior Frontend Developer with React, TypeScript, GraphQL, AWS experience...)"
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.9rem',
              resize: 'vertical',
              outline: 'none',
              marginBottom: '16px',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={isAnalyzing || !jobText.trim()}
              style={{ background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #0284c7 100%)' }}
            >
              <Search size={18} />
              <span>{isAnalyzing ? 'Calculating Match Score...' : 'Calculate Job Match Score'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Match Results Display */}
      {jobMatchResult && jobMatchResult.totalRequiredCount > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Top Summary Bar */}
          <div className="glass-panel" style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
            <ScoreMeter
              score={jobMatchResult.matchScore}
              label="Job Match Score"
              sublabel={`${jobMatchResult.matchedCount} of ${jobMatchResult.totalRequiredCount} core skills matched`}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Keyword Coverage breakdown</h4>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Hard Skills & Tools</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{jobMatchResult.categoryBreakdown.hardSkillsScore}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${jobMatchResult.categoryBreakdown.hardSkillsScore}%`, background: 'var(--accent-cyan)', borderRadius: '3px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Soft Skills & Leadership</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{jobMatchResult.categoryBreakdown.softSkillsScore}%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }}>
                  <div style={{ height: '100%', width: `${jobMatchResult.categoryBreakdown.softSkillsScore}%`, background: 'var(--accent-emerald)', borderRadius: '3px' }} />
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '6px' }}>
                  <Sparkles size={16} /> Key Recommendation
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>
                  {jobMatchResult.keyRecommendations[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Missing & Matched Keyword Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Missing Keywords */}
            <div className="glass-panel" style={{ padding: '20px', borderTop: '4px solid #f43f5e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <XCircle size={20} color="#f87171" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f87171' }}>
                  Missing Required Keywords ({jobMatchResult.missingKeywords.length})
                </h4>
              </div>
              {jobMatchResult.missingKeywords.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {jobMatchResult.missingKeywords.map((k, idx) => (
                    <span key={idx} className="badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      + Add {k.keyword}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.88rem', color: '#34d399' }}>✓ All required hard skills found in your resume!</p>
              )}
            </div>

            {/* Matched Keywords */}
            <div className="glass-panel" style={{ padding: '20px', borderTop: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <CheckCircle size={20} color="#34d399" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                  Matched Keywords ({jobMatchResult.matchedKeywords.length})
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {jobMatchResult.matchedKeywords.map((k, idx) => (
                  <span key={idx} className="badge-green">
                    ✓ {k.keyword} ({k.frequencyInResume}x)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
