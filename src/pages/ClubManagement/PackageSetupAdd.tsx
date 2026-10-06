import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { PackageSetupForm, emptyPackageSetupForm } from "./PackageSetupForm";

export const PackageSetupAdd = () => {
  const navigate = useNavigate();

  return (
    <PackageSetupForm
      pageTitle="Package Setup"
      backLabel="Back to Package Setup List"
      initialValues={emptyPackageSetupForm}
      submitLabel="Save"
      submittingLabel="Saving..."
      onBack={() => navigate("/club-management/package-setup")}
      onSubmit={async ({ classActivity, memberTiers, extensionAllowed, maxExtensionDays }) => {
        const tier = memberTiers[0];
        if (!tier) return;

        const packagePayload = {
          club_class_id: Number(classActivity),
          name: tier.label,
          package_type: tier.packageType,
          credits: tier.credits,
          validity_days: tier.validityDays,
          extension_allowed: extensionAllowed,
          max_extension_days: maxExtensionDays,
          price_member: tier.priceMember,
          price_hotel_guest: tier.priceHotelGuest,
          price_non_member: tier.priceNonMember,
          cgst_rate: tier.cgstRate,
          sgst_rate: tier.sgstRate,
          hsn_code: tier.hsnCode,
          active: true,
        };

        try {
          const baseUrl = localStorage.getItem("baseUrl");
          const token = localStorage.getItem("token");
          await axios.post(
            `https://${baseUrl}/pms/admin/packages.json`,
            { package: packagePayload },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Package created successfully!");
          // List still reads from the in-memory mock store (not yet wired to this real
          // API), so a freshly-created package won't appear there - land back on the
          // list instead of a details page that can't find it.
          navigate("/club-management/package-setup");
        } catch (error) {
          console.error("Failed to create package", error);
          toast.error("Failed to create package");
        }
      }}
    />
  );
};

export default PackageSetupAdd;
