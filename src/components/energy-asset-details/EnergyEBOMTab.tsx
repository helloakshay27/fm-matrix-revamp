
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const EnergyEBOMTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Group</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sub Group</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Criticality</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">SAC/HSN Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Min. Stock Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Min.Order Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Asset</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Expiry Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm text-gray-900">Diesel</td>
                <td className="px-4 py-3 text-sm text-gray-900">95905</td>
                <td className="px-4 py-3 text-sm text-gray-900">Consumable</td>
                <td className="px-4 py-3 text-sm text-gray-900">Electrical System</td>
                <td className="px-4 py-3 text-sm text-gray-900">DG Set</td>
                <td className="px-4 py-3 text-sm text-gray-900">Non Technical</td>
                <td className="px-4 py-3 text-sm text-gray-900">Non-Critical</td>
                <td className="px-4 py-3 text-sm text-gray-900">5.0</td>
                <td className="px-4 py-3 text-sm text-gray-900">Litre</td>
                <td className="px-4 py-3 text-sm text-gray-900">660.0</td>
                <td className="px-4 py-3 text-sm text-gray-900"></td>
                <td className="px-4 py-3 text-sm text-gray-900">2</td>
                <td className="px-4 py-3 text-sm text-gray-900">7</td>
                <td className="px-4 py-3 text-sm text-blue-600">DIESEL GENERATOR</td>
                <td className="px-4 py-3">
                  <div className="w-6 h-3 bg-red-500 rounded-none"></div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">09/05/2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
