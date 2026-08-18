import { JobMatchResult, KeywordMatch } from '../types';
import { HARD_SKILLS_DICTIONARY, SOFT_SKILLS_DICTIONARY } from '../utils/dictionary';

export function matchJobDescription(resumeText: string, jobDescriptionText: string): JobMatchResult {
  if (!jobDescriptionText.trim()) {
    return {
      matchScore: 0,
      jobDescriptionText: '',
      matchedKeywords: [],
      missingKeywords: [],
      weakKeywords: [],
      matchedCount: 0,
      totalRequiredCount: 0,
      categoryBreakdown: { hardSkillsScore: 0, softSkillsScore: 0, toolsScore: 0 },
      keyRecommendations: ['Enter a job description to perform ATS job match analysis.'],
    };
  }

  const resumeLower = resumeText.toLowerCase();
  const jobLower = jobDescriptionText.toLowerCase();

  // Extract all relevant candidate keywords from Job Description
  const requiredKeywordsMap = new Map<string, KeywordMatch>();

  // Check hard skills
  for (const skill of HARD_SKILLS_DICTIONARY) {
    if (jobLower.includes(skill.toLowerCase())) {
      const jobFreq = (jobLower.match(new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'gi')) || []).length;
      const resFreq = (resumeLower.match(new RegExp(`\\b${escapeRegExp(skill)}\\b`, 'gi')) || []).length;

      let status: KeywordMatch['status'] = 'missing';
      if (resFreq >= jobFreq && resFreq > 0) status = 'found';
      else if (resFreq > 0) status = 'weak';

      requiredKeywordsMap.set(skill.toLowerCase(), {
        keyword: skill,
        category: 'Hard Skill',
        status,
        frequencyInResume: resFreq,
        frequencyInJob: jobFreq,
      });
    }
  }

  // Check soft skills
  for (const softSkill of SOFT_SKILLS_DICTIONARY) {
    if (jobLower.includes(softSkill.toLowerCase())) {
      const jobFreq = (jobLower.match(new RegExp(`\\b${escapeRegExp(softSkill)}\\b`, 'gi')) || []).length;
      const resFreq = (resumeLower.match(new RegExp(`\\b${escapeRegExp(softSkill)}\\b`, 'gi')) || []).length;

      let status: KeywordMatch['status'] = 'missing';
      if (resFreq > 0) status = 'found';

      requiredKeywordsMap.set(softSkill.toLowerCase(), {
        keyword: softSkill,
        category: 'Soft Skill',
        status,
        frequencyInResume: resFreq,
        frequencyInJob: jobFreq,
      });
    }
  }

  const allKeywords = Array.from(requiredKeywordsMap.values());
  const matchedKeywords = allKeywords.filter(k => k.status === 'found');
  const weakKeywords = allKeywords.filter(k => k.status === 'weak');
  const missingKeywords = allKeywords.filter(k => k.status === 'missing');

  const totalRequired = allKeywords.length;
  const matchedCount = matchedKeywords.length + weakKeywords.length * 0.5;

  let rawScore = totalRequired > 0 ? (matchedCount / totalRequired) * 100 : 70;
  
  // Calculate TF-IDF style overall n-gram overlap bonus
  const jobWords = new Set(jobLower.split(/\W+/).filter(w => w.length > 3));
  let overlapCount = 0;
  for (const word of jobWords) {
    if (resumeLower.includes(word)) overlapCount++;
  }
  const generalOverlapScore = jobWords.size > 0 ? (overlapCount / jobWords.size) * 100 : 50;

  const finalMatchScore = Math.min(100, Math.round(rawScore * 0.7 + generalOverlapScore * 0.3));

  // Category scores
  const hardSkillsList = allKeywords.filter(k => k.category === 'Hard Skill');
  const hardSkillsFound = hardSkillsList.filter(k => k.status === 'found').length;
  const hardSkillsScore = hardSkillsList.length > 0 ? Math.round((hardSkillsFound / hardSkillsList.length) * 100) : 75;

  const softSkillsList = allKeywords.filter(k => k.category === 'Soft Skill');
  const softSkillsFound = softSkillsList.filter(k => k.status === 'found').length;
  const softSkillsScore = softSkillsList.length > 0 ? Math.round((softSkillsFound / softSkillsList.length) * 100) : 80;

  // Key recommendations
  const keyRecommendations: string[] = [];
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5).map(k => k.keyword).join(', ');
    keyRecommendations.push(`Add top missing job skills into your Skills and Experience bullets: ${topMissing}.`);
  }
  if (weakKeywords.length > 0) {
    const topWeak = weakKeywords.slice(0, 3).map(k => k.keyword).join(', ');
    keyRecommendations.push(`Increase keyword frequency for underrepresented skills: ${topWeak}.`);
  }
  if (finalMatchScore < 70) {
    keyRecommendations.push('Tailor your Professional Summary to mirror the core responsibilities described in the target job posting.');
  } else {
    keyRecommendations.push('Strong keyword alignment! Ensure all bullet points highlight measurable achievements using these skills.');
  }

  return {
    matchScore: finalMatchScore,
    jobDescriptionText,
    matchedKeywords,
    missingKeywords,
    weakKeywords,
    matchedCount: Math.round(matchedCount),
    totalRequiredCount: totalRequired,
    categoryBreakdown: {
      hardSkillsScore,
      softSkillsScore,
      toolsScore: hardSkillsScore,
    },
    keyRecommendations,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
