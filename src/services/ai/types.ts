export type AIUseCase = 
  | 'draft_outreach'
  | 'summarise_venture'
  | 'suggest_tags'
  | 'explain_relevance'
  | 'opportunity_summary';

export interface AIContext {
  targetName?: string;
  targetVenture?: string;
  targetStage?: 'idea' | 'pilot' | 'live';
  targetSectors?: string[];
  userVenture?: string;
  userMission?: string;
  userStage?: 'idea' | 'pilot' | 'live';
  tone?: 'formal' | 'friendly' | 'brief';
  goal?: string;
}

export interface AIResponse {
  text: string;
  meta: {
    useCase: AIUseCase;
    model: string;
    requestId: string;
    tokensUsed?: number;
  };
}
