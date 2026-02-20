'use client';

import React, { useState, useTransition } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AnalysisForm } from '@/components/dashboard/analysis-form';
import { AnalysisView } from '@/components/dashboard/analysis-view';
import { mockTranscript } from '@/lib/mock-data';
import type { AnalysisResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [transcript, setTranscript] = useState<string>(mockTranscript);
  const { toast } = useToast();

  const handleAnalyze = () => {
    startTransition(async () => {
      setAnalysisResult(null);
      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_ANALYSIS_API_KEY || 'secret-key-for-dev',
          },
          body: JSON.stringify({ transcript }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setAnalysisResult(result);
      } catch (error: any) {
        console.error('Failed to analyze:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error.message || 'Could not analyze the transcript. Please try again.',
        });
        setAnalysisResult(null);
      }
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 space-y-8 p-4 md:p-6 lg:p-8">
          <AnalysisForm
            transcript={transcript}
            setTranscript={setTranscript}
            onAnalyze={handleAnalyze}
            isPending={isPending}
          />
          <AnalysisView analysisResult={analysisResult} isPending={isPending} />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
