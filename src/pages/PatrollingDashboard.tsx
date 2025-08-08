import React, { useState } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';
import { EditPatrollingModal } from '@/components/EditPatrollingModal';
import { DeletePatrollingModal } from '@/components/DeletePatrollingModal';

interface PatrollingData {
  id: number;
  site: string;
  building: string;
  wing: string;
  floor: string;
  room: string;
  location: string;
  scheduledTime: string;
  createdOn: string;
  startDate: string;
  endDate: string;
  graceTime: string;
  activeInactive: boolean;
  qrCode: string;
}

const patrollingData: PatrollingData[] = [
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

const columns: ColumnConfig[] = [
  { key: 'location', label: 'Location', sortable: true, hideable: true },
  { key: 'scheduledTime', label: 'Scheduled Time', sortable: true, hideable: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true },
  { key: 'startDate', label: 'Start Date', sortable: true, hideable: true },
  { key: 'endDate', label: 'End Date', sortable: true, hideable: true },
  { key: 'graceTime', label: 'Grace Time(Hours)', sortable: true, hideable: true },
  { key: 'activeInactive', label: 'Active/Inactive', sortable: true, hideable: true },
  { key: 'qrCode', label: 'QR Code', sortable: true, hideable: true },
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

  const renderActions = (patrol: PatrollingData) => (
    <div className="flex items-center gap-2">
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
  );

  const renderCell = (patrol: PatrollingData, columnKey: string) => {
    switch (columnKey) {
      case 'location':
        return (
          <div className="max-w-xs">
            <div className="truncate" title={patrol.location}>
              {patrol.location}
            </div>
          </div>
        );
      case 'activeInactive':
        return (
          <input 
            type="checkbox" 
            checked={patrol.activeInactive}
            className="text-blue-600"
            readOnly
          />
        );
      case 'qrCode':
        return (
          <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200">
            {patrol.qrCode}
          </button>
        );
      default:
        return patrol[columnKey as keyof PatrollingData];
    }
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="mb-6">
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

        {/* Enhanced Table */}
        <EnhancedTable<PatrollingData>
          data={patrollingData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="patrolling-table"
          emptyMessage="No patrolling records found"
          enableExport={true}
          exportFileName="patrolling-records"
          onFilterClick={() => setIsFilterOpen(true)}
        />
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
