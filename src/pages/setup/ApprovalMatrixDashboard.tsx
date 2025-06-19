
import React from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid3X3, FileDown } from 'lucide-react';

export const ApprovalMatrixDashboard = () => {
  const approvals = [
    { id: 171, function: 'Gdn', createdOn: '29/03/2024', createdBy: 'demo demo' },
    { id: 162, function: 'Supplier', createdOn: '14/12/2023', createdBy: 'demo demo' },
    { id: 161, function: 'Permit Closure', createdOn: '12/12/2023', createdBy: 'demo demo' },
    { id: 115, function: 'Permit Extend', createdOn: '25/09/2023', createdBy: 'demo demo' },
    { id: 113, function: 'Vendor Audit', createdOn: '15/09/2023', createdBy: 'Navin Lead Admin' },
    { id: 109, function: 'Permit', createdOn: '11/09/2023', createdBy: 'Navin Lead Admin' },
    { id: 5, function: 'Work Order Invoice', createdOn: '31/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 4, function: 'Work Order', createdOn: '30/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 3, function: 'Grn', createdOn: '30/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 2, function: 'Bill', createdOn: '24/12/2021', createdBy: 'Navin Lead Admin' },
    { id: 1, function: 'Purchase Order', createdOn: '24/12/2021', createdBy: 'Navin Lead Admin' }
  ];

  const handleAddClick = () => {
    window.location.href = '/setup/approval-matrix/add';
  };

  const handleEditClick = (id: number) => {
    window.location.href = `/setup/approval-matrix/edit/${id}`;
  };

  return (
    <SetupLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">INVOICE APPROVALS</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 w-80"
              />
            </div>
            <Button variant="outline" size="icon">
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <FileDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-start">
          <Button 
            onClick={handleAddClick}
            className="bg-[#C72030] hover:bg-[#A01020] text-white"
          >
            + Add
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Id</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Function</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created by</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => handleEditClick(approval.id)}
                      >
                        ✏️
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
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
    </SetupLayout>
  );
};
