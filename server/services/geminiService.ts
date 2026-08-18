import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AiAnalysisRequest {
  resumeText: string;
  sections: {
    contactInfo?: string;
    summary?: string;
    experience?: string[];
    education?: string[];
    skills?: string[];
    projects?: string[];
    certifications?: string[];
  };
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

  const prompt = `
You are an expert Executive Resume Writer and ATS (Applicant Tracking System) Specialist.
Analyze the following candidate resume text and optional target job description.

RULES:
1. DO NOT invent, hallucinate, or add fake experience, degrees, or companies.
2. Only suggest improvements based strictly on the facts provided in the resume.
3. Make rephrased bullet points punchy, quantified, and action-oriented using strong verbs.
4. If a job description is provided, compare keywords and highlight missing hard/soft skills.

RESUME DATA:
${data.resumeText}

${data.jobDescription ? `TARGET JOB DESCRIPTION:\n${data.jobDescription}` : ''}

Respond ONLY with a valid JSON object matching the following structure (no markdown formatting, no code fences):
{
  "summaryReview": "Comprehensive 2-3 sentence overview of the resume quality and ATS readiness.",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "missingKeywords": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "rephrasedBullets": [
    {
      "original": "Original bullet point text from resume",
      "improved": "Enhanced bullet point text starting with strong action verb and quantified impact",
      "reason": "Explanation of why this rewrite improves ATS score"
    }
  ],
  "tailoredSuggestions": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "aiMatchReasoning": "Contextual explanation of how well the candidate matches the job description (if provided)."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text() || '';
    
    // Clean potential markdown code fences from LLM output
    const cleanedText = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed: AiAnalysisResponse = JSON.parse(cleanedText);
    return parsed;
  } catch (error: any) {
    console.error('Gemini AI Generation Error:', error);
    throw new Error(`Gemini AI service error: ${error.message || error}`);
  }
}
