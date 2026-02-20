'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DetectLanguagesInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the conversation.'),
});
export type DetectLanguagesInput = z.infer<typeof DetectLanguagesInputSchema>;

const DetectLanguagesOutputSchema = z.object({
  languages: z.array(z.string()).describe('An array of languages detected in the transcript (e.g., ["English", "Spanish"]).'),
});
export type DetectLanguagesOutput = z.infer<typeof DetectLanguagesOutputSchema>;

export async function detectLanguages(input: DetectLanguagesInput): Promise<DetectLanguagesOutput> {
  return detectLanguagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectLanguagesPrompt',
  input: { schema: DetectLanguagesInputSchema },
  output: { schema: DetectLanguagesOutputSchema },
  prompt: `Analyze the following conversation transcript and identify all languages spoken.
The transcript may contain multiple speakers, identified by 'Speaker (Name):'.

Transcript:
{{{transcript}}}`,
});

const detectLanguagesFlow = ai.defineFlow({
    name: 'detectLanguagesFlow',
    inputSchema: DetectLanguagesInputSchema,
    outputSchema: DetectLanguagesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
