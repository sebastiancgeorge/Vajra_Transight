import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {summarizeConversationAndExtractTopics} from '@/ai/flows/summarize-conversation-and-extract-topics';
import {identifyPrimaryCustomerIntent} from '@/ai/flows/identify-primary-customer-intent';
import {analyzeSentimentTimeline} from '@/ai/flows/analyze-sentiment-timeline';
import {detectCompliancePolicyViolations} from '@/ai/flows/detect-compliance-policy-violations-flow';
import {generateAgentPerformanceCoaching} from '@/ai/flows/generate-agent-performance-coaching';
import { detectLanguages } from '@/ai/flows/detect-languages-flow';
import { classifyCallOutcome } from '@/ai/flows/classify-call-outcome-flow';
import { generateRiskScore } from '@/ai/flows/generate-risk-score-flow';
import {policyDocuments} from '@/lib/policies';
import type {AnalysisResult} from '@/lib/types';
import {mockAnalysisResult} from '@/lib/mock-data'; // For trends and avatar

const AnalyzeRequestSchema = z.object({
  transcript: z.string(),
});

function extractAgentName(transcript: string): string {
  const match = transcript.match(/Agent \((.*?)\):/);
  return match ? match[1] : 'Unknown Agent';
}

export async function POST(req: NextRequest) {
  // API Key Authentication
  const apiKey = req.headers.get('x-api-key');
  if (apiKey !== process.env.ANALYSIS_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {transcript} = AnalyzeRequestSchema.parse(body);

    const agentName = extractAgentName(transcript);

    const [
      summaryAndTopics,
      intent,
      sentimentTimelineResult,
      violationsResult,
      languagesResult,
      outcomeResult,
      riskScoreResult,
    ] = await Promise.all([
      summarizeConversationAndExtractTopics({transcript}),
      identifyPrimaryCustomerIntent({transcript}),
      analyzeSentimentTimeline({transcript}),
      detectCompliancePolicyViolations({
        conversationTranscript: transcript,
        policyDocuments: policyDocuments,
      }),
      detectLanguages({ transcript }),
      classifyCallOutcome({ transcript }),
      generateRiskScore({ transcript }),
    ]);

    const coachingInput = {
      conversationTranscript: transcript,
      agentName: agentName,
      overallSentiment: summaryAndTopics.overallSentiment,
      customerIntent: intent.primaryCustomerIntent,
      keyTopics: summaryAndTopics.topics,
      extractedPolicies: policyDocuments.join('\n'),
    };

    const agentCoaching = await generateAgentPerformanceCoaching(coachingInput);

    const result: AnalysisResult = {
      transcript: transcript,
      languages: languagesResult.languages,
      summary: summaryAndTopics.summary,
      overallSentiment: summaryAndTopics.overallSentiment,
      primaryCustomerIntent: intent.primaryCustomerIntent,
      keyTopics: summaryAndTopics.topics,
      sentimentTimeline: sentimentTimelineResult.timeline,
      policyViolations: violationsResult.violationDetails.map(v => ({
        ...v,
        severity: v.severity as 'LOW' | 'MEDIUM' | 'HIGH',
      })),
      agentPerformance: {
        agentName: agentName,
        agentId: 'A-78910', // mock
        agentAvatarUrl: mockAnalysisResult.agentPerformance.agentAvatarUrl, // mock
        overallScore: agentCoaching.agentScore,
        strengths: agentCoaching.strengths,
        areasForImprovement: agentCoaching.areasForImprovement,
        actionableCoachingPoints: agentCoaching.actionableCoachingPoints.map(p => ({
          point: p.point,
          reference: p.reference,
        })),
      },
      callOutcome: outcomeResult,
      riskScore: riskScoreResult,
      trends: mockAnalysisResult.trends, // mock
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({error: 'Invalid request body', details: error.issues}, {status: 400});
    }
    return NextResponse.json({error: 'An internal error occurred'}, {status: 500});
  }
}
