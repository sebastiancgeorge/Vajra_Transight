'use server';
/**
 * @fileOverview Analyzes the sentiment of a conversation over time.
 *
 * - analyzeSentimentTimeline - A function that handles the sentiment analysis.
 * - AnalyzeSentimentTimelineInput - The input type for the analyzeSentimentTimeline function.
 * - AnalyzeSentimentTimelineOutput - The return type for the analyzeSentimentTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SentimentPointSchema = z.object({
  segment: z.number().describe('The segment number of the conversation.'),
  time: z.string().describe('The timestamp of the segment (e.g., "0:25").'),
  sentiment: z
    .number()
    .min(-1)
    .max(1)
    .describe(
      'A score from -1 (very negative) to 1 (very positive) representing the sentiment.'
    ),
  text: z.string().describe('The text of the conversation segment.'),
});

const AnalyzeSentimentTimelineInputSchema = z.object({
  transcript: z.string().describe('The full transcript of the customer conversation.'),
});
export type AnalyzeSentimentTimelineInput = z.infer<
  typeof AnalyzeSentimentTimelineInputSchema
>;

const AnalyzeSentimentTimelineOutputSchema = z.object({
  timeline: z
    .array(SentimentPointSchema)
    .describe('An array of sentiment points representing the conversation timeline.'),
});
export type AnalyzeSentimentTimelineOutput = z.infer<
  typeof AnalyzeSentimentTimelineOutputSchema
>;

export async function analyzeSentimentTimeline(
  input: AnalyzeSentimentTimelineInput
): Promise<AnalyzeSentimentTimelineOutput> {
  return analyzeSentimentTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSentimentTimelinePrompt',
  input: {schema: AnalyzeSentimentTimelineInputSchema},
  output: {schema: AnalyzeSentimentTimelineOutputSchema},
  prompt: `Analyze the following conversation transcript and break it down into chronological segments. For each segment, provide a sentiment score from -1.0 (very negative) to 1.0 (very positive), a brief description of the text, and a timestamp.
  The conversation should be broken into about 5-7 segments.

Transcript:
{{{transcript}}}`,
});

const analyzeSentimentTimelineFlow = ai.defineFlow(
  {
    name: 'analyzeSentimentTimelineFlow',
    inputSchema: AnalyzeSentimentTimelineInputSchema,
    outputSchema: AnalyzeSentimentTimelineOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
