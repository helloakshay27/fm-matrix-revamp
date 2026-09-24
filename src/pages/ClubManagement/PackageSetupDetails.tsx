import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { ArrowLeft, Pencil, Trash2, Package as PackageIcon, Users } from "lucide-react";
import { toast } from "sonner";
import {
  PACKAGE_TIER_TYPES,
  deletePackage,
  getPackageById,
  gstAmount,
  tierBasePrice,
  tierTotal,
  type PricingTier,
} from "./packageSetupMockData";

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

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

const tierColumns: ColumnConfig[] = [
  { key: "label", label: "Package", sortable: true, hideable: true, draggable: true },
  { key: "packageType", label: "Package Type", sortable: true, hideable: true, draggable: true },
  { key: "credits", label: "No. of classes", sortable: true, hideable: true, draggable: true },
  { key: "validityDays", label: "Validity days (from purchase)", sortable: true, hideable: true, draggable: true },
  { key: "priceMember", label: "Price Member", sortable: true, hideable: true, draggable: true },
  { key: "priceHotelGuest", label: "Hotel Guest", sortable: true, hideable: true, draggable: true },
  { key: "priceNonMember", label: "Non Member", sortable: true, hideable: true, draggable: true },
  { key: "cgstRate", label: "CGST %", sortable: true, hideable: true, draggable: true },
  { key: "sgstRate", label: "SGST %", sortable: true, hideable: true, draggable: true },
  { key: "hsnCode", label: "HSN Code", sortable: true, hideable: true, draggable: true },
  { key: "price", label: "Price (₹)", sortable: true, hideable: true, draggable: true },
  { key: "gstPercent", label: "GST %", sortable: true, hideable: true, draggable: true },
  { key: "gstAmount", label: "GST Amount", sortable: false, hideable: true, draggable: true },
  { key: "total", label: "Total", sortable: false, hideable: true, draggable: true },
].filter((column) => column.key !== "price" && column.key !== "gstPercent");

const PricingTierReadTable = ({
  title,
  icon,
  storageKey,
  tiers,
}: {
  title: string;
  icon: React.ReactNode;
  storageKey: string;
  tiers: PricingTier[];
}) => (
  <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
    <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
      <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
        {icon}
      </div>
      <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-4 bg-white">
      <EnhancedTable
        data={tiers}
        columns={tierColumns}
        storageKey={storageKey}
        hideTableExport
        hideTableSearch
        emptyMessage="No pricing tiers configured"
        renderRow={(tier: PricingTier) => ({
          label: (
            <div>
              <div className="font-medium text-gray-900">{tier.label}</div>
              <div className="text-xs text-gray-400">
                {tier.credits} {tier.credits === 1 ? "credit" : "credits"}
              </div>
            </div>
          ),
          packageType: (
            <span className="text-sm text-gray-700">
              {PACKAGE_TIER_TYPES.find((type) => type.value === tier.packageType)?.label || tier.packageType || "-"}
            </span>
          ),
          credits: <span className="text-sm text-gray-700">{tier.credits}</span>,
          validityDays: <span className="text-sm text-gray-700">{tier.validityDays} days</span>,
          priceMember: <span className="text-sm text-gray-900">{inr(tierBasePrice(tier))}</span>,
          priceHotelGuest: <span className="text-sm text-gray-900">{inr(tier.priceHotelGuest ?? 0)}</span>,
          priceNonMember: <span className="text-sm text-gray-900">{inr(tier.priceNonMember ?? 0)}</span>,
          cgstRate: <span className="text-sm text-gray-700">{tier.cgstRate ?? 0}%</span>,
          sgstRate: <span className="text-sm text-gray-700">{tier.sgstRate ?? 0}%</span>,
          hsnCode: <span className="text-sm text-gray-700">{tier.hsnCode || "-"}</span>,
          gstAmount: <span className="text-sm text-gray-600">{inr(gstAmount(tier))}</span>,
          total: <span className="text-sm font-semibold text-gray-900">{inr(tierTotal(tier))}</span>,
        })}
      />
    </CardContent>
  </Card>
);

export const PackageSetupDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const pkg = id ? getPackageById(id) : undefined;

  if (!pkg) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Package not found.</p>
        <Button variant="link" onClick={() => navigate("/club-management/package-setup")}>
          Back to Package Setup
        </Button>
      </div>
    );
  }

  const handleDelete = () => {
    deletePackage(pkg.id);
    toast.success("Package deleted successfully!");
    navigate("/club-management/package-setup");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <button
              type="button"
              onClick={() => navigate("/club-management/package-setup")}
              className="flex items-center gap-2 text-black font-medium mb-2"
            >
              <ArrowLeft className="h-4 w-4 text-black" />
              Back to Package Setup List
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {pkg.name}
              {getStatusBadge(pkg.status)}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(`/club-management/package-setup/edit/${pkg.id}`)}
              className="gap-2 fm-button-fix fm-button-brand"
            >
              <Pencil className="h-4 w-4" />
              Edit Details
            </Button>
          </div>
        </div>

        <Card className="border-gray-200 rounded-lg overflow-hidden shadow-none">
          <CardHeader className="bg-[#F6F4EE] border-b border-gray-200 flex-row items-center gap-3 space-y-0 p-4">
            <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030] shrink-0">
              <PackageIcon className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-semibold text-gray-800">Package Details</CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ReadOnlyField label="Class / Activity" value={pkg.classActivity} />
              <ReadOnlyField label="Package Type" value={pkg.packageType} />
              <ReadOnlyField label="Sessions" value={`${pkg.sessions} Sessions`} />
              <ReadOnlyField label="Validity" value={pkg.validity} />
            </div>
          </CardContent>
        </Card>

        <PricingTierReadTable
          title="Club member pricing"
          icon={<Users className="h-4 w-4" />}
          storageKey="package-setup-details-member-tiers-v1"
          tiers={pkg.memberTiers}
        />
      </div>
    </div>
  );
};

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">{label}</div>
    <div className="border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-900 bg-gray-50">
      {value || "-"}
    </div>
  </div>
);

export default PackageSetupDetails;
