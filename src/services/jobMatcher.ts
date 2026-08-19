import { JobMatchResult, KeywordMatch } from '../types';
import { HARD_SKILLS_DICTIONARY, SKILL_ALIASES, SOFT_SKILLS_DICTIONARY } from '../utils/dictionary';

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

  const requiredKeywordsMap = new Map<string, KeywordMatch>();

  // Helper to test word-boundary match safely
  const countWordMatches = (text: string, term: string): number => {
    const escaped = escapeRegExp(term);
    // Boundary matching supporting special characters like C++, C#, CI/CD, Git/GitHub, Scikit-learn
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:$|[^a-zA-Z0-9_])`, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  // Helper to check if a canonical skill or its aliases match the resume
  const checkResumeFrequency = (canonical: string, aliases: string[]): number => {
    let count = countWordMatches(resumeText, canonical);
    for (const alias of aliases) {
      count += countWordMatches(resumeText, alias);
    }
    return count;
  };

  // Group alias map by canonical skill
  const canonicalToAliasesMap = new Map<string, string[]>();
  for (const [alias, canonical] of Object.entries(SKILL_ALIASES)) {
    const list = canonicalToAliasesMap.get(canonical) || [];
    list.push(alias);
    canonicalToAliasesMap.set(canonical, list);
  }

  // 1. Scan Job Description for Hard Skills from dictionary & aliases
  for (const skill of HARD_SKILLS_DICTIONARY) {
    const aliases = canonicalToAliasesMap.get(skill) || [];
    
    // Check if canonical skill or any of its aliases exist in the job description using word boundaries
    let jobFreq = countWordMatches(jobDescriptionText, skill);
    for (const alias of aliases) {
      jobFreq += countWordMatches(jobDescriptionText, alias);
    }

    // CRITICAL FIX: Only add to required list if skill ACTUALLY appears in the job description!
    if (jobFreq > 0) {
      const resFreq = checkResumeFrequency(skill, aliases);
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

  // 2. Scan Job Description for Soft Skills
  for (const softSkill of SOFT_SKILLS_DICTIONARY) {
    const jobFreq = countWordMatches(jobDescriptionText, softSkill);
    if (jobFreq > 0) {
      const resFreq = countWordMatches(resumeText, softSkill);
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

  // Calculate score strictly based on extracted required skills
  const finalMatchScore = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 100;

  // Category scores
  const hardSkillsList = allKeywords.filter(k => k.category === 'Hard Skill');
  const hardSkillsFound = hardSkillsList.filter(k => k.status === 'found' || k.status === 'weak').length;
  const hardSkillsScore = hardSkillsList.length > 0 ? Math.round((hardSkillsFound / hardSkillsList.length) * 100) : 100;

  const softSkillsList = allKeywords.filter(k => k.category === 'Soft Skill');
  const softSkillsFound = softSkillsList.filter(k => k.status === 'found').length;
  const softSkillsScore = softSkillsList.length > 0 ? Math.round((softSkillsFound / softSkillsList.length) * 100) : 100;

  // Recommendations
  const keyRecommendations: string[] = [];
  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5).map(k => k.keyword).join(', ');
    keyRecommendations.push(`Add top missing job skills into your Skills and Experience bullets: ${topMissing}.`);
  }
  if (weakKeywords.length > 0) {
    const topWeak = weakKeywords.slice(0, 3).map(k => k.keyword).join(', ');
    keyRecommendations.push(`Increase keyword frequency for underrepresented skills: ${topWeak}.`);
  }
  if (finalMatchScore < 70 && totalRequired > 0) {
    keyRecommendations.push('Tailor your Professional Summary to mirror the core responsibilities described in the target job posting.');
  } else if (totalRequired > 0) {
    keyRecommendations.push('Strong keyword alignment! Ensure all bullet points highlight measurable achievements using these skills.');
  } else {
    keyRecommendations.push('No explicit technical keywords detected in job description.');
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
