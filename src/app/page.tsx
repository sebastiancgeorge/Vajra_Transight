'use client';

import React, { useState, useTransition } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AnalysisForm } from '@/components/dashboard/analysis-form';
import { AnalysisView } from '@/components/dashboard/analysis-view';
import { mockAnalysisResult, mockTranscript } from '@/lib/mock-data';
import type { AnalysisResult } from '@/lib/types';

export default function DashboardPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [transcript, setTranscript] = useState<string>(mockTranscript);

  const handleAnalyze = () => {
    startTransition(() => {
      setAnalysisResult(null);
      setTimeout(() => {
        setAnalysisResult(mockAnalysisResult);
      }, 1500); // Simulate API call delay
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
