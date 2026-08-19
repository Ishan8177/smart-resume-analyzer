import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';
import { OverallScoreCard } from './components/OverallScoreCard';
import { StrengthsWeaknesses } from './components/StrengthsWeaknesses';
import { SectionAudit } from './components/SectionAudit';
import { JobMatcher } from './components/JobMatcher';
import { ResumeRewriter } from './components/ResumeRewriter';
import { HistoryDrawer } from './components/HistoryDrawer';

import { parsePdfFile } from './services/pdfParser';
import { parseDocxFile } from './services/docxParser';
import { segmentResumeText } from './services/resumeSegmenter';
import { calculateAtsScore } from './services/atsScorer';
import { matchJobDescription } from './services/jobMatcher';
import { checkBackendHealth, fetchAiAnalysis } from './services/apiService';
import { clearAllHistory, deleteSessionFromHistory, getHistory, saveSessionToHistory, updateSessionInHistory } from './services/historyStore';

import { AiAnalysisResult, AnalysisSession, AtsScoreResult, BackendHealthResponse, JobMatchResult, ResumeSections } from './types';
import { BarChart3, Target, Sparkles, ArrowLeft } from 'lucide-react';

export function App() {
  const [health, setHealth] = useState<BackendHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('Parsing document...');

  // Current session state
  const [currentSession, setCurrentSession] = useState<AnalysisSession | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'pdf' | 'docx'>('pdf');
  const [parsedSections, setParsedSections] = useState<ResumeSections | null>(null);
  const [atsResult, setAtsResult] = useState<AtsScoreResult | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<JobMatchResult | undefined>(undefined);
  const [aiResult, setAiResult] = useState<AiAnalysisResult | undefined>(undefined);
  
  // Navigation & Drawer
  const [activeTab, setActiveTab] = useState<'audit' | 'jobMatch' | 'aiRewrite'>('audit');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<AnalysisSession[]>([]);

  // Load backend health and history on mount
  useEffect(() => {
    checkBackendHealth().then(setHealth);
    setHistory(getHistory());
  }, []);

  // File Upload Processor
  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setLoadingStep('Extracting document text...');
    
    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (extension === 'pdf') {
        setFileType('pdf');
        extractedText = await parsePdfFile(file);
      } else {
        setFileType('docx');
        extractedText = await parseDocxFile(file);
      }

      setLoadingStep('Segmenting sections & computing ATS score...');
      const sections = segmentResumeText(extractedText);
      const ats = calculateAtsScore(sections);

      setFileName(file.name);
      setParsedSections(sections);
      setAtsResult(ats);
      setJobMatchResult(undefined);
      setAiResult(undefined);

      // Trigger AI Analysis
      setLoadingStep('Running AI semantic analysis...');
      const aiData = await fetchAiAnalysis(extractedText, sections);
      setAiResult(aiData);

      // Save to local history
      const savedSession = saveSessionToHistory({
        fileName: file.name,
        fileType: extension === 'pdf' ? 'pdf' : 'docx',
        fileSizeFormatted: `${(file.size / 1024).toFixed(1)} KB`,
        parsedSections: sections,
        atsResult: ats,
        aiResult: aiData,
      });

      setCurrentSession(savedSession);
      setHistory(getHistory());
      setActiveTab('audit');
    } catch (error: any) {
      console.error('File Analysis Error:', error);
      alert(error.message || 'Failed to process resume file.');
    } finally {
      setIsLoading(false);
    }
  };

  // Job Match Analyzer
  const handleJobMatch = (jobDescriptionText: string) => {
    if (!parsedSections) return;
    setIsLoading(true);
    setLoadingStep('Calculating job match score & skill gaps...');

    setTimeout(async () => {
      const matchRes = matchJobDescription(parsedSections.rawText, jobDescriptionText);
      setJobMatchResult(matchRes);

      let updatedAi = aiResult;
      // Also refresh AI with Job Description
      try {
        updatedAi = await fetchAiAnalysis(parsedSections.rawText, parsedSections, jobDescriptionText);
        setAiResult(updatedAi);
      } catch (err) {
        console.warn('AI job match enhancement error:', err);
      } finally {
        // Sync history session
        if (currentSession && atsResult) {
          const updated = {
            ...currentSession,
            jobMatchResult: matchRes,
            aiResult: updatedAi,
          };
          setCurrentSession(updated);
          setHistory(updateSessionInHistory(updated));
        }
        setIsLoading(false);
      }
    }, 400);
  };

  // Manual AI Refresh
  const handleRefreshAi = async () => {
    if (!parsedSections) return;
    setIsLoading(true);
    setLoadingStep('Refreshing AI suggestions...');
    try {
      const updatedAi = await fetchAiAnalysis(
        parsedSections.rawText, 
        parsedSections, 
        jobMatchResult?.jobDescriptionText
      );
      setAiResult(updatedAi);
      if (currentSession) {
        const updated = {
          ...currentSession,
          aiResult: updatedAi,
        };
        setCurrentSession(updated);
        setHistory(updateSessionInHistory(updated));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Restore session from history
  const handleSelectSession = (session: AnalysisSession) => {
    setCurrentSession(session);
    setFileName(session.fileName);
    setFileType(session.fileType);
    setParsedSections(session.parsedSections);
    setAtsResult(session.atsResult);
    setJobMatchResult(session.jobMatchResult);
    setAiResult(session.aiResult);
    setActiveTab('audit');
  };

  return (
    <div className="app-container">
      {/* Top Navigation & Status */}
      <Header
        health={health}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Upload Dropzone if no resume loaded */}
      {!parsedSections ? (
        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
          <FileUpload
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            loadingStep={loadingStep}
          />
        </div>
      ) : (
        <div>
          {/* Active Session Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <button
              className="btn-secondary"
              onClick={() => { setParsedSections(null); setAtsResult(null); setCurrentSession(null); }}
              style={{ fontSize: '0.85rem' }}
            >
              <ArrowLeft size={16} /> Upload Another Resume
            </button>

            {/* Main Tabs */}
            <div className="nav-tabs">
              <button
                className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
                onClick={() => setActiveTab('audit')}
              >
                <BarChart3 size={16} />
                <span>ATS Audit & Score</span>
              </button>

              <button
                className={`tab-btn ${activeTab === 'jobMatch' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobMatch')}
              >
                <Target size={16} />
                <span>Job Description Matcher</span>
                {jobMatchResult && jobMatchResult.matchScore > 0 && (
                  <span className="badge-green" style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                    {jobMatchResult.matchScore}%
                  </span>
                )}
              </button>

              <button
                className={`tab-btn ${activeTab === 'aiRewrite' ? 'active' : ''}`}
                onClick={() => setActiveTab('aiRewrite')}
              >
                <Sparkles size={16} />
                <span>AI Bullet Enhancer</span>
              </button>
            </div>
          </div>

          {/* Active Tab Views */}
          {activeTab === 'audit' && atsResult && (
            <div className="dashboard-grid">
              {/* Left Score Gauge Column */}
              <OverallScoreCard atsResult={atsResult} fileName={fileName || 'Resume.pdf'} />

              {/* Right Details Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <StrengthsWeaknesses atsResult={atsResult} />
                <SectionAudit sections={parsedSections} />
              </div>
            </div>
          )}

          {activeTab === 'jobMatch' && (
            <div style={{ marginTop: '20px' }}>
              <JobMatcher
                resumeText={parsedSections.rawText}
                onAnalyzeJobMatch={handleJobMatch}
                jobMatchResult={jobMatchResult}
                isAnalyzing={isLoading}
              />
            </div>
          )}

          {activeTab === 'aiRewrite' && (
            <div style={{ marginTop: '20px' }}>
              <ResumeRewriter
                aiResult={aiResult}
                onRefreshAi={handleRefreshAi}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectSession={handleSelectSession}
        onDeleteSession={(id) => setHistory(deleteSessionFromHistory(id))}
        onClearAll={() => { clearAllHistory(); setHistory([]); setCurrentSession(null); }}
      />
    </div>
  );
}
