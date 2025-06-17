
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export const ServiceDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock service data - in real app this would come from API
  const serviceData = {
    id: id,
    serviceName: 'test',
    serviceCode: '7308b0d91b8107aa7e1c',
    site: '2189',
    building: '651',
    wing: '519',
    area: '1789',
    floor: '',
    room: '',
    createdOn: '2025-06-10 09:44:32 +0530',
    createdBy: '2025-06-10 09:44:32 +0530'
  };

  const handleDownloadQR = () => {
    console.log('Downloading QR code');
    // Create a simple QR code placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    if (ctx) {
      // Create a simple pattern as QR code placeholder
      ctx.fillStyle = '#000';
      for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i * 10, j * 10, 10, 10);
          }
        }
      }
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `service_${id}_qr.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/maintenance/service')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service List
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#1a1a1a] opacity-70 mb-2">Service List &gt; Service Detail</p>
            <h1 className="text-2xl font-bold text-[#1a1a1a]">
              {serviceData.serviceName}({serviceData.serviceCode})
            </h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
            >
              Edit
            </Button>
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              <Settings className="w-4 h-4 mr-2" />
              Associate Service
            </Button>
          </div>
        </div>
      </div>

      {/* Location Detail */}
      <div className="bg-white rounded-lg border mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
              9
            </div>
            <h2 className="text-lg font-semibold text-orange-500">LOCATION DETAIL</h2>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-24">Site</span>
                <span>: {serviceData.site}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Wing</span>
                <span>: {serviceData.wing}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Area</span>
                <span>: {serviceData.area}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Created On</span>
                <span>: {serviceData.createdOn}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex">
                <span className="text-gray-600 w-24">Building</span>
                <span>: {serviceData.building}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Floor</span>
                <span>: {serviceData.floor}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Room</span>
                <span>: {serviceData.room}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 w-24">Created By</span>
                <span>: {serviceData.createdBy}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents and QR Code */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Documents */}
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                📄
              </div>
              <h2 className="text-lg font-semibold text-orange-500">DOCUMENTS</h2>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm">Screenshot_2025-06-05_143144.png</span>
                <Button 
                  size="sm"
                  style={{ backgroundColor: '#C72030' }}
                  className="text-white hover:bg-[#C72030]/90"
                >
                  download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-lg border">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
                🔲
              </div>
              <h2 className="text-lg font-semibold text-orange-500">QR CODE</h2>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                <div className="w-40 h-40 bg-black" style={{
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 5px, black 5px, black 10px),
                                   repeating-linear-gradient(90deg, transparent, transparent 5px, black 5px, black 10px)`,
                  backgroundSize: '10px 10px'
                }}></div>
              </div>
              <Button 
                onClick={handleDownloadQR}
                style={{ backgroundColor: '#C72030' }}
                className="text-white hover:bg-[#C72030]/90"
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Associated Assets */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm mr-3">
              9
            </div>
            <h2 className="text-lg font-semibold text-orange-500">Associated Assets</h2>
          </div>
          <div className="flex">
            <Button 
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90"
            >
              (service)
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="text-sm text-[#1a1a1a] opacity-70">
          Powered by <span className="font-semibold">go</span><span className="text-[#C72030]">Phygital</span><span className="font-semibold">.work</span>
        </div>
      </div>
    </div>
  );
};
