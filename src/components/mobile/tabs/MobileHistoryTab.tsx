import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

interface HistoryItem {
  id: number;
  date: string;
  action: string;
  description: string;
  user: string;
}

interface MobileHistoryTabProps {
  asset: any;
  assetId?: string | number;
}

export const MobileHistoryTab: React.FC<MobileHistoryTabProps> = ({ asset, assetId }) => {
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const mobileToken = sessionStorage.getItem("mobile_token");
        const baseUrl = sessionStorage.getItem("baseUrl") || "https://oig-api.gophygital.work";
        
        if (!mobileToken) {
          throw new Error("Mobile token not found");
        }

        const idToUse = assetId || asset?.id;
        if (!idToUse) {
          throw new Error("Asset ID not available");
        }

        const response = await fetch(
          `${baseUrl}/pms/assets/${idToUse}/get_asset_history.json`,
          {
            headers: {
              Authorization: `Bearer ${mobileToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setHistoryData(data.activity_history || []);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to fetch asset history:', error);
        // Mock data for fallback
        setHistoryData([
          {
            id: 1,
            date: '28/07/2025',
            action: 'Status Update',
            description: 'Asset status changed to In Use',
            user: 'System Admin'
          },
          {
            id: 2,
            date: '27/07/2025',
            action: 'Maintenance',
            description: 'Routine maintenance completed',
            user: 'Maintenance Team'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [asset, assetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-orange-600" />
        <h3 className="text-base font-semibold text-gray-900">History Details</h3>
      </div>

      {historyData.length > 0 ? (
        <div className="space-y-3">
          {historyData.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-gray-900">{item.action}</span>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-xs text-gray-500">By: {item.user}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No history records found</p>
        </div>
      )}
    </div>
  );
};
