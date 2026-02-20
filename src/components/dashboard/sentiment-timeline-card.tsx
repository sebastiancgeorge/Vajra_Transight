'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { SentimentPoint } from '@/lib/types';
import { TrendingUp } from 'lucide-react';

type SentimentTimelineCardProps = {
  timeline: SentimentPoint[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: SentimentPoint = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Segment
            </span>
            <span className="font-bold text-muted-foreground">{data.segment}</span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Sentiment
            </span>
            <span
              className={`font-bold ${
                data.sentiment > 0.1
                  ? 'text-green-500'
                  : data.sentiment < -0.1
                  ? 'text-red-500'
                  : 'text-muted-foreground'
              }`}
            >
              {data.sentiment.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-foreground">{`"${data.text}"`}</p>
      </div>
    );
  }

  return null;
};

export function SentimentTimelineCard({ timeline }: SentimentTimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">Sentiment Timeline</CardTitle>
            <CardDescription>
              Emotional trajectory of the conversation.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={timeline}
              margin={{
                top: 5,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[-1, 1]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted))', stroke: 'hsl(var(--accent))', strokeWidth: 1, radius: 4 }} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 6, stroke: 'hsl(var(--accent))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
