
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Plus, QrCode, Download } from 'lucide-react';

// Import existing asset detail tab components
import { AssetInfoTab } from '@/components/asset-details/AssetInfoTab';
import { AMCDetailsTab } from '@/components/asset-details/AMCDetailsTab';
import { PPMTab } from '@/components/asset-details/PPMTab';
import { EBOMTab } from '@/components/asset-details/EBOMTab';
import { AttachmentsTab } from '@/components/asset-details/AttachmentsTab';
import { ReadingsTab } from '@/components/asset-details/ReadingsTab';
import { LogsTab } from '@/components/asset-details/LogsTab';
import { HistoryCardTab } from '@/components/asset-details/HistoryCardTab';
import { CostOfOwnershipTab } from '@/components/asset-details/CostOfOwnershipTab';

export const UtilityAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInUse, setIsInUse] = useState(true);

  // Mock asset data - in real app, this would be fetched based on the ID
  const assetData = {
    name: 'DIESEL GENERATOR',
    id: '#202068',
    customerName: '',
    assetName: 'DIESEL GENERATOR ParentMeter',
    assetNumber: '246810',
    assetCode: 'a85ae876f09cde4b4afb',
    assetType: 'Non-Comprehensive',
    modelNumber: 'ABC',
    serialNo: 'ACEF12',
    manufacturer: '',
    locationInfo: '',
    meterType: 'ParentMeter',
    meterCategoryName: 'DG',
    externalStatus: '',
    dateOfInstallation: 'NA',
    breakdownDate: 'NA',
    purchasedOn: '02/02/2025',
    capacity: '1000 1',
    purchaseCost: '₹1000000.0',
    createdOn: '03/02/2025 5:11 PM',
    equipmentId: '123456',
    subgroup: 'DG Set',
    group: 'Electrical System',
    meterApplicable: 'Yes',
    meterCategory: 'NA',
    critical: 'No',
    updatedOn: '13/06/2025 10:52 AM',
    comments: '',
    description: '',
    consumerNo: 'A1B2C3',
    totalCostOfRepair: '560',
    lifeLeft: '',
    location: {
      site: 'Located Site 1',
      building: 'Tower 101',
      wing: 'A Wing',
      floor: 'NA',
      area: 'Common',
      room: 'NA'
    },
    warranty: {
      underWarranty: 'Yes',
      warrantyExpiresOn: 'NA',
      commissioningDate: 'NA',
      warrantyStartDate: 'NA'
    },
    supplier: {
      name: 'NA',
      mobileNumber: 'NA',
      email: 'NA',
      panNumber: 'NA',
      gstinNumber: 'NA'
    }
  };

  const handleBack = () => {
    navigate('/utility/energy');
  };

  const handleToggleStatus = () => {
    setIsInUse(!isInUse);
    console.log('Asset status toggled:', !isInUse ? 'In Use' : 'Breakdown');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2">
            Assets List &gt; Asset Details
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleBack}
                className="p-0 hover:bg-transparent"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {assetData.name} ({assetData.id})
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Breakdown</span>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    isInUse ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                  onClick={handleToggleStatus}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isInUse ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-600">In Use</span>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Create a Checklist
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Side - Location and Asset Details */}
          <div className="lg:col-span-3 space-y-6">
            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                    📍
                  </div>
                  LOCATION DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-8">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
                      <span className="text-sm font-medium">Site</span>
                      <span className="text-sm text-gray-600">{assetData.location.site}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
                      <span className="text-sm font-medium">Building</span>
                      <span className="text-sm text-gray-600">{assetData.location.building}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
                      <span className="text-sm font-medium">Wing</span>
                      <span className="text-sm text-gray-600">{assetData.location.wing}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
                      <span className="text-sm font-medium">Floor</span>
                      <span className="text-sm text-gray-600">{assetData.location.floor}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
                      <span className="text-sm font-medium">Area</span>
                      <span className="text-sm text-gray-600">{assetData.location.area}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mb-2"></div>
                      <span className="text-sm font-medium">Room</span>
                      <span className="text-sm text-gray-600">{assetData.location.room}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                    ⚙️
                  </div>
                  ASSET DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Customer Name.</span>
                      <span className="text-sm font-medium">: {assetData.customerName || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Asset Code.</span>
                      <span className="text-sm font-medium">: {assetData.assetCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Serial No.</span>
                      <span className="text-sm font-medium">: {assetData.serialNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Meter Type</span>
                      <span className="text-sm font-medium">: {assetData.meterType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Purchased on</span>
                      <span className="text-sm font-medium">: {assetData.purchasedOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created On</span>
                      <span className="text-sm font-medium">: {assetData.createdOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Group</span>
                      <span className="text-sm font-medium">: {assetData.group}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Critical</span>
                      <span className="text-sm font-medium">: {assetData.critical}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Updated On</span>
                      <span className="text-sm font-medium">: {assetData.updatedOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Consumer No.</span>
                      <span className="text-sm font-medium">: {assetData.consumerNo}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Asset Name.</span>
                      <span className="text-sm font-medium">: {assetData.assetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Asset Type.</span>
                      <span className="text-sm font-medium">: {assetData.assetType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Manufacturer</span>
                      <span className="text-sm font-medium">: {assetData.manufacturer || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Meter Category Name</span>
                      <span className="text-sm font-medium">: {assetData.meterCategoryName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Date Of Installation</span>
                      <span className="text-sm font-medium">: {assetData.dateOfInstallation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="text-sm font-medium">: {assetData.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Equipment Id</span>
                      <span className="text-sm font-medium">: {assetData.equipmentId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Meter Applicable</span>
                      <span className="text-sm font-medium">: {assetData.meterApplicable}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Comments</span>
                      <span className="text-sm font-medium">: {assetData.comments || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Cost Of Repair</span>
                      <span className="text-sm font-medium">: {assetData.totalCostOfRepair}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Asset Number.</span>
                      <span className="text-sm font-medium">: {assetData.assetNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Model Number.</span>
                      <span className="text-sm font-medium">: {assetData.modelNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Location Type</span>
                      <span className="text-sm font-medium">: N/A</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">External Status</span>
                      <span className="text-sm font-medium">: {assetData.externalStatus || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Breakdown Date</span>
                      <span className="text-sm font-medium">: {assetData.breakdownDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Purchase Cost</span>
                      <span className="text-sm font-medium">: {assetData.purchaseCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subgroup</span>
                      <span className="text-sm font-medium">: {assetData.subgroup}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Meter Category</span>
                      <span className="text-sm font-medium">: {assetData.meterCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Description</span>
                      <span className="text-sm font-medium">: {assetData.description || '-'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Life Left (yy:mm:dd)</span>
                      <span className="text-sm font-medium">: {assetData.lifeLeft || '-'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warranty Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                    🛡️
                  </div>
                  WARRANTY DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Under Warranty</span>
                      <span className="text-sm font-medium">: {assetData.warranty.underWarranty}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Commissioning Date</span>
                      <span className="text-sm font-medium">: {assetData.warranty.commissioningDate}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Warranty Expires on</span>
                      <span className="text-sm font-medium">: {assetData.warranty.warrantyExpiresOn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Warranty Start Date</span>
                      <span className="text-sm font-medium">: {assetData.warranty.warrantyStartDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - QR Code and Supplier Details */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                    📱
                  </div>
                  QR CODE
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-gray-400" />
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  download
                </Button>
              </CardContent>
            </Card>

            {/* Supplier Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-500 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs">
                    📋
                  </div>
                  SUPPLIER CONTACT DETAILS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="text-sm font-medium">: {assetData.supplier.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mobile Number</span>
                    <span className="text-sm font-medium">: {assetData.supplier.mobileNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email</span>
                    <span className="text-sm font-medium">: {assetData.supplier.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">PAN Number</span>
                    <span className="text-sm font-medium">: {assetData.supplier.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GSTIN Number</span>
                    <span className="text-sm font-medium">: {assetData.supplier.gstinNumber}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-8">
          <Tabs defaultValue="asset-info" className="w-full">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="asset-info">Asset Info</TabsTrigger>
              <TabsTrigger value="amc-details">AMC Details</TabsTrigger>
              <TabsTrigger value="ppm">PPM</TabsTrig>
              <TabsTrigger value="e-bom">E-BOM</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="readings">Readings</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
              <TabsTrigger value="history-card">History Card</TabsTrigger>
              <TabsTrigger value="cost-ownership">Cost Of Ownership</TabsTrigger>
            </TabsList>
            <TabsContent value="asset-info" className="mt-6">
              <AssetInfoTab />
            </TabsContent>
            <TabsContent value="amc-details" className="mt-6">
              <AMCDetailsTab />
            </TabsContent>
            <TabsContent value="ppm" className="mt-6">
              <PPMTab />
            </TabsContent>
            <TabsContent value="e-bom" className="mt-6">
              <EBOMTab />
            </TabsContent>
            <TabsContent value="attachments" className="mt-6">
              <AttachmentsTab />
            </TabsContent>
            <TabsContent value="readings" className="mt-6">
              <ReadingsTab />
            </TabsContent>
            <TabsContent value="logs" className="mt-6">
              <LogsTab />
            </TabsContent>
            <TabsContent value="history-card" className="mt-6">
              <HistoryCardTab />
            </TabsContent>
            <TabsContent value="cost-ownership" className="mt-6">
              <CostOfOwnershipTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
