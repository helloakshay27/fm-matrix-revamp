
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseEscalationTab } from '@/components/escalation-matrix/ResponseEscalationTab';
import { ResolutionEscalationTab } from '@/components/escalation-matrix/ResolutionEscalationTab';

export const EscalationMatrixPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('response-escalation');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Escalation Matrix</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-red-50 border border-red-200 p-1 rounded-lg">
          <TabsTrigger 
            value="response-escalation"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-red-700 hover:text-red-800 font-medium transition-all"
          >
            Response Escalation
          </TabsTrigger>
          <TabsTrigger 
            value="resolution-escalation"
            className="data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-sm text-red-700 hover:text-red-800 font-medium transition-all"
          >
            Resolution Escalation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="response-escalation" className="mt-6">
          <ResponseEscalationTab />
        </TabsContent>

        <TabsContent value="resolution-escalation" className="mt-6">
          <ResolutionEscalationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
