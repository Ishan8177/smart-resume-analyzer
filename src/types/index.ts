export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ResumeSections {
  contact: ContactInfo;
  summary: string;
  experience: string[];
  education: string[];
  skills: string[];
  projects: string[];
  certifications: string[];
  rawText: string;
  detectedSections?: string[];
}

export interface AtsSubScore {
  score: number;
  label: string;
  weight: number;
  details: string[];
  status: 'good' | 'warning' | 'poor';
}

export interface AtsScoreResult {
  overallScore: number;
  tier: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical Issues';
  subScores: {
    formatting: AtsSubScore;
    keywords: AtsSubScore;
    impactVerbs: AtsSubScore;
    quantifiableMetrics: AtsSubScore;
    structure: AtsSubScore;
  };
  strengths: string[];
  weaknesses: string[];
  formattingIssues: string[];
  wordCount: number;
  readingTimeMinutes: number;
}

export interface KeywordMatch {
  keyword: string;
  category: 'Hard Skill' | 'Soft Skill' | 'Tool' | 'Domain';
  status: 'found' | 'missing' | 'weak';
  frequencyInResume: number;
  frequencyInJob: number;
}

export interface JobMatchResult {
  matchScore: number;
  jobTitle?: string;
  jobDescriptionText: string;
  matchedKeywords: KeywordMatch[];
  missingKeywords: KeywordMatch[];
  weakKeywords: KeywordMatch[];
  matchedCount: number;
  totalRequiredCount: number;
  categoryBreakdown: {
    hardSkillsScore: number;
    softSkillsScore: number;
    toolsScore: number;
  };
  keyRecommendations: string[];
}

export interface RephrasedBullet {
  original: string;
  improved: string;
  reason: string;
}

export interface BulletDiagnostics {
  totalCandidateLines: number;
  acceptedBulletsCount: number;
  detectedSections: string[];
}

export interface AiAnalysisResult {
  summaryReview: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  rephrasedBullets: RephrasedBullet[];
  tailoredSuggestions: string[];
  aiMatchReasoning?: string;
  diagnostics?: BulletDiagnostics;
}

export interface AnalysisSession {
  id: string;
  createdAt: string;
  fileName: string;
  fileType: 'pdf' | 'docx';
  fileSizeFormatted: string;
  parsedSections: ResumeSections;
  atsResult: AtsScoreResult;
  jobMatchResult?: JobMatchResult;
  aiResult?: AiAnalysisResult;
}

export interface BackendHealthResponse {
  status: string;
  timestamp: string;
  aiAvailable: boolean;
  message: string;
}
