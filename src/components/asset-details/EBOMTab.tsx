
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const EBOMTab = () => {
  const navigate = useNavigate();
  
  const tableHeaders = [
    'Name', 'ID', 'Type', 'Group', 'Sub Group', 'Category', 'Criticality', 
    'Quantity', 'Unit', 'Cost', 'SAC/HSN Code', 'Min. Stock Level', 
    'Min.Order Level', 'Asset', 'Status', 'Expiry Date'
  ];

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

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Empty table - no data to display */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
