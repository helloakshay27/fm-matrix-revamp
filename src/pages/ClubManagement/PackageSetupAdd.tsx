import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addPackage, defaultTiersForNew, tierTotal } from "./packageSetupMockData";
import { PackageSetupForm } from "./PackageSetupForm";

export const PackageSetupAdd = () => {
  const navigate = useNavigate();

  return (
    <PackageSetupForm
      pageTitle="Package Setup"
      backLabel="Back to Package Setup List"
      initialValues={{ classActivity: "", tiers: defaultTiersForNew() }}
      submitLabel="Save"
      submittingLabel="Saving..."
      onBack={() => navigate("/club-management/package-setup")}
      onSubmit={({ classActivity, tiers }) => {
        const first = tiers[0];
        const created = addPackage({
          name: `${classActivity} Package`,
          classActivity,
          packageType: "Member",
          sessions: first?.credits || 1,
          price: first ? tierTotal(first) : 0,
          validity: "1 Month",
          status: "Active",
          tiers,
        });
        toast.success("Package created successfully!");
        navigate(`/club-management/package-setup/details/${created.id}`);
      }}
    />
  );
};

export default PackageSetupAdd;
