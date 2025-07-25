import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Smartphone, Camera } from 'lucide-react';

export const QRTestPage: React.FC = () => {
  const navigate = useNavigate();

  const simulateAppScan = () => {
    // Simulate scanning QR code through the app
    navigate('/mobile/restaurant/dashboard?source=app');
  };

  const simulateExternalScan = () => {
    // Simulate scanning QR code through external camera (Google Lens, etc.)
    navigate('/mobile/restaurant?source=external');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner Test</h1>
          <p className="text-gray-600">
            Test the restaurant ordering flow by simulating different QR scan sources
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={simulateAppScan}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold flex items-center justify-center"
          >
            <Smartphone className="w-6 h-6 mr-3" />
            Scan via App
          </Button>

          <Button
            onClick={simulateExternalScan}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-4 rounded-xl text-lg font-semibold flex items-center justify-center"
          >
            <Camera className="w-6 h-6 mr-3" />
            Scan via External Camera
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-2">Test Flow:</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>App Scan:</strong> Shows F&B dashboard with Restaurant/My Orders tabs</p>
            <p><strong>External Scan:</strong> Shows Welcome page with conference room info</p>
            <p>Both flows lead to the same restaurant menu and ordering process</p>
          </div>
        </div>
      </div>
    </div>
  );
};