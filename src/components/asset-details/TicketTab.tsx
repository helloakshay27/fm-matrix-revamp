import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Lock,
  MessageSquareHeart,
  AlertTriangle,
  FileText,
  Eye,
  ChevronDown,
} from 'lucide-react';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';

interface TicketTabProps {
  asset: Asset;
  assetId?: string | number;
}

interface Asset {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  heading: string;
  status: string;
  updated_by: string;
  category_type: string;
  documents: any[];
  created_at: string;
}

interface TicketCounts {
  open: number;
  closed: number;
  // pending: number;
  complaints: number;
  suggestions: number;
  requests: number;
  // duplicate: number;
}

const statusMapping: Record<string, string> = {
  Open: 'open',
  Closed: 'closed',
  // Pending: 'pending',
  Complaints: 'complaints',
  Suggestion: 'suggestions',
  Requests: 'requests',
  // Duplicate: 'duplicate',
};

export const TicketTab: React.FC<TicketTabProps> = ({ assetId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [ticketCounts, setTicketCounts] = useState<TicketCounts>({
    open: 0,
    closed: 0,
    // pending: 0,
    complaints: 0,
    suggestions: 0,
    requests: 0,
    // duplicate: 0,
  });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  // Define columns for the enhanced table
  const columns: ColumnConfig[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'heading',
      label: 'Title',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'category_type',
      label: 'Category',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'updated_by',
      label: 'Updated By',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: 'created_at',
      label: 'Created At',
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    // {
    //   key: 'documents',
    //   label: 'Attachments',
    //   sortable: false,
    //   draggable: true,
    //   defaultVisible: true,
    // },
  ];

  // Fetch all counts on mount
  const fetchTicketCounts = async () => {
    try {
      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/tickets.json`,
        {
          params: { id: assetId },
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );
      const data = response.data;
      setTicketCounts({
        open: data.open || 0,
        closed: data.closed || 0,
        // pending: data.pending || 0,
        complaints: data.complaints || 0,
        suggestions: data.suggestions || 0,
        requests: data.requests || 0,
        // duplicate: data.duplicate || 0,
      });
    } catch (err) {
      console.error('Failed to fetch ticket counts', err);
    }
  };

  // Fetch filtered tickets
  const fetchTickets = async (statusKey: string) => {
    setLoading(true);
    try {
      const params: any = { id: assetId };

      if (['open', 'closed', 'pending', 'duplicate'].includes(statusKey)) {
        params['q[complaint_status_fixed_state_eq]'] = statusKey;
      } else if (['complaints', 'suggestions', 'requests'].includes(statusKey)) {
        params['q[complaint_type_eq]'] = statusKey.slice(0, -1); // complaint, suggestion, request
      }

      const response = await axios.get(
        `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/tickets.json`,
        {
          params,
          headers: {
            Authorization: getAuthHeader(),
          },
        }
      );

      setTickets(response.data.tickets || []);
    } catch (error) {
      console.error('Failed to fetch tickets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketCounts();
    fetchTickets(statusFilter);
  }, [assetId]);

  useEffect(() => {
    fetchTickets(statusFilter);
  }, [statusFilter]);

  const statusCards = [
    { label: 'Open', icon: Lock },
    { label: 'Closed', icon: Lock },
    { label: 'Complaints', icon: MessageSquareHeart },
    { label: 'Suggestion', icon: AlertTriangle },
    { label: 'Requests', icon: FileText },
    // { label: 'Duplicate', icon: Grid3X3 },
  ];

  const filteredTickets = tickets.filter((ticket) =>
    ticket.heading?.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const handleExport = () => {
    if (!assetId) return;

    const token = getAuthHeader().replace('Bearer ', '');
    const downloadUrl = `${API_CONFIG.BASE_URL}/pms/assets/${assetId}/tickets.xlsx?access_token=${token}`;
    window.open(downloadUrl, '_blank');
  };


  // Custom cell renderer for the enhanced table
  const renderCell = (item: Ticket, columnKey: string) => {
    switch (columnKey) {
      case 'id':
        return <span className="font-medium">#{item.id}</span>;
      case 'heading':
        return item.heading;
      case 'category_type':
        return item.category_type;
      case 'status':
        return (
          <div
            className={`px-3 py-1 rounded text-sm font-medium inline-flex items-center gap-1 ${
              item.status === 'Open'
                ? 'bg-[#FF6B5A] text-white'
                : 'bg-[#2DD4BF] text-white'
            }`}
          >
            {item.status}
            <ChevronDown className="w-3 h-3" />
          </div>
        );
      case 'updated_by':
        return item.updated_by;
      case 'created_at':
        return new Date(item.created_at).toLocaleDateString();
      case 'documents':
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{item.documents?.length || 0}</span>
            <Eye className="w-4 h-4 text-gray-500" />
          </div>
        );
      default:
        return item[columnKey as keyof Ticket];
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statusCards.map((card, index) => {
          const Icon = card.icon;
          const key = statusMapping[card.label];
          const count = ticketCounts[key as keyof TicketCounts] || 0;

          return (
            <div
              key={index}
              className={`p-4 rounded-lg flex items-center gap-3 cursor-pointer ${statusFilter === key ? 'border-2 border-[#C72030]' : ''
                }`}
              style={{ backgroundColor: '#F6F4EE' }}
              onClick={() => setStatusFilter(key)}
            >
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5" style={{ color: '#C72030' }} />
              </div>
              <div>
                <div className="text-2xl font-bold text-black">
                  {count.toString().padStart(2, '0')}
                </div>
                <div className="text-sm font-medium text-black">
                  {card.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(statusMapping).map(([label, value]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced Ticket Table */}
      <EnhancedTable
        data={filteredTickets}
        columns={columns}
        renderCell={renderCell}
        storageKey="ticket-table"
        emptyMessage="No tickets found."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search tickets..."
        enableExport={true} 
        // exportFileName="tickets-export"
        pagination={true}
        pageSize={10}
        loading={loading}
        enableSearch={true}
        className="w-full"
        handleExport={handleExport}
      />
    </div>
  );
};

