import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const ExternalFlowTester: React.FC = () => {
  const navigate = useNavigate();

  const testExternalFlow = () => {
    console.log("🧪 TESTING EXTERNAL FLOW");
    console.log("Navigating to restaurant with ?source=external");
    navigate('/mobile/restaurant/49/details?source=external');
  };

  const testAppFlow = () => {
    console.log("🧪 TESTING APP FLOW");
    console.log("Navigating to restaurant with ?source=app");
    navigate('/mobile/restaurant/49/details?source=app');
  };

  const testInternalFlow = () => {
    console.log("🧪 TESTING INTERNAL FLOW");
    console.log("Navigating to restaurant without external source");
    navigate('/mobile/restaurant/49/details');
  };

  const clearConsole = () => {
    console.clear();
    console.log("🧹 Console cleared - Ready for testing!");
  };

  return (
    <div className="p-6 bg-yellow-100 border-2 border-yellow-400 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-4 text-gray-900">🧪 External Flow Tester</h2>
      <p className="mb-4 text-sm text-gray-700">
        Use these buttons to test different user flows. Check the browser console for detailed logs.
      </p>
      
      <div className="space-y-3">
        <Button 
          onClick={clearConsole}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium"
        >
          🧹 Clear Console
        </Button>
        
        <Button 
          onClick={testExternalFlow}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
        >
          🔍 Test External User (Google Lens/QR Scan)
        </Button>
        
        <Button 
          onClick={testAppFlow}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium"
        >
          📱 Test App User (source=app)
        </Button>
        
        <Button 
          onClick={testInternalFlow}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
        >
          🏠 Test Internal User (no source)
        </Button>
      </div>

      <div className="mt-4 p-3 bg-white rounded border text-xs">
        <h3 className="font-semibold mb-2">Expected Flow:</h3>
        <div className="space-y-1">
          <p><strong>External (source=external):</strong> Restaurant → Add Items → Contact Form → Place Order → Success (5s) → Order Details</p>
          <p><strong>App (source=app):</strong> Restaurant → Add Items → Place Order → Success (5s) → My Orders</p>
          <p><strong>Internal (no source):</strong> Restaurant → Add Items → Place Order → Success (5s) → My Orders</p>
          <p className="mt-2 text-green-700"><strong>✅ Source Parameter:</strong> Should be preserved through all navigation steps</p>
          <p className="mt-2 text-blue-700"><strong>📋 Contact Form:</strong> External users fill contact details & location before order placement</p>
        </div>
      </div>
    </div>
  );
};
