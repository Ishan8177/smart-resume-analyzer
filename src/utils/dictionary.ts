// Expanded Action Verbs Dictionary for Impact Scoring
export const ACTION_VERBS = new Set([
  'achieved', 'architected', 'spearheaded', 'pioneered', 'engineered', 'scaled', 'accelerated',
  'automated', 'built', 'championed', 'collaborated', 'constructed', 'cultivated', 'designed',
  'developed', 'directed', 'drove', 'established', 'expanded', 'expedited', 'formulated',
  'generated', 'implemented', 'improved', 'increased', 'initiated', 'innovated', 'instituted',
  'launched', 'led', 'leveraged', 'managed', 'maximized', 'mentored', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'overhauled', 'produced', 're-engineered',
  'reduced', 'revamped', 'streamlined', 'transformed', 'unified', 'yielded', 'boosted',
  'curated', 'deployed', 'executed', 'facilitated', 'guided', 'integrated', 'modeled',
  'structured', 'surpassed', 'minimized', 'captured', 'delivered', 'revitalized', 'refactored',
  'standardized', 'consolidated', 'benchmarked', 'provisioned', 'migrated', 'resolved'
]);

// Weak / Passive phrases to flag
export const WEAK_PHRASES = [
  'responsible for', 'worked on', 'helped with', 'assisted in', 'duties included',
  'tasked with', 'handled', 'did', 'was involved in', 'served as a member of',
  'attempted to', 'participated in', 'contributed to'
];

// Skill Alias Mapping (normalizes variations to canonical skill names)
export const SKILL_ALIASES: Record<string, string> = {
  'reactjs': 'React',
  'react.js': 'React',
  'react native': 'React Native',
  'nextjs': 'Next.js',
  'next.js': 'Next.js',
  'vuejs': 'Vue',
  'vue.js': 'Vue',
  'angularjs': 'Angular',
  'nodejs': 'Node.js',
  'node.js': 'Node.js',
  'expressjs': 'Express',
  'express.js': 'Express',
  'nestjs': 'NestJS',
  'typescript': 'TypeScript',
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'ts': 'TypeScript',
  'py': 'Python',
  'python3': 'Python',
  'golang': 'Go',
  'k8s': 'Kubernetes',
  'kubernetes': 'Kubernetes',
  'docker': 'Docker',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'mongo': 'MongoDB',
  'mongodb': 'MongoDB',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'gcp': 'Google Cloud',
  'google cloud platform': 'Google Cloud',
  'azure': 'Azure',
  'microsoft azure': 'Azure',
  'tf': 'Terraform',
  'terraform': 'Terraform',
  'github actions': 'GitHub Actions',
  'ci/cd': 'CI/CD',
  'cicd': 'CI/CD',
  'graphql': 'GraphQL',
  'rest': 'REST API',
  'restful': 'REST API',
  'rest api': 'REST API',
  'rest apis': 'REST API',
  'tailwind': 'Tailwind CSS',
  'tailwindcss': 'Tailwind CSS',
  'sklearn': 'Scikit-learn',
  'scikit-learn': 'Scikit-learn',
  'matplotlib': 'Matplotlib',
  'llm': 'LLM',
  'llms': 'LLM',
  'nlp': 'NLP',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'git': 'Git',
  'github': 'GitHub',
  'git/github': 'Git/GitHub',
  'ai': 'AI',
  'artificial intelligence': 'AI',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'sql': 'SQL'
};

// Comprehensive Hard Skills Dictionary (Categorized)
export const HARD_SKILLS_DICTIONARY: string[] = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'Dart', 'Bash', 'SQL',

  // Frontend & Mobile
  'React', 'React Native', 'Next.js', 'Vue', 'Angular', 'Svelte', 'HTML5', 'CSS3', 'Tailwind CSS', 'Sass', 'Webpack', 'Vite', 'Redux', 'Zustand', 'RxJS', 'Flutter',

  // Backend & APIs
  'Node.js', 'Express', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Ruby on Rails', 'ASP.NET', 'GraphQL', 'REST API', 'gRPC', 'WebSockets', 'Microservices',

  // Databases & Caching
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Snowflake', 'Databricks', 'Cassandra', 'Neo4j', 'SQLite', 'Firebase', 'Supabase',

  // Cloud, DevOps & Infrastructure
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Linux', 'Helm', 'Prometheus', 'Grafana', 'Serverless', 'Kafka', 'RabbitMQ',

  // AI, Data Science & Analytics
  'Machine Learning', 'Deep Learning', 'AI', 'LLM', 'NLP', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'OpenCV', 'Data Engineering', 'Tableau', 'Power BI', 'LangChain',

  // Version Control & Tools
  'Git', 'GitHub', 'Git/GitHub',

  // Testing & Quality Assurance
  'Jest', 'Cypress', 'Playwright', 'Selenium', 'JUnit', 'PyTest', 'Postman', 'Unit Testing', 'Integration Testing', 'TDD',

  // Security, Architecture & Agile
  'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'System Architecture', 'UI/UX', 'Figma', 'Cybersecurity', 'OWASP', 'CI/CD', 'SDLC'
];

// Soft Skills Dictionary
export const SOFT_SKILLS_DICTIONARY: string[] = [
  'Leadership', 'Communication', 'Problem Solving', 'Critical Thinking', 'Time Management',
  'Collaboration', 'Adaptability', 'Creativity', 'Conflict Resolution', 'Cross-Functional Collaboration',
  'Project Management', 'Strategic Planning', 'Decision Making', 'Stakeholder Management',
  'Analytical Skills', 'Attention to Detail', 'Emotional Intelligence', 'Customer Focus', 'Mentorship'
];

// Advanced Metric Regular Expressions
export const METRIC_PATTERNS = [
  /\b\d+(?:\.\d+)?\s*(?:%|percent)\b/i,
  /\$\s*\d+(?:\.\d+)?\s*(?:k|m|b|million|billion|thousand)?\b/i,
  /\b\d+(?:\.\d+)?\s*(?:million|billion|k|m|b)\s*dollars?\b/i,
  /\b\d+(?:\.\d+)?\s*(?:x|-fold)\b/i,
  /\b(?:doubled|tripled|quadrupled|scaled by \d+)\b/i,
  /\b\d+(?:,\d{3})*\+?\s*(?:users|clients|customers|subscribers|engineers|developers|members|services|microservices|servers|requests|tickets|repos|downloads|active users|ms)\b/i,
  /\bteam of \d+\b/i,
  /\bmanaged \d+\b/i,
  /\b\d+\s*years\b/i,
  /\b\d+(?:\.\d+)?\s*(?:ms|milliseconds|seconds|hrs|hours)\b/i,
];
