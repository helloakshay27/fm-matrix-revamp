import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getClassById, updateClass } from "./classSetupMockData";
import { ClassSetupForm, emptyClassSetupForm, type ClassSetupFormState } from "./ClassSetupForm";

export const ClassSetupEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [initialValues, setInitialValues] = useState<ClassSetupFormState | null>(null);

  useEffect(() => {
    if (!id) return;
    const existing = getClassById(id);
    if (!existing) {
      toast.error("Class not found");
      navigate("/club-management/class-setup");
      return;
    }
    setInitialValues({
      className: existing.className,
      amountPerPerson: existing.amountPerPerson,
      minParticipants: String(existing.minParticipants),
      maxCapacity: String(existing.maxCapacity),
      location: existing.location,
      duration: existing.duration,
      trainer: existing.trainer,
      status: existing.status,
      description: existing.description,
    });
  }, [id, navigate]);

  if (!initialValues) return null;

  return (
    <ClassSetupForm
      pageTitle="Edit Class Setup"
      backLabel="Back to Class Setup List"
      initialValues={initialValues ?? emptyClassSetupForm}
      submitLabel="Update"
      submittingLabel="Updating..."
      onBack={() => navigate("/club-management/class-setup")}
      onSubmit={(payload) => {
        if (!id) return;
        updateClass(id, payload);
        toast.success("Class updated successfully!");
        navigate(`/club-management/class-setup/details/${id}`);
      }}
    />
  );
};

export default ClassSetupEdit;
