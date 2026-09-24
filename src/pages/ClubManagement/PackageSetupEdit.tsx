import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getPackageById, updatePackage, tierTotal } from "./packageSetupMockData";
import { PackageSetupForm, type PackageSetupFormState } from "./PackageSetupForm";

export const PackageSetupEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<PackageSetupFormState | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = getPackageById(id);
    if (!existing) {
      toast.error("Package not found");
      navigate("/club-management/package-setup");
      return;
    }
    setInitialValues({
      classActivity: existing.classActivity,
      memberTiers: existing.memberTiers.map((t) => ({ ...t })),
      nonMemberTiers: existing.nonMemberTiers.map((t) => ({ ...t })),
    });
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
      onSubmit={({ classActivity, memberTiers, nonMemberTiers }) => {
        if (!id) return;
        const existing = getPackageById(id);
        if (!existing) return;
        const primary = memberTiers[0] ?? nonMemberTiers[0];
        updatePackage(id, {
          ...existing,
          classActivity,
          memberTiers,
          nonMemberTiers,
          packageType: memberTiers.length > 0 ? "Member" : "Non-Member",
          sessions: primary?.credits || existing.sessions,
          price: primary ? tierTotal(primary) : existing.price,
        });
        toast.success("Package updated successfully!");
        navigate(`/club-management/package-setup/details/${id}`);
      }}
    />
  );
};

export default PackageSetupEdit;
