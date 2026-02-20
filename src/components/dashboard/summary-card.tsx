import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookText } from 'lucide-react';

interface SummaryCardProps {
  summary: string;
  topics: string[];
}

export function SummaryCard({ summary, topics }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <BookText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">Conversation Summary</CardTitle>
            <CardDescription>
              A brief overview of the interaction.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed">{summary}</p>
        <div>
          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
            Key Topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic, index) => (
              <Badge key={index} variant="secondary">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
