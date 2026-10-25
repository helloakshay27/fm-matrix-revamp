import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Edit, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import type { ColumnConfig } from "@/hooks/useEnhancedTable";
import {
  INSPECTION_CHECKLIST_PER_PAGE,
  type InspectionChecklistFilters,
  type InspectionChecklistQuestion,
} from "./api/inspectionChecklistApi";
import {
  useCreateInspectionChecklist,
  useInspectionChecklist,
  useInspectionTypeOptions,
  useUpdateInspectionChecklist,
  useDeleteInspectionChecklist,
} from "./api/queries";
import {
  InspectionChecklistFormDialog,
  type InspectionChecklistFormData,
} from "./components/InspectionChecklistFormDialog";
import {
  InspectionChecklistFilterDialog,
  type InspectionChecklistFilterValues,
} from "./components/InspectionChecklistFilterDialog";
import { MasterPagination } from "./components/MasterPagination";
import { errorMessage, formatDate, parsePage } from "./utils";

const columns: ColumnConfig[] = [
  {
    key: "sr_no",
    label: "Sr. No.",
    sortable: false,
    hideable: false,
    defaultVisible: true,
  },
  {
    key: "question",
    label: "Question",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
  {
    key: "inspection_type",
    label: "Inspection Type",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
  {
    key: "active",
    label: "Status",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
  {
    key: "created_at",
    label: "Created On",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
];

type ChecklistRow = InspectionChecklistQuestion & {
  sr_no: number;
  inspection_type: string;
};

export const InspectionChecklistPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const filters: InspectionChecklistFilters = {
    inspectionTypeId: searchParams.get("inspection_type_id") ?? undefined,
    active: searchParams.get("active") ?? undefined,
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InspectionChecklistQuestion | null>(
    null
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleting, setDeleting] = useState<InspectionChecklistQuestion | null>(
    null
  );

  const { data, isLoading, isFetching, isError } = useInspectionChecklist(
    page,
    filters
  );
  const { data: inspectionTypes = [], isLoading: inspectionTypesLoading } =
    useInspectionTypeOptions();
  const createMutation = useCreateInspectionChecklist();
  const updateMutation = useUpdateInspectionChecklist();
  const deleteMutation = useDeleteInspectionChecklist();

  const questions = data?.data ?? [];
  const totalPages = data?.pagination.total_pages ?? 1;
  const currentPage = Math.min(page, totalPages);
  const loading = isLoading || isFetching;

  const inspectionTypeNames = useMemo(
    () => new Map(inspectionTypes.map((type) => [type.id, type.name])),
    [inspectionTypes]
  );

  /** Updates URL params; any filter change sends the list back to page 1. */
  const updateParams = (
    updates: Record<string, string | undefined>,
    resetPage = true
  ) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, value]) => {
          if (value) params.set(key, value);
          else params.delete(key);
        });
        if (resetPage) params.delete("page");
        return params;
      },
      { replace: false }
    );
  };

  const handlePageChange = (next: number) => {
    updateParams({ page: next > 1 ? String(next) : undefined }, false);
  };

  // The URL page can point past the end (stale link, or filters shrank the list).
  useEffect(() => {
    if (data && page > data.pagination.total_pages) {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (data.pagination.total_pages <= 1) params.delete("page");
          else params.set("page", String(data.pagination.total_pages));
          return params;
        },
        { replace: true }
      );
    }
  }, [data, page, setSearchParams]);

  // Sr. No. continues across pages.
  const offset = (page - 1) * INSPECTION_CHECKLIST_PER_PAGE;
  const rows: ChecklistRow[] = questions.map((item, index) => ({
    ...item,
    sr_no: offset + index + 1,
    inspection_type: inspectionTypeNames.get(item.inspection_type_id) ?? "—",
  }));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: InspectionChecklistQuestion) => {
    setEditing(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: InspectionChecklistFormData) => {
    const payload = {
      inspection_type_id: formData.inspection_type_id,
      question: formData.question.trim(),
    };
    if (editing) {
      // Status is changed from the table toggle, so edit only updates type and question.
      updateMutation.mutate(
        { id: editing.id, payload },
        {
          onSuccess: () => {
            toast.success("Checklist question updated");
            closeForm();
          },
          onError: (error) =>
            toast.error(
              errorMessage(error, "Failed to update checklist question")
            ),
        }
      );
    } else {
      createMutation.mutate(
        { ...payload, active: true },
        {
          onSuccess: () => {
            toast.success("Checklist question created");
            closeForm();
          },
          onError: (error) =>
            toast.error(
              errorMessage(error, "Failed to create checklist question")
            ),
        }
      );
    }
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Checklist question deleted");
        setDeleting(null);
      },
      onError: (error) =>
        toast.error(errorMessage(error, "Failed to delete checklist question")),
    });
  };

  const handleToggleActive = (
    item: InspectionChecklistQuestion,
    active: boolean
  ) => {
    updateMutation.mutate(
      { id: item.id, payload: { active } },
      {
        onSuccess: () =>
          toast.success(
            `Checklist question ${active ? "activated" : "deactivated"}`
          ),
        onError: (error) =>
          toast.error(errorMessage(error, "Failed to update status")),
      }
    );
  };

  const renderCell = (item: ChecklistRow, columnKey: string) => {
    switch (columnKey) {
      case "sr_no":
        return item.sr_no;
      case "question":
        return (
          <span className="font-medium whitespace-normal">{item.question}</span>
        );
      case "inspection_type":
        return item.inspection_type;
      case "active":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={!!item.active}
              onCheckedChange={(checked) => handleToggleActive(item, checked)}
              disabled={updateMutation.isPending}
              aria-label={`Toggle question ${item.id}`}
            />
            <span className="text-sm text-gray-600">
              {item.active ? "Active" : "Inactive"}
            </span>
          </div>
        );
      case "created_at":
        return formatDate(item.created_at);
      default:
        return String(
          (item as unknown as Record<string, unknown>)[columnKey] ?? "—"
        );
    }
  };

  const renderActions = (item: InspectionChecklistQuestion) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => openEdit(item)}
        title="Edit checklist question"
      >
        <Edit className="w-4 h-4" />
      </Button>
      {/* <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-brand-error hover:bg-gray-100"
        onClick={() => setDeleting(item)}
        title="Delete checklist question"
      >
        <Trash2 className="w-4 h-4" />
      </Button> */}
    </div>
  );

  const handleApplyFilters = (values: InspectionChecklistFilterValues) => {
    updateParams({
      inspection_type_id: values.inspectionTypeId || undefined,
      active: values.active || undefined,
    });
  };

  // Chips for the filters currently applied via the URL.
  const activeFilterChips = [
    filters.inspectionTypeId && {
      key: "inspection_type_id",
      label: `Inspection Type: ${
        inspectionTypeNames.get(Number(filters.inspectionTypeId)) ??
        filters.inspectionTypeId
      }`,
    },
    filters.active && {
      key: "active",
      label: `Status: ${filters.active === "true" ? "Active" : "Inactive"}`,
    },
  ].filter(Boolean) as { key: string; label: string }[];

  const leftActions = (
    <Button
      className="bg-brand hover:bg-brand-hover text-white"
      onClick={openCreate}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add
    </Button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1A1A18]">
          Inspection Checklist
        </h1>
      </div>

      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {activeFilterChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => updateParams({ [chip.key]: undefined })}
                className="text-gray-400 hover:text-gray-700"
                aria-label={`Remove ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() =>
              updateParams({ inspection_type_id: undefined, active: undefined })
            }
            className="text-xs font-medium text-brand hover:underline"
          >
            Clear all
          </button>
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
        storageKey="vi-inspection-master-inspection-checklist"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search questions..."
        loading={isLoading || (isFetching && !data)}
        emptyMessage={
          isError
            ? "Failed to load checklist questions"
            : "No checklist questions found"
        }
        leftActions={leftActions}
        onFilterClick={() => setFilterOpen(true)}
      />

      <MasterPagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />

      <InspectionChecklistFormDialog
        open={formOpen}
        onClose={closeForm}
        checklistQuestion={editing}
        inspectionTypes={inspectionTypes}
        inspectionTypesLoading={inspectionTypesLoading}
        defaultInspectionTypeId={filters.inspectionTypeId}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <InspectionChecklistFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={{
          inspectionTypeId: filters.inspectionTypeId ?? "",
          active: filters.active ?? "",
        }}
        inspectionTypes={inspectionTypes}
        onApplyFilters={handleApplyFilters}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete checklist question?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.question}" will be permanently deleted. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
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

export default InspectionChecklistPage;
