import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { addPackage, tierTotal } from "./packageSetupMockData";
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
      onSubmit={({ classActivity, memberTiers, nonMemberTiers }) => {
        const primary = memberTiers[0] ?? nonMemberTiers[0];
        const created = addPackage({
          name: `${classActivity} Package`,
          classActivity,
          packageType: memberTiers.length > 0 ? "Member" : "Non-Member",
          sessions: primary?.credits || 1,
          price: primary ? tierTotal(primary) : 0,
          validity: "1 Month",
          status: "Active",
          memberTiers,
          nonMemberTiers,
        });
        toast.success("Package created successfully!");
        navigate(`/club-management/package-setup/details/${created.id}`);
      }}
    />
  );
};

export default PackageSetupAdd;
