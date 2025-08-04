
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseEscalationTab } from '@/components/escalation-matrix/ResponseEscalationTab';
import { ResolutionEscalationTab } from '@/components/escalation-matrix/ResolutionEscalationTab';
import { ExecutiveEscalationTab } from '@/components/escalation-matrix/ExecutiveEscalationTab';

export const EscalationMatrixPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('response-escalation');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Escalation Matrix</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger
            value="response-escalation"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Response Escalation
          </TabsTrigger>
          <TabsTrigger
            value="resolution-escalation"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Resolution Escalation
          </TabsTrigger>
          <TabsTrigger
            value="executive-escalation"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Executive Escalation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="response-escalation" className="mt-6">
          <ResponseEscalationTab />
        </TabsContent>

        <TabsContent value="resolution-escalation" className="mt-6">
          <ResolutionEscalationTab />
        </TabsContent>

        <TabsContent value="executive-escalation" className="mt-6">
          <ExecutiveEscalationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
