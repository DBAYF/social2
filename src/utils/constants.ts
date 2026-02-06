// Venture stages
export const VENTURE_STAGES = ['idea', 'pilot', 'live'] as const;
export type VentureStage = typeof VENTURE_STAGES[number];

export const STAGE_LABELS: Record<VentureStage, string> = {
  idea: 'Idea Stage',
  pilot: 'Pilot Stage',
  live: 'Live',
};

export const STAGE_DESCRIPTIONS: Record<VentureStage, string> = {
  idea: 'Concept stage, pre-product, validating problem',
  pilot: 'Building or testing MVP, early users',
  live: 'Product in market, generating revenue or traction',
};

// Sector tags
export const SECTOR_TAGS = {
  technology: ['AI/ML', 'SaaS', 'Developer Tools', 'Cybersecurity', 'Web3/Blockchain', 'Hardware', 'IoT'],
  health: ['Digital Health', 'Biotech', 'Mental Health', 'Fitness/Wellness', 'Medical Devices'],
  finance: ['Fintech', 'Insurtech', 'Payments', 'Wealth Management', 'Banking', 'Crypto'],
  commerce: ['E-commerce', 'Marketplace', 'D2C', 'Retail Tech', 'Supply Chain', 'Logistics'],
  education: ['EdTech', 'Skills Training', 'Corporate Learning', 'K-12', 'Higher Ed'],
  media: ['Content', 'Gaming', 'Social', 'Creator Economy', 'Streaming'],
  sustainability: ['CleanTech', 'Renewable Energy', 'Circular Economy', 'AgriTech', 'Climate'],
  b2b: ['HR Tech', 'Legal Tech', 'Marketing Tech', 'Sales Tech'],
  consumer: ['Food & Beverage', 'Travel', 'Real Estate', 'Home', 'Pets', 'Fashion'],
  deepTech: ['Robotics', 'Space', 'Quantum', 'Advanced Materials', 'Synthetic Biology'],
} as const;

export const ALL_SECTOR_TAGS = Object.values(SECTOR_TAGS).flat();

// Audience tags
export const AUDIENCE_TAGS = {
  businessSize: ['Enterprise', 'SMB', 'Startups', 'Solo/Freelancers'],
  consumer: ['Gen Z', 'Millennials', 'Families', 'Seniors', 'Students'],
  professional: ['Developers', 'Designers', 'Marketers', 'Sales', 'HR', 'Finance'],
  geographic: ['Global', 'North America', 'Europe', 'Asia-Pacific', 'LATAM', 'Africa', 'MENA'],
} as const;

export const ALL_AUDIENCE_TAGS = Object.values(AUDIENCE_TAGS).flat();

// Post types
export const POST_TYPES = ['intro', 'update', 'ask', 'opportunity'] as const;
export type PostType = typeof POST_TYPES[number];

export const POST_TYPE_LABELS: Record<PostType, string> = {
  intro: 'Introduction',
  update: 'Update',
  ask: 'Ask',
  opportunity: 'Opportunity',
};

// Opportunity types
export const OPPORTUNITY_TYPES = ['event', 'grant', 'programme', 'accelerator', 'community'] as const;
export type OpportunityType = typeof OPPORTUNITY_TYPES[number];

// Connection statuses
export const CONNECTION_STATUSES = ['requested', 'accepted', 'blocked'] as const;
export type ConnectionStatus = typeof CONNECTION_STATUSES[number];

// Saved opportunity statuses
export const SAVED_STATUSES = ['saved', 'interested', 'applied', 'attended', 'done', 'ignored'] as const;
export type SavedStatus = typeof SAVED_STATUSES[number];

// Privacy levels
export const PRIVACY_LEVELS = ['public', 'members', 'connections'] as const;
export type PrivacyLevel = typeof PRIVACY_LEVELS[number];

// AI use cases
export const AI_USE_CASES = [
  'draft_outreach',
  'summarise_venture',
  'suggest_tags',
  'explain_relevance',
  'opportunity_summary',
] as const;
export type AIUseCase = typeof AI_USE_CASES[number];
