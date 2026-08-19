import React, { Suspense, lazy, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const FieldsSetupPage = lazy(() => import('./FieldsSetupPage'));
const GoldenQrSetupPage = lazy(() => import('./GoldenQrSetupPage').then(m => ({ default: m.GoldenQrSetupPage })));

const TabLoader = () => (
  <div className="flex items-center justify-center p-12">
    <Loader2 className="h-6 w-6 animate-spin text-brand" />
  </div>
);

export default function QrSetupPage() {
  const [activeTab, setActiveTab] = useState('complaint-qr');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">QR Setup</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="complaint-qr"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Golden QR Setup
          </TabsTrigger>
          <TabsTrigger
            value="fields"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Fields Setup
          </TabsTrigger>
          
        </TabsList>

        <TabsContent value="fields" className="mt-6">
          <Suspense fallback={<TabLoader />}>
            <FieldsSetupPage />
          </Suspense>
        </TabsContent>

        <TabsContent value="complaint-qr" className="mt-6">
          <Suspense fallback={<TabLoader />}>
            <GoldenQrSetupPage />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
