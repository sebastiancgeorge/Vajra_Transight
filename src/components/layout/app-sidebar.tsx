'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { LayoutDashboard, Settings, LifeBuoy, History } from 'lucide-react';
import type { AnalysisResult } from '@/lib/types';
import { ScrollArea } from '../ui/scroll-area';
import { HistoryItem } from '../dashboard/history-item';
import { Skeleton } from '../ui/skeleton';

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    href: '/support',
    label: 'Support',
    icon: LifeBuoy,
  },
];

interface AppSidebarProps {
  showHistory?: boolean;
  history?: AnalysisResult[] | null;
  isHistoryLoading?: boolean;
  onSelectHistoryItem?: (item: AnalysisResult) => void;
  selectedHistoryItemId?: string | null;
}

export function AppSidebar({
  showHistory,
  history,
  isHistoryLoading,
  onSelectHistoryItem,
  selectedHistoryItemId,
}: AppSidebarProps) {
  const { state } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span
            className={`font-headline text-lg font-semibold text-sidebar-foreground ${
              state === 'collapsed' ? 'hidden' : 'inline'
            }`}
          >
            Verity Insights
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col">
        <SidebarMenu className="p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {showHistory && (
          <div className="flex flex-1 flex-col min-h-0">
            <SidebarSeparator />
            <div className={`flex items-center gap-2 p-2 pt-3 ${state === 'collapsed' ? 'justify-center' : ''}`}>
              <History className="h-5 w-5 shrink-0" />
              <h2 className={`font-headline text-lg font-semibold ${ state === 'collapsed' ? 'hidden' : 'inline'}`}>History</h2>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {isHistoryLoading && state === 'expanded' && (
                  <>
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </>
                )}
                {state === 'expanded' && history && onSelectHistoryItem && history.map((item) => (
                  <HistoryItem
                    key={item.id}
                    item={item}
                    isSelected={selectedHistoryItemId === item.id}
                    onClick={() => onSelectHistoryItem(item)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
