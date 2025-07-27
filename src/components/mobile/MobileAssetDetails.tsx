import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown, 
  Info,
  BarChart3,
  FileText, 
  Wrench,
  Package,
  Paperclip,
  Gauge,
  History,
  TrendingDown,
  Ticket,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AssetInfoTab } from '@/components/asset-details/AssetInfoTab';
import { AssetAnalyticsTab } from '@/components/asset-details/AssetAnalyticsTab';
import { AMCDetailsTab } from '@/components/asset-details/AMCDetailsTab';
import { PPMTab } from '@/components/asset-details/PPMTab';
import { EBOMTab } from '@/components/asset-details/EBOMTab';
import { AttachmentsTab } from '@/components/asset-details/AttachmentsTab';
import { ReadingsTab } from '@/components/asset-details/ReadingsTab';
import { HistoryCardTab } from '@/components/asset-details/HistoryCardTab';
import { DepreciationTab } from '@/components/asset-details/DepreciationTab';
import { TicketTab } from '@/components/asset-details/TicketTab';

interface Asset {
  id: string;
  name: string;
  assetNumber: string;
  status: string;
  assetGroup?: string;
  assetSubGroup?: string;
  siteName?: string;
  building?: { name: string } | null;
  wing?: { name: string } | null;
  area?: { name: string } | null;
}

interface MobileAssetDetailsProps {
  asset: Asset;
}

const assetTabs = [
  { key: 'asset-info', label: 'Asset Info', icon: Info, component: AssetInfoTab },
  { key: 'asset-analytics', label: 'Analytics', icon: BarChart3, component: AssetAnalyticsTab },
  { key: 'amc-details', label: 'AMC Details', icon: FileText, component: AMCDetailsTab },
  { key: 'ppm', label: 'PPM', icon: Wrench, component: PPMTab },
  { key: 'e-bom', label: 'E-BOM', icon: Package, component: EBOMTab },
  { key: 'attachments', label: 'Attachments', icon: Paperclip, component: AttachmentsTab },
  { key: 'readings', label: 'Readings', icon: Gauge, component: ReadingsTab },
  { key: 'history-card', label: 'History Card', icon: History, component: HistoryCardTab },
  { key: 'depreciation', label: 'Depreciation', icon: TrendingDown, component: DepreciationTab },
  { key: 'ticket', label: 'Ticket', icon: Ticket, component: TicketTab },
];

export const MobileAssetDetails: React.FC<MobileAssetDetailsProps> = ({ asset }) => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const handleBack = () => {
    navigate(-1);
  };

  const handleBreakdownClick = () => {
    navigate(`/mobile/assets/${asset.id}?action=breakdown`);
  };

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderTabContent = (tab: any) => {
    const TabComponent = tab.component;
    return <TabComponent assetId={asset.id} />;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Asset Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Asset Info Card */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-red-600 font-medium">
                Asset ID : #{asset.assetNumber || asset.id}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {asset.status?.toLowerCase() === 'breakdown' && (
                <button
                  onClick={handleBreakdownClick}
                  className="bg-red-500 text-white px-3 py-1 rounded-full text-xs"
                >
                  Breakdown
                </button>
              )}
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                {asset.status || 'In Use'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Asset Info</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Asset Name</span>
                <span className="text-gray-900 font-medium">: {asset.name}</span>
              </div>
              
              {asset.assetGroup && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Group/Subgroup</span>
                  <span className="text-gray-900">
                    : {asset.assetGroup}
                    {asset.assetSubGroup && ` / ${asset.assetSubGroup}`}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-500">Equipment ID</span>
                <span className="text-gray-900">: {asset.assetNumber || asset.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="bg-white rounded-lg p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Please select below options
          </h3>
          
          <div className="space-y-3">
            {assetTabs.map((tab) => {
              const Icon = tab.icon;
              const isOpen = openSections[tab.key];
              
              return (
                <Collapsible
                  key={tab.key}
                  open={isOpen}
                  onOpenChange={() => toggleSection(tab.key)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {tab.label}
                        </span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200">
                      {renderTabContent(tab)}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};