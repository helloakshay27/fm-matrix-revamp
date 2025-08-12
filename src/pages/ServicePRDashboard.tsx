import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ServicePRFilterDialog } from "@/components/ServicePRFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable"; // Adjust the import path as needed
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";

export const ServicePRDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const servicePRData = [
    {
      id: 12985,
      prNumber: "10011",
      referenceNo: "10011",
      supplierName: "xyz",
      createdBy: "Anjali Lungare",
      createdOn: "30/07/2024",
      lastApprovedBy: "ACN",
      approvedStatus: "Pending",
      prAmount: "₹ 150.00",
      activeInactive: true,
    },
    {
      id: 12936,
      prNumber: "10010",
      referenceNo: "10010",
      supplierName: "xyz",
      createdBy: "Anjali Lungare",
      createdOn: "26/07/2024",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 5,000.00",
      activeInactive: true,
    },
    {
      id: 378,
      prNumber: "10006",
      referenceNo: "10006",
      supplierName: "",
      createdBy: "Robert Day2",
      createdOn: "05/07/2023",
      lastApprovedBy: "",
      approvedStatus: "Pending",
      prAmount: "₹ 10,700.00",
      activeInactive: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
          navigate(`/finance/service-pr/edit/${item.id}`);
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
          navigate(`/finance/service-pr/details/${item.id}`);
        }}
      >
        <Eye className="w-4 h-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
      <Button
        className="bg-[#C72030] hover:bg-[#C72030]/90 text-white h-9 px-4 text-sm font-medium"
        onClick={() => navigate("/finance/service-pr/add")}
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
        data={servicePRData}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="service-pr-dashboard-columns"
        className="min-w-[1000px]"
        emptyMessage="No service PR data available"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search..."
        exportFileName="service-prs"
        pagination={true}
        pageSize={5}
        enableSearch={true}
        enableSelection={true}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterDialogOpen(true)}
      />

      {/* Filter Dialog */}
      <ServicePRFilterDialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen} />
    </div>
  );
};