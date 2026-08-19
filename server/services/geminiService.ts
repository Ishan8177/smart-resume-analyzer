import { GoogleGenerativeAI } from '@google/generative-ai';
import { extractBulletPointsDetailed } from '../../src/utils/bulletExtractor.js';
import { ResumeSections } from '../../src/types/index.js';

export interface AiAnalysisRequest {
  resumeText: string;
  sections: ResumeSections;
  jobDescription?: string;
}

export interface AiAnalysisResponse {
  summaryReview: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  rephrasedBullets: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  tailoredSuggestions: string[];
  aiMatchReasoning?: string;
}

export async function analyzeResumeWithGemini(
  data: AiAnalysisRequest
): Promise<AiAnalysisResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured on the backend server.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Extract clean individual bullet points using the single authoritative bullet extractor
  const extractionResult = extractBulletPointsDetailed(data.sections || {
    contact: {},
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    rawText: data.resumeText || '',
  });

  const extractedBullets = extractionResult.bullets;

  const bulletListFormatted = extractedBullets.length > 0
    ? extractedBullets.map((b, i) => `${i + 1}. ${b}`).join('\n')
    : 'No distinct experience bullet points found.';

  const prompt = `
You are an expert Executive Resume Writer and ATS Specialist.
Analyze the candidate's resume bullet points and target job description (if provided).

CRITICAL BULLET ENHANCER INSTRUCTIONS:
1. Process EACH of the candidate's bullet points listed below INDEPENDENTLY.
2. "original": MUST match the exact text of the candidate's bullet point provided below.
3. "improved": MUST be a concise 1-2 sentence ATS-optimized bullet starting with a strong past-tense action verb.
4. ALREADY STRONG BULLETS: If a bullet is already strong, action-oriented, and effective, set "improved" to match "original" exactly, and set "reason" to "Already strong action-oriented bullet point."
5. STRICT TRUTH RULE: DO NOT invent fake metrics, percentages, job titles, companies, or technologies not present in the original bullet. Preserve original facts.
6. If a target job description is provided, align language with required job skills without fabricating experience.

CANDIDATE BULLET POINTS:
${bulletListFormatted}

${data.jobDescription ? `TARGET JOB DESCRIPTION:\n${data.jobDescription}` : ''}

Respond ONLY with a valid JSON object matching this structure (no code fences, no markdown):
{
  "summaryReview": "2-3 sentence summary of resume quality and ATS readiness.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "missingKeywords": ["Keyword 1", "Keyword 2"],
  "rephrasedBullets": [
    {
      "original": "Original bullet text from candidate list above",
      "improved": "Enhanced ATS bullet (1-2 sentences max)",
      "reason": "Explanation of why this rewrite improves ATS score, or note if already strong."
    }
  ],
  "tailoredSuggestions": [
    "Actionable recommendation 1",
    "Actionable recommendation 2"
  ],
  "aiMatchReasoning": "Brief job match reasoning if job description provided."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text() || '';
    
    // Clean markdown code fences
    const cleanedText = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed: AiAnalysisResponse = JSON.parse(cleanedText);

    // Post-process and sanitize rephrased bullets
    if (Array.isArray(parsed.rephrasedBullets)) {
      parsed.rephrasedBullets = parsed.rephrasedBullets
        .filter(b => b && b.original && b.improved)
        .map(b => ({
          original: sanitizeSingleBullet(b.original),
          improved: sanitizeSingleBullet(b.improved),
          reason: b.reason || 'Enhanced action verb framing and ATS readability.'
        }));
    } else {
      parsed.rephrasedBullets = [];
    }

    return parsed;
  } catch (error: any) {
    console.error('Gemini AI Generation Error:', error);
    throw new Error(`Gemini AI service error: ${error.message || error}`);
  }
}

function sanitizeSingleBullet(text: string): string {
  let clean = text.replace(/^[•●▪■◆❖➢\-\*\–\—\s\d\.\)]+/, '').trim();
  if (clean.includes('\n')) {
    clean = clean.split('\n')[0].trim();
  }
  if (clean.length > 300) {
    clean = clean.substring(0, 297) + '...';
  }
  return clean;
}
