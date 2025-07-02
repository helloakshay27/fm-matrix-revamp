import React, { useState } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';
import { EditPatrollingModal } from '@/components/EditPatrollingModal';
import { DeletePatrollingModal } from '@/components/DeletePatrollingModal';

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
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatrollingId, setSelectedPatrollingId] = useState<number | null>(null);

  const handlePrintQR = () => {
    console.log('Print QR clicked');
    window.print();
  };

  const handlePrintAllQR = () => {
    console.log('Print All QR clicked');
    window.print();
  };

  const handleView = (id: number) => {
    console.log('View patrolling:', id);
    navigate(`/security/patrolling/details/${id}`);
  };

  const handleEdit = (id: number) => {
    console.log('Edit patrolling:', id);
    setSelectedPatrollingId(id);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    console.log('Delete patrolling:', id);
    setSelectedPatrollingId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log('Confirmed delete for patrolling:', selectedPatrollingId);
    // Here you would typically make an API call to delete the record
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>security</span>
          <span>&gt;</span>
          <span>Patrolling</span>
        </div>
        
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-[#1a1a1a] mb-6 uppercase">PATROLLING LIST</h1>
        
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
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader className="bg-[#f6f4ee]">
              <TableRow>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="mr-2" />
                    Actions
                  </div>
                </TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Location</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Scheduled Time</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Created On</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Start Date</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">End Date</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Grace Time(Hours)</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">Active/Inactive</TableHead>
                <TableHead className="text-left text-sm font-medium text-[#1a1a1a]">QR Code</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patrollingData.map((patrol) => (
                <TableRow key={patrol.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <button 
                        onClick={() => handleView(patrol.id)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEdit(patrol.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(patrol.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={patrol.location}>
                      {patrol.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {patrol.scheduledTime}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {patrol.createdOn}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {patrol.startDate}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {patrol.endDate}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    {patrol.graceTime}
                  </TableCell>
                  <TableCell>
                    <input 
                      type="checkbox" 
                      checked={patrol.activeInactive}
                      className="text-blue-600"
                      readOnly
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-900">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
                      {patrol.qrCode}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

      {selectedPatrollingId && (
        <EditPatrollingModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPatrollingId(null);
          }}
          patrollingId={selectedPatrollingId}
        />
      )}

      {selectedPatrollingId && (
        <DeletePatrollingModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPatrollingId(null);
          }}
          onConfirm={handleDeleteConfirm}
          patrollingId={selectedPatrollingId}
        />
      )}
    </div>
  );
};
