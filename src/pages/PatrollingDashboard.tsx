import React, { useState } from 'react';
import { Plus, Download, Filter, Upload, Printer, QrCode, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BulkUploadModal } from '@/components/BulkUploadModal';
import { ExportModal } from '@/components/ExportModal';
import { PatrollingFilterModal } from '@/components/PatrollingFilterModal';
import { AddPatrollingModal } from '@/components/AddPatrollingModal';
import { EditPatrollingModal } from '@/components/EditPatrollingModal';
import { DeletePatrollingModal } from '@/components/DeletePatrollingModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { TicketPagination } from '@/components/TicketPagination';
const patrollingData = [{
  id: 1,
  patrolName: 'Lobby Patrol',
  shiftType: 'Day',
  numCheckpoints: 8,
  validity: '15/04/2024 - 30/04/2024',
  graceTime: '15 min',
  status: true
}, {
  id: 2,
  patrolName: 'Night Perimeter',
  shiftType: 'Night',
  numCheckpoints: 12,
  validity: '22/02/2024 -',
  graceTime: '10 min',
  status: true
}, {
  id: 3,
  patrolName: 'Parking Deck',
  shiftType: 'Day',
  numCheckpoints: 6,
  validity: '01/05/2024 - 31/05/2024',
  graceTime: '5 min',
  status: false
}, {
  id: 4,
  patrolName: 'Server Room',
  shiftType: 'General',
  numCheckpoints: 4,
  validity: 'Ongoing',
  graceTime: '10 min',
  status: true
}, {
  id: 5,
  patrolName: 'Warehouse Loop',
  shiftType: 'Night',
  numCheckpoints: 10,
  validity: '01/06/2024 - 30/06/2024',
  graceTime: '20 min',
  status: true
}, {
  id: 6,
  patrolName: 'Reception Rounds',
  shiftType: 'General',
  numCheckpoints: 5,
  validity: 'Ongoing',
  graceTime: '10 min',
  status: true
}, {
  id: 7,
  patrolName: 'Roof Access',
  shiftType: 'Day',
  numCheckpoints: 3,
  validity: '15/03/2024 - 15/09/2024',
  graceTime: '5 min',
  status: false
}, {
  id: 8,
  patrolName: 'Utilities Check',
  shiftType: 'Night',
  numCheckpoints: 7,
  validity: 'Ongoing',
  graceTime: '15 min',
  status: true
}, {
  id: 9,
  patrolName: 'Perimeter East',
  shiftType: 'Day',
  numCheckpoints: 9,
  validity: 'Ongoing',
  graceTime: '10 min',
  status: true
}, {
  id: 10,
  patrolName: 'Perimeter West',
  shiftType: 'Night',
  numCheckpoints: 9,
  validity: 'Ongoing',
  graceTime: '10 min',
  status: true
}, {
  id: 11,
  patrolName: 'CCTV Hub',
  shiftType: 'General',
  numCheckpoints: 2,
  validity: '01/04/2024 - 01/10/2024',
  graceTime: '5 min',
  status: false
}, {
  id: 12,
  patrolName: 'Loading Bay',
  shiftType: 'Day',
  numCheckpoints: 6,
  validity: 'Ongoing',
  graceTime: '15 min',
  status: true
}];

// Column configuration for the enhanced table
const columns: ColumnConfig[] = [{
  key: 'actions',
  label: 'Action',
  sortable: false,
  hideable: false,
  draggable: false
}, {
  key: 'patrolName',
  label: 'Patrol Name',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'shiftType',
  label: 'Shift Type',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'numCheckpoints',
  label: 'No. of Checkpoints',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'validity',
  label: 'Validity',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'graceTime',
  label: 'Grace Time',
  sortable: true,
  hideable: true,
  draggable: true
}, {
  key: 'status',
  label: 'Status',
  sortable: true,
  hideable: true,
  draggable: true
}];
export const PatrollingDashboard = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatrollingId, setSelectedPatrollingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredData = patrollingData.filter((p) =>
    [p.patrolName, p.shiftType, String(p.numCheckpoints), p.validity, p.graceTime]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const totalRecords = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / perPage));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const displayedData = filteredData.slice(startIndex, endIndex);

  // Render row function for enhanced table
  const renderRow = (patrol: any) => ({
    actions: <div className="flex items-center gap-2">
        <button onClick={() => handleView(patrol.id)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View">
          <Eye className="w-4 h-4" />
        </button>
        <button onClick={() => handleEdit(patrol.id)} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Edit">
          <Edit className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(patrol.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>,
    patrolName: patrol.patrolName,
    shiftType: patrol.shiftType,
    numCheckpoints: patrol.numCheckpoints,
    validity: patrol.validity || '--',
    graceTime: patrol.graceTime || '--',
    status: <input type="checkbox" checked={patrol.status} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" readOnly />
  });
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
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Patrolling List</h1>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New
        </Button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="Search Tickets"
              className="h-10 w-64 rounded-md border border-gray-300 bg-white px-3 text-sm"
            />
          </div>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)} aria-label="Filter">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <EnhancedTable
        data={displayedData}
        columns={columns}
        renderRow={renderRow}
        storageKey="patrolling-list-table"
        hideTableExport={true}
        hideTableSearch={true}
      />

      <TicketPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        perPage={perPage}
        isLoading={false}
        onPageChange={setCurrentPage}
        onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1); }}
      />

      <AddPatrollingModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <PatrollingFilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
      {selectedPatrollingId !== null && (
        <EditPatrollingModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          patrollingId={selectedPatrollingId}
        />
      )}
      {selectedPatrollingId !== null && (
        <DeletePatrollingModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          patrollingId={selectedPatrollingId}
        />
      )}
    </div>
  );
};