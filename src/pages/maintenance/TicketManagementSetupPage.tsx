
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoryTypeTab } from '@/components/ticket-management/CategoryTypeTab';
import { SubCategoryTab } from '@/components/ticket-management/SubCategoryTab';
import { StatusTab } from '@/components/ticket-management/StatusTab';
import { OperationalDaysTab } from '@/components/ticket-management/OperationalDaysTab';
import { ComplaintModeTab } from '@/components/ticket-management/ComplaintModeTab';
import { AgingRuleTab } from '@/components/ticket-management/AgingRuleTab';

export const TicketManagementSetupPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('category-type');

  useEffect(() => {
    // Check if there's a saved tab in localStorage
    const savedTab = localStorage.getItem('ticketManagementActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
      // Clear the saved tab after restoring
      localStorage.removeItem('ticketManagementActiveTab');
    }
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ticket Management Setup</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white border border-gray-200">
          <TabsTrigger
            value="category-type"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Category Type
          </TabsTrigger>

          <TabsTrigger
            value="sub-category"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Sub Category
          </TabsTrigger>

          <TabsTrigger
            value="status"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Status
          </TabsTrigger>

          <TabsTrigger
            value="operational-days"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Operational Days
          </TabsTrigger>

          <TabsTrigger
            value="complaint-mode"
            className="group flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            Complaint Mode
          </TabsTrigger>
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
