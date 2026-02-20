'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { AssemblyAI } from 'assemblyai';

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
      const transcript = await client.transcripts.transcribe({
        audio: audioDataUri,
        speaker_labels: true,
        speech_model: 'universal-2',
      });

      if (transcript.status === 'error') {
        throw new Error(`Transcription failed: ${transcript.error}`);
      }

      if (!transcript.text) {
        throw new Error('Transcription resulted in no text.');
      }

      if (!transcript.utterances || transcript.utterances.length === 0) {
        return { transcript: transcript.text };
      }
      
      const speakers = [...new Set(transcript.utterances.map(u => u.speaker))].sort();

      if (speakers.length === 1) {
        return { transcript: transcript.utterances.map(u => `Customer: ${u.text}`).join('\n') };
      }

      const customerSpeaker = speakers[0];
      const agentSpeaker = speakers[1];
      
      const formattedTranscript = transcript.utterances
        .map(u => {
            let speakerLabel = `Speaker ${u.speaker}`; // Fallback for >2 speakers
            if (u.speaker === customerSpeaker) {
                speakerLabel = 'Customer';
            } else if (agentSpeaker && u.speaker === agentSpeaker) {
                speakerLabel = 'Agent (Sarah)';
            }
            return `${speakerLabel}: ${u.text}`;
        })
        .join('\n');

      return { transcript: formattedTranscript };
    } catch (error: any) {
      console.error('AssemblyAI transcription error:', error);
      throw new Error(error.message || 'Failed to transcribe audio with AssemblyAI.');
    }
  }
);
