
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryTypeTab } from '@/components/ticket-management/CategoryTypeTab';
import { SubCategoryTab } from '@/components/ticket-management/SubCategoryTab';
import { StatusTab } from '@/components/ticket-management/StatusTab';
import { OperationalDaysTab } from '@/components/ticket-management/OperationalDaysTab';
import { ComplaintModeTab } from '@/components/ticket-management/ComplaintModeTab';
import { AgingRuleTab } from '@/components/ticket-management/AgingRuleTab';

export const TicketManagementSetupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('category-type');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ticket Management Setup</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="category-type">Category Type</TabsTrigger>
          <TabsTrigger value="sub-category">Sub Category</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="operational-days">Operational Days</TabsTrigger>
          <TabsTrigger value="complaint-mode">Complaint Mode</TabsTrigger>
          {/* <TabsTrigger value="aging-rule">Aging Rule</TabsTrigger> */}
        </TabsList>

        <TabsContent value="category-type" className="mt-6">
          <CategoryTypeTab />
        </TabsContent>

        <TabsContent value="sub-category" className="mt-6">
          <SubCategoryTab />
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <StatusTab />
        </TabsContent>

        <TabsContent value="operational-days" className="mt-6">
          <OperationalDaysTab />
        </TabsContent>

        <TabsContent value="complaint-mode" className="mt-6">
          <ComplaintModeTab />
        </TabsContent>

        <TabsContent value="aging-rule" className="mt-6">
          <AgingRuleTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
