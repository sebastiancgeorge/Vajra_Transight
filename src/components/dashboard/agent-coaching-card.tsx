'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { AgentPerformance } from '@/lib/types';
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import {
  CheckCircle2,
  List,
  Target,
  ThumbsUp,
  TrendingUp,
  Headphones,
  MicOff,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

type AgentCoachingCardProps = {
  performance: AgentPerformance;
};

export function AgentCoachingCard({ performance }: AgentCoachingCardProps) {
  const chartData = [{ value: performance.overallScore }];
  const nameInitials = performance.agentName
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          {performance.agentAvatarUrl && <AvatarImage src={performance.agentAvatarUrl} alt={performance.agentName} data-ai-hint="professional portrait" />}
          <AvatarFallback>{nameInitials}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="font-headline text-2xl">
            Agent Performance: {performance.agentName}
          </CardTitle>
          <CardDescription>ID: {performance.agentId}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center justify-start space-y-2 rounded-lg border bg-card p-4">
          <h3 className="text-lg font-medium">Overall Score</h3>
          <div className="relative h-32 w-32">
            <RadialBarChart
              width={128}
              height={128}
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={8}
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                angleAxisId={0}
                fill="var(--primary)"
                className="fill-primary"
                cornerRadius={4}
              />
            </RadialBarChart>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold font-headline text-primary">
                {performance.overallScore}
              </span>
            </div>
          </div>
          <div className="w-full space-y-3 pt-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Headphones className="h-4 w-4" />
                <span>Talk/Listen Ratio</span>
              </div>
              <span className="font-semibold">{performance.talkToListenRatio}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MicOff className="h-4 w-4" />
                <span>Interruptions</span>
              </div>
              <span className="font-semibold">{performance.interruptionCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Sentiment Trend</span>
              </div>
              <Badge
                variant={
                  performance.sentimentTrend === 'Declining'
                    ? 'destructive'
                    : 'secondary'
                }
                className={
                  performance.sentimentTrend === 'Improving'
                    ? 'border-transparent bg-green-500 text-primary-foreground hover:bg-green-500/80'
                    : ''
                }
              >
                {performance.sentimentTrend}
              </Badge>
            </div>
          </div>
        </div>
        <div className="md:col-span-2">
          <Tabs defaultValue="coaching">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="coaching">
                <Target className="mr-2" /> Coaching
              </TabsTrigger>
              <TabsTrigger value="strengths">
                <ThumbsUp className="mr-2" /> Strengths
              </TabsTrigger>
              <TabsTrigger value="improvements">
                <TrendingUp className="mr-2" /> Improvements
              </TabsTrigger>
            </TabsList>
            <TabsContent value="coaching" className="mt-4 pr-2 max-h-48 overflow-y-auto">
              <ul className="space-y-3">
                {performance.actionableCoachingPoints.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <div>
                      <p className="font-medium">{item.point}</p>
                      {item.reference && (
                        <Badge variant="secondary" className="mt-1">
                          {item.reference}
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="strengths" className="mt-4 pr-2 max-h-48 overflow-y-auto">
              <ul className="space-y-2">
                {performance.strengths.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <ThumbsUp className="h-4 w-4 flex-shrink-0 text-green-500" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="improvements" className="mt-4 pr-2 max-h-48 overflow-y-auto">
              <ul className="space-y-2">
                {performance.areasForImprovement.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <TrendingUp className="h-4 w-4 flex-shrink-0 text-amber-500" />
                    <p>{item}</p>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
