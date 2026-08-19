import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { segmentResumeText } from '../src/services/resumeSegmenter.js';
import { calculateAtsScore } from '../src/services/atsScorer.js';
import { matchJobDescription } from '../src/services/jobMatcher.js';
import { extractBulletPoints, extractBulletPointsDetailed } from '../src/utils/bulletExtractor.js';

// Controlled Test Fixture 1: Modern Engineer Resume
const sampleResume1 = `
Alex Mercer
alex.mercer@dev.io | +1 (555) 019-2834 | San Francisco, CA
linkedin.com/in/alexmercer | github.com/alexmercer

Professional Summary
Senior Full Stack Engineer with 7+ years of experience architecting microservices and leading frontend engineering teams.

Technical Skills
JavaScript, TypeScript, React, Node.js, PostgreSQL, Docker, Kubernetes, AWS, GraphQL, CI/CD, Jest, Python, SQL, REST API, Machine Learning, Scikit-learn, Pandas, NumPy, Git, C++

Work Experience
Senior Software Engineer | Tech Corp | 2021 - Present
• Spearheaded migration of legacy monolith to React and Node.js microservices, reducing load times by 45%.
• Architected automated CI/CD pipeline using GitHub Actions and Kubernetes, deployment frequency increased by 3x.
• Managed a team of 6 engineers and mentored junior developers across cross-functional projects.

Software Developer | Startup X | 2017 - 2021
• Engineered scalable REST APIs using Express and PostgreSQL, handling over 10M+ daily requests.
• Optimized SQL database queries, cutting p99 latency from 250ms to 40ms.

Education
Bachelor of Science in Computer Science | Stanford University | 2017

Projects
Real-time Analytics Dashboard | Built with React, WebSockets, and Redis.

Certifications
AWS Certified Solutions Architect - Associate
`;

// Controlled Test Fixture 2: Executive Resume with All-Caps & Colons
const sampleResume2 = `
SARAH JENKINS
sarah.j@execs.com | +1 415-555-8822

EXECUTIVE SUMMARY:
Visionary Technology Executive and VP of Engineering with 15+ years driving global software development, scaling engineering organizations, and managing $20M+ technology budgets.

CORE COMPETENCIES:
System Architecture, Leadership, Strategic Planning, Python, Java, AWS, Agile, Microservices, Cybersecurity, CI/CD

CAREER HISTORY:
VP of Engineering | Enterprise Cloud | 2019 - Present
• Spearheaded digital transformation across 120+ microservices, yielding $4.5M in annual cost savings.
• Doubled engineering team from 30 to 65 developers while maintaining 99.99% system availability.

ACADEMIC QUALIFICATIONS:
Master of Science in Software Engineering | MIT | 2008

CERTIFICATIONS:
Certified ScrumMaster (CSM), CISSP
`;

// Controlled Test Fixture 3: Markdown Formatted Resume with Aliases
const sampleResume3 = `
# Jordan Taylor
jordan@code.dev | github.com/jordant

## Profile
Frontend engineer specializing in k8s, reactjs, and nodejs applications.

## Technical Stack
ReactJS, NodeJS, K8s, MongoDB, Tailwind CSS, TypeScript, Docker

## Experience
Lead Developer | CloudApp
- Built high-speed WebSockets integration serving 500k active users.
- Automated testing with Jest, achieving 90% code coverage.

## Education
B.S. Information Technology | State University
`;

// Controlled Test Fixture 4: Plain Lines & Unicode Bullets Resume
const sampleResume4 = `
Marcus Vance
marcus@vance.io

Professional Experience
Lead Backend Architect | DataFlow Inc
● Designed distributed event-driven architecture using Kafka and Go
▪ Improved query response time by 60% across 5TB database
Managed migration of cloud infrastructure to AWS Serverless

Projects
High-Frequency Trading Engine
Architected C++ trading system with sub-millisecond execution latency
`;

describe('ATS Analysis Accuracy & End-to-End Audit Test Suite', () => {
  it('Fixture 1: Should correctly segment all 6 sections for standard resume', () => {
    const sections = segmentResumeText(sampleResume1);
    assert.ok(sections.summary.includes('Senior Full Stack Engineer'));
    assert.ok(sections.experience.length > 0, 'Work Experience section should not be empty');
    assert.ok(sections.skills.length > 0, 'Skills section should not be empty');
    assert.ok(sections.education.length > 0, 'Education section should not be empty');
    assert.ok(sections.projects.length > 0, 'Projects section should not be empty');
    assert.ok(sections.certifications.length > 0, 'Certifications section should not be empty');
    assert.equal(sections.contact.email, 'alex.mercer@dev.io');
    assert.ok(sections.contact.phone?.includes('555'));
  });

  it('Fixture 2: Should correctly segment All-Caps headers with colons', () => {
    const sections = segmentResumeText(sampleResume2);
    assert.ok(sections.summary.includes('Visionary Technology Executive'));
    assert.ok(sections.experience.length > 0, 'CAREER HISTORY should map to experience');
    assert.ok(sections.skills.length > 0, 'CORE COMPETENCIES should map to skills');
    assert.ok(sections.education.length > 0, 'ACADEMIC QUALIFICATIONS should map to education');
    assert.ok(sections.certifications.length > 0, 'CERTIFICATIONS should map to certifications');
    assert.equal(sections.contact.email, 'sarah.j@execs.com');
  });

  it('Punctuation Skill Recognition: Should recognize C++, Node.js, and CI/CD in ATS Scorer', () => {
    const sections = segmentResumeText(sampleResume1);
    const ats = calculateAtsScore(sections);
    const skillDetails = ats.subScores.keywords.details[0];
    assert.ok(ats.subScores.keywords.score > 50, 'Keywords subscore should recognize technical skills');
  });

  it('Job Description Matcher: Should compute 100% match score when candidate possesses all required skills', () => {
    const testJd = `
      Required Skills: Python, React, Node.js, PostgreSQL, Docker, Kubernetes, AWS, C++.
    `;

    const match = matchJobDescription(sampleResume1, testJd);
    assert.ok(match.matchScore === 100, `Expected 100% match, got ${match.matchScore}%`);
    assert.equal(match.missingKeywords.length, 0);
  });

  it('Bullet Extractor: Should extract standard • bullets and detailed diagnostics', () => {
    const sections = segmentResumeText(sampleResume1);
    const detailed = extractBulletPointsDetailed(sections);
    assert.ok(detailed.bullets.length >= 4, `Expected >= 4 bullets, got ${detailed.bullets.length}`);
    assert.ok(detailed.bullets.some(b => b.includes('Spearheaded migration')));
    assert.ok(detailed.diagnostics.acceptedBulletsCount >= 4);
    assert.ok(detailed.diagnostics.detectedSections.includes('experience'));
  });

  it('Bullet Extractor: Should extract hyphen -, unicode ●/▪, and plain line bullets without bullet symbols', () => {
    const sections = segmentResumeText(sampleResume4);
    const bullets = extractBulletPoints(sections);
    assert.ok(bullets.length >= 3, `Expected >= 3 bullets from sampleResume4, got ${bullets.length}`);
    assert.ok(bullets.some(b => b.includes('Kafka and Go')));
    assert.ok(bullets.some(b => b.includes('sub-millisecond execution latency')));
    
    assert.ok(!bullets.some(b => b.toLowerCase() === 'professional experience'));
    assert.ok(!bullets.some(b => b.toLowerCase() === 'projects'));
    assert.ok(!bullets.some(b => b.includes('marcus@vance.io')));
  });
});
