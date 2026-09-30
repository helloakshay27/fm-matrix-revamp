import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { Plus, Eye, Trash2 } from "lucide-react";
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
  cancelClassBooking,
  fetchClassBookings,
  fetchClubClasses,
  fetchTrainersForClass,
  type BookingStatus,
  type ClassBookingListItem,
  type ClubClassOption,
  type TrainerOption,
} from "./classPurchaseApi";

const statusBadgeClass = (status: BookingStatus) =>
  status === "booked"
    ? "bg-green-100 text-green-800"
    : status === "attended"
      ? "bg-gray-100 text-gray-700"
      : status === "no_show"
        ? "bg-yellow-100 text-yellow-800"
        : status === "cancelled"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-700";

const Badge = ({ className, children }: { className: string; children: React.ReactNode }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${className}`}>
    {children}
  </span>
);

const formatTime = (iso: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "member", label: "Member", sortable: true, hideable: true, draggable: true },
  { key: "className", label: "Class", sortable: true, hideable: true, draggable: true },
  { key: "trainerName", label: "Trainer", sortable: true, hideable: true, draggable: true },
  { key: "bookingDate", label: "Date", sortable: true, hideable: true, draggable: true },
  { key: "time", label: "Time", sortable: false, hideable: true, draggable: true },
  { key: "remainingCredits", label: "Credits left", sortable: false, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: false, hideable: true, draggable: true },
];

export const ClassBookingList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const purchaseIdFilter = searchParams.get("purchase_id") ?? "";

  const [items, setItems] = useState<ClassBookingListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [classOptions, setClassOptions] = useState<ClubClassOption[]>([]);
  const [trainerOptions, setTrainerOptions] = useState<TrainerOption[]>([]);
  const [classFilter, setClassFilter] = useState("");
  const [trainerFilter, setTrainerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<ClassBookingListItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchClubClasses()
      .then(setClassOptions)
      .catch((error) => console.error("Failed to load classes", error));
    fetchTrainersForClass()
      .then(setTrainerOptions)
      .catch((error) => console.error("Failed to load trainers", error));
  }, []);

  const load = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await fetchClassBookings({
        page,
        search: searchTerm || undefined,
        clubClassId: classFilter || undefined,
        trainerId: trainerFilter || undefined,
        status: statusFilter || undefined,
        classPurchaseId: purchaseIdFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      });
      setItems(result.items);
      setTotalPages(result.totalPages);
      setTotalRecords(result.totalCount);
    } catch (error) {
      console.error("Failed to load class bookings", error);
      toast.error("Failed to load class bookings");
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
  }, [currentPage, classFilter, trainerFilter, statusFilter, purchaseIdFilter, dateFrom, dateTo]);

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
    const reason = window.prompt("Reason for cancelling this booking:") ?? "";
    try {
      await cancelClassBooking(deleteTarget.id, reason);
      toast.success("Booking cancelled successfully!");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      load(currentPage);
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error("Failed to cancel booking");
    }
  };

  const renderRow = (item: ClassBookingListItem) => ({
    actions: (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className="p-1"
          title="View"
          onClick={() => navigate(`/club-management/class-booking/${item.id}`)}
        >
          <Eye className="w-4 h-4" />
        </Button>
        {/* {item.status === "booked" && (
          <Button
            variant="ghost"
            className="p-1 text-red-600"
            title="Delete"
            onClick={() => {
              setDeleteTarget(item);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )} */}
      </div>
    ),
    member: <span className="font-medium text-brand">{item.userName}</span>,
    className: <span className="text-sm text-gray-700">{item.className}</span>,
    trainerName: <span className="text-sm text-gray-700">{item.trainerName}</span>,
    bookingDate: <span className="text-sm text-gray-700">{item.bookingDate}</span>,
    time: (
      <span className="text-sm text-gray-600">
        {formatTime(item.startTime)}&ndash;{formatTime(item.endTime)}
      </span>
    ),
    remainingCredits: <span className="text-sm text-gray-700">{item.remainingCredits}</span>,
    status: <Badge className={statusBadgeClass(item.status)}>{item.status.replace("_", " ")}</Badge>,
  });

  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Bookings</h1>
      </header>

      {purchaseIdFilter && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-fit">
          Filtered by purchase #{purchaseIdFilter}
          <button
            className="text-[#C72030] hover:underline"
            onClick={() => {
              searchParams.delete("purchase_id");
              setSearchParams(searchParams);
            }}
          >
            Clear
          </button>
        </div>
      )}

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
            <InputLabel shrink>Trainer</InputLabel>
            <MuiSelect
              value={trainerFilter}
              onChange={(e) => {
                setTrainerFilter(e.target.value);
                setCurrentPage(1);
              }}
              label="Trainer"
              notched
              displayEmpty
            >
              <MenuItem value="">All trainers</MenuItem>
              {trainerOptions.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
                </MenuItem>
              ))}
            </MuiSelect>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel shrink>Status</InputLabel>
            <MuiSelect
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as BookingStatus | "");
                setCurrentPage(1);
              }}
              label="Status"
              notched
              displayEmpty
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="booked">Booked</MenuItem>
              <MenuItem value="attended">Attended</MenuItem>
              <MenuItem value="no_show">No-show</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
              <MenuItem value="rescheduled">Rescheduled</MenuItem>
            </MuiSelect>
          </FormControl>
          <TextField
            label="From"
            type="date"
            size="small"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="To"
            type="date"
            size="small"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button variant="outline" onClick={() => load(1)}>
            Search
          </Button>
        </div>
      )}

      <EnhancedTable
        data={items}
        columns={columns}
        renderRow={renderRow}
        storageKey="class-booking-list"
        hideTableExport
        enableSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search"
        loading={isLoading}
        loadingMessage="Loading class bookings..."
        emptyMessage="No class bookings found"
        pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-6"
            onClick={() => navigate("/club-management/class-booking/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> New Booking
          </Button>
        }
      />
      <p className="text-sm text-gray-500">{totalRecords} booking{totalRecords === 1 ? "" : "s"} total</p>

      <AlertDialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          setShowDeleteModal(open);
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Once you delete this booking, you won't be able to retrieve it later. Are you sure you
              want to delete {deleteTarget?.userName || "this"}'s booking?
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

export default ClassBookingList;
