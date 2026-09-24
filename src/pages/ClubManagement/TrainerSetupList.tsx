import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { TicketPagination } from "@/components/TicketPagination";
import { toast } from "sonner";
import { apiClient } from "@/utils/apiClient";
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
import { deleteTrainer, updateTrainer, type TrainerSetup } from "./trainerSetupMockData";

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "name", label: "Trainer Name", sortable: true, hideable: true, draggable: true },
  { key: "specialization", label: "Specialization", sortable: true, hideable: true, draggable: true },
  { key: "experience", label: "Experience", sortable: true, hideable: true, draggable: true },
  { key: "ratePerSession", label: "Rate / Session", sortable: true, hideable: true, draggable: true },
  { key: "contactNumber", label: "Contact Number", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
];

const PAGE_SIZE = 10;

export const TrainerSetupList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const [allTrainers, setAllTrainers] = useState<TrainerSetup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalRecords, setTotalRecords] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<TrainerSetup | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTrainers = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get("/pms/admin/trainers.json?page=1&per_page=20");
        const responseData = response.data;
        const records = Array.isArray(responseData)
          ? responseData
          : responseData?.trainers ?? responseData?.data ?? responseData?.records ?? [];
        const trainers: TrainerSetup[] = records.map((trainer: any) => ({
          id: String(trainer.id),
          name: trainer.name ?? trainer.full_name ?? "",
          email: trainer.email ?? "",
          specialization: trainer.specialization ?? "",
          experience: trainer.experience ?? trainer.experience_years ?? "",
          ratePerSession: String(trainer.rate_per_session ?? trainer.ratePerSession ?? ""),
          contactNumber: trainer.mobile ?? trainer.contact_number ?? "",
          status: String(trainer.status).toLowerCase() === "inactive" ? "Inactive" : "Active",
          bio: trainer.bio ?? "",
          imageUrl: trainer.image_url ?? trainer.image ?? "",
          credentials: trainer.credentials ?? [],
        }));
        if (isMounted) {
          setAllTrainers(trainers);
          setTotalRecords(
            responseData?.meta?.total_count ??
              responseData?.total_count ??
              responseData?.pagination?.total_count ??
              trainers.length
          );
        }
      } catch (error) {
        console.error("Failed to fetch trainers", error);
        if (isMounted) {
          setAllTrainers([]);
          setTotalRecords(0);
          toast.error("Failed to load trainers");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchTrainers();
    return () => {
      isMounted = false;
    };
  }, [refreshTick]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allTrainers;
    return allTrainers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || t.specialization.toLowerCase().includes(q)
    );
  }, [allTrainers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil((searchTerm ? filtered.length : totalRecords) / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleToggleStatus = (trainer: TrainerSetup) => {
    const nextStatus = trainer.status === "Active" ? "Inactive" : "Active";
    updateTrainer(trainer.id, { ...trainer, status: nextStatus });
    toast.success(`Trainer marked ${nextStatus}`);
    setRefreshTick((n) => n + 1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteTrainer(deleteTarget.id);
    toast.success("Trainer deleted successfully!");
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setRefreshTick((n) => n + 1);
  };

  const renderRow = (trainer: TrainerSetup) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/club-management/trainer-setup/details/${trainer.id}`)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/club-management/trainer-setup/edit/${trainer.id}`)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setDeleteTarget(trainer);
            setShowDeleteModal(true);
          }}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    name: (
      <div
        className="font-medium text-brand cursor-pointer"
        onClick={() => navigate(`/club-management/trainer-setup/details/${trainer.id}`)}
      >
        {trainer.name}
      </div>
    ),
    specialization: <span className="text-sm text-gray-700">{trainer.specialization}</span>,
    experience: <span className="text-sm text-gray-900">{trainer.experience}</span>,
    ratePerSession: <span className="text-sm text-gray-900">₹ {trainer.ratePerSession}/hr</span>,
    contactNumber: <span className="text-sm text-gray-600">{trainer.contactNumber}</span>,
    status: (
      <button
        type="button"
        onClick={() => handleToggleStatus(trainer)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${trainer.status === "Active" ? "bg-brand" : "bg-gray-300"
          }`}
        title={trainer.status === "Active" ? "Active - click to deactivate" : "Inactive - click to activate"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${trainer.status === "Active" ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    ),
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trainer Setup</h1>
      </header>

      <EnhancedTaskTable
        data={pageRows}
        columns={columns}
        renderRow={renderRow}
        storageKey="trainer-setup-list-v1"
        hideTableExport={true}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search trainer..."
        emptyMessage="No trainers found"
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-8 py-2"
            onClick={() => navigate("/club-management/trainer-setup/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        }
      />

      {filtered.length > 0 && (
        <TicketPagination
          currentPage={page}
          totalPages={totalPages}
          totalRecords={searchTerm ? filtered.length : totalRecords}
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
            <AlertDialogTitle>Delete Trainer</AlertDialogTitle>
            <AlertDialogDescription>
              Once you delete this trainer, you won't be able to retrieve it later. Are you sure you
              want to delete {deleteTarget?.name || "this trainer"}?
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

export default TrainerSetupList;
