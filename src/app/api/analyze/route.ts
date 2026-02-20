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
  // Simplified auth for local dev, but you might re-enable this in production.
  // const apiKey = req.headers.get('x-api-key');
  // if (apiKey !== process.env.ANALYSIS_API_KEY) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

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

    // The AI now returns the complete analysis. We just need to structure it
    // for our application's `AnalysisResult` type.
    const result: Omit<AnalysisResult, 'id' | 'createdAt' | 'trends' | 'agentPerformance.agentAvatarUrl'> = {
      transcript: transcript,
      languages: analysisOutput.languages,
      summary: analysisOutput.summary,
      overallSentiment: analysisOutput.overallSentiment,
      primaryCustomerIntent: analysisOutput.primaryCustomerIntent,
      keyTopics: analysisOutput.keyTopics,
      sentimentTimeline: analysisOutput.sentimentTimeline,
      policyViolations: analysisOutput.policyViolations, // The structure already matches
      agentPerformance: {
        agentName: agentName, // We still extract this manually for consistency
        agentId: 'A-78910', // This can be improved to be dynamic later
        overallScore: analysisOutput.agentPerformance.overallScore,
        strengths: analysisOutput.agentPerformance.strengths,
        areasForImprovement: analysisOutput.agentPerformance.areasForImprovement,
        actionableCoachingPoints: analysisOutput.agentPerformance.actionableCoachingPoints,
      },
      callOutcome: analysisOutput.callOutcome, // Structure matches
      riskScore: analysisOutput.riskScore, // Structure matches
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
