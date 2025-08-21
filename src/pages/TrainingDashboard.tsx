import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Eye } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { toast } from 'sonner';

const columns = [
  { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
  { key: 'user_name', label: 'User Name', sortable: true, defaultVisible: true },
  { key: 'email', label: 'Email ID', sortable: true, defaultVisible: true },
  { key: 'user_type', label: 'Type of User', sortable: true, defaultVisible: true },
  { key: 'training_type', label: 'Training Type(Internal/External)', sortable: true, defaultVisible: true },
  { key: 'training_name', label: 'Training Name', sortable: true, defaultVisible: true },
  { key: 'training_date', label: 'Training Date', sortable: true, defaultVisible: true },
  { key: 'attachment', label: 'Attachment', sortable: false, defaultVisible: true },
];

// API types
interface TrainingAttachment {
  id: number;
  url: string;
  doctype: string | null;
}

interface TrainingApiRecord {
  id: number;
  training_type: string | null;
  training_subject_id: number | null;
  training_date: string | null;
  status: string | null;
  approved_by_id: number | null;
  created_by_id: number | null;
  comment: string | null;
  total_score: number | null;
  actual_score: number | null;
  resource_id: number | null;
  resource_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  url: string | null;
  form_url: string | null;
  training_subject_name: string | null;
  created_by?: {
    id?: number;
    name?: string;
    email?: string;
    mobile?: string | null;
    employee_type?: string | null;
  } | null;
  training_attachments?: TrainingAttachment[];
}

interface TrainingPagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}

interface TrainingApiResponse {
  code?: number;
  data?: TrainingApiRecord[];
  pagination?: TrainingPagination;
}

interface TrainingRow {
  id: number;
  user_name: string;
  email: string;
  user_type: string;
  training_type: string;
  training_name: string;
  training_date: string; // formatted
  raw_date?: string | null; // original for potential sorting
  attachment_url?: string;
  attachment_doctype?: string | null;
}


import { useNavigate } from 'react-router-dom';
import { Users, ClipboardList, CalendarCheck2, UserCheck, FileText, FileSpreadsheet } from 'lucide-react';
import TrainingFilterDialog from '@/components/TrainingFilterDialog';

const TrainingDashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [trainings, setTrainings] = useState<TrainingRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // email search input
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Filter dialog state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterEmail, setFilterEmail] = useState('');
  const [filterTrainingName, setFilterTrainingName] = useState('');
  const navigate = useNavigate();

  const formatDateTime = (iso: string | null): string => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      // Format DD/MM/YYYY HH:MM (24h)
      return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  };

  // Debounce search input (500ms)
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Reset to first page when search term changes
  useEffect(() => {
    if (debouncedSearch) setCurrentPage(1);
  }, [debouncedSearch]);

  const fetchTrainings = useCallback(async (page: number, emailSearch?: string) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      setError('Missing base URL or token');
      toast.error('Missing base URL or token');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dialogFilterActive = filterEmail.trim() || filterTrainingName.trim();
      const effectivePage = (emailSearch || dialogFilterActive) ? 1 : page; // force first page when searching / filtering
      let url = `https://${baseUrl}/trainings.json?approval=true&page=${effectivePage}`;
      // If dialog filter is active, use combined OR param; precedence: training name > email if both provided (can adjust)
      if (dialogFilterActive) {
        const term = (filterTrainingName.trim() || filterEmail.trim());
        url += `&q[training_subject_category_name_or_created_by_email_cont]=${encodeURIComponent(term)}`;
      } else if (emailSearch) {
        // Inline search (email only)
        url += `&created_by_email_cont=${encodeURIComponent(emailSearch)}`;
      }
      console.debug('[Training] Fetch URL:', url);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json: TrainingApiResponse = await res.json();
      const records = json.data || [];
      const mapped: TrainingRow[] = records.map(r => ({
        id: r.id,
        user_name: r.created_by?.name || '—',
        email: r.created_by?.email || '—',
        user_type: r.created_by?.employee_type || '—',
        training_type: (r.training_type || '').toString().toLowerCase() === 'internal' ? 'Internal' : (r.training_type || '') ? (r.training_type || '').charAt(0).toUpperCase() + (r.training_type || '').slice(1) : '—',
        training_name: r.training_subject_name || '—',
        training_date: formatDateTime(r.training_date),
  raw_date: r.training_date,
  attachment_url: r.training_attachments?.[0]?.url,
  attachment_doctype: r.training_attachments?.[0]?.doctype || null,
      }));
      setTrainings(mapped);
  if (json.pagination) {
    setCurrentPage((emailSearch || dialogFilterActive) ? 1 : json.pagination.current_page);
        setTotalPages(json.pagination.total_pages);
        setTotalCount(json.pagination.total_count);
      } else {
        setTotalPages(1);
        setTotalCount(mapped.length);
    if (emailSearch || dialogFilterActive) setCurrentPage(1);
      }
    } catch (e: any) {
      console.error('Training fetch error', e);
      setError(e.message || 'Failed to load trainings');
      toast.error('Failed to load trainings');
    } finally {
      setLoading(false);
    }
  }, [filterEmail, filterTrainingName]);

  useEffect(() => {
    fetchTrainings(currentPage, debouncedSearch || undefined);
  }, [fetchTrainings, currentPage, debouncedSearch]);

  // Summary card data (training-specific) using current page data & totals
  const cardData = [
    {
      title: 'Total Trainings',
      count: totalCount || trainings.length,
      icon: Users,
    },
    {
      title: 'Unique Users (page)',
      count: Array.from(new Set(trainings.map(d => d.user_name))).filter(n => n !== '—').length,
      icon: UserCheck,
    },
    {
      title: 'Training Types (page)',
      count: Array.from(new Set(trainings.map(d => d.training_type))).filter(t => t !== '—').length,
      icon: ClipboardList,
    },
    {
      title: 'Internal / External (page)',
      count: `${trainings.filter(d => d.training_type === 'Internal').length} / ${trainings.filter(d => d.training_type !== 'Internal' && d.training_type !== '—').length}`,
      icon: CalendarCheck2,
    },
  ];

  const renderCell = (item: TrainingRow, columnKey: string) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate(`/maintenance/training-list/${item.id}`, { state: { row: item } })}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'training_date':
        return item.training_date;
  case 'attachment': {
        if (!item.attachment_url) return '—';
        const url = item.attachment_url;
        const doctype = item.attachment_doctype || '';
        const isImage = /(jpg|jpeg|png|webp|gif|svg)$/i.test(url) || doctype.startsWith('image/');
        const isPdf = /pdf$/i.test(url) || doctype === 'application/pdf';
        const isExcel = /(xls|xlsx|csv)$/i.test(url) || /spreadsheetml|excel|csv/i.test(doctype);
        const isWord = /(doc|docx)$/i.test(url) || /word/i.test(doctype);
        if (isImage) {
          return (
            <div className="flex justify-center">
              <div className="w-14 h-14 flex items-center justify-center bg-[#F6F4EE] rounded border overflow-hidden cursor-pointer group" onClick={() => setPreviewImage(url)} title="View image">
                <img src={url} alt="Attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
            </div>
          );
        }
        let icon: React.ReactNode = <FileText className="w-6 h-6 text-gray-600" />;
        if (isPdf) icon = <FileText className="w-6 h-6 text-red-600" />;
        else if (isExcel) icon = <FileSpreadsheet className="w-6 h-6 text-green-600" />;
        else if (isWord) icon = <FileText className="w-6 h-6 text-blue-600" />;
        return (
          <div className="flex justify-center">
            <div title="Download attachment" className="w-14 h-14 flex items-center justify-center bg-[#F6F4EE] rounded border cursor-pointer hover:ring-1 hover:ring-[#C72030]"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    window.open(url, '_blank');
                    return;
                  }
                  window.open(url, '_blank');
                } catch (e) {
                  console.error('Attachment open error', e);
                }
              }}
            >
              {icon}
            </div>
          </div>
        );
      }
      default:
        return item[columnKey] || '';
    }
  };

  // Filter dialog handlers
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleApplyFilters = (filters: { email: string; trainingName: string }) => {
    setFilterEmail(filters.email);
    setFilterTrainingName(filters.trainingName);
    // Clear inline search when dialog filters are applied
    if (filters.email || filters.trainingName) {
      setSearchTerm('');
      setDebouncedSearch('');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(trainings.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Pagination rendering (same style as MSafeDashboard)
  const renderPaginationItems = () => {
    const items = [];
  const showEllipsis = totalPages > 7;
    if (showEllipsis) {
      // Show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => setCurrentPage(1)} isActive={currentPage === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
      );
      // Show ellipsis or pages 2-3
      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1">
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      // Show current page area
      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }
      // Show ellipsis or pages before last
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <span className="px-2">...</span>
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find(item => item.key === i)) {
            items.push(
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }
      // Show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => setCurrentPage(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink onClick={() => setCurrentPage(i)} isActive={currentPage === i} className="cursor-pointer">
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  return (
    <div className="p-6">
      {/* Training Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="p-3 sm:p-4 rounded-lg shadow-sm h-[100px] sm:h-[132px] flex items-center gap-2 sm:gap-4 bg-[#f6f4ee]"
          >
            <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0 bg-[#C4B89D54] rounded-full">
              <card.icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color: '#C72030' }} />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="text-lg sm:text-2xl font-bold leading-tight truncate">
                {card.count}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground font-medium leading-tight">
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="mb-4 p-3 border border-red-300 text-red-600 rounded bg-red-50 text-sm">{error}</div>
      )}
      <EnhancedTable
        data={trainings}
        columns={columns}
        renderCell={renderCell}
        selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={(item: TrainingRow) => item.id.toString()}
        storageKey="training-dashboard-table"
        emptyMessage={loading ? 'Loading trainings...' : 'No training records found'}
        searchPlaceholder="Search by user email..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        enableSearch={true}
        enableExport={false}
        showBulkActions={false}
        pagination={false}
        loading={loading}
        onFilterClick={handleFilterClick}
      />
      {/* Pagination (same as MSafeDashboard) */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {renderPaginationItems()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {totalPages === 1 && !loading && (
        <div className="text-xs text-gray-500 mt-4">Showing {trainings.length} record(s)</div>
      )}

      {/* Image Preview Modal */}
      <Dialog open={!!previewImage} onOpenChange={(open) => { if (!open) setPreviewImage(null); }}>
        <DialogContent className="max-w-[90vw] md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Attachment Preview</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="flex flex-col items-center gap-4">
              <img src={previewImage} alt="Preview" className="max-h-[70vh] w-auto object-contain rounded border" />
              <Button variant="secondary" onClick={() => window.open(previewImage!, '_blank')}>Open in New Tab</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <TrainingFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialEmail={filterEmail}
        initialTrainingName={filterTrainingName}
      />
    </div>
  );
};

export default TrainingDashboard;
