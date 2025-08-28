import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { Eye, Users, UserCheck, ClipboardList, Building2 } from 'lucide-react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const SMTDashboard = () => {

  // Server-driven data and pagination
  type SMTRecord = {
    id: number;
    area_of_visit?: string | null;
    facility_name?: string | null;
    other_facility_name?: string | null;
    created_at?: string | null;
    circle_name?: string | null;
    smt_user?: { id: number; name?: string | null } | null;
    people_interacted_with?: (string | null)[];
  };

  type PaginationData = { current_page: number; total_count: number; total_pages: number };

  const [serverData, setServerData] = useState<SMTRecord[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationData>({ current_page: 1, total_count: 0, total_pages: 1 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const cardData = useMemo(() => {
    const uniqueCircles = new Set(serverData.map((d) => d.circle_name || '-')).size;
    const peopleInteracted = serverData.reduce((acc, r) => acc + (r.people_interacted_with?.filter((n) => (n || '').toString().trim().length > 0).length || 0), 0);
    return [
      { title: 'Total SMTs', count: paginationData.total_count, icon: Users },
      { title: 'Unique Circles', count: uniqueCircles, icon: Building2 },
      { title: 'Distinct Functions', count: 0, icon: ClipboardList },
      { title: 'People Interacted', count: peopleInteracted, icon: UserCheck },
    ];
  }, [serverData, paginationData.total_count]);

  const columns = [
    { key: 'actions', label: 'Action', sortable: false, defaultVisible: true },
    { key: 'smt_done_by_name', label: 'SMT Done By Name', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_function', label: 'SMT Done By Function', sortable: true, defaultVisible: true },
    { key: 'smt_done_by_circle', label: 'SMT Done By Circle', sortable: true, defaultVisible: true },
    { key: 'area_of_visit', label: 'Area Of Visit', sortable: true, defaultVisible: true },
    { key: 'type_of_facility', label: 'Type Of Facility', sortable: true, defaultVisible: true },
    { key: 'smt_done_date', label: 'SMT Done Date', sortable: true, defaultVisible: true },
  ];



  const pageSize = 5; // per_page on server

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const navigate = useNavigate();

  // Fetch data from API
  const fetchSMTs = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const baseUrl = localStorage.getItem('baseUrl') || 'fm-uat-api.lockated.com';
      const url = `https://${baseUrl}/smts.json?page=${page}&per_page=${pageSize}`;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const resp = await axios.get(url, { headers });
      const payload = resp.data || {};
      const rows: SMTRecord[] = Array.isArray(payload.data) ? payload.data : Array.isArray(payload) ? payload : [];
      const pagination: PaginationData = payload.pagination || { current_page: page, total_count: rows.length, total_pages: Math.max(1, Math.ceil((payload.total_count || rows.length) / pageSize)) };
      setServerData(rows);
      setPaginationData(pagination);
    } catch (e: any) {
      console.error('Failed to fetch SMTs:', e);
      setError(e?.message || 'Failed to fetch SMTs');
      toast.error('Failed to fetch SMTs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSMTs(currentPage);
  }, [fetchSMTs, currentPage]);

  // Map server data to table rows expected by EnhancedTable
  const tableData = useMemo(() => {
    return serverData.map((r) => ({
      id: r.id,
      smt_done_by_name: r.smt_user?.name || '-',
      smt_done_by_function: '-',
      smt_done_by_circle: r.circle_name || '-',
      area_of_visit: r.area_of_visit || '-',
      type_of_facility: r.facility_name || r.other_facility_name || '-',
      smt_done_date: r.created_at || '-',
      _raw: r,
    }));
  }, [serverData]);

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => navigate(`/maintenance/smt/${item.id}`, { state: { row: item } })}
            >
              <Eye className="h-4 w-4" onClick={() => navigate(`/maintenance/smt/${item.id}`, { state: { row: item } })} />
            </Button>
          </div>
        );
      case 'smt_done_date':
        return item.smt_done_date ? new Date(item.smt_done_date).toLocaleDateString() : '-';
      default:
        return item[columnKey] || '';
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(tableData.map(item => item.id.toString()));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Pagination rendering (same style as MSafeDashboard)
  const totalPages = paginationData.total_pages || 1;
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
      {/* SMT Summary Cards */}
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
      <EnhancedTable
        data={tableData}
        columns={columns}
        renderCell={renderCell}
        // selectable={true}
        selectedItems={selectedItems}
        onSelectAll={handleSelectAll}
        onSelectItem={handleSelectItem}
        getItemId={item => item.id.toString()}
        storageKey="smt-dashboard-table"
        emptyMessage="No SMT records found"
        searchPlaceholder="Search..."
        enableExport={false}
        showBulkActions={false}
        pagination={false}
        loading={loading}
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
    </div>
  );
}

export default SMTDashboard;
