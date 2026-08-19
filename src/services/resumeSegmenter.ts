import { ContactInfo, ResumeSections } from '../types';

export function segmentResumeText(rawText: string): ResumeSections {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const contact: ContactInfo = extractContactInfo(rawText, lines);

  // Section Header Regexes (supporting decorations, colons, markdown headers, and all-caps)
  const sectionHeaderPatterns: Record<keyof Omit<ResumeSections, 'contact' | 'rawText' | 'detectedSections'>, RegExp[]> = {
    summary: [
      /^(?:#{1,6}\s*)?(?:[*\-_\s\-\|])*?(?:professional\s+|executive\s+|career\s+)?(?:summary|profile|about\s+me|overview|objective|summary\s+of\s+qualifications)(?:[*\-_\s\-\|:])*?$/i,
      /^(?:summary|profile|objective):$/i
    ],
    experience: [
      /^(?:#{1,6}\s*)?(?:[*\-_\s\-\|])*?(?:work|professional|employment|career|relevant|internship)?\s*(?:experience|experiences|history|background|positions\s+held|roles\s+&\s+responsibilities|accomplishments|highlights)(?:[*\-_\s\-\|:])*?$/i,
      /^(?:experience|work\s+history|employment\s+history|professional\s+background|career\s+highlights|internships):$/i,
      /^(?:employment|internships|work\s+history|career\s+history)$/i
    ],
    education: [
      /^(?:#{1,6}\s*)?(?:[*\-_\s\-\|])*?(?:education|academic\s+background|academic\s+qualifications|qualifications|degrees|educational\s+attainment)(?:[*\-_\s\-\|:])*?$/i,
      /^(?:education):$/i
    ],
    skills: [
      /^(?:#{1,6}\s*)?(?:[*\-_\s\-\|])*?(?:technical\s+|core\s+)?(?:skills|competencies|technologies|proficiencies|technical\s+stack|tools\s+&\s+technologies|areas\s+of\s+expertise|skills\s+&\s+abilities)(?:[*\-_\s\-\|:])*?$/i,
      /^(?:skills|technical\s+skills):$/i
    ],
    projects: [
      /^(?:#{1,6}\s*)?(?:[*\-_\s\-\|])*?(?:key\s+|personal\s+|selected\s+|notable\s+|technical\s+|academic\s+)?(?:projects|portfolio|capstone\s+projects|projects\s+&\s+accomplishments)(?:[*\-_\s\-\|:])*?$/i,
      /^(?:projects|portfolio):$/i
    ],
    certifications: [
      /^(?:#{1,6}\s*)?(?:[*\-_\s\-\|])*?(?:certifications|certificates|licenses|professional\s+development|courses\s+&\s+certifications|certifications\s+&\s+licenses)(?:[*\-_\s\-\|:])*?$/i,
      /^(?:certifications):$/i
    ]
  };

  let currentSection: keyof Omit<ResumeSections, 'contact' | 'rawText' | 'detectedSections'> = 'summary';
  const detectedSectionsSet = new Set<string>();

  const sectionsContent: Record<keyof Omit<ResumeSections, 'contact' | 'rawText' | 'detectedSections'>, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
  };

  for (const line of lines) {
    const cleanHeaderLine = line.replace(/^[#*_\-\s]+|[#*_\-\s:]+$/g, '').trim();
    let matchedHeader = false;

    if (cleanHeaderLine.length > 0 && cleanHeaderLine.length < 50) {
      for (const [key, patterns] of Object.entries(sectionHeaderPatterns)) {
        for (const pattern of patterns) {
          if (pattern.test(line) || pattern.test(cleanHeaderLine)) {
            currentSection = key as keyof Omit<ResumeSections, 'contact' | 'rawText' | 'detectedSections'>;
            detectedSectionsSet.add(key);
            matchedHeader = true;
            break;
          }
        }
        if (matchedHeader) break;
      }
    }

    if (!matchedHeader) {
      sectionsContent[currentSection].push(line);
    }
  }

  const detectedSections = Array.from(detectedSectionsSet);

  return {
    contact,
    summary: sectionsContent.summary.join(' '),
    experience: sectionsContent.experience,
    education: sectionsContent.education,
    skills: sectionsContent.skills,
    projects: sectionsContent.projects,
    certifications: sectionsContent.certifications,
    rawText,
    detectedSections,
  };
}

function extractContactInfo(rawText: string, lines: string[]): ContactInfo {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
  const phoneRegex = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const linkedinRegex = /(?:linkedin\.com\/in\/[\w-]+)/i;
  const githubRegex = /(?:github\.com\/[\w-]+)/i;

  const emailMatch = rawText.match(emailRegex);
  const phoneMatch = rawText.match(phoneRegex);
  const linkedinMatch = rawText.match(linkedinRegex);
  const githubMatch = rawText.match(githubRegex);

  let candidateName = 'Candidate Name';
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const l = lines[i];
    if (l.length < 40 && !emailRegex.test(l) && !phoneRegex.test(l) && !l.includes('http')) {
      candidateName = l.replace(/^[#*_\-\s]+|[#*_\-\s]+$/g, '');
      break;
    }
  }

  return {
    name: candidateName,
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : undefined,
    github: githubMatch ? `https://${githubMatch[0]}` : undefined,
  };
}
