'use client';

import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { PolicyEditor } from '@/components/settings/policy-editor';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, SlidersHorizontal } from 'lucide-react';
import { ConfigurationViewer } from '@/components/settings/configuration-viewer';


export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 space-y-8 p-4 md:p-6 lg:p-8">
          <h1 className="font-headline text-3xl font-semibold">Settings</h1>
          <Tabs defaultValue="policies" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="policies"><FileText className="mr-2 h-4 w-4"/> Policies</TabsTrigger>
              <TabsTrigger value="configurations"><SlidersHorizontal className="mr-2 h-4 w-4"/> Configurations</TabsTrigger>
            </TabsList>
            <TabsContent value="policies" className="mt-4">
              <PolicyEditor />
            </TabsContent>
            <TabsContent value="configurations" className="mt-4">
               <ConfigurationViewer />
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
