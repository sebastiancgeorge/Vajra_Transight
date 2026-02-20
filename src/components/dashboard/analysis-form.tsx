'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Loader2, Upload } from 'lucide-react';

interface AnalysisFormProps {
  transcript: string;
  setTranscript: (value: string) => void;
  onAnalyze: () => void;
  isPending: boolean;
  isTranscribing: boolean;
  onFileChange: (file: File) => void;
}

export function AnalysisForm({
  transcript,
  setTranscript,
  onAnalyze,
  isPending,
  isTranscribing,
  onFileChange,
}: AnalysisFormProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
    // Reset the file input so the same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-2xl">Conversation Input</CardTitle>
            <CardDescription>
              Paste a conversation transcript or upload an audio file to begin analysis.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste conversation transcript here..."
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          className="min-h-[150px] font-code text-sm"
          disabled={isPending || isTranscribing}
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onAnalyze} disabled={isPending || isTranscribing || !transcript}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Conversation'
            )}
          </Button>
          <Button variant="outline" onClick={handleUploadClick} disabled={isPending || isTranscribing}>
            {isTranscribing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Audio
              </>
            )}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="audio/*,video/mp4,video/mpeg,video/quicktime"
            disabled={isTranscribing}
          />
        </div>
      </CardContent>
    </Card>
  );
}
