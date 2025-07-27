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
  Move, 
  FileText, 
  Ticket, 
  Shield, 
  TrendingDown,
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
  { key: 'ppm', label: 'PPM', icon: Wrench },
  { key: 'ebom', label: 'E-BOM', icon: FileText },
  { key: 'attachments', label: 'Attachments', icon: FileText },
  { key: 'readings', label: 'Readings', icon: Gauge },
  { key: 'amc-details', label: 'AMC Details', icon: Shield },
  { key: 'tickets', label: 'Tickets', icon: Ticket },
  { key: 'analytics', label: 'Asset Analytics', icon: TrendingDown },
  { key: 'cost-ownership', label: 'Cost of Ownership', icon: Move },
  { key: 'logs', label: 'Logs', icon: FileText },
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
      case 'ppm':
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
      case 'ebom':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Motor Assembly</p>
              <p className="text-gray-500 text-xs">Qty: 1 | Unit: Nos | Cost: ₹25,000</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">Bearing Set</p>
              <p className="text-gray-500 text-xs">Qty: 2 | Unit: Set | Cost: ₹5,000</p>
            </div>
          </div>
        );
      case 'attachments':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Manual_V1.pdf</p>
              <p className="text-gray-500 text-xs">Type: Manual | Size: 2.5MB</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">warranty_cert.jpg</p>
              <p className="text-gray-500 text-xs">Type: Warranty | Size: 1.2MB</p>
            </div>
          </div>
        );
      case 'readings':
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
      case 'tickets':
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
      case 'analytics':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Uptime:</span>
              <span className="text-green-600">95.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Downtime:</span>
              <span className="text-red-600">4.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Next PPM:</span>
              <span>2025-02-15</span>
            </div>
          </div>
        );
      case 'cost-ownership':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Original Value:</span>
              <span>₹50,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Maintenance Cost:</span>
              <span>₹15,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Cost:</span>
              <span className="font-semibold">₹65,000</span>
            </div>
          </div>
        );
      case 'logs':
        return (
          <div className="space-y-2 text-sm">
            <div className="p-2 border rounded">
              <p className="font-medium">Asset Created</p>
              <p className="text-gray-500 text-xs">By: Anushree | Date: 26th Nov, 2020</p>
            </div>
            <div className="p-2 border rounded">
              <p className="font-medium">Status Updated</p>
              <p className="text-gray-500 text-xs">By: Rakesh K. | Date: 01st Jan, 2021</p>
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
                <p className="text-xs text-red-600 font-medium">
                  Asset ID: #{asset.assetNumber || asset.id}
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
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}>
                            <Icon className="h-4 w-4" style={{ color: 'hsl(var(--primary))' }} />
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