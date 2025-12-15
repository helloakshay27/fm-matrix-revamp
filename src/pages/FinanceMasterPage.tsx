import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, ChevronLeft, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/apiClient";
import { TACCodeTab } from '@/components/finance/TAXCodeTab';
import { GLAccountsTab } from '@/components/finance/GLAccountsTab';
import { StorageLocationTab } from '@/components/finance/StorageLocationTab';

export const FinanceMasterPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tac-code');

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white shadow-sm">
        <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-[#1a1a1a]">Finance Master</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg shadow-sm">
              <TabsTrigger 
                value="tac-code"
                className="data-[state=active]:bg-[#BF213E] data-[state=active]:text-white"
              >
                TAX Code
              </TabsTrigger>
              <TabsTrigger 
                value="gl-accounts"
                className="data-[state=active]:bg-[#BF213E] data-[state=active]:text-white"
              >
                GL Accounts
              </TabsTrigger>
              <TabsTrigger 
                value="storage-location"
                className="data-[state=active]:bg-[#BF213E] data-[state=active]:text-white"
              >
                Storage Location
              </TabsTrigger>
            </TabsList>

            {/* TAx Code Tab */}
            <TabsContent value="tac-code" className="mt-6">
              <TACCodeTab />
            </TabsContent>

            {/* GL Accounts Tab */}
            <TabsContent value="gl-accounts" className="mt-6">
              <GLAccountsTab />
            </TabsContent>

            {/* Storage Location Tab */}
            <TabsContent value="storage-location" className="mt-6">
            <StorageLocationTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FinanceMasterPage;
