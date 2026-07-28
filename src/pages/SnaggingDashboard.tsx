import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SnaggingFilterDialog } from '@/components/SnaggingFilterDialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { apiClient } from '@/utils/apiClient';

interface SnaggingItem {
  id: number;
  name: string;
  snag_audit_category: string;
  questions_count: number;
  check_type: string;
  active: number;
}

interface FilterValues {
  tower: string;
  floor: string;
  flat: string;
  stage: string;
}

const columns: ColumnConfig[] = [
  { key: 'sr_no', label: 'Sr.no.', sortable: true, hideable: true, defaultVisible: true },
  { key: 'name', label: 'Survey List', sortable: true, hideable: true, defaultVisible: true },
  { key: 'snag_audit_category', label: 'Ticket Category', sortable: true, hideable: true, defaultVisible: true },
  { key: 'questions_count', label: 'No. of Association', sortable: true, hideable: true, defaultVisible: true },
  { key: 'check_type', label: 'Check Type', sortable: true, hideable: true, defaultVisible: true },
  { key: 'status', label: 'Status', sortable: true, hideable: true, defaultVisible: true },
];

export const SnaggingDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState('User Snag');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    tower: '',
    floor: '',
    flat: '',
    stage: '',
  });
  const [snaggingData, setSnaggingData] = useState<SnaggingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view');
    if (view === 'my') {
      setActiveView('My Snags');
    } else {
      setActiveView('User Snag');
    }
  }, [location.search]);

  useEffect(() => {
    fetchSnaggingData();
  }, []);

  const fetchSnaggingData = async () => {
    try {
      setLoading(true);
      const siteId = localStorage.getItem('site_id') || '2189';
      const response = await apiClient.get(`/pms/admin/snag_checklists.json?site_id=${siteId}`);
      setSnaggingData(response.data || []);
    } catch (error) {
      console.error('Error fetching snagging data:', error);
      setSnaggingData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: SnaggingItem[]) => {
    return data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.snag_audit_category?.toLowerCase().includes(searchLower) ||
        item.check_type?.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  };

  const filteredData = applyFilters(snaggingData).map((item, index) => ({
    ...item,
    sr_no: index + 1,
  }));

  const handleViewDetail = (item: SnaggingItem) => {
    navigate(`/transitioning/snagging/details/${item.id}`, { state: { item } });
  };

  const handleApplyFilters = (nextFilters: FilterValues) => {
    setFilters(nextFilters);
    setCurrentPage(1);
  };

  const renderCell = (item: SnaggingItem & { sr_no: number }, columnKey: string) => {
    switch (columnKey) {
      case 'sr_no':
        return item.sr_no;
      case 'name':
        return <span className="font-medium text-gray-900">{item.name || '—'}</span>;
      case 'snag_audit_category':
        return item.snag_audit_category || '—';
      case 'questions_count':
        return item.questions_count ?? '—';
      case 'check_type':
        return item.check_type || '—';
      case 'status':
        return (
          <span
            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
              item.active === 1
                ? 'bg-[#C7EDDA] text-gray-800'
                : 'bg-[#F2C8C4] text-gray-800'
            }`}
          >
            {item.active === 1 ? 'Active' : 'Inactive'}
          </span>
        );
      default:
        return '—';
    }
  };

  const renderActions = (item: SnaggingItem) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleViewDetail(item)}
      className="h-8 w-8 p-0 text-black hover:bg-gray-100"
      title="View Detail"
    >
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">SNAG LIST</h1>

        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-700">
            {activeView === 'User Snag' ? 'User Snagging Items' : 'My Snagging Items'}
          </h2>
        </div>

        <div className="w-full min-w-0 max-w-full">
          <EnhancedTable
            data={filteredData}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            storageKey="snagging-list-table"
            enableSearch
            searchTerm={searchTerm}
            onSearchChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            disableClientSearch
            searchPlaceholder="Search snags..."
            onFilterClick={() => setShowFilters(true)}
            hideTableExport
            loading={loading}
            emptyMessage="No snagging items found"
            pagination
            pageSize={15}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            getItemId={(item) => String(item.id)}
          />
        </div>
      </div>

      <SnaggingFilterDialog
        open={showFilters}
        onOpenChange={setShowFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
