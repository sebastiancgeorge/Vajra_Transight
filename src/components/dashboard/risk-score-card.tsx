'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { RiskScore } from '@/lib/types';
import { RadialBar, RadialBarChart, PolarAngleAxis } from 'recharts';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

type RiskScoreCardProps = {
  riskScore: RiskScore;
};

export function RiskScoreCard({ riskScore }: RiskScoreCardProps) {
  const chartData = [{ value: riskScore.score }];

  const getRiskInfo = () => {
    if (riskScore.score > 75) {
      return {
        Icon: ShieldX,
        colorClass: 'text-destructive',
        fillColor: 'var(--destructive)',
        label: 'High Risk',
      };
    }
    if (riskScore.score > 40) {
      return {
        Icon: ShieldAlert,
        colorClass: 'text-accent',
        fillColor: 'var(--accent)',
        label: 'Medium Risk',
      };
    }
    return {
      Icon: ShieldCheck,
      colorClass: 'text-chart-3',
      fillColor: 'var(--chart-3)',
      label: 'Low Risk',
    };
  };

  const { Icon, colorClass, fillColor, label } = getRiskInfo();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10`}>
            <Icon className={`h-6 w-6 text-primary`} />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">Risk & Escalation</CardTitle>
            <CardDescription>
              Potential for churn or negative outcome.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium">Risk Score</h3>
          <div className="relative h-24 w-24">
            <RadialBarChart
              width={96}
              height={96}
              cx="50%"
              cy="50%"
              innerRadius="80%"
              outerRadius="100%"
              barSize={6}
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
                fill={fillColor}
                cornerRadius={3}
              />
            </RadialBarChart>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold font-headline ${colorClass}`}>
                {riskScore.score}
              </span>
            </div>
          </div>
           <span className={`text-sm font-semibold ${colorClass}`}>{label}</span>
        </div>
        <div className="flex flex-col justify-center">
            <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                Justification
            </h4>
            <p className="text-sm">{riskScore.reason}</p>
        </div>
      </CardContent>
    </Card>
  );
}
