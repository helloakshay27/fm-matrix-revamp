import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/features/pulse_notifications/utils/apiErrorMessage";
import { useCreateSupplierMutation } from "../hooks/useCreateSupplierMutation";
import { SupplierForm } from "../components/SupplierForm";
import type { SupplierFormFields } from "../types/supplier";

const SUPPLIER_LIST_PATH = "/pulse/supplier-setup";

const AddSupplierPage = () => {
    const navigate = useNavigate();
    const createSupplier = useCreateSupplierMutation();

    const handleSubmit = async (fields: SupplierFormFields) => {
        try {
            await createSupplier.mutateAsync({
                pms_supplier: { ...fields, active: true, supplier_type: ["AMC"] },
            });
            toast.success("Supplier created successfully!");
            navigate(SUPPLIER_LIST_PATH);
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to create supplier"));
        }
    };

    return (
        <SupplierForm
            headerTitle="Add Supplier"
            headerSubtitle="Enter the supplier's details to add them to the directory."
            submitLabel="Submit"
            submittingLabel="Submitting..."
            isSubmitting={createSupplier.isPending}
            onSubmit={handleSubmit}
            onCancel={() => navigate(SUPPLIER_LIST_PATH)}
        />
    );
};

export default AddSupplierPage;
