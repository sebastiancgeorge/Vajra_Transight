'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { AnalysisResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import type { Timestamp } from 'firebase/firestore';

// A type guard to check if the value is a Firebase Timestamp
function isTimestamp(value: any): value is Timestamp {
  return value && typeof value.toDate === 'function';
}

interface HistoryItemProps {
  item: AnalysisResult;
  isSelected: boolean;
  onClick: () => void;
}

export function HistoryItem({ item, isSelected, onClick }: HistoryItemProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (item.createdAt && isTimestamp(item.createdAt)) {
      setTimeAgo(formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }));
    } else {
      setTimeAgo('Just now');
    }
  }, [item.createdAt]);

  return (
    <Button
      variant={isSelected ? 'secondary' : 'ghost'}
      className="w-full justify-start h-auto py-2 px-3 text-left"
      onClick={onClick}
    >
      <div>
        <p className="font-semibold text-sm truncate">{item.analytics.summary}</p>
        <p className="text-xs text-muted-foreground">
          {timeAgo || <>&nbsp;</>}
        </p>
      </div>
    </Button>
  );
}
