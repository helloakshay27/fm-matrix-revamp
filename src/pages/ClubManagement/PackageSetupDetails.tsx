import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, Trash2, Package as PackageIcon } from "lucide-react";
import { toast } from "sonner";
import { deletePackage, getPackageById, gstAmount, tierTotal } from "./packageSetupMockData";

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
          <CardContent className="p-6 bg-white space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ReadOnlyField label="Class / Activity" value={pkg.classActivity} />
              <ReadOnlyField label="Package Type" value={pkg.packageType} />
              <ReadOnlyField label="Sessions" value={`${pkg.sessions} Sessions`} />
              <ReadOnlyField label="Validity" value={pkg.validity} />
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Club member pricing</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-gray-500 border-b border-gray-200">
                      <th className="px-4 py-2 font-medium">Package</th>
                      <th className="px-4 py-2 font-medium text-right">Price (₹)</th>
                      <th className="px-4 py-2 font-medium text-right">GST</th>
                      <th className="px-4 py-2 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pkg.tiers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                          No pricing tiers configured
                        </td>
                      </tr>
                    ) : (
                      pkg.tiers.map((tier) => (
                        <tr key={tier.id} className="border-b border-gray-100 last:border-0">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{tier.label}</div>
                            <div className="text-xs text-gray-400">
                              {tier.credits} {tier.credits === 1 ? "credit" : "credits"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-gray-900">{inr(tier.price)}</td>
                          <td className="px-4 py-3 text-right text-gray-600">
                            {inr(gstAmount(tier))}
                            <span className="text-xs text-gray-400"> ({tier.gstPercent}%)</span>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-gray-900">
                            {inr(tierTotal(tier))}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
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
