import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { InvoicesFilterDialog } from '@/components/InvoicesFilterDialog';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getInvoinces } from '@/store/slices/invoicesSlice';
import { useNavigate } from 'react-router-dom';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const columns: ColumnConfig[] = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'invoice_number',
    label: 'Invoice Number',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'invoice_date',
    label: 'Invoice Date',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'supplier',
    label: 'Supplier',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'wo_number',
    label: 'W.O. Number',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'wo_amount',
    label: 'WO Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'total_invoice_amount',
    label: 'Total Invoice Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'last_approved_by',
    label: 'Last Approved By',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'approved_status',
    label: 'Approved Status',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'payment_status',
    label: 'Payable Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'adjustment_amount',
    label: 'Adjustment Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'retention_amount',
    label: 'Retention Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'tds_amount',
    label: 'TDS Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'qh_amount',
    label: 'QC Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'physical_invoice_sent_to_accounts',
    label: 'Physical Invoice Sent to Accounts',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'physical_invoice_received_by_accounts',
    label: 'Physical Invoice Received by Accounts',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'days_passed',
    label: 'Days Passed',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'amount_paid',
    label: 'Amount Paid',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'balance_amount',
    label: 'Balance Amount',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'payment_status',
    label: 'Payment Status',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'aging',
    label: 'Aging',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'created_on',
    label: 'Created On',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
  {
    key: 'created_by',
    label: 'Created By',
    sortable: true,
    defaultVisible: true,
    draggable: true,
  },
];

export const InvoicesDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem("token");

  const { loading } = useAppSelector(state => state.getInvoinces)

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: '',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [invoicesData, setInvoicesData] = useState([]);

  const fetchData = async (page: number = 1) => {
    try {
      const response = await dispatch(getInvoinces({ baseUrl, token, page })).unwrap();
      setInvoicesData(response.work_order_invoices);
      setPagination({
        current_page: response.pagination.current_page,
        total_count: response.pagination.total_count,
        total_pages: response.pagination.total_pages
      })
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const handleFilterApply = (filters: typeof appliedFilters) => {
    setAppliedFilters(filters);
    toast.success('Filters applied successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'partial':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderActions = (item: any) => (
    <div className="flex items-center justify-center gap-3">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/finance/invoices/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "approved_status":
      case "paymentStatus":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.approved_status
            )}`}
          >
            {item.approved_status}
          </span>
        );
      default:
        return item[columnKey] || "-";
    }
  };

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchData(page);
    } catch (error) {
      console.error("Error changing page:", error);
      toast.error("Failed to load page data. Please try again.");
    }
  };

  const renderPaginationItems = () => {
    if (!pagination.total_pages || pagination.total_pages <= 0) {
      return null;
    }
    const items = [];
    const totalPages = pagination.total_pages;
    const currentPage = pagination.current_page;
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      items.push(
        <PaginationItem key={1} className='cursor-pointer'>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            aria-disabled={loading}
            className={loading ? "pointer-events-none opacity-50" : ""}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 4) {
        items.push(
          <PaginationItem key="ellipsis1" >
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = 2; i <= Math.min(3, totalPages - 1); i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage > 3 && currentPage < totalPages - 2) {
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i} className='cursor-pointer'>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                aria-disabled={loading}
                className={loading ? "pointer-events-none opacity-50" : ""}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      } else {
        for (let i = Math.max(totalPages - 2, 2); i < totalPages; i++) {
          if (!items.find((item) => item.key === i.toString())) {
            items.push(
              <PaginationItem key={i} className='cursor-pointer'>
                <PaginationLink
                  onClick={() => handlePageChange(i)}
                  isActive={currentPage === i}
                  aria-disabled={loading}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          }
        }
      }

      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i} className='cursor-pointer'>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              aria-disabled={loading}
              className={loading ? "pointer-events-none opacity-50" : ""}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="p-6 space-y-6">
      <EnhancedTable
        data={invoicesData}
        renderActions={renderActions}
        renderCell={renderCell}
        columns={columns}
        storageKey="invoices-dashboard"
        emptyMessage="No invoices found matching your criteria"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search..."
        loading={loading}
        onFilterClick={() => setIsFilterDialogOpen(true)}
      />

      <div className="flex justify-center mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                className={pagination.current_page === 1 || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(pagination.total_pages, pagination.current_page + 1))}
                className={pagination.current_page === pagination.total_pages || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <InvoicesFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};