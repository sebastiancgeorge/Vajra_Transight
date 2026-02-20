'use client';

import React, { useState, useTransition, useEffect, useMemo } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AnalysisForm } from '@/components/dashboard/analysis-form';
import { AnalysisView } from '@/components/dashboard/analysis-view';
import { mockTranscript } from '@/lib/mock-data';
import type { AnalysisResult, TrendData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  useAuth,
  useFirestore,
  useUser,
  useCollection,
  initiateAnonymousSignIn,
  addDocumentNonBlocking,
  useMemoFirebase,
} from '@/firebase';
import { collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { HistoryItem } from '@/components/dashboard/history-item';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, startTransition] = useTransition();
  const [transcript, setTranscript] = useState<string>(mockTranscript);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  // Sign in user anonymously if not already signed in
  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  // Fetch conversation history from Firestore
  const conversationsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(collection(firestore, 'conversations'), orderBy('createdAt', 'desc'))
        : null,
    [firestore]
  );
  const { data: analysisHistory, isLoading: isHistoryLoading } = useCollection<AnalysisResult>(conversationsQuery);

  // Set the first analysis as selected by default
  useEffect(() => {
    if (!selectedAnalysis && analysisHistory && analysisHistory.length > 0) {
      setSelectedAnalysis(analysisHistory[0]);
    }
  }, [analysisHistory, selectedAnalysis]);

  const handleAnalyze = () => {
    startTransition(async () => {
      setSelectedAnalysis(null);
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

        const result: Omit<AnalysisResult, 'id'|'createdAt'> = await response.json();

        // Save result to Firestore
        if (firestore) {
          const conversationsCol = collection(firestore, 'conversations');
          const newDoc = { ...result, createdAt: serverTimestamp() };
          await addDocumentNonBlocking(conversationsCol, newDoc);
          toast({
            title: 'Analysis Complete',
            description: 'The conversation has been analyzed and saved.',
          });
        }
      } catch (error: any) {
        console.error('Failed to analyze:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error.message || 'Could not analyze the transcript. Please try again.',
        });
        setSelectedAnalysis(null);
      }
    });
  };

  const trendData = useMemo<TrendData | null>(() => {
    if (!analysisHistory) return null;

    const topicCounts = new Map<string, number>();
    analysisHistory.forEach((analysis) => {
      analysis.keyTopics.forEach((topic) => {
        topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
      });
    });

    const sortedTopics = Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      topIssues: sortedTopics.map(([issue, count]) => ({ issue, count })),
    };
  }, [analysisHistory]);

  const fullAnalysisResult = useMemo<AnalysisResult | null>(() => {
    if (!selectedAnalysis) return null;
    return {
      ...selectedAnalysis,
      agentPerformance: {
        ...selectedAnalysis.agentPerformance,
        agentAvatarUrl: 'https://picsum.photos/seed/agent/100/100'
      },
      trends: trendData || { topIssues: [] },
    };
  }, [selectedAnalysis, trendData]);


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-svh">
          <div className="w-1/4 max-w-xs border-r">
              <div className="flex h-16 items-center border-b px-4">
                  <h2 className="font-headline text-lg font-semibold flex items-center gap-2"><History className="w-5 h-5"/> History</h2>
              </div>
              <ScrollArea className="h-[calc(100svh-4rem)]">
                  <div className="p-2 space-y-1">
                      {isHistoryLoading && <p className="p-2 text-sm text-muted-foreground">Loading history...</p>}
                      {analysisHistory && analysisHistory.map((item) => (
                        <HistoryItem
                            key={item.id}
                            item={item}
                            isSelected={selectedAnalysis?.id === item.id}
                            onClick={() => setSelectedAnalysis(item)}
                        />
                      ))}
                  </div>
              </ScrollArea>
          </div>
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <ScrollArea className="h-[calc(100svh-4rem)]">
              <main className="flex-1 space-y-8 p-4 md:p-6 lg:p-8">
                {isClient ? (
                  <AnalysisForm
                    transcript={transcript}
                    setTranscript={setTranscript}
                    onAnalyze={handleAnalyze}
                    isPending={isAnalyzing}
                  />
                ) : (
                  <Skeleton className="h-[250px] w-full rounded-lg" />
                )}
                <AnalysisView analysisResult={fullAnalysisResult} isPending={isAnalyzing || (isHistoryLoading && !analysisHistory)} />
              </main>
            </ScrollArea>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
