import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { PackageSetupForm, type PackageSetupFormState } from "./PackageSetupForm";

export const PackageSetupEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<PackageSetupFormState | null>(null);
  // The API's own `active` flag, kept out of the form (it has no status field) so an
  // edit doesn't silently reactivate a package that was deactivated from the list.
  const activeRef = useRef(true);

  useEffect(() => {
    if (!id) return;
    const fetchPackage = async () => {
      try {
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://${baseUrl}/pms/admin/packages/${id}.json`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const p = res.data?.package ?? res.data;
        activeRef.current = p.active ?? true;

        setInitialValues({
          classActivity: String(p.club_class_id ?? ""),
          memberTiers: [
            {
              id: `tier-${id}`,
              label: p.name ?? "",
              packageType: p.package_type ?? "",
              credits: p.credits ?? 0,
              validityDays: p.validity_days ?? 0,
              price: p.price_member ?? 0,
              gstPercent: (p.cgst_rate ?? 0) + (p.sgst_rate ?? 0),
              priceMember: p.price_member ?? 0,
              priceHotelGuest: p.price_hotel_guest ?? 0,
              priceNonMember: p.price_non_member ?? 0,
              cgstRate: p.cgst_rate ?? 0,
              sgstRate: p.sgst_rate ?? 0,
              hsnCode: p.hsn_code ?? "",
            },
          ],
          nonMemberTiers: [],
          extensionAllowed: p.extension_allowed ?? true,
          maxExtensionDays: p.max_extension_days ?? "",
        });
      } catch (error) {
        console.error("Failed to load package", error);
        toast.error("Package not found");
        navigate("/club-management/package-setup");
      }
    };
    fetchPackage();
  }, [id, navigate]);

  if (!initialValues) return null;

  return (
    <PackageSetupForm
      pageTitle="Edit Package Setup"
      backLabel="Back to Package Setup List"
      initialValues={initialValues}
      submitLabel="Update"
      submittingLabel="Updating..."
      onBack={() => navigate("/club-management/package-setup")}
      onSubmit={async ({ classActivity, memberTiers, extensionAllowed, maxExtensionDays }) => {
        if (!id) return;
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
          active: activeRef.current,
        };

        try {
          const baseUrl = localStorage.getItem("baseUrl");
          const token = localStorage.getItem("token");
          await axios.patch(
            `https://${baseUrl}/pms/admin/packages/${id}.json`,
            { package: packagePayload },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("Package updated successfully!");
          navigate("/club-management/package-setup");
        } catch (error) {
          console.error("Failed to update package", error);
          toast.error("Failed to update package");
        }
      }}
    />
  );
};

export default PackageSetupEdit;
