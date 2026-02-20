import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import {summarizeConversationAndExtractTopics} from '@/ai/flows/summarize-conversation-and-extract-topics';
import {identifyPrimaryCustomerIntent} from '@/ai/flows/identify-primary-customer-intent';
import {analyzeSentimentTimeline} from '@/ai/flows/analyze-sentiment-timeline';
import {detectCompliancePolicyViolations} from '@/ai/flows/detect-compliance-policy-violations-flow';
import {generateAgentPerformanceCoaching} from '@/ai/flows/generate-agent-performance-coaching';
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
  try {
    const body = await req.json();
    const {transcript} = AnalyzeRequestSchema.parse(body);

    const agentName = extractAgentName(transcript);

    const [
      summaryAndTopics,
      intent,
      sentimentTimelineResult,
      violationsResult,
    ] = await Promise.all([
      summarizeConversationAndExtractTopics({transcript}),
      identifyPrimaryCustomerIntent({transcript}),
      analyzeSentimentTimeline({transcript}),
      detectCompliancePolicyViolations({
        conversationTranscript: transcript,
        policyDocuments: policyDocuments,
      }),
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
      language: 'English (US)', // Hardcoded for now
      summary: summaryAndTopics.summary,
      overallSentiment: summaryAndTopics.overallSentiment,
      primaryCustomerIntent: intent.primaryCustomerIntent,
      keyTopics: summaryAndTopics.topics,
      sentimentTimeline: sentimentTimelineResult.timeline,
      policyViolations: violationsResult.violationDetails.map(v => ({
        ...v,
        // The flow returns LOW, MEDIUM, HIGH. The type expects the same.
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
