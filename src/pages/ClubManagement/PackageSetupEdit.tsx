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
      tiers: existing.tiers.map((t) => ({ ...t })),
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
      onSubmit={({ classActivity, tiers }) => {
        if (!id) return;
        const existing = getPackageById(id);
        if (!existing) return;
        const first = tiers[0];
        updatePackage(id, {
          ...existing,
          classActivity,
          tiers,
          sessions: first?.credits || existing.sessions,
          price: first ? tierTotal(first) : existing.price,
        });
        toast.success("Package updated successfully!");
        navigate(`/club-management/package-setup/details/${id}`);
      }}
    />
  );
};

export default PackageSetupEdit;
