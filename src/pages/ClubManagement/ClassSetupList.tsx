import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { toast } from "sonner";
import { useClubManagementEvents } from "@/components/PostHogClubManagementEvents";
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

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "className", label: "Class name", sortable: true, hideable: true, draggable: true },
  { key: "maxCapacity", label: "Max Capacity", sortable: true, hideable: true, draggable: true },
  { key: "minParticipants", label: "Min Participants", sortable: true, hideable: true, draggable: true },
  { key: "duration", label: "Duration", sortable: true, hideable: true, draggable: true },
  { key: "location", label: "Location", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
];

const PAGE_SIZE = 20;

// Row shape the list renders - mapped from whatever GET /pms/admin/club_classes
// actually returns (session_type/duration_minutes/etc.), not the older mock
// ClassSetup shape.
interface ClassRow {
  id: string;
  className: string;
  maxCapacity: number;
  minParticipants: number;
  duration: string;
  location: string;
  status: "Active" | "Inactive";
}

export const ClassSetupList = () => {
  const navigate = useNavigate();
  const cmEvents = useClubManagementEvents();
  const listViewLogged = useRef(false);

  useEffect(() => {
    if (listViewLogged.current) return;
    listViewLogged.current = true;
    cmEvents.listViewed("Class Setup", "class_setup_list");
  }, [cmEvents]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reloadTick, setReloadTick] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<ClassRow | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      setIsLoading(true);
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://${baseUrl}/pms/admin/club_classes.json`, {
          params: { page: currentPage, per_page: PAGE_SIZE },
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        const list = Array.isArray(data) ? data : data?.club_classes ?? data?.data ?? [];
        const totalCount =
          data?.total_count ?? data?.pagination?.total_count ?? list.length;
        const apiTotalPages =
          data?.total_pages ??
          data?.pagination?.total_pages ??
          Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

        setRows(
          list.map((c: any) => ({
            id: String(c.id),
            className: c.name ?? "-",
            maxCapacity: c.max_capacity ?? 0,
            minParticipants: c.min_capacity ?? 0,
            duration: c.duration_minutes != null ? `${c.duration_minutes} min` : "-",
            location: c.location ?? "-",
            status: String(c.status).toLowerCase() === "active" ? "Active" : "Inactive",
          }))
        );
        setTotalPages(apiTotalPages);
        setTotalRecords(totalCount);
      } catch (err) {
        console.error("Failed to fetch class list", err);
        toast.error("Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchClasses();
  }, [currentPage, reloadTick]);

  // The list endpoint takes page/per_page only (no search param), so search
  // filters within the current page's 20 rows rather than across the whole set.
  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((c) => c.className.toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleToggleStatus = async (cls: ClassRow) => {
    const nextStatus = cls.status === "Active" ? "Inactive" : "Active";
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      await axios.put(
        `https://${baseUrl}/pms/admin/club_classes/${cls.id}.json`,
        { club_class: { status: nextStatus.toLowerCase() } },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRows((prev) => prev.map((r) => (r.id === cls.id ? { ...r, status: nextStatus } : r)));
      cmEvents.action("Class Setup Status Toggled", { entity_id: cls.id, status: nextStatus });
      toast.success(`Class marked ${nextStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      await axios.delete(`https://${baseUrl}/pms/admin/club_classes/${deleteTarget.id}.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cmEvents.deleted("Class Setup", deleteTarget.id, "class_setup_list");
      toast.success("Class deleted successfully!");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setReloadTick((n) => n + 1);
    } catch (err) {
      toast.error("Failed to delete class");
    }
  };

  const renderRow = (cls: ClassRow) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/club-management/class-setup/details/${cls.id}`)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/club-management/class-setup/edit/${cls.id}`)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setDeleteTarget(cls);
            setShowDeleteModal(true);
          }}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    className: (
      <div
        className="font-medium text-brand cursor-pointer"
        onClick={() => navigate(`/club-management/class-setup/details/${cls.id}`)}
      >
        {cls.className}
      </div>
    ),
    maxCapacity: <span className="text-sm text-gray-900">{cls.maxCapacity}</span>,
    minParticipants: <span className="text-sm text-gray-900">{cls.minParticipants}</span>,
    duration: <span className="text-sm text-gray-600">{cls.duration || "-"}</span>,
    location: <span className="text-sm text-gray-600">{cls.location}</span>,
    status: (
      <button
        type="button"
        onClick={() => handleToggleStatus(cls)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${cls.status === "Active" ? "bg-brand" : "bg-gray-300"
          }`}
        title={cls.status === "Active" ? "Active - click to deactivate" : "Inactive - click to activate"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${cls.status === "Active" ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    ),
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Setup</h1>
      </header>

      <EnhancedTaskTable
        data={filtered}
        columns={columns}
        renderRow={renderRow}
        storageKey="class-setup-list-v1"
        hideTableExport={true}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search class..."
        emptyMessage={isLoading ? "Loading classes..." : "No classes found"}
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-8 py-2"
            onClick={() => navigate("/club-management/class-setup/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        }
      />

      {totalRecords > 0 && (
        <TicketPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          perPage={PAGE_SIZE}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          onPerPageChange={() => {}}
        />
      )}

      <AlertDialog
        open={showDeleteModal}
        onOpenChange={(open) => {
          setShowDeleteModal(open);
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Once you delete this class, you won't be able to retrieve it later. Are you sure you
              want to delete {deleteTarget?.className || "this class"}?
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

export default ClassSetupList;
