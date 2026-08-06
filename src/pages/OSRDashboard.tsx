import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Plus } from 'lucide-react';
import { CreateScheduleModal } from '@/components/CreateScheduleModal';
import { OSRDashboardFilterModal } from '@/components/OSRDashboardFilterModal';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { toast } from 'sonner';

interface OSREntry {
  id: string;
  schedule: string;
  amountPaid: number;
  paymentStatus: string;
  paymentMode: string;
  createdBy: string;
  flat: string;
  category: string;
  subCategory: string;
  status: string;
  rating: string;
  createdOn: string;
}

const columns: ColumnConfig[] = [
  { key: 'id', label: 'ID', sortable: true, hideable: true, defaultVisible: true },
  { key: 'schedule', label: 'Schedule', sortable: true, hideable: true, defaultVisible: true },
  { key: 'amountPaid', label: 'Amount Paid', sortable: true, hideable: true, defaultVisible: true },
  { key: 'paymentStatus', label: 'Payment Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'paymentMode', label: 'Payment Mode', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdBy', label: 'Created By', sortable: true, hideable: true, defaultVisible: true },
  { key: 'flat', label: 'Flat', sortable: true, hideable: true, defaultVisible: true },
  { key: 'category', label: 'Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'subCategory', label: 'Sub Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true },
  { key: 'rating', label: 'Rating', sortable: true, hideable: true, defaultVisible: true },
  { key: 'createdOn', label: 'Created On', sortable: true, hideable: true, defaultVisible: true },
];

const brandButtonClass =
  'bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium whitespace-nowrap [&_svg]:text-white';

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'Work Pending':
      return 'bg-[#F2EBC9] text-gray-800';
    case 'Payment Pending':
      return 'bg-[#F2EBC9] text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const OSRDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample data matching the image structure
  const osrData: OSREntry[] = [
    {
      id: '1244',
      schedule: '24/06/2025 17:00 To 18:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Mosquito Mesh Sta...',
      subCategory: 'Residential Apart...',
      status: 'Work Pending',
      rating: '',
      createdOn: '23/06/2025',
    },
    {
      id: '1243',
      schedule: '24/06/2025 10:00 To 13:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Invisible Grill',
      subCategory: 'Residential Apart...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '23/06/2025',
    },
    {
      id: '1242',
      schedule: '23/06/2025 15:00 To 16:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Pest Control',
      subCategory: '4D Cockroach Cont...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '23/06/2025',
    },
    {
      id: '1241',
      schedule: '21/04/2025 10:00 To 15:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Deepak Gupta',
      flat: 'FM - Office',
      category: 'Civil & Mason Works',
      subCategory: 'Grouting Of Tiles',
      status: 'Payment Pending',
      rating: '',
      createdOn: '19/04/2025',
    },
    {
      id: '1240',
      schedule: '15/04/2025 11:00 To 13:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Deep Cleaning',
      subCategory: 'Sofa Cleaning',
      status: 'Payment Pending',
      rating: '',
      createdOn: '14/04/2025',
    },
    {
      id: '1239',
      schedule: '30/03/2025 06:00 To 09:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Deepak Gupta',
      flat: 'A - 104',
      category: 'Pest Control',
      subCategory: 'Standard Cockroac...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '29/03/2025',
    },
    {
      id: '1238',
      schedule: '06/03/2025 06:00 To 08:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Deep Cleaning',
      subCategory: 'Bathroom Cleaning',
      status: 'Payment Pending',
      rating: '',
      createdOn: '05/03/2025',
    },
    {
      id: '1237',
      schedule: '15/02/2025 06:00 To 08:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Godrej Living',
      flat: 'FM - Office',
      category: 'Deep Cleaning',
      subCategory: 'Bathroom Cleaning',
      status: 'Payment Pending',
      rating: '',
      createdOn: '14/02/2025',
    },
    {
      id: '1236',
      schedule: '13/02/2025 06:00 To 09:00',
      amountPaid: 0,
      paymentStatus: 'Payment Pending',
      paymentMode: '',
      createdBy: 'Deepak Gupta',
      flat: 'A - 101',
      category: 'Pest Control',
      subCategory: 'Standard Cockroac...',
      status: 'Payment Pending',
      rating: '',
      createdOn: '12/02/2025',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return osrData;
    const q = searchTerm.toLowerCase();
    return osrData.filter((entry) =>
      Object.values(entry).some((value) =>
        value.toString().toLowerCase().includes(q)
      )
    );
  }, [searchTerm]);

  const handleViewDetails = (id: string) => {
    navigate(`/vas/osr/details/${id}`);
  };

  const handleGenerateReceipt = () => {
    navigate('/vas/osr/generate-receipt');
    toast.success('Navigating to Generate Receipt page');
  };

  const handleCreateSchedule = (data: object) => {
    toast.success('Schedule created successfully!');
  };

  const handleApplyFilters = (filters: object) => {
    toast.success('Filters applied successfully!');
  };

  const handleResetFilters = () => {
    toast.success('Filters reset successfully!');
  };

  const renderCell = (entry: OSREntry, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return (
          <button
            onClick={() => handleViewDetails(entry.id)}
            className="text-gray-900 hover:underline font-medium"
          >
            {entry.id}
          </button>
        );
      case 'paymentStatus':
        return (
          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-[#F2EBC9] text-gray-800">
            {entry.paymentStatus}
          </span>
        );
      case 'status':
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(entry.status)}`}
          >
            {entry.status}
          </span>
        );
      case 'paymentMode':
        return entry.paymentMode || '--';
      case 'rating':
        return entry.rating || '--';
      default:
        return entry[columnKey as keyof OSREntry] ?? '';
    }
  };

  const renderActions = (entry: OSREntry) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleViewDetails(entry.id)}
      className="h-8 w-8 p-0 text-black hover:bg-gray-100"
      title="View Details"
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-[#2D2A26] mb-6">OSR</h1>

      <EnhancedTable
        data={filteredData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        disableClientSearch
        searchPlaceholder="Search"
        onFilterClick={() => setShowFilterModal(true)}
        hideColumnsButton={false}
        hideTableExport
        storageKey="osr-dashboard"
        emptyMessage="No OSR records found"
        loading={loading}
        pagination
        pageSize={10}
        leftActions={
          <div className="flex items-center gap-2">
            <Button onClick={handleGenerateReceipt} className={brandButtonClass}>
              <FileText className="w-4 h-4 mr-2" />
              Generate Receipt
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className={brandButtonClass}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        }
      />

      <CreateScheduleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSchedule}
      />

      <OSRDashboardFilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </div>
  );
};
