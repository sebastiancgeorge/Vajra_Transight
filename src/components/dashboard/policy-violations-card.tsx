import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PolicyViolation } from '@/lib/types';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

type PolicyViolationsCardProps = {
  violations: PolicyViolation[];
};

const severityMap = {
  LOW: {
    variant: 'default',
    className: 'bg-yellow-400/80 text-yellow-900',
    icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
  },
  MEDIUM: {
    variant: 'default',
    className: 'bg-orange-500 text-white',
    icon: <AlertTriangle className="h-4 w-4 text-orange-600" />,
  },
  HIGH: {
    variant: 'destructive',
    className: '',
    icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
  },
} as const;

export function PolicyViolationsCard({ violations }: PolicyViolationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <ShieldAlert className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-xl">Policy Violations</CardTitle>
            <CardDescription>
              {violations.length > 0
                ? `${violations.length} violation(s) detected.`
                : 'No policy violations detected.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {violations.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {violations.map((violation, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    {severityMap[violation.severity].icon}
                    <span className="font-medium">{violation.policyViolated}</span>
                    <Badge
                      variant={severityMap[violation.severity].variant as any}
                      className={severityMap[violation.severity].className}
                    >
                      {violation.severity}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pl-2">
                  <p className="text-sm">{violation.violationDescription}</p>
                  <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                    "{violation.relevantExcerpt}"
                  </blockquote>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center">
            <ShieldAlert className="h-10 w-10 text-green-500" />
            <p className="font-medium">All Clear!</p>
            <p className="text-sm text-muted-foreground">The conversation adhered to all configured policies.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
