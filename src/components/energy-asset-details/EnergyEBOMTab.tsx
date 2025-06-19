
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const EnergyEBOMTab = () => {
  const bomData = [
    {
      name: 'Diesel',
      id: '9505',
      type: 'Consumable',
      group: 'Electrical System',
      subGroup: 'DG Set',
      category: 'Non Technical',
      criticality: 'Non Critical',
      quantity: 5.0,
      unit: 'Litre',
      cost: '650.0',
      sacHsnCode: '-',
      minStockLevel: 2,
      minOrderLevel: 7,
      asset: 'DIESEL GENERATOR',
      status: '🔘',
      expiryDate: '09/05/2025'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">📋</div>
          <h3 className="text-lg font-semibold text-orange-500 uppercase">E-BOM</h3>
        </div>
        <Button 
          className="bg-[#C72030] hover:bg-[#A61B2A] text-white"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Name</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">ID</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Type</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Group</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Sub Group</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Category</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Criticality</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Quantity</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Unit</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Cost</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">SAC/HSN Code</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Min. Stock Level</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Min Order Level</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Asset</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Status</th>
              <th className="border border-gray-200 px-2 py-2 text-left text-xs font-medium text-gray-700">Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {bomData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.name}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.id}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.type}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.group}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.subGroup}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.category}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.criticality}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.quantity}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.unit}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.cost}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.sacHsnCode}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.minStockLevel}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.minOrderLevel}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs text-blue-600">{item.asset}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.status}</td>
                <td className="border border-gray-200 px-2 py-2 text-xs">{item.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
