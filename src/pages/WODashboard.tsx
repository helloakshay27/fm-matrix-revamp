import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WOFilterDialog } from "@/components/WOFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchWorkOrders } from "@/store/slices/workOrderSlice";

export const WODashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [workOrders, setWorkOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchWorkOrders({ baseUrl, token })
        ).unwrap();
        setWorkOrders(response.work_orders);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    const value = item[columnKey];

    switch (columnKey) {
      case "approved_status":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item?.approved_status
            )}`}
          >
            {item?.approved_status || "N/A"}
          </span>
        );
      case "reference_number":
        return (
          <span className="text-blue-600 hover:underline cursor-pointer">
            {value || "N/A"}
          </span>
        );
      case "active":
        return (
          <input
            type="checkbox"
            checked={value || false}
            readOnly
            className="w-4 h-4"
          />
        );
      case "debit_credit_note_raised":
        return value === true ? "Yes" : "No";
      default:
        return value !== undefined && value !== null ? value : "-";
    }
  };

  const columns: ColumnConfig[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "wo_no",
      label: "WO No.",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "reference_number",
      label: "Reference No.",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "created_on",
      label: "Created On",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "supplier",
      label: "Supplier",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "approved_status",
      label: "Approved Status",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "payment_tenure",
      label: "Payment Tenure (Days)",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "advance_amount",
      label: "Advance Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "total_amount",
      label: "Total Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "total_work_completed_percent",
      label: "Total Work Completed (%)",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "retention_percent",
      label: "Retention (%)",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "tds_percent",
      label: "TDS (%)",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "qc_percent",
      label: "QC (%)",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "active",
      label: "Active/Inactive",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "last_approved_by",
      label: "Last Approved By",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "tds_amount",
      label: "TDS Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "retention_amount",
      label: "Retention Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "retention_outstanding",
      label: "Retention Outstanding",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "qc_amount",
      label: "QC Amount",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "qc_outstanding",
      label: "QC Outstanding",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "no_of_invoices",
      label: "No. of Invoices",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "total_amount_paid",
      label: "Total Amount Paid",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "outstanding",
      label: "Outstanding",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "debit_credit_note_raised",
      label: "Debt/Credit Note Raised",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "created_by",
      label: "Created By",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "updated_by",
      label: "Updated By",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
    {
      key: "updated_on",
      label: "Updated On",
      sortable: true,
      draggable: true,
      defaultVisible: true,
    },
  ];

  const renderActions = (item: any) => (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/finance/wo/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/wo/edit/${item.id}`);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
      <Button
        style={{ backgroundColor: '#F2EEE9', color: '#BF213E' }}
        className="hover:bg-[#F2EEE9]/90"
        onClick={() => navigate('/finance/wo/add')}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Enhanced Table */}
      <EnhancedTable
        data={workOrders || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="wo-dashboard-columns"
        className="min-w-[1200px]"
        emptyMessage="No work orders found"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search WOs..."
        // enableExport={true}
        exportFileName="work-orders"
        pagination={true}
        pageSize={10}
        enableSearch={true}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        leftActions={leftActions}
      />

      {/* Filter Dialog */}
      <WOFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
    </div>
  );
};
