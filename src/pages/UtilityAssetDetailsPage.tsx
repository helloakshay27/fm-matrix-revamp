import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Eye, Edit, Plus, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const UtilityAssetDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isInUse, setIsInUse] = useState(true);

  // Mock data - replace with actual API call
  const assetData = {
    id: id || '202068',
    name: 'DIESEL GENERATOR',
    assetNumber: '246810',
    site: 'Lockated Site 1',
    building: 'Tower 101',
    wing: 'A Wing',
    floor: 'Common',
    area: 'Common',
    room: 'NA',
    customerName: 'DIESEL GENERATOR ParentMeter',
    assetCode: 'a95ae876f09cde4b4afb',
    assetType: 'Non-Comprehensive',
    modelNumber: 'ABC',
    serialNo: 'ACEF12',
    manufacturer: '',
    locationType: 'N/A',
    meterType: 'ParentMeter',
    meterCategoryName: 'DG',
    externalStatus: '',
    dateOfInstallation: 'NA',
    breakdownDate: 'NA',
    purchasedOn: '02/02/2025',
    createdOn: '03/02/2025 5:11 PM',
    capacity: '1000 1',
    equipmentId: '123456',
    purchaseCost: '₹100000.0',
    group: 'Electrical System',
    meterApplicable: 'Yes',
    subgroup: 'DG Set',
    critical: 'No',
    updatedOn: '13/06/2025 10:52 AM',
    comments: '',
    meterCategory: 'NA',
    consumerNo: 'A1B2C3',
    totalCostOfRepair: '560',
    description: '',
    lifeLeft: ''
  };

  const amcData = [
    {
      id: 1,
      supplier: 'Schindler',
      startDate: '12/12/2024',
      endDate: '01/05/2025',
      firstService: '17/02/2025',
      createdOn: '04/02/2025'
    }
  ];

  const warrantyData = {
    underWarranty: 'Yes',
    warrantyExpiresOn: 'NA',
    commissioningDate: 'NA',
    warrantyStartDate: 'NA'
  };

  const supplierContact = {
    name: 'NA',
    mobileNumber: 'NA',
    email: 'NA',
    panNumber: 'NA'
  };

  const amcInfo = {
    id: '49124',
    cost: '₹5600',
    startDate: '12/12/2024',
    endDate: '01/05/2025',
    firstService: '17/02/2025',
    paymentTerms: 'Visit Based Payment',
    noOfVisits: '3',
    remarks: ''
  };

  const attachments = [
    { name: 'AMC Contracts 1', fileName: 'CVIT_QR.pdf' },
    { name: 'AMC Invoices 1', fileName: 'EON_JI_QR.pdf' }
  ];

  const amcDataLogs = [
    {
      assetPeriod: '12/12/2024 - 01/05/2025',
      visitNo: '12',
      visitDate: '09/04/2025'
    }
  ];

  const ppmStatusData = [
    { status: 'Schedule', count: 0, color: 'bg-purple-600' },
    { status: 'Open', count: 0, color: 'bg-orange-600' },
    { status: 'In Progress', count: 0, color: 'bg-orange-500' },
    { status: 'Closed', count: 0, color: 'bg-green-600' },
    { status: 'Overdue', count: 0, color: 'bg-red-600' }
  ];

  const ebomData = [
    {
      name: 'Diesel',
      id: '95905',
      type: 'Consumable',
      group: 'Electrical System',
      subGroup: 'DG Set',
      category: 'Non Technical',
      criticality: 'Non-Critical',
      quantity: '5.0',
      unit: 'Litre',
      cost: '650.0',
      sacHsnCode: '',
      minStockLevel: '2',
      minOrderLevel: '7',
      asset: 'DIESEL GENERATOR',
      status: 'Active',
      expiryDate: '09/05/2025'
    }
  ];

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
              <h1 className="text-2xl font-bold text-gray-800">
                {assetData.name} (#{assetData.id})
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Breakdown</span>
                <Switch checked={isInUse} onCheckedChange={setIsInUse} />
                <span className="text-sm text-gray-600">In Use</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Details
              </Button>
              <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2">
                Create a Checklist
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="asset-info" className="space-y-6">
          <TabsList className="grid w-full grid-cols-10">
            <TabsTrigger value="asset-info">Asset Info</TabsTrigger>
            <TabsTrigger value="amc-details">AMC Details</TabsTrigger>
            <TabsTrigger value="ppm">PPM</TabsTrigger>
            <TabsTrigger value="e-bom">E-BOM</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="readings">Readings</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="history-card">History Card</TabsTrigger>
            <TabsTrigger value="cost-ownership">Cost Of Ownership</TabsTrigger>
          </TabsList>

          {/* Asset Info Tab */}
          <TabsContent value="asset-info" className="space-y-6">
            {/* Location Details */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📍</span>
                </div>
                <CardTitle className="text-orange-500">LOCATION DETAILS</CardTitle>
                <div className="ml-auto">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">QR</span>
                  </div>
                  <span className="text-orange-500 font-bold">QR CODE</span>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-8">
                    {[
                      { label: 'Site', value: assetData.site },
                      { label: 'Building', value: assetData.building },
                      { label: 'Wing', value: assetData.wing },
                      { label: 'Floor', value: assetData.floor },
                      { label: 'Area', value: assetData.area },
                      { label: 'Room', value: assetData.room }
                    ].map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                        <div className="text-sm font-medium">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚙️</span>
                </div>
                <CardTitle className="text-orange-500">ASSET DETAILS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <span className="text-sm text-gray-500">Customer Name:</span>
                    <p className="font-medium">{assetData.customerName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Asset Name:</span>
                    <p className="font-medium">{assetData.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Asset Number:</span>
                    <p className="font-medium">{assetData.assetNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Asset Code:</span>
                    <p className="font-medium">{assetData.assetCode}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Asset Type:</span>
                    <p className="font-medium">{assetData.assetType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Model Number:</span>
                    <p className="font-medium">{assetData.modelNumber}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Serial No:</span>
                    <p className="font-medium">{assetData.serialNo}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Manufacturer:</span>
                    <p className="font-medium">{assetData.manufacturer || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Location Type:</span>
                    <p className="font-medium">{assetData.locationType}</p>
                  </div>
                  {/* Add more fields as needed */}
                </div>
              </CardContent>
            </Card>

            {/* Warranty Details */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🛡️</span>
                </div>
                <CardTitle className="text-orange-500">WARRANTY DETAILS</CardTitle>
                <div className="ml-auto">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📞</span>
                  </div>
                  <span className="text-orange-500 font-bold">SUPPLIER CONTACT DETAILS</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Under Warranty:</span>
                        <p className="font-medium">{warrantyData.underWarranty}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Warranty Expires on:</span>
                        <p className="font-medium">{warrantyData.warrantyExpiresOn}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Commissioning Date:</span>
                        <p className="font-medium">{warrantyData.commissioningDate}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Warranty Start Date:</span>
                        <p className="font-medium">{warrantyData.warrantyStartDate}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-500">Name:</span>
                        <p className="font-medium">{supplierContact.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Mobile Number:</span>
                        <p className="font-medium">{supplierContact.mobileNumber}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Email:</span>
                        <p className="font-medium">{supplierContact.email}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">PAN Number:</span>
                        <p className="font-medium">{supplierContact.panNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AMC Details Tab */}
          <TabsContent value="amc-details" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">✕</span>
                </div>
                <CardTitle className="text-red-500">AMC DETAILS</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sr.No</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>First Service</TableHead>
                      <TableHead>Created On</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amcData.map((amc, index) => (
                      <TableRow key={index}>
                        <TableCell>{amc.id}</TableCell>
                        <TableCell>{amc.supplier}</TableCell>
                        <TableCell>{amc.startDate}</TableCell>
                        <TableCell>{amc.endDate}</TableCell>
                        <TableCell>{amc.firstService}</TableCell>
                        <TableCell>{amc.createdOn}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Supplier Information */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🏢</span>
                </div>
                <CardTitle className="text-orange-500">SUPPLIER INFORMATION</CardTitle>
                <div className="ml-auto flex gap-2">
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Visit
                  </Button>
                  <Button variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">Schindler</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium text-blue-600">lockated@yandex.com</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mobile1:</span>
                      <p className="font-medium">8548758475</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Mobile2:</span>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Company name:</span>
                      <p className="font-medium">Schindler</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Information Table */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🏢</span>
                </div>
                <CardTitle className="text-orange-500">ASSET INFORMATION</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-blue-100">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Under Warranty</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Empty table as shown in reference */}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* AMC Information */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📋</span>
                </div>
                <CardTitle className="text-orange-500">AMC INFORMATION</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">ID:</span>
                      <p className="font-medium">{amcInfo.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Cost:</span>
                      <p className="font-medium">{amcInfo.cost}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">End Date:</span>
                      <p className="font-medium">{amcInfo.endDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Payment Terms:</span>
                      <p className="font-medium">{amcInfo.paymentTerms}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Remarks:</span>
                      <p className="font-medium">{amcInfo.remarks || '-'}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <div className="flex items-center gap-2">
                        <Switch checked={true} />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Start Date:</span>
                      <p className="font-medium">{amcInfo.startDate}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">First Service:</span>
                      <p className="font-medium">{amcInfo.firstService}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">No. of Visits:</span>
                      <p className="font-medium">{amcInfo.noOfVisits}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📎</span>
                </div>
                <CardTitle className="text-orange-500">ATTACHMENTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="border-b pb-4">
                      <h4 className="font-medium mb-2">{attachment.name}</h4>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                          <span className="text-white text-xs">📄</span>
                        </div>
                        <span className="text-sm">{attachment.fileName}</span>
                        <Button size="sm" variant="ghost" className="text-blue-600">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AMC Data Logs */}
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
                <CardTitle className="text-orange-500">AMC DATA LOGS</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead>Asset Period</TableHead>
                      <TableHead>Visit No</TableHead>
                      <TableHead>Visit Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {amcDataLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{log.assetPeriod}</TableCell>
                        <TableCell>{log.visitNo}</TableCell>
                        <TableCell>{log.visitDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PPM Tab */}
          <TabsContent value="ppm" className="space-y-6">
            <div className="grid grid-cols-5 gap-4 mb-6">
              {ppmStatusData.map((status, index) => (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <div className={`${status.color} text-white rounded-lg p-4 mb-2`}>
                      <div className="text-2xl font-bold">{status.count}</div>
                    </div>
                    <div className="text-sm font-medium">{status.status}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 mx-auto mb-4 opacity-50">
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-4xl">📋</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">No Scheduled Task</h3>
              </CardContent>
            </Card>
          </TabsContent>

          {/* E-BOM Tab */}
          <TabsContent value="e-bom" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-purple-700">E-BOM Details</CardTitle>
                  <Button className="bg-purple-700 hover:bg-purple-800 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Group</TableHead>
                      <TableHead>Sub Group</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Criticality</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>SAC/HSN Code</TableHead>
                      <TableHead>Min. Stock Level</TableHead>
                      <TableHead>Min.Order Level</TableHead>
                      <TableHead>Asset</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ebomData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.id}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.group}</TableCell>
                        <TableCell>{item.subGroup}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.criticality}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.cost}</TableCell>
                        <TableCell>{item.sacHsnCode}</TableCell>
                        <TableCell>{item.minStockLevel}</TableCell>
                        <TableCell>{item.minOrderLevel}</TableCell>
                        <TableCell className="text-blue-600">{item.asset}</TableCell>
                        <TableCell>
                          <Switch checked={item.status === 'Active'} />
                        </TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs can be implemented similarly */}
          <TabsContent value="attachments">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Attachments content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="readings">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Readings content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Logs content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history-card">
            <Card>
              <CardContent className="p-8 text-center">
                <p>History Card content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cost-ownership">
            <Card>
              <CardContent className="p-8 text-center">
                <p>Cost of Ownership content coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
