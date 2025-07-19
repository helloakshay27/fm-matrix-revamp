
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Plus, ChevronDown } from 'lucide-react';
import { AssetInfoTab } from '@/components/asset-details/AssetInfoTab';
import { AssetAnalyticsTab } from '@/components/asset-details/AssetAnalyticsTab';
import { AMCDetailsTab } from '@/components/asset-details/AMCDetailsTab';
import { PPMTab } from '@/components/asset-details/PPMTab';
import { EBOMTab } from '@/components/asset-details/EBOMTab';
import { AttachmentsTab } from '@/components/asset-details/AttachmentsTab';
import { ReadingsTab } from '@/components/asset-details/ReadingsTab';
import { LogsTab } from '@/components/asset-details/LogsTab';
import { HistoryCardTab } from '@/components/asset-details/HistoryCardTab';
import { DepreciationTab } from '@/components/asset-details/DepreciationTab';
import { TicketTab } from '@/components/asset-details/TicketTab';
import { RepairReplaceModal } from '@/components/RepairReplaceModal';
import { EditStatusModal } from '@/components/EditStatusModal';

export const AssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInUse, setIsInUse] = useState(true);
  const [isRepairReplaceOpen, setIsRepairReplaceOpen] = useState(false);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);

  const asset = {
    id: id || '203696',
    name: 'DELL LAPTOP',
    code: '#3423',
    status: 'In Use'
  };

  const handleBack = () => {
    navigate('/maintenance/asset');
  };

  const handleEditClick = () => {
    setIsEditStatusOpen(true);
  };

  const handleEditDetails = () => {
    navigate(`/maintenance/asset/edit/${asset.id}`);
  };

  const handleCreateChecklist = () => {
    console.log('Create Checklist clicked');
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsInUse(checked);
    if (checked) {
      setIsRepairReplaceOpen(true);
    }
  };

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Assets
          </button>
          <span>&gt;</span>
          <span>Asset Details</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                {asset.name} ({asset.code})
              </h1>
              
              <div className="relative">
                <select className="appearance-none bg-green-500 text-white px-4 py-2 pr-8 rounded font-medium text-sm cursor-pointer">
                  <option>In Use</option>
                  <option>Breakdown</option>
                  <option>Under Maintenance</option>
                  <option>Retired</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Created by Rakesh • Last updated by Rakesh on 06/01/2022, 12:22pm
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCreateChecklist}
              className="bg-[#1e40af] hover:bg-[#1e40af]/90 text-white px-4 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Checklist
            </Button>

            <Button
              onClick={handleEditDetails}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 px-4 py-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="asset-info" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
            <TabsTrigger value="asset-info" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              Asset Info
            </TabsTrigger>
            <TabsTrigger value="amc-details" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              AMC Details
            </TabsTrigger>
            <TabsTrigger value="ppm" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              PPM
            </TabsTrigger>
            <TabsTrigger value="e-bom" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              E-BOM
            </TabsTrigger>
            <TabsTrigger value="attachments" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              Attachments
            </TabsTrigger>
            <TabsTrigger value="readings" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              Readings
            </TabsTrigger>
            <TabsTrigger value="logs" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              Logs
            </TabsTrigger>
            <TabsTrigger value="history-card" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              History Card
            </TabsTrigger>
            <TabsTrigger value="depreciation" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              Depreciation
            </TabsTrigger>
            <TabsTrigger value="ticket" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">
              Ticket
            </TabsTrigger>
          </TabsList>

          <TabsContent value="asset-info" className="p-0">
            <Tabs defaultValue="analytics" className="w-full">
              <TabsList className="grid grid-cols-2 bg-white border-b h-auto p-0 rounded-none">
                <TabsTrigger 
                  value="analytics" 
                  className="rounded-none py-3 px-6 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 font-medium"
                >
                  📊 Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="info" 
                  className="rounded-none py-3 px-6 data-[state=active]:bg-[#C72030] data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-800 font-medium"
                >
                  🎯 Asset List
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analytics" className="p-4 sm:p-6 mt-0">
                <AssetAnalyticsTab />
              </TabsContent>
              
              <TabsContent value="info" className="p-4 sm:p-6 mt-0">
                <AssetInfoTab assetId={asset.id} />
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="amc-details" className="p-4 sm:p-6">
            <AMCDetailsTab />
          </TabsContent>
          <TabsContent value="ppm" className="p-4 sm:p-6">
            <PPMTab />
          </TabsContent>
          <TabsContent value="e-bom" className="p-4 sm:p-6">
            <EBOMTab />
          </TabsContent>
          <TabsContent value="attachments" className="p-4 sm:p-6">
            <AttachmentsTab />
          </TabsContent>
          <TabsContent value="readings" className="p-4 sm:p-6">
            <ReadingsTab />
          </TabsContent>
          <TabsContent value="logs" className="p-4 sm:p-6">
            <LogsTab />
          </TabsContent>
          <TabsContent value="history-card" className="p-4 sm:p-6">
            <HistoryCardTab />
          </TabsContent>
          <TabsContent value="depreciation" className="p-4 sm:p-6">
            <DepreciationTab />
          </TabsContent>
          <TabsContent value="ticket" className="p-4 sm:p-6">
            <TicketTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <RepairReplaceModal
        isOpen={isRepairReplaceOpen}
        onClose={() => setIsRepairReplaceOpen(false)}
      />

      <EditStatusModal
        isOpen={isEditStatusOpen}
        onClose={() => setIsEditStatusOpen(false)}
      />
    </div>
  );
};
