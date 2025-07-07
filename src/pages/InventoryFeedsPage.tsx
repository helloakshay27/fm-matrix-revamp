import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

export const InventoryFeedsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/maintenance/inventory/details/${id}`);
  };

  const systemLogs = [
    {
      logId: '17099854',
      changedBy: 'Abdul A',
      logType: 'Iventventory updated',
      changeTimestamp: '2025-06-06 16:29:19',
      changedAttributes: {
        quantity: 'Changed from 10.0 to 8.0'
      },
      updatedAt: 'Changed from 2025-06-06 16:29:13 +0530 to 2025-06-06 16:29:19 +0530'
    },
    {
      logId: '17099853',
      changedBy: 'Abdul A',
      logType: 'Iventventory updated',
      changeTimestamp: '2025-06-06 16:29:13',
      changedAttributes: {
        quantity: 'Changed from nil to 10.0'
      },
      updatedAt: 'Changed from 2025-06-05 21:41:58 +0530 to 2025-06-06 16:29:13 +0530'
    },
    {
      logId: '16990700',
      changedBy: 'Abhishek Sharma',
      logType: 'N/A',
      changeTimestamp: '2025-05-13 21:44:59',
      changedAttributes: {
        id: 'Changed from nil to 97100',
        createdAt: 'Changed from nil to 2025-05-13 21:44:58 +0530',
        updatedAt: 'Changed from nil to 2025-05-13 21:44:58 +0530',
        name: 'Changed from nil to test12',
        inventoryType: 'Changed from nil to 2',
        criticality: 'Changed from nil to 1',
        asset: 'Changed from nil to 52225',
        code: 'Changed from nil to 123987',
        serialNumber: 'Changed from nil to',
        proSite: 'Changed from nil to 2189',
        user: 'Changed from nil to 67909',
        unit: 'Changed from nil to',
        category: 'Changed from nil to'
      }
    }
  ];

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
            <ArrowLeft className="w-4 h-4" />
            <span>Inventory Details</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#C72030' }}>L</div>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">LOGS</h1>
        </div>
      </div>

      {/* System Log Changes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">System Log Changes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {systemLogs.map((log, index) => (
            <div key={log.logId} className="border-b border-gray-200 pb-6 last:border-b-0">
              <div className="mb-3">
                <h3 className="font-semibold text-lg">Log ID: {log.logId}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><span className="font-medium">Changed By:</span> {log.changedBy}</p>
                  <p><span className="font-medium">Log Type:</span> {log.logType}</p>
                  <p><span className="font-medium">Change Timestamp:</span> {log.changeTimestamp}</p>
                </div>
              </div>
              
              <div className="mb-3">
                <h4 className="font-medium text-gray-800 mb-2">Changed Attributes:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {typeof log.changedAttributes === 'object' ? (
                    Object.entries(log.changedAttributes).map(([key, value]) => (
                      <p key={key}><span className="font-medium capitalize">{key}:</span> {value}</p>
                    ))
                  ) : (
                    <p>{log.changedAttributes}</p>
                  )}
                </div>
              </div>
              
              {log.updatedAt && (
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Updated at:</span> {log.updatedAt}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
