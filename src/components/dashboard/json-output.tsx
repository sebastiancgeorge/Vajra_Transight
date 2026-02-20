'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '../ui/button';
import { ChevronsUpDown, FileJson } from 'lucide-react';

interface JsonOutputProps {
  data: object;
}

export function JsonOutput({ data }: JsonOutputProps) {
  return (
    <Card>
      <Collapsible>
        <CardHeader>
        <div className="flex items-center justify-between">
          <div className='flex items-center gap-3'>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <FileJson className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="font-headline text-xl">JSON Output</CardTitle>
              <CardDescription>
                Raw analysis data for integration.
              </CardDescription>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            <div className="max-h-96 overflow-auto rounded-md bg-muted/50 p-4">
              <pre className="text-sm font-code">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
