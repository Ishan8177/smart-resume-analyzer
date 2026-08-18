import React, { useState } from 'react';
import { ResumeSections } from '../types';
import { User, FileText, Briefcase, GraduationCap, Wrench, FolderGit2, Award } from 'lucide-react';

interface SectionAuditProps {
  sections: ResumeSections;
}

export const SectionAudit: React.FC<SectionAuditProps> = ({ sections }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'contact'>('experience');

  const tabs = [
    { id: 'experience', label: 'Experience', icon: Briefcase, count: sections.experience.length },
    { id: 'skills', label: 'Skills', icon: Wrench, count: sections.skills.length },
    { id: 'summary', label: 'Summary', icon: FileText, count: sections.summary ? 1 : 0 },
    { id: 'education', label: 'Education', icon: GraduationCap, count: sections.education.length },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: sections.projects.length },
    { id: 'contact', label: 'Contact', icon: User, count: 1 },
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>
        Parsed Section Audit
      </h3>

      {/* Sub-tabs */}
      <div className="nav-tabs" style={{ marginBottom: '20px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span style={{ opacity: 0.7, fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '1px 6px', borderRadius: '4px' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Section Content Display */}
      <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)', minHeight: '220px' }}>
        {activeTab === 'experience' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              Work Experience ({sections.experience.length} parsed items)
            </h4>
            {sections.experience.length > 0 ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', listStyle: 'none' }}>
                {sections.experience.map((item, idx) => (
                  <li key={idx} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No distinct Work Experience section detected.</p>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '12px' }}>
              Skills & Proficiencies
            </h4>
            {sections.skills.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {sections.skills.map((skill, idx) => (
                  <span key={idx} className="glass-pill" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No dedicated skills list detected.</p>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '12px' }}>
              Professional Summary / Objective
            </h4>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              {sections.summary || 'No summary text detected at the top of the resume.'}
            </p>
          </div>
        )}

        {activeTab === 'education' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '12px' }}>
              Education & Academic Credentials
            </h4>
            {sections.education.length > 0 ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                {sections.education.map((edu, idx) => (
                  <li key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                    🎓 {edu}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No Education section found.</p>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a855f7', marginBottom: '12px' }}>
              Projects & Portfolio Highlights
            </h4>
            {sections.projects.length > 0 ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                {sections.projects.map((proj, idx) => (
                  <li key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                    🚀 {proj}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No Projects section detected.</p>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px' }}>
              Extracted Contact Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Name</div>
                <div style={{ fontWeight: 700 }}>{sections.contact.name || 'Not detected'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email</div>
                <div style={{ fontWeight: 700, color: sections.contact.email ? '#34d399' : '#f87171' }}>
                  {sections.contact.email || 'Missing'}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</div>
                <div style={{ fontWeight: 700 }}>{sections.contact.phone || 'Missing'}</div>
              </div>
              {sections.contact.linkedin && (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>LinkedIn</div>
                  <a href={sections.contact.linkedin} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', fontSize: '0.85rem' }}>
                    {sections.contact.linkedin}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
