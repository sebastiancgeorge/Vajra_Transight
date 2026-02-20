'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AssemblyAI, type Transcript, type TranscriptionConfig } from 'assemblyai';

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
    if (!process.env.ASSEMBLYAI_API_KEY || process.env.ASSEMBLYAI_API_KEY === 'your_assemblyai_api_key_here') {
      console.warn("AssemblyAI API key not set. This is a mock transcript. Please add your API key to the .env file to enable audio transcription.");
      return { transcript: `AssemblyAI API key not configured. This is a mock transcript.
Customer: Hi, I'm having trouble with my new XT-5000 camera.
Agent (Sarah): Hello, thank you for calling TechSupport.` };
    }

    const client = new AssemblyAI({
      apiKey: process.env.ASSEMBLYAI_API_KEY,
    });

    try {
      const config: TranscriptionConfig = {
        audio: audioDataUri,
        speaker_labels: true,
        speakers_expected: 2,
        sentiment_analysis: false, // Disabled: Handled by the main analysis flow
        language_detection: true, // Disabled: Handled by the main analysis flow
        summarization: false,      // Disabled: Handled by the main analysis flow
      };
      
      // The AssemblyAI SDK type is missing `speech_models`, so we cast to `any` to add it.
      // This is required by their API to route to the correct transcription model.
      (config as any).speech_models = ['universal-2'];
      
      const transcript: Transcript = await client.transcripts.transcribe(config);

      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      if (!transcript.text || !transcript.utterances || transcript.utterances.length === 0) {
        return { transcript: transcript.text || 'Transcription produced no text.' };
      }
      
      // Use the speaker labels directly from AssemblyAI (e.g., Speaker A, Speaker B)
      // This is more robust than trying to guess who is the customer vs. agent.
      const formattedTranscript = transcript.utterances
        .map(u => `Speaker ${u.speaker}: ${u.text}`)
        .join('\n');

      return { transcript: formattedTranscript };
    } catch (error: any) {
      console.error('AssemblyAI transcription error:', error);
      throw new Error(error.message || 'Failed to transcribe audio with AssemblyAI.');
    }
  }
);
