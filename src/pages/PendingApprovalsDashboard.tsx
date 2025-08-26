import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchPendingApprovals } from "@/store/slices/pendingApprovalSlice";
import { useNavigate } from "react-router-dom";

const columns: ColumnConfig[] = [
  {
    key: "view",
    label: "View",
    sortable: false,
    draggable: false,
    defaultVisible: true,
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "prNo",
    label: "PR No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "siteName",
    label: "Site Name",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "level",
    label: "Level",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const PendingApprovalsDashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");
  const [pendingApprovalsData, setPendingApprovalsData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchPendingApprovals({ baseUrl, token })
        ).unwrap();
        const formattedResponse = response.pending_data.map((item: any) => ({
          id: item.resource_id,
          type:
            item.resource_type === "Pms::PurchaseOrder" && item.letter_of_indent === true
              ? "Material PR"
              : item.resource_type === "Pms::PurchaseOrder" && item.letter_of_indent === false
                ? "PO"
                : item.resource_type === "Pms::WorkOrder" && item.letter_of_indent === true
                  ? "Service PR"
                  : item.resource_type === "Pms::WorkOrder" && item.letter_of_indent === false
                    ? "WO"
                    : item.resource_type === "Pms::Grn"
                      ? "GRN"
                      : "Invoice",
          prNo: item.reference_number,
          siteName: item.site_name,
          level: item.approval_level_name,
          level_id: item.level_id,
          user_id: item.user_id,
        }));
        setPendingApprovalsData(formattedResponse);
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    };

    fetchData();
  }, []);

  const renderCell = (item: any, columnKey: string) => {
    if (columnKey === "view") {
      const url =
        item.type === "Material PR"
          ? `finance/material-pr/details`
          : item.type === "PO"
            ? `finance/po/details`
            : item.type === "Service PR"
              ? `finance/service-pr/details`
              : item.type === "WO"
                ? `finance/wo/details`
                : item.type === "GRN"
                  ? `finance/grn-srn/details`
                  : `finance/invoices`;
      return (
        <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={() =>
            navigate(
              `/${url}/${item.id}?level_id=${item.level_id}&user_id=${item.user_id}`
            )
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    }
    return item[columnKey];
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">Pending Approvals</h1>

      <EnhancedTable
        data={pendingApprovalsData}
        columns={columns}
        renderCell={renderCell}
        storageKey="pending-approvals-table"
        className="bg-white rounded-lg shadow overflow-x-auto"
        emptyMessage="No pending approvals found"
        enableSearch={true}
        enableExport={true}
        exportFileName="pending-approvals"
        pagination={true}
        pageSize={10}
        hideColumnsButton={true}
        hideTableExport={true}
        hideTableSearch={true}
      />
    </div>
  );
};
