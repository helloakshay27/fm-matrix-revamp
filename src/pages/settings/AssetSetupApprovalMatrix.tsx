
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, FileDown } from 'lucide-react';
import { Edit } from 'lucide-react';

export const AssetSetupApprovalMatrix = () => {
  const approvals = [
    { id: 198, function: 'Custom Form 11372', createdOn: '08/10/2024', createdBy: 'Vinayak Mane' },
    { id: 173, function: 'Gdn', createdOn: '10/04/2024', createdBy: 'Vinayak Mane' },
    { id: 172, function: 'Work Order', createdOn: '10/04/2024', createdBy: 'Robert Day2' },
    { id: 108, function: 'Grn', createdOn: '01/08/2023', createdBy: 'Robert Day2' },
    { id: 34, function: 'Work Order Invoice', createdOn: '23/11/2022', createdBy: 'Robert Day2' },
    { id: 33, function: 'Purchase Order', createdOn: '15/11/2022', createdBy: 'Robert Day2' }
  ];

  const handleAddClick = () => {
    window.location.href = '/settings/asset-setup/approval-matrix/add';
  };

  const handleEditClick = (id: number) => {
    window.location.href = `/settings/asset-setup/approval-matrix/edit/${id}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Setup</span>
          <span>&gt;</span>
          <span>Asset Setup</span>
          <span>&gt;</span>
          <span>Approval Matrix</span>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">INVOICE APPROVALS</h1>
        
        {/* Top Controls */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            onClick={handleAddClick}
            className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 text-sm"
          >
            + Add
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-80 bg-white"
              />
            </div>
            <Button variant="outline" size="icon" className="bg-white">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white">
              <FileDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Edit</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Id</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Function</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created On</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created by</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {approvals.map((approval, index) => (
                <tr key={approval.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900 p-1"
                      onClick={() => handleEditClick(approval.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {approval.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {approval.function}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {approval.createdOn}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {approval.createdBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
