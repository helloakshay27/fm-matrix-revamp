import React, { useState, useEffect } from 'react';
import qrCodePlaceholder from '@/assets/qr-code-placeholder.png';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode, Edit, Loader2 } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const InventoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('inventory-detail');

  useEffect(() => {
    const fetchInventoryDetails = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/pms/inventories/${id}.json`);
        setInventoryData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load inventory details');
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/maintenance/inventory');
  };

  const handleFeeds = () => {
    navigate(`/maintenance/inventory/feeds/${id}`);
  };

  const handleEdit = () => {
    navigate(`/maintenance/inventory/edit/${id}`);
  };

  const getInventoryType = (type: number) => {
    return type === 1 ? 'Consumable' : 'Non-Consumable';
  };

  const getCriticality = (criticality: number) => {
    return criticality === 1 ? 'Critical' : 'Non-Critical';
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-white">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-white">
      {/* Header */}
      <div className="mb-6">
        <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030] mb-4">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory List</span>
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">{inventoryData?.name || 'N/A'}</h1>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleFeeds} style={{ backgroundColor: '#C72030' }} className="text-white hover:bg-[#C72030]/90">
              Feeds
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="inventory-detail" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-12 xl:flex-wrap bg-gray-50 rounded-t-lg h-auto p-0 text-sm">
            <TabsTrigger
              value="inventory-detail"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030]"
            >
              Inventory Detail
            </TabsTrigger>
            <TabsTrigger
              value="asset-information"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030]"
            >
              Asset Information
            </TabsTrigger>
            <TabsTrigger
              value="qr-code"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030]"
            >
              QR Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory-detail" className="p-4 sm:p-6">
            <Card className="border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="border-b bg-[#F6F4EE]">
                <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#C72030' }}>!</div>
                  <h2 className="text-lg font-[700] text-black">INVENTORY DETAIL</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Name</label>
                      <p className="font-medium">{inventoryData?.name || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Min Stock Level</label>
                      <p className="font-medium">{inventoryData?.min_stock_level || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Type</label>
                      <Badge className="bg-blue-500 text-white mt-1">
                        {inventoryData?.inventory_type ? getInventoryType(inventoryData.inventory_type) : '-'}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Criticality</label>
                      <p className="font-medium">{inventoryData?.criticality ? getCriticality(inventoryData.criticality) : '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Code</label>
                      <p className="font-medium">{inventoryData?.code || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Serial Number</label>
                      <p className="font-medium">{inventoryData?.serial_number || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Quantity</label>
                      <p className="font-medium">{inventoryData?.quantity || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">SGST Rate</label>
                      <p className="font-medium">NA</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">IGST Rate</label>
                      <p className="font-medium">NA</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Site</label>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Active</label>
                      <p className="font-medium">{inventoryData?.active ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Rate Contract Vendor</label>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Max Stock Level</label>
                      <p className="font-medium">{inventoryData?.max_stock_level || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Min. Order Level</label>
                      <p className="font-medium">{inventoryData?.min_order_level || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">SAC/HSN</label>
                      <p className="font-medium">{inventoryData?.hsc_hsn_code || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Cost</label>
                      <p className="font-medium">{inventoryData?.cost || 'NA'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">CGST Rate</label>
                      <p className="font-medium">NA</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Eco-friendly</label>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Unit</label>
                      <p className="font-medium">{inventoryData?.unit || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Category</label>
                      <p className="font-medium">{inventoryData?.category || '-'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Expiry Date</label>
                      <p className="font-medium">-</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="asset-information" className="p-4 sm:p-6">
            <Card className="mt-6 border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="border-b bg-[#F6F4EE]">
                <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#C72030' }}>i</div>
                  <h2 className="text-lg font-[700] text-black">ASSET INFORMATION</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Name</label>
                      <p className="font-medium">CCTV</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Group</label>
                      <p className="font-medium">CCTV</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">SubGroup</label>
                      <p className="font-medium">CCTV Camera</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Site</label>
                      <p className="font-medium">Sai Radhe, Bund Garden</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600">Wing</label>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Floor</label>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Area</label>
                      <p className="font-medium">-</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Room</label>
                      <p className="font-medium">-</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="qr-code" className="p-4 sm:p-6">
            <Card className="border border-[#D9D9D9] bg-[#F6F7F7]">
              <CardHeader className="border-b bg-[#F6F4EE]">
                <CardTitle className="flex items-center gap-2" style={{ color: '#C72030' }}>
                  <QrCode className="w-5 h-5" />
                  <h2 className="text-lg font-[700] text-black">QR Code</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 flex justify-center">
                <div className="w-48 h-48 bg-gray-100 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <img 
                    src={qrCodePlaceholder} 
                    alt="QR Code" 
                    className="w-40 h-40 object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};