import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { transcribeAudio } from '@/ai/flows/transcribe-audio';

const TranscribeRequestSchema = z.object({
  audioDataUri: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioDataUri } = TranscribeRequestSchema.parse(body);

    const result = await transcribeAudio({ audioDataUri });

    return NextResponse.json({ transcript: result.transcript });
  } catch (error) {
    console.error('Transcription API Error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: error.issues }, { status: 400 });
    }
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
