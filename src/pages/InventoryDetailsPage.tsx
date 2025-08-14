import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, QrCode, Edit, Loader2, Box } from 'lucide-react';
import { apiClient } from '@/utils/apiClient';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';

export const InventoryDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('inventory-detail');
  const [downloading, setDownloading] = useState(false);

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

  const getInventoryType = (type) => {
    return type === 1 ? 'Consumable' : 'Non-Consumable';
  };

  const getCriticality = (criticality) => {
    return criticality === 1 ? 'Critical' : 'Non-Critical';
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const handleDownload = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      toast.error('Missing baseUrl or token');
      return;
    }
    try {
      setDownloading(true);
      const url = `https://${baseUrl}/pms/inventories/inventory_qr_codes.pdf?inventory_ids=[${id}]`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to download QR PDF');
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `qr-code-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error('Failed to download QR PDF');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading inventory details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <Button variant="ghost" onClick={handleBack} className="w-max">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory List
        </Button>
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleEdit}
            variant="outline"
            className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleFeeds} className="bg-[#C72030] text-white hover:bg-[#C72030]/90">
            Feeds
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <Tabs defaultValue="inventory-detail" className="w-full">
          <TabsList className="flex justify-start flex-nowrap overflow-x-auto no-scrollbar bg-gray-50 rounded-t-lg text-sm">
            <TabsTrigger
              value="inventory-detail"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              INVENTORY DETAIL
            </TabsTrigger>
            <TabsTrigger
              value="qr-code"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              QR CODE
            </TabsTrigger>
            <TabsTrigger
              value="asset-information"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              ASSET INFORMATION
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="bg-white data-[state=active]:bg-[#EDEAE3] px-3 py-2 data-[state=active]:text-[#C72030] whitespace-nowrap"
            >
              HISTORY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory-detail" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">INVENTORY DETAIL</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Name</span>
                    <span>: {inventoryData?.name || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Min Stock Level</span>
                    <span>: {inventoryData?.min_stock_level || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Type</span>
                    <span>: {inventoryData?.inventory_type ? getInventoryType(inventoryData.inventory_type) : '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Criticality</span>
                    <span>: {inventoryData?.criticality ? getCriticality(inventoryData.criticality) : '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Code</span>
                    <span>: {inventoryData?.code || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Serial Number</span>
                    <span>: {inventoryData?.serial_number || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Quantity</span>
                    <span>: {inventoryData?.quantity || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">SGST Rate</span>
                    <span>: NA</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">IGST Rate</span>
                    <span>: NA</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Site</span>
                    <span>: -</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Active</span>
                    <span>: {inventoryData?.active ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Rate Contract Vendor</span>
                    <span>: -</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Max Stock Level</span>
                    <span>: {inventoryData?.max_stock_level || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Min. Order Level</span>
                    <span>: {inventoryData?.min_order_level || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">SAC/HSN</span>
                    <span>: {inventoryData?.hsc_hsn_code || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Cost</span>
                    <span>: {inventoryData?.cost || 'NA'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">CGST Rate</span>
                    <span>: NA</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Eco-friendly</span>
                    <span>: -</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Unit</span>
                    <span>: {inventoryData?.unit || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Category</span>
                    <span>: {inventoryData?.category || '—'}</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Expiry Date</span>
                    <span>: -</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border mt-6">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">HISTORY</h2>
              </div>
              <div className="p-4 text-gray-600 text-sm">
                No history available.
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr-code" className="p-4 sm:p-6">
            <div className="border border-[#D9D9D9] bg-[#F6F7F7] rounded-lg">
              <div className="flex items-center mb-4 bg-[#F6F4EE] p-4">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <QrCode className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">QR CODE</h2>
              </div>
              <div className="text-center">
                <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                  <img
                    src={inventoryData?.qr_code}
                    alt="QR Code"
                    className="w-40 h-40 object-contain"
                    id="qr-code-img"
                  />
                </div>
                {id && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleDownload}
                      className="mt-2 px-4 mb-5 py-2 bg-[#f6f4ee] text-[#a81a27] rounded transition-colors text-sm font-medium flex items-center justify-center"
                      disabled={downloading}
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        'Download QR Code'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="asset-information" className="p-4 sm:p-6">
            <div className="bg-white rounded-lg border mt-6">
              <div className="flex p-4 items-center bg-[#F6F4EE]">
                <div className="w-8 h-8 bg-[#C72030] text-white rounded-full flex items-center justify-center mr-3">
                  <Box className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-[700]">ASSET INFORMATION</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 border border-[#D9D9D9] bg-[#F6F7F7] p-4 gap-6">
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Name</span>
                    <span>: CCTV</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Group</span>
                    <span>: CCTV</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">SubGroup</span>
                    <span>: CCTV Camera</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Site</span>
                    <span>: Sai Radhe, Bund Garden</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Wing</span>
                    <span>: -</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Floor</span>
                    <span>: -</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Area</span>
                    <span>: -</span>
                  </div>
                  <div className="flex text-sm">
                    <span className="text-gray-600 w-24">Room</span>
                    <span>: -</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};