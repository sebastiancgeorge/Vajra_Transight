'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { LayoutDashboard, Settings, LifeBuoy } from 'lucide-react';

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

export function AppSidebar() {
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
      <SidebarMenu className="flex-1 p-2">
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
    </Sidebar>
  );
}
