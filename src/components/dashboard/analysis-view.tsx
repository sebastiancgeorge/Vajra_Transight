'use client';

import { Skeleton } from '@/components/ui/skeleton';
import type { AnalysisResult } from '@/lib/types';
import { AgentCoachingCard } from './agent-coaching-card';
import { JsonOutput } from './json-output';
import { OverviewCard } from './overview-card';
import { PolicyViolationsCard } from './policy-violations-card';
import { SentimentTimelineCard } from './sentiment-timeline-card';
import { SummaryCard } from './summary-card';
import { TrendsCard } from './trends-card';
import { RiskScoreCard } from './risk-score-card';
import { Languages, Smile, FileQuestion, BarChart3, AlertTriangle, FileJson, Bot, CheckCircle } from 'lucide-react';

interface AnalysisViewProps {
  analysisResult: AnalysisResult | null;
  isPending: boolean;
}

const SkeletonCard = () => (
  <div className="flex flex-col space-y-3 rounded-xl border bg-card p-6">
    <Skeleton className="h-6 w-1/2 rounded-md" />
    <Skeleton className="h-4 w-3/4 rounded-md" />
    <div className="flex-1 space-y-2 pt-4">
      <Skeleton className="h-16 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
    </div>
  </div>
);

export function AnalysisView({ analysisResult, isPending }: AnalysisViewProps) {
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <div className="lg:col-span-2"><SkeletonCard /></div>
        <div className="lg:col-span-2"><SkeletonCard /></div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
        <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium font-headline">Awaiting Analysis</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit a conversation to see AI-powered insights.
        </p>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-max grid-cols-1 gap-6 lg:grid-cols-4">
      <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <OverviewCard
          title="Overall Sentiment"
          value={analysisResult.overallSentiment}
          icon={Smile}
        />
        <OverviewCard
          title="Primary Intent"
          value={analysisResult.primaryCustomerIntent}
          icon={FileQuestion}
        />
        <OverviewCard
          title="Call Outcome"
          value={analysisResult.callOutcome.outcome}
          icon={CheckCircle}
        />
        <OverviewCard
          title="Language(s)"
          value={analysisResult.languages}
          icon={Languages}
        />
      </div>

      <SummaryCard
        summary={analysisResult.summary}
        topics={analysisResult.keyTopics}
      />
      <SentimentTimelineCard
        timeline={analysisResult.sentimentTimeline}
      />
      <TrendsCard trends={analysisResult.trends} />
      <RiskScoreCard riskScore={analysisResult.riskScore} />
      <PolicyViolationsCard violations={analysisResult.policyViolations} />
      <AgentCoachingCard performance={analysisResult.agentPerformance} />
      <JsonOutput data={analysisResult} />
    </div>
  );
}
