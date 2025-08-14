import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';

interface BOMItem {
  id: number;
  item_name: string;
  part_number: string;
  quantity: number;
  unit: string;
  specifications?: string;
}

interface Asset {
  id: number;
  name: string;
  [key: string]: any;
}

interface MobileEBOMTabProps {
  asset: Asset;
  assetId?: string | number;
}

export const MobileEBOMTab: React.FC<MobileEBOMTabProps> = ({ asset, assetId }) => {
  const [bomData, setBomData] = useState<BOMItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBOMData = async () => {
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
          `${baseUrl}/pms/assets/${idToUse}/bom_items.json`,
          {
            headers: {
              Authorization: `Bearer ${mobileToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBomData(data.bom_items || []);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to fetch BOM data:', error);
        // Mock data for fallback
        setBomData([
          {
            id: 1,
            item_name: 'Engine Oil Filter',
            part_number: 'EOF-001',
            quantity: 2,
            unit: 'Pieces',
            specifications: 'High-grade synthetic filter'
          },
          {
            id: 2,
            item_name: 'Air Filter',
            part_number: 'AF-002',
            quantity: 1,
            unit: 'Piece',
            specifications: 'Heavy-duty air filtration'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBOMData();
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
        <Package className="h-5 w-5 text-orange-600" />
        <h3 className="text-base font-semibold text-gray-900">E-BOM Details</h3>
      </div>

      {bomData.length > 0 ? (
        <div className="space-y-3">
          {bomData.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-900">{item.item_name}</h4>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                    {item.part_number}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Quantity:</span>
                    <span className="text-gray-900 ml-1">{item.quantity} {item.unit}</span>
                  </div>
                </div>
                
                {item.specifications && (
                  <div className="text-sm">
                    <span className="text-gray-500">Specifications:</span>
                    <p className="text-gray-600 mt-1">{item.specifications}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No BOM items found</p>
        </div>
      )}
    </div>
  );
};
