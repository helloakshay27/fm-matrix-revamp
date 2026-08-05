import { useEffect, useState } from 'react';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';
import { useProcurementEvents } from '@/components/PostHogProcurementEvents';
import {
  TempRequestFilterDialog,
  type TempRequestFilters,
} from '@/components/TempRequestFilterDialog';

interface PRData {
  id: string;
  type: string;
  lastUpdated: string;
}

const columns: ColumnConfig[] = [
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: 'lastUpdated',
    label: 'Last Updated',
    sortable: true,
    hideable: true,
    draggable: true,
    defaultVisible: true,
  },
];

const emptyFilters: TempRequestFilters = {
  type: '',
};

const formattedData = (data: unknown[]): PRData[] => {
  return (data || []).map((raw) => {
    const item = raw as {
      id: string;
      log_type?: string;
      updated_at: string;
    };
    return {
      id: item.id,
      type:
        item.log_type === 'Pms::PurchaseOrder'
          ? 'Material PR'
          : item.log_type === 'Pms::WorkOrder'
            ? 'Service PR'
            : item.log_type === 'Pms::Grn'
              ? 'GRN'
              : '',
      lastUpdated: format(item.updated_at, 'dd/MM/yyyy hh:mm a'),
    };
  });
};

export const AutoSavedPRDashboard = () => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { shouldShow } = useDynamicPermissions();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('page')) || 1;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TempRequestFilters>(emptyFilters);
  const [savedPR, setSavedPR] = useState<PRData[]>([]);
  const [loading, setLoading] = useState(true);
  const procurementEvents = useProcurementEvents();

  useEffect(() => {
    navigate(`${location.pathname}?page=${currentPage}`, { replace: true });
  }, [currentPage, location.pathname, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/pms/purchase_orders/temp_records.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSavedPR(formattedData(response.data.system_logs || []));
        try {
          procurementEvents.onPrDraftReopened(null, null);
        } catch {
          /* ignore analytics errors */
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = [...savedPR]
    .reverse()
    .filter((item) => {
      if (filters.type && item.type !== filters.type) {
        return false;
      }

      const q = searchTerm.toLowerCase();
      return (
        !q ||
        item.type.toLowerCase().includes(q) ||
        item.lastUpdated.toLowerCase().includes(q) ||
        String(item.id).toLowerCase().includes(q)
      );
    });

  const renderCell = (item: PRData, columnKey: string) => {
    switch (columnKey) {
      case 'type':
        return <span className="font-medium text-gray-900">{item.type || '—'}</span>;
      case 'lastUpdated':
        return <span className="text-gray-900">{item.lastUpdated || '—'}</span>;
      default:
        return item[columnKey as keyof PRData] ?? '—';
    }
  };

  const handleNavigate = (item: PRData) => {
    const url =
      item.type === 'Material PR'
        ? `/finance/material-pr/add?saved_pr_id=${item.id}`
        : item.type === 'Service PR'
          ? `/finance/service-pr/add?saved_pr_id=${item.id}`
          : item.type === 'GRN'
            ? `/finance/grn-srn/add?saved_pr_id=${item.id}`
            : '';

    try {
      procurementEvents.onPrDraftReopened(item.id, null);
    } catch {
      /* ignore analytics errors */
    }
    navigate(url);
  };

  const renderActions = (item: PRData) =>
    shouldShow('Auto Saved PR', 'show') ? (
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        title="View"
        onClick={(e) => {
          e.stopPropagation();
          handleNavigate(item);
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
    ) : null;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    navigate(`${location.pathname}?page=${page}`, { replace: true });
  };

  const handleApplyFilters = (nextFilters: TempRequestFilters) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">Temp Requests</h1>

      <div className="w-full min-w-0 max-w-full">
        <EnhancedTable
          data={filteredData}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          storageKey="auto-saved-pr-dashboard"
          emptyMessage="No temp requests found"
          enableSearch
          searchTerm={searchTerm}
          onSearchChange={(value) => {
            setSearchTerm(value);
            setCurrentPage(1);
          }}
          disableClientSearch
          searchPlaceholder="Search temp requests..."
          hideTableExport
          loading={loading}
          pagination
          pageSize={10}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          getItemId={(item) => String(item.id)}
          onFilterClick={() => setShowFilters(true)}
        />
      </div>

      <TempRequestFilterDialog
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};
