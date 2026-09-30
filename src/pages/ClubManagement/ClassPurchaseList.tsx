import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, TextField } from "@mui/material";
import { Button } from "@/components/ui/button";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  cancelClassPurchase,
  fetchClassPurchases,
  fetchClubClasses,
  type ClassPurchaseListItem,
  type ClubClassOption,
  type PurchasePaymentStatus,
  type PurchaseStatus,
} from "./classPurchaseApi";

const PAGE_SIZE = 20;

const paymentBadgeClass = (status: PurchasePaymentStatus) =>
  status === "paid"
    ? "bg-green-100 text-green-800"
    : status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : status === "failed"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-700";

const statusBadgeClass = (status: PurchaseStatus) =>
  status === "active" ? "bg-green-100 text-green-800" : status === "expired" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-800";

const Badge = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${className}`}>
    {children}
  </span>
);

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "member", label: "Member", sortable: true, hideable: true, draggable: true },
  { key: "classPackage", label: "Class / Package", sortable: false, hideable: true, draggable: true },
  { key: "credits", label: "Credits", sortable: false, hideable: true, draggable: true },
  { key: "validity", label: "Validity", sortable: false, hideable: true, draggable: true },
  { key: "total", label: "Total", sortable: true, hideable: true, draggable: true },
  { key: "paymentStatus", label: "Payment", sortable: false, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: false, hideable: true, draggable: true },
];

export const ClassPurchaseList = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ClassPurchaseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [classOptions, setClassOptions] = useState<ClubClassOption[]>([]);
  const [classFilter, setClassFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<PurchasePaymentStatus | "">("");
  const [statusFilter, setStatusFilter] = useState<PurchaseStatus | "">("");
  const [deleteTarget, setDeleteTarget] = useState<ClassPurchaseListItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchClubClasses()
      .then(setClassOptions)
      .catch((error) => console.error("Failed to load classes", error));
  }, []);

  const load = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await fetchClassPurchases({
        page,
        search: searchTerm || undefined,
        clubClassId: classFilter || undefined,
        paymentStatus: paymentFilter || undefined,
        status: statusFilter || undefined,
      });
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotalRecords(result.totalCount);
    } catch (error) {
      console.error("Failed to load class purchases", error);
      toast.error("Failed to load class purchases");
      setItems([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, classFilter, paymentFilter, statusFilter]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const didMountSearch = useRef(false);
  useEffect(() => {
    if (!didMountSearch.current) {
      didMountSearch.current = true;
      return;
    }
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await cancelClassPurchase(deleteTarget.id);
      toast.success("Purchase cancelled successfully!");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      load(currentPage);
    } catch (error) {
      console.error("Failed to cancel purchase", error);
      toast.error("Failed to cancel purchase");
    }
  };

  const renderRow = (item: ClassPurchaseListItem) => ({
    actions: (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className="p-1"
          title="View"
          onClick={() => navigate(`/club-management/class-purchase/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          className="p-1"
          title="Edit"
          onClick={() => navigate(`/club-management/class-purchase/edit/${item.id}`)}
        >
          <Edit className="w-4 h-4" />
        </Button>
        {/* <Button
          variant="ghost"
          className="p-1 text-red-600"
          title="Delete"
          onClick={() => {
            setDeleteTarget(item);
            setShowDeleteModal(true);
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button> */}
      </div>
    ),
    member: <span className="font-medium text-brand">{item.userName}</span>,
    classPackage: (
      <div>
        <div className="text-sm text-gray-900">{item.className}</div>
        <div className="text-xs text-gray-500">{item.packageName}</div>
      </div>
    ),
    credits: <span className="text-sm text-gray-700">{item.remainingSessions} / {item.totalSessions}</span>,
    validity: (
      <span className="text-sm text-gray-600">
        {item.validityStartDate} &ndash; {item.validityEndDate}
      </span>
    ),
    total: <span className="text-sm text-gray-900">₹{item.total.toLocaleString("en-IN")}</span>,
    paymentStatus: <Badge className={paymentBadgeClass(item.paymentStatus)}>{item.paymentStatus}</Badge>,
    status: <Badge className={statusBadgeClass(item.status)}>{item.status}</Badge>,
  });

  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Purchases</h1>
      </header>

      {/* Filters hidden for now - keep implementation for when they're needed again */}
      {false && (
        <div className="flex flex-wrap items-end gap-3">
          <TextField
            label="Search member"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(1)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel shrink>Class</InputLabel>
            <MuiSelect
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
              label="Class"
              notched
              displayEmpty
            >
              <MenuItem value="">All classes</MenuItem>
              {classOptions.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel shrink>Payment status</InputLabel>
            <MuiSelect
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value as PurchasePaymentStatus | "");
                setCurrentPage(1);
              }}
              label="Payment status"
              notched
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </MuiSelect>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as PurchaseStatus | "");
                setCurrentPage(1);
              }}
              label="Status"
              notched
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="expired">Expired</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </MuiSelect>
          </FormControl>
          <Button variant="outline" onClick={() => load(1)}>
            Search
          </Button>
        </div>
      )}

      <EnhancedTable
        data={items}
        columns={columns}
        renderRow={renderRow}
        storageKey="class-purchase-list"
        hideTableExport
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
        loading={isLoading}
        loadingMessage="Loading class purchases..."
        emptyMessage="No class purchases found"
        pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-6"
            onClick={() => navigate("/club-management/class-purchase/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> New Purchase
          </Button>
        }
      />
      <p className="text-sm text-gray-500">{totalRecords} purchase{totalRecords === 1 ? "" : "s"} total</p>

      <AlertDialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          setShowDeleteModal(open);
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Purchase</AlertDialogTitle>
            <AlertDialogDescription>
              Once you delete this purchase, you won't be able to retrieve it later. Are you sure you
              want to delete {deleteTarget?.userName || "this purchase"}'s purchase?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              className="btn-delete-confirm"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClassPurchaseList;
