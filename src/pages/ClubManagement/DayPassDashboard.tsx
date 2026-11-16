import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, CalendarClock, CalendarX, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { StatsCard } from '@/components/StatsCard';
import { useDebounce } from '@/hooks/useDebounce';
import { apiClient } from '@/utils/apiClient';
import { getApiErrorMessage } from './apiErrorMessage';

// A day pass is a club member of the Day Pass plan; the Members list leaves them out and this list shows only them
// (GET /club_members.json?day_pass=true).
interface DayPassRow {
  id: number;
  membership_number?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  user_mobile?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  member_payment_detail?: {
    total_amount?: number | string | null;
    payment_mode?: string | null;
  } | null;
}

type PassStatus = 'today' | 'upcoming' | 'past';

const PER_PAGE = 20;

const columns = [
  { key: 'actions', label: 'Actions', sortable: false },
  { key: 'membership_number', label: 'Pass Number', sortable: true },
  { key: 'user_name', label: 'Name', sortable: true },
  { key: 'user_mobile', label: 'Mobile', sortable: true },
  { key: 'user_email', label: 'Email', sortable: true },
  { key: 'start_date', label: 'Pass Date', sortable: true },
  { key: 'status', label: 'Status', sortable: false },
  { key: 'amount', label: 'Amount (₹)', sortable: false },
  { key: 'payment_mode', label: 'Payment Mode', sortable: false },
  { key: 'created_at', label: 'Created On', sortable: true },
];

const todayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 'YYYY-MM-DD' -> 'DD/MM/YYYY' without going through Date (no timezone shift).
const formatDate = (value?: string | null) => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : '-';
};

const passStatusOf = (row: DayPassRow): PassStatus => {
  const today = todayString();
  if (row.start_date && row.start_date > today) return 'upcoming';
  if (row.end_date && row.end_date < today) return 'past';
  return 'today';
};

const STATUS_LABEL: Record<PassStatus, string> = { today: 'Valid today', upcoming: 'Upcoming', past: 'Expired' };
const STATUS_STYLE: Record<PassStatus, string> = {
  today: 'bg-brand-success-bg text-brand-success border-transparent',
  upcoming: 'bg-brand-selected text-brand border-transparent',
  past: 'bg-gray-100 text-gray-600 border-transparent',
};

export const DayPassDashboard = () => {
  const navigate = useNavigate();

  const [rows, setRows] = useState<DayPassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [counts, setCounts] = useState<Record<PassStatus, number>>({ today: 0, upcoming: 0, past: 0 });
  const [statusFilter, setStatusFilter] = useState<PassStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const search = useDebounce(searchQuery, 300).trim();

  const fetchPasses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/club_members.json', {
        params: {
          day_pass: true,
          page,
          per_page: PER_PAGE,
          search: search || undefined,
          pass_status: statusFilter || undefined,
        },
      });
      setRows(Array.isArray(response.data?.club_members) ? response.data.club_members : []);
      setTotal(response.data?.pagination?.total_count || 0);
      setTotalPages(Math.max(1, response.data?.pagination?.total_pages || 1));
      if (response.data?.pass_counts) setCounts(response.data.pass_counts);
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Failed to fetch day passes'));
      setRows([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  // A new search or filter starts from the first page.
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const toggleStatus = (status: PassStatus) => setStatusFilter((current) => (current === status ? '' : status));

  const renderCell = (item: DayPassRow, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <Button
            variant="ghost"
            className="p-0"
            title="View Details"
            onClick={() => navigate(`/club-management/membership/${item.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        );
      case 'start_date':
        return formatDate(item.start_date);
      case 'status': {
        const status = passStatusOf(item);
        return <Badge className={STATUS_STYLE[status]}>{STATUS_LABEL[status]}</Badge>;
      }
      case 'amount': {
        const amount = parseFloat(String(item.member_payment_detail?.total_amount ?? ''));
        return Number.isFinite(amount) ? amount.toFixed(2) : '-';
      }
      case 'payment_mode': {
        const mode = item.member_payment_detail?.payment_mode;
        return mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '-';
      }
      case 'created_at':
        return formatDate(item.created_at);
      default:
        return (item as unknown as Record<string, string | null | undefined>)[columnKey] || '-';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--color-primary)' }}>Day Pass</h1>
        <p className="text-sm text-gray-500 mt-1">People holding a one-day pass. Members are listed under Users → Members.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatsCard
          title="Valid Today"
          value={counts.today}
          icon={<CalendarCheck className="w-6 h-6 text-green-600" />}
          onClick={() => toggleStatus('today')}
          selected={statusFilter === 'today'}
        />
        <StatsCard
          title="Upcoming"
          value={counts.upcoming}
          icon={<CalendarClock className="w-6 h-6 text-yellow-600" />}
          onClick={() => toggleStatus('upcoming')}
          selected={statusFilter === 'upcoming'}
        />
        <StatsCard
          title="Expired"
          value={counts.past}
          icon={<CalendarX className="w-6 h-6 text-red-600" />}
          onClick={() => toggleStatus('past')}
          selected={statusFilter === 'past'}
        />
      </div>

      <div className="overflow-x-auto animate-fade-in">
        <EnhancedTable
          data={rows}
          columns={columns}
          renderCell={renderCell}
          pagination={false}
          storageKey="day-pass-table"
          getItemId={(item: DayPassRow) => item.id.toString()}
          leftActions={
            <Button className="bg-brand hover:bg-brand-hover text-white" onClick={() => navigate('/club-management/day-pass/add')}>
              <Plus className="w-4 h-4 mr-2" /> Add Day Pass
            </Button>
          }
          searchPlaceholder="Search by name, mobile, email or pass number"
          onSearchChange={setSearchQuery}
          disableClientSearch
          hideTableExport
          emptyMessage="No day passes found"
          loading={loading}
          loadingMessage="Loading day passes..."
        />

        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 mt-6 pb-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className={page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    className={page === totalPages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} | Showing {rows.length} of {total} day passes
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayPassDashboard;
