import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string | string[];
  icon: LucideIcon;
}

export function OverviewCard({ title, value, icon: Icon }: OverviewCardProps) {
  const displayValue = Array.isArray(value) ? value.join(', ') : value;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-headline truncate" title={displayValue}>{displayValue}</div>
      </CardContent>
    </Card>
  );
}
