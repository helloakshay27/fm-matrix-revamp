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
import { deletePackage, getPackages, updatePackage, type PackageSetup } from "./packageSetupMockData";

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "name", label: "Package name", sortable: true, hideable: true, draggable: true },
  { key: "classActivity", label: "Class/Activity", sortable: true, hideable: true, draggable: true },
  { key: "packageType", label: "Package Type", sortable: true, hideable: true, draggable: true },
  { key: "sessions", label: "Sessions", sortable: true, hideable: true, draggable: true },
  { key: "price", label: "Price", sortable: true, hideable: true, draggable: true },
  { key: "validity", label: "Validity", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
];

const PAGE_SIZE = 10;

export const PackageSetupList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTick, setRefreshTick] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<PackageSetup | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const allPackages = useMemo(() => getPackages(), [refreshTick]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return allPackages;
    return allPackages.filter(
      (p) => p.name.toLowerCase().includes(q) || p.classActivity.toLowerCase().includes(q)
    );
  }, [allPackages, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleToggleStatus = (pkg: PackageSetup) => {
    const nextStatus = pkg.status === "Active" ? "Inactive" : "Active";
    updatePackage(pkg.id, { ...pkg, status: nextStatus });
    toast.success(`Package marked ${nextStatus}`);
    setRefreshTick((n) => n + 1);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deletePackage(deleteTarget.id);
    toast.success("Package deleted successfully!");
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setRefreshTick((n) => n + 1);
  };

  const renderRow = (pkg: PackageSetup) => ({
    actions: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(`/club-management/package-setup/details/${pkg.id}`)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="View"
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigate(`/club-management/package-setup/edit/${pkg.id}`)}
          className="p-1 text-black hover:bg-gray-100 rounded"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setDeleteTarget(pkg);
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
        onClick={() => navigate(`/club-management/package-setup/details/${pkg.id}`)}
      >
        {pkg.name}
      </div>
    ),
    classActivity: <span className="text-sm text-gray-700">{pkg.classActivity}</span>,
    packageType: <span className="text-sm text-gray-700">{pkg.packageType}</span>,
    sessions: <span className="text-sm text-gray-900">{pkg.sessions} Sessions</span>,
    price: <span className="text-sm text-gray-900">₹{pkg.price.toLocaleString("en-IN")}</span>,
    validity: <span className="text-sm text-gray-600">{pkg.validity}</span>,
    status: (
      <button
        type="button"
        onClick={() => handleToggleStatus(pkg)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${pkg.status === "Active" ? "bg-brand" : "bg-gray-300"
          }`}
        title={pkg.status === "Active" ? "Active - click to deactivate" : "Inactive - click to activate"}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${pkg.status === "Active" ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    ),
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Package Setup</h1>
      </header>

      <EnhancedTaskTable
        data={pageRows}
        columns={columns}
        renderRow={renderRow}
        storageKey="package-setup-list-v1"
        hideTableExport={true}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search packages..."
        emptyMessage="No packages found"
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-8 py-2"
            onClick={() => navigate("/club-management/package-setup/add")}
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
            <AlertDialogTitle>Delete Package</AlertDialogTitle>
            <AlertDialogDescription>
              Once you delete this package, you won't be able to retrieve it later. Are you sure you
              want to delete {deleteTarget?.name || "this package"}?
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

export default PackageSetupList;
