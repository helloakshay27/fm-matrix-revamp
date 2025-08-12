import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MaterialPRFilterDialog } from "@/components/MaterialPRFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable"; // Adjust the import path as needed
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { getMaterialPR } from "@/store/slices/materialPRSlice";

export const MaterialPRDashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [materialPR, setMaterialPR] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getMaterialPR({ baseUrl, token })).unwrap();
        const formatedResponse = response.purchase_orders.map((item: any) => ({
          id: item.id,
          prNo: item.external_id,
          referenceNo: item.reference_number,
          supplierName: item.supplier.company_name,
          createdBy: item.user.full_name,
          createdOn: item.created_at,
          lastApprovedBy: item.lastApprovedBy,
          approvedStatus: item.approval_levels?.status_label,
          prAmount: item.total_amount,
          activeInactive: item.active
        }))
        setMaterialPR(formatedResponse)
      } catch (error) {
        console.log(error)
        toast.error(error)
      }
    }

    fetchData();
  }, [])

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
    switch (columnKey) {
      case "prNumber":
      case "referenceNo":
        return (
          <span className="text-blue-600 hover:underline cursor-pointer">
            {item[columnKey]}
          </span>
        );
      case "approvedStatus":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.approvedStatus
            )}`}
          >
            {item.approvedStatus}
          </span>
        );
      case "activeInactive":
        return (
          <input
            type="checkbox"
            checked={item.activeInactive}
            readOnly
            className="w-4 h-4"
          />
        );
      case "prAmount":
        return <span className="font-medium">{item.prAmount}</span>;
      default:
        return item[columnKey] || "";
    }
  };

  const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, draggable: true, defaultVisible: true },
    { key: "prNumber", label: "PR No.", sortable: true, draggable: true, defaultVisible: true },
    { key: "referenceNo", label: "Reference No.", sortable: true, draggable: true, defaultVisible: true },
    { key: "supplierName", label: "Supplier Name", sortable: true, draggable: true, defaultVisible: true },
    { key: "createdBy", label: "Created By", sortable: true, draggable: true, defaultVisible: true },
    { key: "createdOn", label: "Created On", sortable: true, draggable: true, defaultVisible: true },
    { key: "lastApprovedBy", label: "Last Approved By", sortable: true, draggable: true, defaultVisible: true },
    { key: "approvedStatus", label: "Approved Status", sortable: true, draggable: true, defaultVisible: true },
    { key: "prAmount", label: "PR Amount", sortable: true, draggable: true, defaultVisible: true },
    { key: "activeInactive", label: "Active/Inactive", sortable: false, draggable: true, defaultVisible: true },
  ];

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/material-pr/edit/${item.id}`);
        }}
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/finance/material-pr/details/${item.id}`);
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#A01020] text-white"
        onClick={() => navigate("/finance/material-pr/add")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-4 sm:p-6">
      {/* Table */}
      <EnhancedTable
        data={materialPR || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="material-pr-dashboard-columns"
        className="min-w-[1000px]"
        emptyMessage="No material PR data available"
        selectAllLabel="Select all Material PRs"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search..."
        enableExport={true}
        exportFileName="material-prs"
        pagination={true}
        pageSize={10}
        enableSearch={true}
        enableSelection={true}
        leftActions={leftActions}
        onFilterClick={() => setFilterDialogOpen(true)}
      />

      {/* Filter Dialog */}
      <MaterialPRFilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
      />
    </div>
  );
};