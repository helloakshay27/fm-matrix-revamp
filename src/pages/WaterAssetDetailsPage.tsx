
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit } from 'lucide-react';
import { WaterAssetInfoTab } from '@/components/water-asset-details/WaterAssetInfoTab';
import { WaterAMCDetailsTab } from '@/components/water-asset-details/WaterAMCDetailsTab';
import { WaterPPMTab } from '@/components/water-asset-details/WaterPPMTab';
import { WaterEBOMTab } from '@/components/water-asset-details/WaterEBOMTab';
import { WaterAttachmentsTab } from '@/components/water-asset-details/WaterAttachmentsTab';
import { WaterReadingsTab } from '@/components/water-asset-details/WaterReadingsTab';
import { WaterLogsTab } from '@/components/water-asset-details/WaterLogsTab';
import { WaterHistoryCardTab } from '@/components/water-asset-details/WaterHistoryCardTab';
import { WaterCostOfOwnershipTab } from '@/components/water-asset-details/WaterCostOfOwnershipTab';
import { EditStatusModal } from '@/components/EditStatusModal';

export const WaterAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInUse, setIsInUse] = useState(true);
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false);

  // Mock water asset data based on the asset ID from URL
  const assetDatabase = {
    '53619': {
      id: '53619',
      name: 'Borewell',
      code: '83898732f107c5df0121',
      assetNo: '505',
      status: 'In Use',
      equipmentId: '',
      building: 'Sarova',
      site: 'Located Site 1',
      wing: 'SW1',
      floor: 'FW1',
      area: 'AW1'
    },
    '53615': {
      id: '53615',
      name: 'Tanker',
      code: 'c302fd076e1a78a9116',
      assetNo: '502',
      status: 'In Use',
      equipmentId: '',
      building: 'Twin Tower',
      site: 'Located Site 1',
      wing: '',
      floor: '',
      area: ''
    }
  };

  // Get asset data based on ID from URL
  const asset = assetDatabase[id as keyof typeof assetDatabase] || {
    id: id || 'Unknown',
    name: 'Asset Not Found',
    code: 'N/A',
    assetNo: 'N/A',
    status: 'Unknown',
    equipmentId: '',
    building: 'Unknown',
    site: 'Unknown',
    wing: '',
    floor: '',
    area: ''
  };

  // Set initial switch state based on asset status
  React.useEffect(() => {
    setIsInUse(asset.status === 'In Use');
  }, [asset.status]);

  const handleBack = () => {
    navigate('/utility/water');
  };

  const handleEditDetails = () => {
    navigate(`/utility/water/edit/${asset.id}?type=Water`);
  };

  const handleCreateChecklist = () => {
    console.log('Create Checklist clicked for water asset:', asset.id);
  };

  const handleEditClick = () => {
    setIsEditStatusOpen(true);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Assets List
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">
            {asset.name.toUpperCase()} (#{asset.id})
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

        {/* Asset Info Display */}
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Asset Code:</span>
              <span className="ml-2 font-mono">{asset.code}</span>
            </div>
            <div>
              <span className="text-gray-600">Asset No:</span>
              <span className="ml-2">{asset.assetNo}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${asset.status === 'In Use' ? 'bg-green-500 text-white' :
                  asset.status === 'Breakdown' ? 'bg-red-500 text-white' :
                    'bg-gray-500 text-white'
                }`}>
                {asset.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Building:</span>
              <span className="ml-2">{asset.building}</span>
            </div>
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
            <WaterAssetInfoTab assetId={asset.id} />
          </TabsContent>

          <TabsContent value="amc-details" className="p-6">
            <WaterAMCDetailsTab />
          </TabsContent>

          <TabsContent value="ppm" className="p-6">
            <WaterPPMTab />
          </TabsContent>

          <TabsContent value="e-bom" className="p-6">
            <WaterEBOMTab />
          </TabsContent>

          <TabsContent value="attachments" className="p-6">
            <WaterAttachmentsTab />
          </TabsContent>

          <TabsContent value="readings" className="p-6">
            <WaterReadingsTab />
          </TabsContent>

          <TabsContent value="logs" className="p-6">
            <WaterLogsTab />
          </TabsContent>

          <TabsContent value="history-card" className="p-6">
            <WaterHistoryCardTab />
          </TabsContent>

          <TabsContent value="cost-ownership" className="p-6">
            <WaterCostOfOwnershipTab />
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
