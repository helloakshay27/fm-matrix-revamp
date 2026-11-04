import { useMemo, useState } from "react";
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
  TrainingFilterDialog,
  type TrainingFilterValues,
} from "@/features/vi-training/master/components/TrainingFilterDialog";
import { deleteOutcomeMessage, useMasterListParams } from "@/features/vi-training/master/useMasterListParams";
import { ZONE_PER_PAGE, zoneCircleName, type ViZone, type ViZoneFilters } from "./api/zoneApi";
import { useCircleOptions, useCreateZone, useDeleteZone, useUpdateZone, useZones } from "./api/queries";
import { ZoneFormDialog, type ZoneFormData } from "./components/ZoneFormDialog";

const columns: ColumnConfig[] = [
  { key: "sr_no", label: "Sr. No.", sortable: false, hideable: false, defaultVisible: true },
  { key: "name", label: "Zone Name", sortable: true, hideable: true, defaultVisible: true },
  { key: "circle", label: "Circle", sortable: true, hideable: true, defaultVisible: true },
  { key: "active", label: "Status", sortable: true, hideable: true, defaultVisible: true },
  { key: "created_at", label: "Created On", sortable: true, hideable: true, defaultVisible: true },
];

type ZoneRow = ViZone & { sr_no: number; circle: string };

// Circle-wise zones (GET/POST/PATCH/DELETE /vi_zones.json).
export const ZonePage = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editing, setEditing] = useState<ViZone | null>(null);
  const [deleting, setDeleting] = useState<ViZone | null>(null);
  const [totalPages, setTotalPages] = useState<number>();

  const { searchParams, page, search, searchInput, setSearchInput, updateParams, setPage } =
    useMasterListParams(totalPages);
  const filters: ViZoneFilters = {
    circleId: searchParams.get("circle_id") ?? undefined,
    active: searchParams.get("active") ?? undefined,
    search: search || undefined,
  };

  const { data, isLoading, isFetching, isError } = useZones(page, filters);
  const { data: circles = [], isLoading: circlesLoading } = useCircleOptions();
  const createMutation = useCreateZone();
  const updateMutation = useUpdateZone();
  const deleteMutation = useDeleteZone();

  const circleNames = useMemo(() => new Map(circles.map((circle) => [circle.id, circle.name])), [circles]);

  const pages = data?.pagination.total_pages ?? 1;
  if (data && totalPages !== pages) setTotalPages(pages);
  const currentPage = Math.min(page, pages);

  // Sr. No. continues across pages; the circle name comes with the zone or from the circle list.
  const offset = (page - 1) * ZONE_PER_PAGE;
  const rows: ZoneRow[] = (data?.data ?? []).map((item, index) => ({
    ...item,
    sr_no: offset + index + 1,
    circle: zoneCircleName(item) || circleNames.get(String(item.company_cluster_id)) || "—",
  }));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (formData: ZoneFormData) => {
    const name = formData.name.trim();
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, payload: { name } },
        {
          onSuccess: () => {
            toast.success("Zone updated");
            closeForm();
          },
          onError: (error) => toast.error(errorMessage(error, "Failed to update zone")),
        }
      );
    } else {
      createMutation.mutate(
        { name, company_cluster_id: formData.company_cluster_id },
        {
          onSuccess: () => {
            toast.success("Zone created");
            closeForm();
          },
          onError: (error) => toast.error(errorMessage(error, "Failed to create zone")),
        }
      );
    }
  };

  const handleToggleActive = (item: ViZone, active: boolean) => {
    updateMutation.mutate(
      { id: item.id, payload: { active } },
      {
        onSuccess: () => toast.success(`Zone ${active ? "activated" : "deactivated"}`),
        onError: (error) => toast.error(errorMessage(error, "Failed to update status")),
      }
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: (result) => {
        toast.success(deleteOutcomeMessage(result.outcome, "Zone"));
        setDeleting(null);
      },
      onError: (error) => toast.error(errorMessage(error, "Failed to delete zone")),
    });
  };

  const renderCell = (item: ZoneRow, columnKey: string) => {
    switch (columnKey) {
      case "sr_no":
        return item.sr_no;
      case "name":
        return <span className="font-medium">{item.name}</span>;
      case "circle":
        return item.circle;
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

  const renderActions = (item: ViZone) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => {
          setEditing(item);
          setFormOpen(true);
        }}
        title="Edit zone"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-brand-error hover:bg-gray-100"
        onClick={() => setDeleting(item)}
        title="Delete zone"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );

  const handleApplyFilters = (values: TrainingFilterValues) =>
    updateParams({ circle_id: values.categoryId || undefined, active: values.active || undefined });

  const chips = [
    filters.circleId && {
      key: "circle_id",
      label: `Circle: ${circleNames.get(filters.circleId) ?? filters.circleId}`,
    },
    filters.active && {
      key: "active",
      label: `Status: ${filters.active === "true" ? "Active" : "Inactive"}`,
    },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1A1A18]">Zone</h1>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-700"
            >
              {chip.label}
              <button
                type="button"
                onClick={() => updateParams({ [chip.key]: undefined })}
                className="text-gray-400 hover:text-gray-700"
                aria-label={`Remove ${chip.label} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {chips.length > 1 && (
            <button
              type="button"
              onClick={() => updateParams({ circle_id: undefined, active: undefined })}
              className="text-xs font-medium text-gray-600 hover:underline"
            >
              Clear all
            </button>
          )}
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
        storageKey="vi-zone-master"
        searchTerm={searchInput}
        onSearchChange={setSearchInput}
        disableClientSearch
        searchPlaceholder="Search zones..."
        loading={isLoading || (isFetching && !data)}
        emptyMessage={isError ? "Failed to load zones" : "No zones found"}
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

      <ZoneFormDialog
        open={formOpen}
        onClose={closeForm}
        zone={editing}
        circles={circles}
        circlesLoading={circlesLoading}
        defaultCircleId={filters.circleId}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <TrainingFilterDialog
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={{ categoryId: filters.circleId ?? "", active: filters.active ?? "" }}
        categories={circles}
        categoryLabel="Circle"
        allCategoriesLabel="All circles"
        onApplyFilters={handleApplyFilters}
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete zone?</AlertDialogTitle>
            <AlertDialogDescription>"{deleting?.name}" will be deleted.</AlertDialogDescription>
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

export default ZonePage;
