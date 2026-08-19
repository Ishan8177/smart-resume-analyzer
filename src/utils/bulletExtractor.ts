import { BulletDiagnostics, ResumeSections } from '../types/index.js';

const BULLET_PREFIX_REGEX = /^(?:[•●▪■◆❖➢\-\*\–\—\s]+|(?:\d+|[a-zA-Z])[\.\)]\s*|\[\d+\]\s*)/;

const SECTION_HEADER_REGEX = /^(?:work\s+experience|professional\s+experience|experience|employment\s+history|career\s+history|education|academic\s+background|technical\s+skills|skills|projects|personal\s+projects|certifications|professional\s+summary|summary|profile|contact\s+info|contact|overview|objective|qualifications|employment|internships|work\s+history|career\s+highlights)[:\-\—\s]*$/i;

const CONTACT_REGEX = /(?:@|phone|linkedin\.com|github\.com|http|www\.|\+?\d{3}[\s.-]\d{3})/i;

const EDUCATION_REGEX = /(?:bachelor|master|ph\.d|degree|university|college|gpa:|graduated|magna\s+cum\s+laude)/i;

const DATE_ONLY_REGEX = /^(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[0-9]{2})\s*[-–—/]?\s*)*(?:[0-9]{4})\s*[-–—]\s*(?:present|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[0-9]{2})\s*[-–—/]?\s*(?:[0-9]{4}))$/i;

const PURE_SKILL_LIST_REGEX = /^(?:[a-zA-Z0-9.#+/\-\s]{2,25}(?:,\s*|\s*\|\s*)){3,}[a-zA-Z0-9.#+/\-\s]{2,25}$/;

export interface ExtractionResult {
  bullets: string[];
  diagnostics: BulletDiagnostics;
}

/**
 * Single authoritative bullet extraction implementation.
 * Robustly extracts candidate bullet points from a resume and returns diagnostic metrics.
 */
export function extractBulletPointsDetailed(sections: ResumeSections): ExtractionResult {
  const candidateLines: string[] = [];
  let totalCandidatesScanned = 0;

  // Combine lines from Experience & Projects sections
  const primarySources = [
    ...(sections.experience || []),
    ...(sections.projects || [])
  ];

  let rawLinesToScan: string[] = [];

  if (primarySources.length > 0) {
    rawLinesToScan = primarySources;
  } else {
    // If no experience/projects lines were isolated, split rawText by newline
    rawLinesToScan = sections.rawText.split(/\r?\n/).map((l: string) => l.trim()).filter(Boolean);
  }

  // Handle inline bullets if text contains inline bullet characters (e.g. "• Item 1 • Item 2")
  const expandedLines: string[] = [];
  for (const line of rawLinesToScan) {
    if (line.includes('•') && line.indexOf('•') !== line.lastIndexOf('•')) {
      const parts = line.split('•').map(p => p.trim()).filter(Boolean);
      expandedLines.push(...parts);
    } else if (line.includes('●') && line.indexOf('●') !== line.lastIndexOf('●')) {
      const parts = line.split('●').map(p => p.trim()).filter(Boolean);
      expandedLines.push(...parts);
    } else {
      expandedLines.push(line);
    }
  }

  totalCandidatesScanned = expandedLines.length;

  for (const rawLine of expandedLines) {
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Strip bullet character prefix
    const cleanLine = trimmed.replace(BULLET_PREFIX_REGEX, '').trim();

    // Validation Filters
    if (cleanLine.length < 18 || cleanLine.length > 350) continue;
    if (SECTION_HEADER_REGEX.test(cleanLine)) continue;
    if (CONTACT_REGEX.test(cleanLine)) continue;
    if (EDUCATION_REGEX.test(cleanLine)) continue;
    if (DATE_ONLY_REGEX.test(cleanLine)) continue;
    if (PURE_SKILL_LIST_REGEX.test(cleanLine)) continue;

    // Filter out full resume wall-of-text paragraphs (more than 3 sentences)
    const sentenceCount = cleanLine.split(/[.!?]+/).filter((s: string) => s.trim().length > 0).length;
    if (sentenceCount > 3) continue;

    candidateLines.push(cleanLine);
  }

  const acceptedBullets = Array.from(new Set(candidateLines)).slice(0, 10);
  const detectedSections = sections.detectedSections || [];

  return {
    bullets: acceptedBullets,
    diagnostics: {
      totalCandidateLines: totalCandidatesScanned,
      acceptedBulletsCount: acceptedBullets.length,
      detectedSections,
    },
  };
}

export function extractBulletPoints(sections: ResumeSections): string[] {
  return extractBulletPointsDetailed(sections).bullets;
}
