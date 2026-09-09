import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/features/pulse_notifications/utils/apiErrorMessage";
import { useSupplierDetailQuery } from "../hooks/useSupplierDetailQuery";
import { useUpdateSupplierMutation } from "../hooks/useUpdateSupplierMutation";
import { SupplierForm } from "../components/SupplierForm";
import type { SupplierFormFields } from "../types/supplier";

const SUPPLIER_LIST_PATH = "/pulse/supplier-setup";

const EditSupplierPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const supplierId = id ? parseInt(id, 10) : NaN;
    const hasValidId = !Number.isNaN(supplierId);

    const {
        data: supplier,
        isLoading: isDetailLoading,
        isError: isDetailError,
        error: detailError,
    } = useSupplierDetailQuery(hasValidId ? supplierId : null);

    const updateSupplier = useUpdateSupplierMutation(supplierId);

    const handleSubmit = async (fields: SupplierFormFields) => {
        try {
            await updateSupplier.mutateAsync({
                pms_supplier: {
                    ...fields,
                    active: supplier?.active ?? true,
                    supplier_type: supplier?.supplier_type ?? ["AMC"],
                },
            });
            toast.success("Supplier updated successfully!");
            navigate(SUPPLIER_LIST_PATH);
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to update supplier"));
        }
    };

    if (!hasValidId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-brand-error">Invalid supplier.</p>
            </div>
        );
    }

    if (isDetailLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading supplier...</p>
            </div>
        );
    }

    if (isDetailError || !supplier) {
        const detail = isDetailError
            ? getApiErrorMessage(detailError, "Unable to reach the server.")
            : "The server responded, but not in the shape this page expects.";

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-sm text-brand-error">Failed to load supplier.</p>
                    {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
                </div>
            </div>
        );
    }

    return (
        <SupplierForm
            headerTitle="Edit Supplier"
            headerSubtitle="Update this supplier's details."
            submitLabel="Save Changes"
            submittingLabel="Saving..."
            isSubmitting={updateSupplier.isPending}
            initialValues={{
                first_name: supplier.first_name ?? "",
                last_name: supplier.last_name ?? "",
                email: supplier.email ?? "",
                company_name: supplier.company_name ?? "",
                mobile1: supplier.mobile1 ?? "",
                mobile2: supplier.mobile2 ?? "",
                gstin_number: supplier.gstin_number ?? "",
                pan_number: supplier.pan_number ?? "",
                category: supplier.category ?? "",
                address: supplier.address ?? "",
                address2: supplier.address2 ?? "",
                country: supplier.country ?? "",
                state: supplier.state ?? "",
                city: supplier.city ?? "",
                pincode: supplier.pincode ?? "",
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate(SUPPLIER_LIST_PATH)}
        />
    );
};

export default EditSupplierPage;
