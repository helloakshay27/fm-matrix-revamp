import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { PACKAGE_TIER_TYPES, fetchClubClassOptions, type ClubClassOption } from "./packageSetupMockData";

interface PackageRow {
  id: string;
  name: string;
  classId: string;
  className: string;
  packageType: string;
  credits: number;
  validityDays: number;
  priceMember: number;
  priceHotelGuest: number;
  priceNonMember: number;
  cgstRate: number;
  sgstRate: number;
  hsnCode: string;
  extensionAllowed: boolean;
  maxExtensionDays: number;
  active: boolean;
}

const columns: ColumnConfig[] = [
  { key: "actions", label: "Actions", sortable: false, hideable: false, draggable: false },
  { key: "name", label: "Package name", sortable: true, hideable: true, draggable: true },
  { key: "classActivity", label: "Class/Activity", sortable: true, hideable: true, draggable: true },
  { key: "packageType", label: "Package Type", sortable: true, hideable: true, draggable: true },
  { key: "sessions", label: "Sessions", sortable: true, hideable: true, draggable: true },
  { key: "priceMember", label: "Price Member", sortable: true, hideable: true, draggable: true },
  { key: "priceHotelGuest", label: "Hotel Guest", sortable: true, hideable: true, draggable: true },
  { key: "priceNonMember", label: "Non Member", sortable: true, hideable: true, draggable: true },
  { key: "validity", label: "Validity", sortable: true, hideable: true, draggable: true },
  { key: "status", label: "Status", sortable: true, hideable: true, draggable: true },
];

const packageTypeLabel = (value: string) =>
  PACKAGE_TIER_TYPES.find((t) => t.value === value)?.label ?? value;

const PAGE_SIZE = 20;

export const PackageSetupList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [classOptions, setClassOptions] = useState<ClubClassOption[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<PackageRow | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchClubClassOptions()
      .then(setClassOptions)
      .catch((error) => console.error("Failed to load classes", error));
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      const res = await axios.get(`https://${baseUrl}/pms/admin/packages.json`, {
        params: { page: currentPage, per_page: PAGE_SIZE },
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const list = Array.isArray(data) ? data : data?.packages ?? data?.data ?? [];
      const totalCount = data?.total_count ?? data?.pagination?.total_count ?? list.length;
      const apiTotalPages =
        data?.total_pages ?? data?.pagination?.total_pages ?? Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

      setRows(
        list.map((p: any) => {
          const classId = String(p.club_class_id ?? "");
          return {
            id: String(p.id),
            name: p.name ?? "-",
            classId,
            className: p.club_class?.name ?? classOptions.find((c) => c.id === classId)?.name ?? classId,
            packageType: p.package_type ?? "",
            credits: p.credits ?? 0,
            validityDays: p.validity_days ?? 0,
            priceMember: p.price_member ?? 0,
            priceHotelGuest: p.price_hotel_guest ?? 0,
            priceNonMember: p.price_non_member ?? 0,
            cgstRate: p.cgst_rate ?? 0,
            sgstRate: p.sgst_rate ?? 0,
            hsnCode: p.hsn_code ?? "",
            extensionAllowed: p.extension_allowed ?? true,
            maxExtensionDays: p.max_extension_days ?? 0,
            active: p.active ?? true,
          };
        })
      );
      setTotalPages(apiTotalPages);
      setTotalRecords(totalCount);
    } catch (error) {
      console.error("Failed to fetch package list", error);
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // The API doesn't expose a name search param, so this only narrows the page already
  // fetched rather than querying the server.
  const visibleRows = (() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.className.toLowerCase().includes(q)
    );
  })();

  const handleSearch = (term: string) => setSearchTerm(term);

  const handleToggleStatus = async (pkg: PackageRow) => {
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://${baseUrl}/pms/admin/packages/${pkg.id}.json`,
        {
          package: {
            club_class_id: Number(pkg.classId),
            name: pkg.name,
            package_type: pkg.packageType,
            credits: pkg.credits,
            validity_days: pkg.validityDays,
            extension_allowed: pkg.extensionAllowed,
            max_extension_days: pkg.maxExtensionDays,
            price_member: pkg.priceMember,
            price_hotel_guest: pkg.priceHotelGuest,
            price_non_member: pkg.priceNonMember,
            cgst_rate: pkg.cgstRate,
            sgst_rate: pkg.sgstRate,
            hsn_code: pkg.hsnCode,
            active: !pkg.active,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Package marked ${!pkg.active ? "Active" : "Inactive"}`);
      fetchPackages();
    } catch (error) {
      console.error("Failed to update package status", error);
      toast.error("Failed to update package status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const baseUrl = localStorage.getItem("baseUrl");
      const token = localStorage.getItem("token");
      await axios.delete(`https://${baseUrl}/pms/admin/packages/${deleteTarget.id}.json`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Package deleted successfully!");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchPackages();
    } catch (error) {
      console.error("Failed to delete package", error);
      toast.error("Failed to delete package");
    }
  };

  const renderRow = (pkg: PackageRow) => ({
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
    classActivity: <span className="text-sm text-gray-700">{pkg.className}</span>,
    packageType: <span className="text-sm text-gray-700">{packageTypeLabel(pkg.packageType)}</span>,
    sessions: <span className="text-sm text-gray-900">{pkg.credits} Sessions</span>,
    priceMember: <span className="text-sm text-gray-900">₹{pkg.priceMember.toLocaleString("en-IN")}</span>,
    priceHotelGuest: <span className="text-sm text-gray-900">₹{pkg.priceHotelGuest.toLocaleString("en-IN")}</span>,
    priceNonMember: <span className="text-sm text-gray-900">₹{pkg.priceNonMember.toLocaleString("en-IN")}</span>,
    validity: <span className="text-sm text-gray-600">{pkg.validityDays} days</span>,
    status: (
      <Switch
        checked={pkg.active}
        onCheckedChange={() => handleToggleStatus(pkg)}
        aria-label={`Toggle ${pkg.name} status`}
      />
    ),
  });

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Package Setup</h1>
      </header>

      <EnhancedTaskTable
        data={visibleRows}
        columns={columns}
        renderRow={renderRow}
        storageKey="package-setup-list-v2"
        hideTableExport={true}
        enableSearch={true}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search packages..."
        emptyMessage={isLoading ? "Loading..." : "No packages found"}
        leftActions={
          <Button
            className="fm-button-fix fm-button-brand px-8 py-2"
            onClick={() => navigate("/club-management/package-setup/add")}
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
