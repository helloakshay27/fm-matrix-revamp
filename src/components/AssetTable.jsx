
import React from 'react';
import { Button } from './ui/button';
import { Plus, Import, Filter, Download } from 'lucide-react';

export const AssetTable = ({ onAddAsset }) => {
  const assets = [
    { id: 1, name: 'Laptop Dell XPS', category: 'IT Equipment', status: 'In Use', location: 'Office 1' },
    { id: 2, name: 'Printer HP LaserJet', category: 'Office Equipment', status: 'Available', location: 'Office 2' },
    { id: 3, name: 'Chair Ergonomic', category: 'Furniture', status: 'In Use', location: 'Office 1' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#D5DbDB]">
      <div className="p-6 border-b border-[#D5DbDB]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Assets</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Import className="w-4 h-4" />
              Import
            </Button>
            <Button onClick={onAddAsset} className="flex items-center gap-2 bg-[#C72030] hover:bg-[#A01A28]">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f6f4ee]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[#1a1a1a] uppercase tracking-wider">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5DbDB]">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-[#f6f4ee]">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">{asset.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">{asset.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    asset.status === 'In Use' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {asset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1a1a1a]">{asset.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
