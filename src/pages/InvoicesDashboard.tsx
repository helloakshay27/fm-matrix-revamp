import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';
import { InvoicesFilterDialog } from '@/components/InvoicesFilterDialog';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { useAppDispatch } from '@/store/hooks';
import { getInvoinces } from '@/store/slices/invoicesSlice';
import { useNavigate } from 'react-router-dom';

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

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    invoiceNumber: '',
    invoiceDate: '',
    supplierName: '',
  });

  const [invoicesData, setInvoicesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getInvoinces({ baseUrl, token })).unwrap();
        setInvoicesData(response.work_order_invoices);
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }

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

  const handleExport = () => { };

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
        enableExport={true}
        exportFileName="invoices_export"
        handleExport={handleExport}
        pagination={true}
        pageSize={10}
        onFilterClick={() => setIsFilterDialogOpen(true)}
      />

      <InvoicesFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        onApply={handleFilterApply}
      />
    </div>
  );
};