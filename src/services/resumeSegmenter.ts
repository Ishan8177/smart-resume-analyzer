import { ContactInfo, ResumeSections } from '../types';

export function segmentResumeText(rawText: string): ResumeSections {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  const contact: ContactInfo = extractContactInfo(rawText, lines);

  // Section Headers Keywords
  const sectionKeywords: Record<keyof Omit<ResumeSections, 'contact' | 'rawText'>, RegExp> = {
    summary: /^(summary|professional summary|about me|profile|executive summary|overview)/i,
    experience: /^(work experience|professional experience|experience|employment history|work history|career)/i,
    education: /^(education|academic background|qualifications|degrees)/i,
    skills: /^(skills|technical skills|core competencies|technologies|proficiencies)/i,
    projects: /^(projects|key projects|personal projects|portfolio|selected projects)/i,
    certifications: /^(certifications|licenses|courses|professional development|certificates)/i,
  };

  let currentSection: keyof Omit<ResumeSections, 'contact' | 'rawText'> = 'summary';
  const sectionsContent: Record<keyof Omit<ResumeSections, 'contact' | 'rawText'>, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines) {
    // Check if line matches a header pattern
    let matchedHeader = false;
    for (const [key, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line) && line.length < 40) {
        currentSection = key as keyof Omit<ResumeSections, 'contact' | 'rawText'>;
        matchedHeader = true;
        break;
      }
    }

    if (!matchedHeader) {
      sectionsContent[currentSection].push(line);
    }
  }

  return {
    contact,
    summary: sectionsContent.summary.join(' '),
    experience: sectionsContent.experience,
    education: sectionsContent.education,
    skills: sectionsContent.skills,
    projects: sectionsContent.projects,
    certifications: sectionsContent.certifications,
    rawText,
  };
}

function extractContactInfo(rawText: string, lines: string[]): ContactInfo {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(?:linkedin\.com\/in\/[\w-]+)/i;
  const githubRegex = /(?:github\.com\/[\w-]+)/i;

  const emailMatch = rawText.match(emailRegex);
  const phoneMatch = rawText.match(phoneRegex);
  const linkedinMatch = rawText.match(linkedinRegex);
  const githubMatch = rawText.match(githubRegex);

  // Usually the name is at line 0 or 1
  const candidateName = lines.length > 0 && lines[0].length < 40 && !emailRegex.test(lines[0]) 
    ? lines[0] 
    : 'Candidate Name';

  return {
    name: candidateName,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : undefined,
    github: githubMatch ? `https://${githubMatch[0]}` : undefined,
  };
}
