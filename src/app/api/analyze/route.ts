import {NextRequest, NextResponse} from 'next/server';
import {z} from 'zod';
import { analyzeConversation } from '@/ai/flows/analyze-conversation';
import { organizationConfig } from '@/lib/organization';
import type { AnalysisResult } from '@/lib/types';

const AnalyzeRequestSchema = z.object({
  transcript: z.string(),
});

// Helper to extract agent name from transcript, e.g., "Agent (Sarah):"
function extractAgentName(transcript: string): string {
  const match = transcript.match(/Agent \((.*?)\):/);
  return match ? match[1] : 'Unknown Agent';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {transcript} = AnalyzeRequestSchema.parse(body);

    const agentName = extractAgentName(transcript);

    // Call the single, consolidated analysis flow
    const analysisOutput = await analyzeConversation({
      transcript,
      businessDomain: organizationConfig.businessDomain,
      products: organizationConfig.products,
      policyDocuments: organizationConfig.policies,
    });

    // Map the structured AI output to our application's AnalysisResult type.
    const result: Omit<AnalysisResult, 'id' | 'createdAt' | 'trends' | 'agentPerformance.agentAvatarUrl'> = {
      transcript: transcript,
      analytics: {
        summary: analysisOutput.analytics.summary,
        languages: analysisOutput.analytics.languages,
        overallSentiment: analysisOutput.analytics.overallSentiment,
        primaryCustomerIntent: analysisOutput.analytics.primaryCustomerIntent,
        keyTopics: analysisOutput.analytics.keyTopics,
        sentimentTimeline: analysisOutput.analytics.sentimentTimeline,
      },
      classifications: {
        callOutcome: analysisOutput.classifications.callOutcome,
        riskScore: analysisOutput.classifications.riskScore,
        policyViolations: analysisOutput.classifications.policyViolations,
      },
      agentPerformance: {
        agentName: agentName,
        agentId: 'A-78910', // This can be improved to be dynamic later
        ...analysisOutput.agentPerformance,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({error: 'Invalid request body', details: error.issues}, {status: 400});
    }
    // Return the actual error message from the AI service or internal logic
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
