// Action verbs dictionary for impact scoring
export const ACTION_VERBS = new Set([
  'achieved', 'architected', 'spearheaded', 'pioneered', 'engineered', 'scaled', 'accelerated',
  'automated', 'built', 'championed', 'collaborated', 'constructed', 'cultivated', 'designed',
  'developed', 'directed', 'drove', 'established', 'expanded', 'expedited', 'formulated',
  'generated', 'implemented', 'improved', 'increased', 'initiated', 'innovated', 'instituted',
  'launched', 'led', 'leveraged', 'managed', 'maximized', 'mentored', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'overhauled', 'produced', 're-engineered',
  'reduced', 'revamped', 'streamlined', 'transformed', 'unified', 'yielded', 'boosted',
  'curated', 'deployed', 'executed', 'facilitated', 'guided', 'integrated', 'modeled',
  'structured', 'surpassed', 'minimized', 'captured', 'delivered', 'orchestrated'
]);

// Weak/Passive phrases to flag
export const WEAK_PHRASES = [
  'responsible for', 'worked on', 'helped with', 'assisted in', 'duties included',
  'tasked with', 'handled', 'did', 'was involved in', 'served as a member of'
];

// Common Technical & Hard Skills
export const HARD_SKILLS_DICTIONARY = [
  // Programming & Web
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin',
  'react', 'react native', 'next.js', 'vue', 'vue.js', 'angular', 'svelte', 'node.js', 'express', 'nestJS',
  'html5', 'css3', 'tailwind', 'sass', 'webpack', 'vite', 'graphql', 'rest api', 'grpc', 'webSockets',
  
  // Data & Cloud
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'dynamodb', 'snowflake', 'databricks',
  'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ansible', 'ci/cd', 'jenkins',
  'github actions', 'linux', 'bash', 'system architecture', 'microservices', 'serverless',
  
  // AI, ML & Analytics
  'machine learning', 'deep learning', 'artificial intelligence', 'llm', 'nlp', 'pytorch', 'tensorflow',
  'scikit-learn', 'pandas', 'numpy', 'opencv', 'data science', 'tableau', 'power bi',
  
  // Business, Product & Security
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'product management', 'sdlc', 'ui/ux', 'figma',
  'cybersecurity', 'owasp', 'penetration testing', 'unit testing', 'jest', 'cypress', 'playwright'
];

// Common Soft Skills
export const SOFT_SKILLS_DICTIONARY = [
  'leadership', 'communication', 'problem solving', 'critical thinking', 'time management',
  'collaboration', 'adaptability', 'creativity', 'conflict resolution', 'cross-functional team',
  'project management', 'strategic planning', 'decision making', 'stakeholder management',
  'analytical skills', 'attention to detail', 'emotional intelligence', 'customer service'
];

// Metric patterns (detecting numbers, percentages, dollar amounts)
export const METRIC_REGEX = /(\$\d+(?:\.\d+)?(?:k|m|b)?|\d+(?:\.\d+)?%|\b\d+\+(?:\s*(?:users|clients|customers|projects|services|servers|requests|tickets|members))?|\b\d{2,}\b)/i;
