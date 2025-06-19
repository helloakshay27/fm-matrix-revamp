
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Download } from 'lucide-react';
import { EnergyAssetInfoTab } from '@/components/energy-asset-details/EnergyAssetInfoTab';
import { EnergyAMCDetailsTab } from '@/components/energy-asset-details/EnergyAMCDetailsTab';
import { EnergyPPMTab } from '@/components/energy-asset-details/EnergyPPMTab';
import { EnergyEBOMTab } from '@/components/energy-asset-details/EnergyEBOMTab';
import { EnergyAttachmentsTab } from '@/components/energy-asset-details/EnergyAttachmentsTab';
import { EnergyReadingsTab } from '@/components/energy-asset-details/EnergyReadingsTab';
import { EnergyLogsTab } from '@/components/energy-asset-details/EnergyLogsTab';
import { EnergyHistoryCardTab } from '@/components/energy-asset-details/EnergyHistoryCardTab';
import { EnergyCostOfOwnershipTab } from '@/components/energy-asset-details/EnergyCostOfOwnershipTab';
import { EditStatusModal } from '@/components/EditStatusModal';

export const EnergyAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInUse, setIsInUse] = useState(true);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);

  // Mock asset data based on the images
  const asset = {
    id: id || '202068',
    name: 'DIESEL GENERATOR',
    code: '865ae67609cde4b4afb',
    status: 'In Use'
  };

  const handleBack = () => {
    navigate('/utility/energy');
  };

  const handleEditDetails = () => {
    navigate(`/utility/energy/edit/${asset.id}`);
  };

  const handleCreateChecklist = () => {
    console.log('Create Checklist clicked');
  };

  const handleEditClick = () => {
    setIsEditStatusOpen(true);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Assets List
          </button>
          <span>&gt;</span>
          <span>Asset Details</span>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {asset.name} (#{asset.id})
          </h1>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Breakdown</span>
              <Switch
                checked={isInUse}
                onCheckedChange={setIsInUse}
                className="data-[state=checked]:bg-green-500"
              />
              <span className="text-sm text-gray-600">In Use</span>
            </div>
            
            <Button 
              onClick={handleEditClick}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
            </Button>
            
            <Button 
              onClick={handleEditDetails}
              variant="outline"
              className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Details
            </Button>
            
            <Button 
              onClick={handleCreateChecklist}
              className="bg-[#C72030] hover:bg-[#A61B2A] text-white"
            >
              Create a Checklist
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="asset-info" className="w-full">
          <TabsList className="grid w-full grid-cols-9 bg-gray-50 rounded-t-lg h-auto p-0">
            <TabsTrigger value="asset-info" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">Asset Info</TabsTrigger>
            <TabsTrigger value="amc-details" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">AMC Details</TabsTrigger>
            <TabsTrigger value="ppm" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">PPM</TabsTrigger>
            <TabsTrigger value="e-bom" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">E-BOM</TabsTrigger>
            <TabsTrigger value="attachments" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]">Attachments</TabsTrigger>
            <TabsTrigger value="readings" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">Readings</TabsTrigger>
            <TabsTrigger value="logs" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">Logs</TabsTrigger>
            <TabsTrigger value="history-card" className="rounded-none border-r data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">History Card</TabsTrigger>
            <TabsTrigger value="cost-ownership" className="rounded-none data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030] text-[#C72030]">Cost Of Ownership</TabsTrigger>
          </TabsList>

          <TabsContent value="asset-info" className="p-6">
            <EnergyAssetInfoTab assetId={asset.id} />
          </TabsContent>

          <TabsContent value="amc-details" className="p-6">
            <EnergyAMCDetailsTab />
          </TabsContent>

          <TabsContent value="ppm" className="p-6">
            <EnergyPPMTab />
          </TabsContent>

          <TabsContent value="e-bom" className="p-6">
            <EnergyEBOMTab />
          </TabsContent>

          <TabsContent value="attachments" className="p-6">
            <EnergyAttachmentsTab />
          </TabsContent>

          <TabsContent value="readings" className="p-6">
            <EnergyReadingsTab />
          </TabsContent>

          <TabsContent value="logs" className="p-6">
            <EnergyLogsTab />
          </TabsContent>

          <TabsContent value="history-card" className="p-6">
            <EnergyHistoryCardTab />
          </TabsContent>

          <TabsContent value="cost-ownership" className="p-6">
            <EnergyCostOfOwnershipTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Status Modal */}
      <EditStatusModal 
        isOpen={isEditStatusOpen}
        onClose={() => setIsEditStatusOpen(false)}
      />
    </div>
  );
};
