import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Edit, Plus, Trash2 } from "lucide-react";
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
import {
  INSPECTION_TYPE_PER_PAGE,
  type InspectionType,
} from "./api/inspectionTypeApi";
import {
  useCreateInspectionType,
  useDeleteInspectionType,
  useInspectionTypes,
  useUpdateInspectionType,
} from "./api/queries";
import {
  InspectionTypeFormDialog,
  type InspectionTypeFormData,
} from "./components/InspectionTypeFormDialog";
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
    key: "name",
    label: "Name",
    sortable: true,
    hideable: true,
    defaultVisible: true,
  },
  {
    key: "lat_long_required",
    label: "Lat/Long Required",
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

export const InspectionTypePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const [searchTerm, setSearchTerm] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<InspectionType | null>(null);
  const [deleting, setDeleting] = useState<InspectionType | null>(null);

  const { data, isLoading, isFetching, isError } = useInspectionTypes(page);
  const createMutation = useCreateInspectionType();
  const updateMutation = useUpdateInspectionType();
  const deleteMutation = useDeleteInspectionType();

  const inspectionTypes = data?.data ?? [];
  const totalPages = data?.pagination.total_pages ?? 1;
  const totalCount = data?.pagination.total_count ?? 0;
  const currentPage = Math.min(page, totalPages);
  const loading = isLoading || isFetching;

  const handlePageChange = (next: number) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next <= 1) params.delete("page");
        else params.set("page", String(next));
        return params;
      },
      { replace: false }
    );
  };

  // The URL page can point past the end (stale link, or the last row on a page was deleted).
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
  const offset = (page - 1) * INSPECTION_TYPE_PER_PAGE;
  const rows = inspectionTypes.map((item, index) => ({
    ...item,
    sr_no: offset + index + 1,
  }));

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: InspectionType) => {
    setEditing(item);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data: InspectionTypeFormData) => {
    const name = data.name.trim();
    if (editing) {
      // Lat/Long Required and Status are changed from the table toggles, so edit only sends the name.
      updateMutation.mutate(
        { id: editing.id, payload: { name } },
        {
          onSuccess: () => {
            toast.success("Inspection type updated");
            closeForm();
          },
          onError: (error) =>
            toast.error(
              errorMessage(error, "Failed to update inspection type")
            ),
        }
      );
    } else {
      createMutation.mutate(
        { name, lat_long_required: data.lat_long_required },
        {
          onSuccess: () => {
            toast.success("Inspection type created");
            closeForm();
          },
          onError: (error) =>
            toast.error(
              errorMessage(error, "Failed to create inspection type")
            ),
        }
      );
    }
  };

  const handleToggleActive = (item: InspectionType, active: boolean) => {
    updateMutation.mutate(
      { id: item.id, payload: { active } },
      {
        onSuccess: () =>
          toast.success(
            `Inspection type ${active ? "activated" : "deactivated"}`
          ),
        onError: (error) =>
          toast.error(errorMessage(error, "Failed to update status")),
      }
    );
  };

  const handleToggleLatLong = (
    item: InspectionType,
    latLongRequired: boolean
  ) => {
    updateMutation.mutate(
      { id: item.id, payload: { lat_long_required: latLongRequired } },
      {
        onSuccess: () =>
          toast.success(
            `Lat/Long ${latLongRequired ? "required" : "not required"} for ${item.name}`
          ),
        onError: (error) =>
          toast.error(
            errorMessage(error, "Failed to update Lat/Long Required")
          ),
      }
    );
  };

  const handleDelete = () => {
    if (!deleting) return;
    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success("Inspection type deleted");
        setDeleting(null);
      },
      onError: (error) =>
        toast.error(errorMessage(error, "Failed to delete inspection type")),
    });
  };

  const renderCell = (
    item: InspectionType & { sr_no: number },
    columnKey: string
  ) => {
    switch (columnKey) {
      case "sr_no":
        return item.sr_no;
      case "name":
        return <span className="font-medium">{item.name}</span>;
      case "lat_long_required":
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={!!item.lat_long_required}
              onCheckedChange={(checked) => handleToggleLatLong(item, checked)}
              disabled={updateMutation.isPending}
              aria-label={`Toggle Lat/Long Required for ${item.name}`}
            />
            <span className="text-sm text-gray-600">
              {item.lat_long_required ? "Yes" : "No"}
            </span>
          </div>
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

  const renderActions = (item: InspectionType) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-black hover:bg-gray-100"
        onClick={() => openEdit(item)}
        title="Edit inspection type"
      >
        <Edit className="w-4 h-4" />
      </Button>
      {/* <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-brand-error hover:bg-gray-100"
        onClick={() => setDeleting(item)}
        title="Delete inspection type"
      >
        <Trash2 className="w-4 h-4" />
      </Button> */}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-semibold text-[#1A1A18]">
          Inspection Type
        </h1>
      </div>

      <EnhancedTable
        data={rows}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        storageKey="vi-inspection-master-inspection-type"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search inspection types..."
        loading={isLoading || (isFetching && !data)}
        emptyMessage={
          isError
            ? "Failed to load inspection types"
            : "No inspection types found"
        }
        leftActions={
          <Button
            className="bg-brand hover:bg-brand-hover text-white"
            onClick={openCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        }
      />

      <MasterPagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />

      <InspectionTypeFormDialog
        open={formOpen}
        onClose={closeForm}
        inspectionType={editing}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete inspection type?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.name}" will be permanently deleted. This action cannot
              be undone.
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

export default InspectionTypePage;
