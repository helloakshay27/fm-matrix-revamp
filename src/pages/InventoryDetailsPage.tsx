import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, QrCode } from 'lucide-react';
export const InventoryDetailsPage = () => {
  const {
    id
  } = useParams();
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/maintenance/inventory');
  };
  const handleFeeds = () => {
    navigate(`/maintenance/inventory/feeds/${id}`);
  };
  return <div className="p-6 bg-[#f6f4ee] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
            <ArrowLeft className="w-4 h-4" />
            <span>Inventory List</span>
          </button>
          <span>&gt;</span>
          <span>Inventory Details</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">test12</h1>
          <Button onClick={handleFeeds} style={{
          backgroundColor: '#C72030'
        }} className="text-white hover:bg-[#C72030]/90">
            Feeds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Detail Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b bg-white">
              <CardTitle className="flex items-center gap-2" style={{
              color: '#C72030'
            }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{
                backgroundColor: '#C72030'
              }}>!</div>
                INVENTORY DETAIL
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium">test12</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Min Stock Level</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Type</label>
                    <Badge className="bg-blue-500 text-white">Consumable</Badge>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Criticality</label>
                    <p className="font-medium">Critical</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Code</label>
                    <p className="font-medium">123987</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Serial Number</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Quantity</label>
                    <p className="font-medium">8.0</p>
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
                    <p className="font-medium">Loccated</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Active</label>
                    <p className="font-medium">Active</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">Rate Contract Vendor</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Max Stock Level</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Min. Order Level</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">SAC/HSN</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Cost</label>
                    <p className="font-medium">NA</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">CGST Rate</label>
                    <p className="font-medium">NA</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Eco-friendly</label>
                    <p className="font-medium">No</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Unit</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Category</label>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Expiry Date</label>
                    <p className="font-medium">-</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Information Section */}
          <Card className="mt-6">
            <CardHeader className="border-b bg-white">
              <CardTitle className="flex items-center gap-2" style={{
              color: '#C72030'
            }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{
                backgroundColor: '#C72030'
              }}>i</div>
                ASSET INFORMATION
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
        </div>

        {/* QR Code Section */}
        <div>
          <Card>
            <CardHeader className="bg-orange-50 border-b">
              <CardTitle className="flex items-center gap-2" style={{
              color: '#C72030'
            }}>
                <QrCode className="w-5 h-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <div className="w-48 h-48 border-2 border-gray-300 flex items-center justify-center bg-gray-50">
                <QrCode className="w-24 h-24 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};