export type SentimentPoint = {
  segment: number;
  time: string;
  sentiment: number;
  text: string;
};

export type PolicyViolation = {
  policyViolated: string;
  violationDescription: string;
  relevantExcerpt: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
};

export type AgentPerformance = {
  agentName: string;
  agentId: string;
  agentAvatarUrl: string;
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  actionableCoachingPoints: {
    point: string;
    reference?: string;
  }[];
};

export type TrendData = {
  topIssues: {
    issue: string;
    count: number;
  }[];
};

export type AnalysisResult = {
  transcript: string;
  language: string;
  summary: string;
  overallSentiment: 'Positive' | 'Neutral' | 'Negative' | string;
  primaryCustomerIntent: string;
  keyTopics: string[];
  sentimentTimeline: SentimentPoint[];
  policyViolations: PolicyViolation[];
  agentPerformance: AgentPerformance;
  trends: TrendData;
};
