import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Interface for each EBOM item
interface EBOMItem {
  id: number;
  name: string;
  inventory_type: string;
  asset_group: string;
  asset_sub_group: string;
  category: string;
  criticality: string;
  quantity: number;
  unit: string;
  cost: number;
  hsn: string;
  min_stock_level: string;
  min_order_level: string;
  asset_name: string;
  asset_id: number;
  active: boolean;
  expiry_date: string | null;
}

// Interface for the Asset
interface Asset {
  id: number;
  name: string;
  ebom_details?: EBOMItem[];
}

// Props for EBOMTab
interface EBOMTabProps {
  asset: Asset;
  assetId?: string | number;
}

// EBOMTab Component
export const EBOMTab: React.FC<EBOMTabProps> = ({ asset }) => {
  const navigate = useNavigate();

  // Table column headers
  const tableHeaders = [
    'Name',
    'ID',
    'Type',
    'Group',
    'Sub Group',
    'Category',
    'Criticality',
    'Quantity',
    'Unit',
    'Cost',
    'SAC/HSN Code',
    'Min. Stock Level',
    'Min.Order Level',
    'Asset',
    'Status',
    'Expiry Date',
  ];

  // Add button click handler
  const handleAddClick = () => {
    navigate('/maintenance/inventory/add');
  };

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <div>
        <Button
          onClick={handleAddClick}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {/* EBOM Table - Styled like PPMTab */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#F6F4EE' }}>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                  style={{ fontWeight: 600 }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {asset.ebom_details && asset.ebom_details.length > 0 ? (
              asset.ebom_details.map((item, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{item.name?.trim() || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.inventory_type}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.asset_group}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.asset_sub_group}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.criticality}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.unit}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{localStorage.getItem('currency')}{item.cost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.hsn || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.min_stock_level}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.min_order_level || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.asset_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.active ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{item.expiry_date || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeaders.length}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No EBOM data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
