'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z.string().describe("Audio file as a data URI, including MIME type and Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

const TranscribeAudioOutputSchema = z.object({
  transcript: z.string().describe("The transcribed text from the audio, with speaker labels if multiple speakers are detected."),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async ({ audioDataUri }) => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: [
        { media: { url: audioDataUri } },
        { text: 'You are an expert transcriptionist. Your task is to transcribe the audio provided. First, verify if the provided media is a valid audio or video file from which audio can be extracted. If it is not, or if the audio is silent or unintelligible, return an error message explaining the problem. Otherwise, transcribe the audio accurately. If there are multiple speakers, label them as "Speaker 1:", "Speaker 2:", etc.' },
      ],
    });

    if (!text) {
      throw new Error('Failed to get a valid transcript from the model.');
    }
    return { transcript: text };
  }
);
