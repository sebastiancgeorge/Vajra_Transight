'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRiskScoreInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the conversation.'),
});
export type GenerateRiskScoreInput = z.infer<typeof GenerateRiskScoreInputSchema>;

const GenerateRiskScoreOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('A risk score from 0 (no risk) to 100 (high risk) for potential customer churn or escalation.'),
  reason: z.string().describe('A brief explanation for the assigned risk score.'),
});
export type GenerateRiskScoreOutput = z.infer<typeof GenerateRiskScoreOutputSchema>;

export async function generateRiskScore(input: GenerateRiskScoreInput): Promise<GenerateRiskScoreOutput> {
  return generateRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskScorePrompt',
  input: { schema: GenerateRiskScoreInputSchema },
  output: { schema: GenerateRiskScoreOutputSchema },
  prompt: `Analyze the following conversation transcript for risk of customer churn or escalation.
The transcript may contain multiple speakers, identified by 'Speaker (Name):'.
Consider factors like customer frustration, unresolved issues, and negative sentiment.
Provide a risk score from 0 to 100 and a brief justification.

Transcript:
{{{transcript}}}`,
});

const generateRiskScoreFlow = ai.defineFlow({
    name: 'generateRiskScoreFlow',
    inputSchema: GenerateRiskScoreInputSchema,
    outputSchema: GenerateRiskScoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
