import { AtsScoreResult, AtsSubScore, ResumeSections } from '../types';
import { ACTION_VERBS, HARD_SKILLS_DICTIONARY, METRIC_REGEX, WEAK_PHRASES } from '../utils/dictionary';

export function calculateAtsScore(sections: ResumeSections): AtsScoreResult {
  const text = sections.rawText;
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const formattingIssues: string[] = [];

  // 1. Structure & Contact Completeness (15% Weight)
  let structurePoints = 0;
  const structureDetails: string[] = [];
  
  if (sections.contact.email) {
    structurePoints += 25;
    structureDetails.push('Email address detected');
  } else {
    formattingIssues.push('Missing email address in contact section');
  }

  if (sections.contact.phone) {
    structurePoints += 20;
    structureDetails.push('Phone number detected');
  } else {
    formattingIssues.push('Missing phone number');
  }

  if (sections.experience.length > 0) {
    structurePoints += 25;
    structureDetails.push('Work Experience section clearly identified');
  } else {
    weaknesses.push('Work Experience section heading not clearly recognized by ATS parser');
  }

  if (sections.education.length > 0) {
    structurePoints += 15;
    structureDetails.push('Education section identified');
  } else {
    weaknesses.push('Education section heading missing or unparsed');
  }

  if (sections.skills.length > 0) {
    structurePoints += 15;
    structureDetails.push('Dedicated Skills section detected');
  } else {
    weaknesses.push('Dedicated Skills section missing');
  }

  const structureScore: AtsSubScore = {
    score: Math.min(100, structurePoints),
    label: 'Structure & Completeness',
    weight: 0.15,
    details: structureDetails,
    status: structurePoints >= 80 ? 'good' : structurePoints >= 50 ? 'warning' : 'poor',
  };

  // 2. Action Verbs & Impact (25% Weight)
  const foundActionVerbs = new Set<string>();
  for (const word of words) {
    const cleanWord = word.replace(/[^a-z]/g, '');
    if (ACTION_VERBS.has(cleanWord)) {
      foundActionVerbs.add(cleanWord);
    }
  }

  const actionVerbCount = foundActionVerbs.size;
  let impactScoreVal = Math.min(100, actionVerbCount * 12);
  const impactDetails: string[] = [
    `Found ${actionVerbCount} unique strong action verbs (e.g. ${Array.from(foundActionVerbs).slice(0, 4).join(', ')})`
  ];

  // Detect weak phrases
  let weakPhraseCount = 0;
  for (const phrase of WEAK_PHRASES) {
    if (text.toLowerCase().includes(phrase)) {
      weakPhraseCount++;
    }
  }
  if (weakPhraseCount > 0) {
    impactScoreVal = Math.max(0, impactScoreVal - weakPhraseCount * 8);
    weaknesses.push(`Contains ${weakPhraseCount} passive/weak phrases (e.g., "responsible for", "helped with")`);
  }

  if (actionVerbCount >= 6) {
    strengths.push(`Strong action verb usage (${actionVerbCount} distinct action verbs detected)`);
  } else {
    weaknesses.push('Low action verb density. Start bullet points with dynamic verbs like Spearheaded, Engineered, Scaled');
  }

  const impactVerbsScore: AtsSubScore = {
    score: Math.min(100, Math.round(impactScoreVal)),
    label: 'Action & Impact Verbs',
    weight: 0.25,
    details: impactDetails,
    status: impactScoreVal >= 75 ? 'good' : impactScoreVal >= 45 ? 'warning' : 'poor',
  };

  // 3. Quantifiable Metrics (20% Weight)
  const lines = text.split(/\n+/);
  let metricLineCount = 0;
  for (const line of lines) {
    if (METRIC_REGEX.test(line)) {
      metricLineCount++;
    }
  }

  let metricScoreVal = Math.min(100, metricLineCount * 20);
  const metricDetails: string[] = [`${metricLineCount} bullet points contain quantified metrics (%, $, numeric figures)`];

  if (metricLineCount >= 4) {
    strengths.push(`Excellent use of measurable metrics (${metricLineCount} data-driven achievements)`);
  } else {
    weaknesses.push('Lack of quantified results. Include metrics like percentages, revenue, or efficiency improvements');
  }

  const quantifiableMetricsScore: AtsSubScore = {
    score: Math.min(100, Math.round(metricScoreVal)),
    label: 'Quantifiable Achievements',
    weight: 0.20,
    details: metricDetails,
    status: metricScoreVal >= 70 ? 'good' : metricScoreVal >= 40 ? 'warning' : 'poor',
  };

  // 4. Keyword & Skill Coverage (30% Weight)
  const foundSkills = new Set<string>();
  const lowerText = text.toLowerCase();
  for (const skill of HARD_SKILLS_DICTIONARY) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.add(skill);
    }
  }

  const skillCount = foundSkills.size;
  let keywordScoreVal = Math.min(100, skillCount * 8);
  const keywordDetails: string[] = [
    `Identified ${skillCount} recognized hard skills & tools (e.g., ${Array.from(foundSkills).slice(0, 5).join(', ')})`
  ];

  if (skillCount >= 8) {
    strengths.push(`Rich hard skill profile (${skillCount} core industry skills identified)`);
  } else {
    weaknesses.push('Limited skill keywords found. Expand your Technical Skills section');
  }

  const keywordsScore: AtsSubScore = {
    score: Math.min(100, Math.round(keywordScoreVal)),
    label: 'Hard Skill & Tool Coverage',
    weight: 0.30,
    details: keywordDetails,
    status: keywordScoreVal >= 70 ? 'good' : keywordScoreVal >= 40 ? 'warning' : 'poor',
  };

  // 5. Formatting & Length (10% Weight)
  let formattingScoreVal = 100;
  const formattingDetails: string[] = [];

  if (wordCount < 250) {
    formattingScoreVal -= 30;
    formattingIssues.push('Resume is too brief (under 250 words)');
    weaknesses.push('Resume word count is under ideal length for experienced roles');
  } else if (wordCount > 1000) {
    formattingScoreVal -= 15;
    formattingIssues.push('Resume is overly long (over 1000 words)');
  } else {
    strengths.push(`Ideal word count length (${wordCount} words)`);
    formattingDetails.push(`Optimal word count (${wordCount} words)`);
  }

  const formattingScore: AtsSubScore = {
    score: Math.max(0, Math.round(formattingScoreVal)),
    label: 'Formatting & Readability',
    weight: 0.10,
    details: formattingDetails,
    status: formattingScoreVal >= 80 ? 'good' : 'warning',
  };

  // Calculate Weighted Overall ATS Score
  const overallScore = Math.round(
    structureScore.score * structureScore.weight +
    impactVerbsScore.score * impactVerbsScore.weight +
    quantifiableMetricsScore.score * quantifiableMetricsScore.weight +
    keywordsScore.score * keywordsScore.weight +
    formattingScore.score * formattingScore.weight
  );

  let tier: AtsScoreResult['tier'] = 'Good';
  if (overallScore >= 85) tier = 'Excellent';
  else if (overallScore >= 70) tier = 'Good';
  else if (overallScore >= 50) tier = 'Needs Improvement';
  else tier = 'Critical Issues';

  return {
    overallScore,
    tier,
    subScores: {
      formatting: formattingScore,
      keywords: keywordsScore,
      impactVerbs: impactVerbsScore,
      quantifiableMetrics: quantifiableMetricsScore,
      structure: structureScore,
    },
    strengths,
    weaknesses,
    formattingIssues,
    wordCount,
    readingTimeMinutes,
  };
}
