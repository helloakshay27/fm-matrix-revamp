import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronDown, 
  Gauge, 
  Calendar, 
  ArrowRightLeft, 
  FileText, 
  Ticket, 
  ClipboardCheck, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Wrench
} from 'lucide-react';

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

const assetOptions = [
  { key: 'meter', label: 'Meter', icon: Gauge },
  { key: 'scheduled-tasks', label: 'Scheduled Tasks', icon: Calendar },
  { key: 'asset-movement', label: 'Asset Movement', icon: ArrowRightLeft },
  { key: 'audit', label: 'Audit', icon: ClipboardCheck },
  { key: 'asset-tickets', label: 'Asset Tickets', icon: Ticket },
  { key: 'amc-details', label: 'AMC Details', icon: FileText },
  { key: 'depreciation', label: 'Depreciation', icon: DollarSign },
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in use':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'breakdown':
      case 'under repair':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'in use':
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'breakdown':
      case 'under repair':
        return <AlertTriangle className="h-4 w-4" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const renderSectionContent = (key: string) => {
    // Mock data for demonstration
    switch (key) {
      case 'meter':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Current Reading:</span>
              <span>1,250 hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last Reading:</span>
              <span>1,200 hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Reading Date:</span>
              <span>2025-01-25</span>
            </div>
          </div>
        );
      case 'scheduled-tasks':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Weekly Maintenance</p>
              <p className="text-gray-500 text-xs">Status: Scheduled | Due: 2025-01-30</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">Monthly Inspection</p>
              <p className="text-gray-500 text-xs">Status: Completed | Due: 2025-02-01</p>
            </div>
          </div>
        );
      case 'asset-movement':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Movement to Building A</p>
              <p className="text-gray-500 text-xs">Date: 2025-01-20 | By: John Doe</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">Location Update</p>
              <p className="text-gray-500 text-xs">Date: 2025-01-15 | By: Jane Smith</p>
            </div>
          </div>
        );
      case 'audit':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Annual Audit</p>
              <p className="text-gray-500 text-xs">Status: Completed | Date: 2024-12-15</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">Quarterly Review</p>
              <p className="text-gray-500 text-xs">Status: Pending | Due: 2025-03-31</p>
            </div>
          </div>
        );
      case 'asset-tickets':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Maintenance Request #001</p>
              <p className="text-gray-500 text-xs">Status: Open | Priority: High</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">Repair Ticket #002</p>
              <p className="text-gray-500 text-xs">Status: Closed | Priority: Medium</p>
            </div>
          </div>
        );
      case 'amc-details':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Contract Start:</span>
              <span>2024-01-01</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contract End:</span>
              <span>2024-12-31</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vendor:</span>
              <span>ABC Services</span>
            </div>
          </div>
        );
      case 'depreciation':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Original Value:</span>
              <span>₹50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Current Value:</span>
              <span>₹35,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Depreciation Rate:</span>
              <span>10% per year</span>
            </div>
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">No data available</p>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
        <Card style={{ backgroundColor: '#E8E2D3' }}>
          <CardContent className="p-4">
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
                    className="text-red-600 text-xs underline"
                  >
                    Breakdown
                  </button>
                )}
                <Badge className={`${getStatusColor(asset.status)} flex items-center gap-1`}>
                  {getStatusIcon(asset.status)}
                  {asset.status || 'In Use'}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900">Asset Info</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Asset Name</span>
                  <span className="text-gray-900 font-medium">{asset.name}</span>
                </div>
                
                {asset.assetGroup && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Group/Subgroup</span>
                    <span className="text-gray-900">
                      {asset.assetGroup}
                      {asset.assetSubGroup && ` / ${asset.assetSubGroup}`}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-500">Equipment ID</span>
                  <span className="text-gray-900">{asset.assetNumber || asset.id}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options Section */}
        <Card style={{ backgroundColor: '#E8E2D3' }}>
          <CardContent className="p-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Please select below options
            </h3>
            
            <div className="space-y-2">
              {assetOptions.map((option) => {
                const Icon = option.icon;
                const isOpen = openSections[option.key];
                
                return (
                  <Collapsible
                    key={option.key}
                    open={isOpen}
                    onOpenChange={() => toggleSection(option.key)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Icon className="h-4 w-4 text-orange-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {option.label}
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
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        {renderSectionContent(option.key)}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};