import React, { useState, useMemo, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { StatsCard } from '@/components/StatsCard';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface SeatRequest {
  id: string;
  name: string;
  requestedDate: string;
  seatType: string;
  shift: string;
  allocationType: string;
  count: number;
  status: string;
}

const initialSeatRequests: SeatRequest[] = [
  {
    id: '48823',
    name: 'Robert Day2',
    requestedDate: '14/08/2024',
    seatType: 'Angular Ws',
    shift: '10:00 AM to 08:00 PM',
    allocationType: 'Recurring',
    count: 100,
    status: 'Rejected',
  },
  {
    id: '79876',
    name: 'Abdul A',
    requestedDate: '25/07/2024',
    seatType: 'circular',
    shift: '09:00 AM to 07:00 PM',
    allocationType: '',
    count: 1,
    status: 'Rejected',
  },
  {
    id: '48823',
    name: 'Robert Day2',
    requestedDate: '17/10/2023',
    seatType: 'Angular Ws',
    shift: '10:00 AM to 08:00 PM',
    allocationType: 'Recurring',
    count: 100,
    status: 'Rejected',
  },
  {
    id: '48823',
    name: 'Robert Day2',
    requestedDate: '26/05/2023',
    seatType: 'Angular Ws',
    shift: '10:00 AM to 08:00 PM',
    allocationType: 'Recurring',
    count: 100,
    status: 'Approved',
  },
  {
    id: '85672',
    name: 'Kshitij Rasal',
    requestedDate: '12/04/2023',
    seatType: 'circularchair',
    shift: '',
    allocationType: '',
    count: 1,
    status: 'Approved',
  },
  {
    id: '85672',
    name: 'Kshitij Rasal',
    requestedDate: '29/04/2023',
    seatType: 'circularchair',
    shift: '',
    allocationType: '',
    count: 1,
    status: 'Approved',
  },
  {
    id: '85672',
    name: 'Kshitij Rasal',
    requestedDate: '28/04/2023',
    seatType: 'Rectangle',
    shift: '',
    allocationType: '',
    count: 1,
    status: 'Approved',
  },
  {
    id: '79876',
    name: 'Abdul A',
    requestedDate: '20/04/2023',
    seatType: 'circular',
    shift: '09:00 AM to 07:00 PM',
    allocationType: '',
    count: 1,
    status: 'Approved',
  },
  {
    id: '79876',
    name: 'Abdul A',
    requestedDate: '15/04/2023',
    seatType: 'circular',
    shift: '09:00 AM to 07:00 PM',
    allocationType: '',
    count: 1,
    status: 'Approved',
  },
  {
    id: '79876',
    name: 'Abdul A',
    requestedDate: '27/04/2023',
    seatType: 'circular',
    shift: '09:00 AM to 07:00 PM',
    allocationType: '',
    count: 1,
    status: 'Pending',
  },
];

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Name', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'requestedDate', label: 'Requested Date', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'seatType', label: 'Seat Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'shift', label: 'Shift', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'allocationType', label: 'Allocation Type', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'count', label: 'Count', sortable: true, hideable: true, draggable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, draggable: true, defaultVisible: true },
];

const outlineActionClass =
  'inline-flex items-center justify-center h-8 min-w-[72px] px-3 text-xs font-medium whitespace-nowrap rounded-md border border-[#DA7756] bg-[#fffaf6] text-[#DA7756] hover:bg-[#fdf0ea] transition-colors';

const solidActionClass =
  'inline-flex items-center justify-center h-8 min-w-[72px] px-3 text-xs font-medium whitespace-nowrap rounded-md border border-[#DA7756] bg-[#DA7756] text-white hover:bg-[#c96546] transition-colors';

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'bg-[#C7EDDA] text-gray-800';
    case 'rejected':
      return 'bg-[#F2C8C4] text-gray-800';
    case 'pending':
      return 'bg-[#F2EBC9] text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const SpaceManagementSeatRequestsDashboard = () => {
  const [seatRequests, setSeatRequests] = useState<SeatRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let active = true;
    const fetchSeatRequests = async () => {
      setLoading(true);
      try {
        await new Promise((res) => setTimeout(res, 800));
        if (active) setSeatRequests(initialSeatRequests);
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchSeatRequests();
    return () => {
      active = false;
    };
  }, []);

  const statistics = useMemo(() => {
    const total = seatRequests.length;
    const pending = seatRequests.filter((request) => request.status === 'Pending').length;
    const approved = seatRequests.filter((request) => request.status === 'Approved').length;
    const rejected = seatRequests.filter((request) => request.status === 'Rejected').length;
    return { total, pending, approved, rejected };
  }, [seatRequests]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return seatRequests;
    const q = searchTerm.toLowerCase();
    return seatRequests.filter((request) =>
      Object.values(request).some((value) =>
        String(value ?? '').toLowerCase().includes(q)
      )
    );
  }, [seatRequests, searchTerm]);

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setSeatRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === requestId
          ? {
              ...request,
              status: newStatus,
            }
          : request
      )
    );
    console.log(`Status changed for request ${requestId} to ${newStatus}`);
  };

  const renderCell = (item: SeatRequest, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return <span className="font-medium text-gray-900">{item.name}</span>;
      case 'shift':
        return item.shift || '--';
      case 'allocationType':
        return item.allocationType || '--';
      case 'status':
        return (
          <span
            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(item.status)}`}
          >
            {item.status}
          </span>
        );
      default:
        return item[columnKey as keyof SeatRequest] ?? '--';
    }
  };

  const renderActions = (item: SeatRequest) => (
    <div className="flex items-center gap-2 flex-nowrap">
      {item.status === 'Pending' ? (
        <>
          <button
            type="button"
            className={outlineActionClass}
            onClick={() => handleStatusChange(item.id, 'Approved')}
          >
            Approve
          </button>
          <button
            type="button"
            className={solidActionClass}
            onClick={() => handleStatusChange(item.id, 'Rejected')}
          >
            Reject
          </button>
        </>
      ) : (
        <button
          type="button"
          className={outlineActionClass}
          onClick={() => handleStatusChange(item.id, 'Pending')}
        >
          Reset
        </button>
      )}
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-white">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <span>Space</span>
          <span>&gt;</span>
          <span>Seat Approval request (seat request)</span>
        </div>

        <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6 uppercase">
          SEAT APPROVAL REQUEST
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="All"
            value={statistics.total}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="Pending"
            value={statistics.pending}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="Approved"
            value={statistics.approved}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
          <StatsCard
            title="Rejected"
            value={statistics.rejected}
            icon={<Settings className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#C72030' }} />}
          />
        </div>

        <EnhancedTable
          data={filteredData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="seat-requests-table"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          disableClientSearch
          searchPlaceholder="Search..."
          pagination
          pageSize={10}
          hideTableExport
          emptyMessage="No seat requests found"
          loading={loading}
        />
      </div>
    </div>
  );
};
