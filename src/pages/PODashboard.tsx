import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { POFilterDialog } from "@/components/POFilterDialog";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getPurchaseOrders } from "@/store/slices/purchaseOrderSlice";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { updateActiveStaus } from "@/store/slices/materialPRSlice";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

const debounce = (func: (...args: any[]) => void, wait: number) => {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
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
    key: "activeInactive",
    label: "Active/Inactive",
    sortable: false,
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
    key: "amount",
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
  // {
  //   key: "retentionAmount",
  //   label: "Retention Amount",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  // {
  //   key: "retentionOutstanding",
  //   label: "Retention Outstanding",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  // {
  //   key: "qcAmount",
  //   label: "QC Amount",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  // {
  //   key: "qcOutstanding",
  //   label: "QC Outstanding",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  // {
  //   key: "noOfGrns",
  //   label: "No of Grns",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  // {
  //   key: "totalAmountPaid",
  //   label: "Total Amount Paid",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
  // {
  //   key: "outstanding",
  //   label: "Outstanding",
  //   sortable: true,
  //   draggable: true,
  //   defaultVisible: true,
  // },
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
  const [filters, setFilters] = useState({
    referenceNumber: '',
    poNumber: '',
    supplierName: '',
    approvalStatus: ''
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_count: 0,
    total_pages: 0,
  });
  const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  const fetchData = async (filterData = {}) => {
    try {
      const response = await dispatch(
        getPurchaseOrders({ baseUrl, token, page: pagination.current_page, ...filterData })
      ).unwrap();
      const formattedData = response.purchase_orders.map((item: any) => ({
        id: item.id,
        poNumber: item.external_id,
        referenceNo: item.reference_number,
        createdBy: item.created_by,
        createdOn: item.created_at.split("T")[0],
        supplier: item.supplier?.company_name,
        paymentTenure: item.payment_tenure,
        activeInactive: item.active,
        lastApprovedBy:
          item?.approval_levels[item.approval_levels.length - 1]?.approved_by,
        approvalStatus: item.all_level_approved
          ? "Approved"
          : item.all_level_approved === false
            ? "Rejected"
            : "Pending",
        allLevelApproved: item.all_level_approved,
        amount: item.amount,
        advanceAmount: item.advance_amount,
        poAmount: item.po_amount,
        retention: item.retention,
        tds: item.tds,
        qc: item.quality_holding,
        tdsAmount: item.total_tax_amount.toFixed(2),
        retentionAmount: item.retention_amount,
        retentionOutstanding: item.retention_outstanding,
        qcAmount: item.qc_amount,
        qcOutstanding: item.qc_outstanding,
        noOfGrns: item.no_of_grns,
        totalAmountPaid: item.total_amount_paid,
        outstanding: item.outstanding,
        debitCreditNoteRaised: item.debit_credit_note_raised,

      }));

      setPoList(formattedData);
      setPagination({
        current_page: response.current_page,
        total_count: response.total_count,
        total_pages: response.total_pages
      })
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApplyFilters = (newFilters: {
    referenceNumber: string;
    poNumber: string;
    supplierName: string;
    approvalStatus: string;
  }) => {
    setFilters(newFilters); // Update filter state
    fetchData({
      reference_number: newFilters.referenceNumber,
      external_id: newFilters.poNumber,
      supplier_name: newFilters.supplierName,
      approval_status: newFilters.approvalStatus
    }); // Fetch data with filters
  };

  const debouncedFetchData = useCallback(
    debounce((query: string) => {
      fetchData({ search: query });
    }, 500),
    [pagination.current_page, filters]
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPagination((prev) => ({ ...prev, current_page: 1 })); // Reset to first page on search
    debouncedFetchData(query, {
      reference_number: filters.referenceNumber,
      external_id: filters.poNumber,
      supplier_name: filters.supplierName,
    });
  };

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

  const handleCheckboxChange = async (item: any) => {
    const newStatus = !item.activeInactive;
    const itemId = item.id;

    if (updatingStatus[itemId]) return;

    try {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

      await dispatch(
        updateActiveStaus({
          baseUrl,
          token,
          id: itemId,
          data: {
            pms_purchase_order: {
              active: newStatus,
            },
          },
        })
      ).unwrap();

      setPoList((prevData: any[]) =>
        prevData.map((row) =>
          row.id === itemId ? { ...row, activeInactive: newStatus } : row
        )
      );

      toast.success(`Purchase Order ${newStatus ? "activated" : "deactivated"} successfully`);
    } catch (error) {
      console.error("Error updating active status:", error);
      toast.error(error || "Failed to update active status. Please try again.");
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
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
          <Switch
            checked={item.activeInactive}
            onCheckedChange={() =>
              handleCheckboxChange(item)
            }
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
            disabled={updatingStatus[item.id]}
          />
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
      case "createdOn":
        return format(item.createdOn, "dd-MM-yyyy");
      default:
        return item[columnKey] ?? "-";
    }
  };

  const renderActions = (item: any) => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="p-1"
        onClick={() => navigate(`/finance/po/details/${item.id}`)}
      >
        <Eye className="w-4 h-4" />
      </Button>
      {
        item.allLevelApproved === null && <Button
          size="sm"
          variant="ghost"
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/finance/po/edit/${item.id}`);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
      }
    </div>
  );

  const handlePageChange = async (page: number) => {
    if (page < 1 || page > pagination.total_pages || page === pagination.current_page || loading) {
      return;
    }

    try {
      setPagination((prev) => ({ ...prev, current_page: page }));
      await fetchData({
        page,
        reference_number: filters.referenceNumber,
        external_id: filters.poNumber,
        supplier_name: filters.supplierName,
        approval_status: filters.approvalStatus,
        search: searchQuery,
      });
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
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by PO No."
        exportFileName="purchase-orders"
        enableSearch={true}
        leftActions={leftActions}
        onFilterClick={() => setIsFilterDialogOpen(true)}
        loading={loading}
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

      <POFilterDialog
        open={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};
