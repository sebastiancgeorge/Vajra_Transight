'use server';
/**
 * @fileOverview This file implements a Genkit flow to summarize customer conversation transcripts and extract key topics.
 *
 * - summarizeConversationAndExtractTopics - A function that processes a conversation transcript to generate a summary and identify key topics.
 * - ConversationTranscriptInput - The input type for the summarizeConversationAndExtractTopics function.
 * - ConversationAnalysisOutput - The return type for the summarizeConversationAndExtractTopics function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConversationTranscriptSchema = z.object({
  transcript: z.string().describe('The full transcript of the customer conversation.'),
});
export type ConversationTranscriptInput = z.infer<typeof ConversationTranscriptSchema>;

const ConversationAnalysisOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the conversation.'),
  topics: z.array(z.string()).describe('An array of key topics discussed in the conversation.'),
});
export type ConversationAnalysisOutput = z.infer<typeof ConversationAnalysisOutputSchema>;

export async function summarizeConversationAndExtractTopics(
  input: ConversationTranscriptInput
): Promise<ConversationAnalysisOutput> {
  return summarizeConversationAndExtractTopicsFlow(input);
}

const summarizeConversationPrompt = ai.definePrompt({
  name: 'summarizeConversationAndExtractTopicsPrompt',
  input: { schema: ConversationTranscriptSchema },
  output: { schema: ConversationAnalysisOutputSchema },
  prompt: `You are an expert assistant for a call center manager. Your task is to analyze a customer conversation transcript and provide a concise summary and a list of key topics discussed.

Conversation Transcript:
{{{transcript}}}

Based on the transcript, provide:
1. A concise summary of the conversation.
2. A list of 3-5 key topics that were discussed.`,
});

const summarizeConversationAndExtractTopicsFlow = ai.defineFlow(
  {
    name: 'summarizeConversationAndExtractTopicsFlow',
    inputSchema: ConversationTranscriptSchema,
    outputSchema: ConversationAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeConversationPrompt(input);
    return output!;
  }
);
