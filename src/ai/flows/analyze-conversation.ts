'use server';
/**
 * @fileOverview A comprehensive Genkit flow for end-to-end conversation analysis.
 * This flow consolidates multiple analysis tasks into a single, efficient call.
 *
 * - analyzeConversation - The main function to perform the analysis.
 * - AnalyzeConversationInput - The input type for the flow.
 * - AnalyzeConversationOutput - The return type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AnalyzeConversationInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the customer conversation, including speaker labels like "Customer:" and "Agent (Name):".'),
  policyDocuments: z.array(z.string()).describe('An array of policy documents to check for compliance violations.'),
});
export type AnalyzeConversationInput = z.infer<typeof AnalyzeConversationInputSchema>;

// Output Schema
const SentimentPointSchema = z.object({
  segment: z.number().describe('The chronological segment number of the conversation.'),
  time: z.string().describe('A representative timestamp for the segment (e.g., "0:25").'),
  sentiment: z.number().min(-1).max(1).describe('A score from -1 (very negative) to 1 (very positive) representing the sentiment of the segment.'),
  text: z.string().describe('A brief summary of the conversation text for this segment.'),
});

const PolicyViolationDetailSchema = z.object({
  policyViolated: z.string().describe('The specific policy that was violated.'),
  violationDescription: z.string().describe('A detailed explanation of how the policy was violated.'),
  relevantExcerpt: z.string().describe('The exact text snippet from the conversation where the violation occurred.'),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH']).describe('The severity of the violation.'),
});

const AgentCoachingPointSchema = z.object({
  point: z.string().describe('A concrete, actionable coaching advice for the agent.'),
  reference: z.string().optional().describe('An optional reference to a specific part of the conversation (e.g., a direct quote).'),
});

const AnalyzeConversationOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the entire conversation.'),
  languages: z.array(z.string()).describe('An array of all languages detected in the transcript (e.g., ["English", "Spanish"]).'),
  overallSentiment: z.enum(['Positive', 'Neutral', 'Negative']).describe('The single overall sentiment of the conversation.'),
  primaryCustomerIntent: z.string().describe("A concise classification of the customer's primary reason for the interaction (e.g., 'Technical Support', 'Billing Inquiry')."),
  keyTopics: z.array(z.string()).describe('A list of 3-5 key topics discussed in the conversation.'),
  sentimentTimeline: z.array(SentimentPointSchema).describe('An array of 5-7 sentiment points representing the conversation\'s emotional trajectory.'),
  policyViolations: z.array(PolicyViolationDetailSchema).describe('An array of any detected policy violations. Should be empty if no violations are found.'),
  agentPerformance: z.object({
    overallScore: z.number().min(0).max(100).describe('A numerical score from 0 to 100 for the agent\'s performance.'),
    strengths: z.array(z.string()).describe('Specific positive aspects of the agent\'s performance.'),
    areasForImprovement: z.array(z.string()).describe('Specific areas where the agent can improve.'),
    actionableCoachingPoints: z.array(AgentCoachingPointSchema).describe('A list of concrete coaching points for the agent.'),
  }),
  callOutcome: z.object({
    outcome: z.enum(['Resolved', 'Escalated', 'Dropped', 'Requires Follow-up', 'No Action Needed']).describe('The final classified outcome of the call.'),
    reason: z.string().describe('A brief explanation for the classified outcome.'),
  }),
  riskScore: z.object({
    score: z.number().min(0).max(100).describe('A risk score from 0 (no risk) to 100 (high risk) for customer churn or escalation.'),
    reason: z.string().describe('A brief justification for the assigned risk score.'),
  }),
});
export type AnalyzeConversationOutput = z.infer<typeof AnalyzeConversationOutputSchema>;


// The main exported function
export async function analyzeConversation(
  input: AnalyzeConversationInput
): Promise<AnalyzeConversationOutput> {
  return analyzeConversationFlow(input);
}


// The "Mega" Prompt
const analysisPrompt = ai.definePrompt({
  name: 'analyzeConversationPrompt',
  input: {schema: AnalyzeConversationInputSchema},
  output: {schema: AnalyzeConversationOutputSchema},
  prompt: `You are an expert, multi-tasking conversation analysis engine. Your task is to perform a comprehensive analysis of the provided conversation transcript and return a single, structured JSON object with the results.

Analyze the transcript for the following aspects:

1.  **Languages**: Identify all languages spoken in the transcript.
2.  **Summary**: Provide a concise summary of the entire interaction.
3.  **Overall Sentiment**: Determine the single overall sentiment (Positive, Neutral, or Negative).
4.  **Primary Customer Intent**: Classify the customer's main reason for the call (e.g., 'Technical Support', 'Billing Inquiry').
5.  **Key Topics**: Extract 3-5 main topics discussed.
6.  **Sentiment Timeline**: Break the conversation into 5-7 chronological segments. For each, provide a sentiment score (-1.0 to 1.0), a timestamp, and a brief summary of that segment's text.
7.  **Policy Violations**: Analyze the transcript against the provided policy documents. Identify any violations, detailing the policy, a description, the relevant excerpt, and severity (LOW, MEDIUM, HIGH). If none, this should be an empty array.
8.  **Agent Performance**: Evaluate the agent's performance. Provide an overall score (0-100), a list of strengths, areas for improvement, and specific, actionable coaching points with references to the transcript if possible.
9.  **Call Outcome**: Classify the final outcome of the call (e.g., Resolved, Escalated) and provide a brief reason.
10. **Risk Score**: Calculate a customer churn/escalation risk score (0-100) based on factors like frustration and issue resolution, and provide a brief justification.

You MUST extract the Agent's name from the transcript (e.g., from "Agent (Name):") to use in your analysis.

---
**Policy Documents to Enforce:**
{{#each policyDocuments}}
- {{{this}}}
{{/each}}
---
**Conversation Transcript:**
{{{transcript}}}
---
`,
});

// The Consolidated Genkit Flow
const analyzeConversationFlow = ai.defineFlow(
  {
    name: 'analyzeConversationFlow',
    inputSchema: AnalyzeConversationInputSchema,
    outputSchema: AnalyzeConversationOutputSchema,
  },
  async (input) => {
    const {output} = await analysisPrompt(input);
    if (!output) {
      throw new Error('Failed to get a valid analysis from the AI model.');
    }
    return output;
  }
);
