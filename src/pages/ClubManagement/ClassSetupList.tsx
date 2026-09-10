import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
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
import { deleteClass, getClasses, type ClassSetup } from "./classSetupMockData";

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "className", label: "Class name", sortable: true, hideable: true, draggable: true },
  { key: "maxCapacity", label: "Max Capacity", sortable: true, hideable: true, draggable: true },
  { key: "minParticipants", label: "Min Participants", sortable: true, hideable: true, draggable: true },
  { key: "duration", label: "Duration", sortable: true, hideable: true, draggable: true },
  { key: "location", label: "Location", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
];

const getStatusBadge = (status: string) => (
  <span
    className={
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium " +
      (status === "Active" ? "bg-[#C7EDDA] text-gray-800" : "bg-[#F2C8C4] text-gray-800")
    }
  >
    {status}
  </span>
);

const PAGE_SIZE = 10;

export const ClassSetupList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<ClassSetup | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allClasses = useMemo(() => getClasses(), [refreshTick]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allClasses;
    return allClasses.filter((c) => c.className.toLowerCase().includes(q));
  }, [allClasses, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteClass(deleteTarget.id);
    toast.success("Class deleted successfully!");
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setRefreshTick((n) => n + 1);
  };

  const renderRow = (cls: ClassSetup) => ({
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
    status: <div className="flex items-center">{getStatusBadge(cls.status)}</div>,
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Class Setup</h1>
      </header>

      <EnhancedTaskTable
        data={pageRows}
        columns={columns}
        renderRow={renderRow}
        storageKey="class-setup-list-v1"
        hideTableExport={true}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search class..."
        emptyMessage="No classes found"
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-8 py-2"
            onClick={() => navigate("/club-management/class-setup/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        }
      />

      {filtered.length > 0 && (
        <TicketPagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={filtered.length}
          perPage={PAGE_SIZE}
          isLoading={false}
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
