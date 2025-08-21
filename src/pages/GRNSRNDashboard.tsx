import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { GRNFilterDialog } from "@/components/GRNFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getGRN } from "@/store/slices/grnSlice";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "inventories_name",
    label: "Inventory",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "supplier_name",
    label: "Supplier",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "invoice_no",
    label: "Invoice Number",
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
    key: "po_number",
    label: "P.O. Number",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "po_reference_number",
    label: "P.O Reference Number",
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
    key: "last_approved_by",
    label: "Last Approved By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "po_amount",
    label: "PO Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "total_grn_amount",
    label: "Total GRN Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "payable_amount",
    label: "Payable Amount",
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
    key: "tds_amount",
    label: "TDS Amount",
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
    key: "invoice_date",
    label: "Invoice Date",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const GRNSRNDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const { loading } = useAppSelector(state => state.getGRN)

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [grn, setGrn] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getGRN({ baseUrl, token })).unwrap();
        setGrn(response.grns);
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
      case "pending":
        return "bg-yellow-500 text-black";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const renderCell = (item, columnKey: string) => {
    switch (columnKey) {
      case "approved_status":
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

  const handleAddNew = () => {
    navigate("/finance/grn-srn/add");
  };

  const handleFilter = () => {
    setIsFilterDialogOpen(true);
  };

  const handleView = (id: number) => {
    navigate(`/finance/grn-srn/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/finance/grn-srn/edit/${id}`);
  };

  const renderActions = (item) => (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => handleEdit(item.id)}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => handleView(item.id)}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex gap-3">
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={handleAddNew}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">GRN LIST</h1>

      <EnhancedTable
        data={grn}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        onRowClick={(item) => handleView(item.id)}
        storageKey="grn-srn-table"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search..."
        enableExport={true}
        exportFileName="grn_srn_export"
        pagination={true}
        pageSize={5}
        enableSearch={true}
        leftActions={leftActions}
        onFilterClick={handleFilter}
        loading={loading}
      />

      <GRNFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
    </div>
  );
};
