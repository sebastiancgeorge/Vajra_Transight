'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing agent performance
 * and generating actionable coaching insights based on conversation dynamics,
 * sentiment, and adherence to company guidelines.
 *
 * - generateAgentPerformanceCoaching - A function that handles the agent performance coaching generation process.
 * - GenerateAgentPerformanceCoachingInput - The input type for the generateAgentPerformanceCoaching function.
 * - GenerateAgentPerformanceCoachingOutput - The return type for the generateAgentPerformanceCoaching function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAgentPerformanceCoachingInputSchema = z.object({
  conversationTranscript: z.string().describe('The full transcript of the conversation.'),
  agentName: z.string().describe('The name of the agent.'),
  overallSentiment: z.string().describe('The overall sentiment of the conversation (e.g., "positive", "neutral", "negative").'),
  customerIntent: z.string().describe('The primary intent detected for the customer.'),
  keyTopics: z.array(z.string()).describe('A list of key topics discussed in the conversation.'),
  extractedPolicies: z.string().describe('Relevant company policies and guidelines retrieved from a RAG system.'),
  callDurationSeconds: z.number().optional().describe('The total duration of the call in seconds.'),
  agentTalkTimePercentage: z.number().optional().describe('The percentage of time the agent spoke during the conversation.'),
});
export type GenerateAgentPerformanceCoachingInput = z.infer<typeof GenerateAgentPerformanceCoachingInputSchema>;

const GenerateAgentPerformanceCoachingOutputSchema = z.object({
  overallPerformanceSummary: z.string().describe('A high-level summary of the agent\u2019s performance.'),
  strengths: z.array(z.string()).describe('Specific positive aspects of the agent\u2019s performance.'),
  areasForImprovement: z.array(z.string()).describe('Specific aspects where the agent can improve.'),
  actionableCoachingPoints: z.array(z.object({
    point: z.string().describe('A concrete, actionable coaching advice.'),
    reference: z.string().optional().describe('An optional reference to a specific part of the conversation (e.g., a direct quote or timestamp) relevant to the coaching point.'),
  })).describe('A list of concrete, actionable coaching points for the agent.'),
  complianceViolations: z.array(z.object({
    rule: z.string().describe('The specific policy or rule that was violated.'),
    verbatim: z.string().describe('The exact phrase or statement from the transcript that constitutes the violation.'),
    explanation: z.string().describe('An explanation of why this action constitutes a violation.'),
  })).describe('A list of any detected compliance or policy violations.'),
  agentScore: z.number().min(0).max(100).describe('A numerical score between 0 and 100 representing the agent\u2019s overall performance.'),
});
export type GenerateAgentPerformanceCoachingOutput = z.infer<typeof GenerateAgentPerformanceCoachingOutputSchema>;

export async function generateAgentPerformanceCoaching(input: GenerateAgentPerformanceCoachingInput): Promise<GenerateAgentPerformanceCoachingOutput> {
  return generateAgentPerformanceCoachingFlow(input);
}

const generateAgentPerformanceCoachingPrompt = ai.definePrompt({
  name: 'generateAgentPerformanceCoachingPrompt',
  input: { schema: GenerateAgentPerformanceCoachingInputSchema },
  output: { schema: GenerateAgentPerformanceCoachingOutputSchema },
  prompt: `You are an expert quality assurance specialist tasked with evaluating call center agent performance.
Your goal is to provide specific, actionable coaching insights based on the provided conversation transcript, sentiment analysis, key topics, and relevant company policies.
The transcript may contain multiple speakers, identified by 'Speaker (Name):'.

Agent Name: {{{agentName}}}
Overall Conversation Sentiment: {{{overallSentiment}}}
Customer Primary Intent: {{{customerIntent}}}
Key Topics Discussed: {{#each keyTopics}}
- {{{this}}}
{{/each}}

{{#if callDurationSeconds}}
Call Duration: {{callDurationSeconds}} seconds
{{/if}}
{{#if agentTalkTimePercentage}}
Agent Talk Time Percentage: {{agentTalkTimePercentage}}%
{{/if}}

---
Relevant Company Policies:
{{{extractedPolicies}}}
---

Conversation Transcript:
{{{conversationTranscript}}}
---

Based on the above information, provide a comprehensive performance analysis for the agent, including:
1.  An overall performance summary.
2.  Specific strengths demonstrated by the agent.
3.  Key areas where the agent can improve.
4.  Actionable coaching points, referencing specific parts of the conversation if possible (e.g., direct quotes or timestamp references if available in the transcript).
5.  Any detected compliance or policy violations, citing the specific policy, the verbatim phrase from the transcript, and an explanation.
6.  An overall performance score between 0 and 100, where 100 is excellent.
`,
});

const generateAgentPerformanceCoachingFlow = ai.defineFlow(
  {
    name: 'generateAgentPerformanceCoachingFlow',
    inputSchema: GenerateAgentPerformanceCoachingInputSchema,
    outputSchema: GenerateAgentPerformanceCoachingOutputSchema,
  },
  async (input) => {
    const { output } = await generateAgentPerformanceCoachingPrompt(input);
    if (!output) {
      throw new Error('Failed to generate agent performance coaching insights.');
    }
    return output;
  }
);
