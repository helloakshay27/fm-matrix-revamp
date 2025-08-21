import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { POFilterDialog } from "@/components/POFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getPurchaseOrders } from "@/store/slices/purchaseOrderSlice";

const columns: ColumnConfig[] = [
  {
    key: "id",
    label: "ID",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "poNumber",
    label: "PO No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "referenceNo",
    label: "Reference No.",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "createdBy",
    label: "Created by",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "createdOn",
    label: "Created on",
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
    key: "paymentTenure",
    label: "Payment Tenure(in Days)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "activeInactive",
    label: "Active/Inactive",
    sortable: false,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "lastApprovedBy",
    label: "Last Approved By",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "approvalStatus",
    label: "Approval status",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "advanceAmount",
    label: "Advance Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "poAmount",
    label: "PO Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "retention",
    label: "Retention(%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "tds",
    label: "TDS(%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "qc",
    label: "QC(%)",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "tdsAmount",
    label: "TDS Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "retentionAmount",
    label: "Retention Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "retentionOutstanding",
    label: "Retention Outstanding",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "qcAmount",
    label: "QC Amount",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "qcOutstanding",
    label: "QC Outstanding",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "noOfGrns",
    label: "No of Grns",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
  {
    key: "totalAmountPaid",
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
    key: "debitCreditNoteRaised",
    label: "Debit/Credit Note Raised",
    sortable: true,
    draggable: true,
    defaultVisible: true,
  },
];

export const PODashboard = () => {
  const dispatch = useAppDispatch();
  const token = localStorage.getItem("token");
  const baseUrl = localStorage.getItem("baseUrl");

  const { loading } = useAppSelector(state => state.getPurchaseOrders)

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [poList, setPoList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getPurchaseOrders({ baseUrl, token })
        ).unwrap();
        const formattedData = response.purchase_orders.map((item: any) => ({
          id: item.id,
          poNumber: item.po_number,
          referenceNo: item.reference_number,
          createdBy: item.created_by,
          createdOn: item.created_at.split("T")[0],
          supplier: item.supplier?.company_name,
          paymentTenure: item.payment_tenure,
          activeInactive: item.active,
          lastApprovedBy:
            item.approval_levels[item.approval_levels.length - 1].approved_by,
          approvalStatus: item.all_level_approved
            ? "Approved"
            : item.all_level_approved === false
              ? "Rejected"
              : "Pending",
          advanceAmount: item.advance_amount,
          poAmount: item.po_amount,
          retention: item.retention,
          tds: item.tds,
          qc: item.quality_holding,
          tdsAmount: item.total_tax_amount,
          retentionAmount: item.retention_amount,
          retentionOutstanding: item.retention_outstanding,
          qcAmount: item.qc_amount,
          qcOutstanding: item.qc_outstanding,
          noOfGrns: item.no_of_grns,
          totalAmountPaid: item.total_amount_paid,
          outstanding: item.outstanding,
          debitCreditNoteRaised: item.debit_credit_note_raised,
        }));

        console.log(formattedData);
        setPoList(formattedData);
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
    switch (columnKey) {
      case "approvalStatus":
        return (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
              item.approvalStatus
            )}`}
          >
            {item.approvalStatus}
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
      case "referenceNo":
        return (
          <span className="text-blue-600 hover:underline cursor-pointer">
            {item.referenceNo}
          </span>
        );
      case "debitCreditNoteRaised":
        return (
          <span
            className={
              item.debitCreditNoteRaised
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {item.debitCreditNoteRaised ? "Yes" : "No"}
          </span>
        );
      default:
        return item[columnKey] ?? "-";
    }
  };

  const renderActions = (item: any) => (
    <Button
      size="sm"
      variant="ghost"
      className="p-1"
      onClick={() => navigate(`/finance/po/details/${item.id}`)}
    >
      <Eye className="w-4 h-4" />
    </Button>
  );

  const leftActions = (
    <>
      <Button
        style={{ backgroundColor: "#F2EEE9", color: "#BF213E" }}
        className="hover:bg-[#F2EEE9]/90"
        onClick={() => navigate("/finance/po/add")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add
      </Button>
    </>
  );

  return (
    <div className="p-4 sm:p-6">
      <EnhancedTable
        data={poList || []}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="po-dashboard-columns"
        className="min-w-[1100px]"
        emptyMessage="No purchase orders found"
        selectAllLabel="Select all POs"
        searchTerm={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search POs..."
        exportFileName="purchase-orders"
        pagination={true}
        pageSize={10}
        enableSearch={true}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        loading={loading}
      />

      <POFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
      />
    </div>
  );
};
