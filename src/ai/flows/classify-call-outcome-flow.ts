'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClassifyCallOutcomeInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the conversation.'),
});
export type ClassifyCallOutcomeInput = z.infer<typeof ClassifyCallOutcomeInputSchema>;

const ClassifyCallOutcomeOutputSchema = z.object({
  outcome: z
    .enum(['Resolved', 'Escalated', 'Dropped', 'Requires Follow-up', 'No Action Needed'])
    .describe('The final outcome of the call.'),
  reason: z.string().describe('A brief explanation for the classified outcome.'),
});
export type ClassifyCallOutcomeOutput = z.infer<typeof ClassifyCallOutcomeOutputSchema>;

export async function classifyCallOutcome(input: ClassifyCallOutcomeInput): Promise<ClassifyCallOutcomeOutput> {
  return classifyCallOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyCallOutcomePrompt',
  input: { schema: ClassifyCallOutcomeInputSchema },
  output: { schema: ClassifyCallOutcomeOutputSchema },
  prompt: `Analyze the following conversation transcript and classify its final outcome.
The transcript may contain multiple speakers, identified by 'Speaker (Name):'.
Determine if the issue was resolved, if it was escalated, if the call was dropped, or if it requires follow-up. Provide a brief reason for your classification.

Transcript:
{{{transcript}}}`,
});

const classifyCallOutcomeFlow = ai.defineFlow({
    name: 'classifyCallOutcomeFlow',
    inputSchema: ClassifyCallOutcomeInputSchema,
    outputSchema: ClassifyCallOutcomeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
