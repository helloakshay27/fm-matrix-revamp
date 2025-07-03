import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit } from 'lucide-react';
import { AssetInfoTab } from '@/components/asset-details/AssetInfoTab';
import { AMCDetailsTab } from '@/components/asset-details/AMCDetailsTab';
import { PPMTab } from '@/components/asset-details/PPMTab';
import { EBOMTab } from '@/components/asset-details/EBOMTab';
import { AttachmentsTab } from '@/components/asset-details/AttachmentsTab';
import { ReadingsTab } from '@/components/asset-details/ReadingsTab';
import { LogsTab } from '@/components/asset-details/LogsTab';
import { HistoryCardTab } from '@/components/asset-details/HistoryCardTab';
import { CostOfOwnershipTab } from '@/components/asset-details/CostOfOwnershipTab';
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
    name: 'sdcsdc',
    code: '026dd95aa50be420318ea',
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
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 flex-wrap">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" />
            Assets List
          </button>
          <span>&gt;</span>
          <span>Asset Details</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a]">
            {asset.name.toUpperCase()} (#{asset.id})
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Breakdown</span>
              <div className="flex items-center">
                <div
                  className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                    isInUse ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setIsInUse(prev => {
                    const next = !prev;
                    handleSwitchChange(next);
                    return next;
                  })}
                >
                  <span
                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                      isInUse ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </div>
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
              className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
            >
              Create a Checklist
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="asset-info" className="w-full">
          <TabsList className="overflow-x-auto whitespace-nowrap no-scrollbar bg-gray-50 rounded-t-lg border-b px-2">
            {[
              { value: 'asset-info', label: 'Asset Info' },
              { value: 'amc-details', label: 'AMC Details' },
              { value: 'ppm', label: 'PPM' },
              { value: 'e-bom', label: 'E-BOM' },
              { value: 'attachments', label: 'Attachments' },
              { value: 'readings', label: 'Readings' },
              { value: 'logs', label: 'Logs' },
              { value: 'history-card', label: 'History Card' },
              { value: 'cost-ownership', label: 'Cost Of Ownership' }
            ].map(tab => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="inline-block min-w-[140px] px-2 py-3 text-sm text-[#C72030] data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-[#C72030]"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="asset-info" className="p-4 sm:p-6">
            <AssetInfoTab assetId={asset.id} />
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
          <TabsContent value="cost-ownership" className="p-4 sm:p-6">
            <CostOfOwnershipTab />
          </TabsContent>
        </Tabs>
      </div>

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
