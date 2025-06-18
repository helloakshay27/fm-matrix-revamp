
import React, { useState } from 'react';
import { Plus, Download, Filter, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';

export const PatrollingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>security</span>
          <span>&gt;</span>
          <span>Patrolling</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">PATROLLING</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: '#C72030' }}
            className="hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2 bg-white hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button 
            onClick={() => setIsExportOpen(true)}
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            onClick={() => setIsFilterOpen(true)}
            variant="outline" 
            className="border-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-2 bg-white hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f6f4ee]">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Patrol ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Guard Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a]">Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No patrolling records found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddPatrollingModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <BulkUploadModal 
        isOpen={isBulkUploadOpen} 
        onClose={() => setIsBulkUploadOpen(false)} 
      />
      
      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <PatrollingFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  );
};
