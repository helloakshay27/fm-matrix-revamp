import { useState } from "react";
import { Link } from "react-router-dom";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import { MasterPagination } from "@/features/vi-inspection/master/components/MasterPagination";
import { errorMessage, formatDate } from "@/features/vi-inspection/master/utils";
import {
  TRAINING_CATEGORY_PER_PAGE,
  type TrainingCategory,
  type TrainingCategoryFilters,
} from "./api/trainingCategoryApi";
import {
  useCreateTrainingCategory,
  useDeleteTrainingCategory,
  useTrainingCategories,
  useUpdateTrainingCategory,
} from "./api/queries";
import {
  TrainingCategoryFormDialog,
  type TrainingCategoryFormData,
} from "./components/TrainingCategoryFormDialog";
import { TrainingFilterDialog, type TrainingFilterValues } from "./components/TrainingFilterDialog";
import { deleteOutcomeMessage, useMasterListParams } from "./useMasterListParams";

export const TRAINING_CHECKLIST_PATH = "/settings/training/checklist";

const columns: ColumnConfig[] = [
  { key: "sr_no", label: "Sr. No.", sortable: false, hideable: false, defaultVisible: true },
  { key: "name", label: "Category Name", sortable: true, hideable: true, defaultVisible: true },
  { key: "questions_count", label: "Questions", sortable: true, hideable: true, defaultVisible: true },
  { key: "active", label: "Status", sortable: true, hideable: true, defaultVisible: true },
  { key: "created_at", label: "Created On", sortable: true, hideable: true, defaultVisible: true },
];

type CategoryRow = TrainingCategory & { sr_no: number };

// Training categories (GET/POST/PATCH/DELETE /training_subjects.json).
export const TrainingCategoryPage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editing, setEditing] = useState<TrainingCategory | null>(null);
  const [deleting, setDeleting] = useState<TrainingCategory | null>(null);
  const [totalPages, setTotalPages] = useState<number>();

  const { searchParams, page, search, searchInput, setSearchInput, updateParams, setPage } =
    useMasterListParams(totalPages);
  const filters: TrainingCategoryFilters = {
    search: search || undefined,
    active: searchParams.get("active") ?? undefined,
  };

  const { data, isLoading, isFetching, isError } = useTrainingCategories(page, filters);
  const createMutation = useCreateTrainingCategory();
  const updateMutation = useUpdateTrainingCategory();
  const deleteMutation = useDeleteTrainingCategory();

  const pages = data?.pagination.total_pages ?? 1;
  if (data && totalPages !== pages) setTotalPages(pages);
  const currentPage = Math.min(page, pages);

  // Sr. No. continues across pages.
  const offset = (page - 1) * TRAINING_CATEGORY_PER_PAGE;
  const rows: CategoryRow[] = (data?.data ?? []).map((item, index) => ({ ...item, sr_no: offset + index + 1 }));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: TrainingCategoryFormData) => {
    const category_name = formData.category_name.trim();
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload: { category_name } },
        {
          onSuccess: () => {
            toast.success("Training category updated");
            closeForm();
          },
          onError: (error) => toast.error(errorMessage(error, "Failed to update training category")),
        }
      );
    } else {
      createMutation.mutate(
        { category_name },
        {
          onSuccess: () => {
            toast.success("Training category created");
            closeForm();
          },
          onError: (error) => toast.error(errorMessage(error, "Failed to create training category")),
        }
      );
    }
  };

  const handleToggleActive = (item: TrainingCategory, active: boolean) => {
    updateMutation.mutate(
      { id: item.id, payload: { active } },
      {
        onSuccess: () => toast.success(`Training category ${active ? "activated" : "deactivated"}`),
        onError: (error) => toast.error(errorMessage(error, "Failed to update status")),
      }
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: (result) => {
        toast.success(deleteOutcomeMessage(result.outcome, "Training category"));
        setDeleting(null);
      },
      onError: (error) => toast.error(errorMessage(error, "Failed to delete training category")),
    });
  };

  const renderCell = (item: CategoryRow, columnKey: string) => {
    switch (columnKey) {
      case "sr_no":
        return item.sr_no;
      case "name":
        return <span className="font-medium">{item.name}</span>;
      case "questions_count":
        // Opens the checklist filtered to this category.
        return (
          <Link
            to={`${TRAINING_CHECKLIST_PATH}?category_id=${item.id}`}
            className="font-medium text-brand hover:underline"
            title={`View questions in ${item.name}`}
          >
            {item.questions_count ?? 0}
          </Link>
        );
      case "active":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={!!item.active}
              onCheckedChange={(checked) => handleToggleActive(item, checked)}
              disabled={updateMutation.isPending}
              aria-label={`Toggle ${item.name}`}
            />
            <span className="text-sm text-gray-600">{item.active ? "Active" : "Inactive"}</span>
          </div>
        );
      case "created_at":
        return formatDate(item.created_at);
      default:
        return String((item as unknown as Record<string, unknown>)[columnKey] ?? "—");
    }
  };

  const renderActions = (item: TrainingCategory) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => {
          setEditing(item);
          setFormOpen(true);
        }}
        title="Edit training category"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-brand-error hover:bg-gray-100"
        onClick={() => setDeleting(item)}
        title="Delete training category"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const handleApplyFilters = (values: TrainingFilterValues) => updateParams({ active: values.active || undefined });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1A1A18]">Training Category</h1>
      </div>

      {filters.active && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700">
            Status: {filters.active === "true" ? "Active" : "Inactive"}
            <button
              type="button"
              onClick={() => updateParams({ active: undefined })}
              className="text-gray-400 hover:text-gray-700"
              aria-label="Remove status filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="text-xs font-medium text-gray-600 hover:underline"
          >
            Edit filters
          </button>
        </div>
      )}

      <EnhancedTable
        data={rows}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="vi-training-master-category"
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        disableClientSearch
        searchPlaceholder="Search training categories..."
        loading={isLoading || (isFetching && !data)}
        emptyMessage={isError ? "Failed to load training categories" : "No training categories found"}
        onFilterClick={() => setFilterOpen(true)}
        leftActions={
          <Button className="bg-brand hover:bg-brand-hover text-white" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        }
      />

      <MasterPagination
        currentPage={currentPage}
        totalPages={pages}
        loading={isLoading || isFetching}
        onPageChange={setPage}
      />

      <TrainingCategoryFormDialog
        open={formOpen}
        onClose={closeForm}
        category={editing}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <TrainingFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={{ categoryId: "", active: filters.active ?? "" }}
        onApplyFilters={handleApplyFilters}
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete training category?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.name}" will be deleted. If trainings or questions still use it, it is
              deactivated instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteMutation.isPending}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TrainingCategoryPage;
