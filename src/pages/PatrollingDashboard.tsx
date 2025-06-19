
import React, { useState } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';

const patrollingData = [
  {
    id: 1,
    site: 'Site - Localized Site 1',
    building: 'Building - HDFC Ergo Bharti',
    wing: 'Wing - Wing 1',
    floor: 'Floor - Floor 1',
    room: 'Room - Room 1',
    location: 'Site - Localized Site 1 / Building - HDFC Ergo Bharti / Wing - Wing 1 / Floor - Floor 1 / Room - Room 1',
    scheduledTime: '8:00 AM, 11:00 AM, 2:00 PM, 5:00 PM, 8:00 PM, 11:00 PM',
    createdOn: '15/04/2024',
    startDate: '15/04/2024',
    endDate: '30/04/2024',
    graceTime: '',
    activeInactive: true,
    qrCode: '1234567890'
  },
  {
    id: 2,
    site: 'Site - Localized Site 1',
    building: 'Building - HDFC Ergo Bharti',
    wing: 'Wing - Wing 1',
    floor: 'Floor - Floor 1',
    room: 'Room - NA',
    location: 'Site - Localized Site 1 / Building - HDFC Ergo Bharti / Wing - Wing 1 / Floor - Floor 1 / Room - NA',
    scheduledTime: '8:00 AM, 11:00 AM, 2:00 PM, 5:00 PM, 8:00 PM, 11:00 PM',
    createdOn: '22/02/2024',
    startDate: '22/02/2024',
    endDate: '',
    graceTime: '',
    activeInactive: true,
    qrCode: '0987654321'
  }
];

export const PatrollingDashboard = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handlePrintQR = () => {
    console.log('Print QR clicked');
    // Add QR printing logic here
    window.print();
  };

  const handlePrintAllQR = () => {
    console.log('Print All QR clicked');
    // Add print all QR logic here
    window.print();
  };

  const handleView = (id: number) => {
    console.log('View patrolling:', id);
  };

  const handleEdit = (id: number) => {
    console.log('Edit patrolling:', id);
  };

  const handleDelete = (id: number) => {
    console.log('Delete patrolling:', id);
  };

  return (
    <div className="p-6 bg-[#f6f4ee] min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>security</span>
          <span>&gt;</span>
          <span>Patrolling</span>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">PATROLLING LIST</h1>
        
        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <Plus className="w-4 h-4" />
            Add
          </Button>
          <Button 
            onClick={() => setIsBulkUploadOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button 
            onClick={() => setIsExportOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button 
            onClick={handlePrintQR}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <QrCode className="w-4 h-4" />
            Print QR
          </Button>
          <Button 
            onClick={handlePrintAllQR}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2 border-0"
          >
            <Printer className="w-4 h-4" />
            Print All QR
          </Button>
          <Button 
            onClick={() => setIsFilterOpen(true)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-4 py-2 rounded flex items-center gap-2 border-0"
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
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">
                    <input type="checkbox" className="mr-2" />
                    Actions
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Scheduled Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Created On</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Grace Time(Hours)</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a] border-r border-gray-200">Active/Inactive</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[#1a1a1a]">Qr Code</th>
                </tr>
              </thead>
              <tbody>
                {patrollingData.map((patrol) => (
                  <tr key={patrol.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" />
                        <button 
                          onClick={() => handleView(patrol.id)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEdit(patrol.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(patrol.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {patrol.location}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {patrol.scheduledTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {patrol.createdOn}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {patrol.startDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {patrol.endDate}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {patrol.graceTime}
                    </td>
                    <td className="px-4 py-3 text-sm border-r border-gray-200">
                      <input 
                        type="checkbox" 
                        checked={patrol.activeInactive}
                        className="text-blue-600"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {patrol.qrCode}
                      </button>
                    </td>
                  </tr>
                ))}
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
