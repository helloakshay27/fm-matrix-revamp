import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { DetailCard } from "@/components/ui/detail-card";
import { useSupplierDetailQuery } from "../hooks/useSupplierDetailQuery";
import { getApiErrorMessage } from "@/features/pulse_notifications/utils/apiErrorMessage";

const SUPPLIER_LIST_PATH = "/pulse/supplier-setup";

function Field({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <div className="mt-1 text-sm text-gray-900">{value ?? "—"}</div>
        </div>
    );
}

const SupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const supplierId = id ? parseInt(id, 10) : NaN;
    const hasValidId = !Number.isNaN(supplierId);

    const {
        data: supplier,
        isLoading,
        isError,
        error,
    } = useSupplierDetailQuery(hasValidId ? supplierId : null);

    if (!hasValidId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-brand-error">Invalid supplier.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading supplier...</p>
            </div>
        );
    }

    if (isError || !supplier) {
        const detail = isError
            ? getApiErrorMessage(error, "Unable to reach the server.")
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

    const contactName = [supplier.first_name, supplier.last_name].filter(Boolean).join(" ") || "—";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-6">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(SUPPLIER_LIST_PATH)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {supplier.company_name || "Supplier Details"}
                            </h1>
                            <p className="text-sm text-gray-500">Read-only view of this supplier.</p>
                        </div>
                    </div>
                    <StatusBadge className="rounded-[10px]" status={supplier.active ? "active" : "inactive"}>
                        {supplier.active ? "Active" : "Inactive"}
                    </StatusBadge>
                </div>
            </div>

            <div className="flex-1 w-full mx-auto px-6 pb-6 space-y-6">
                <DetailCard
                    icon={<Building2 className="w-[18px] h-[18px] text-gray-500" />}
                    title="Supplier Details"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Company Name" value={supplier.company_name} />
                        <Field label="Contact Person" value={contactName} />
                        <Field label="Email" value={supplier.email} />
                        <Field label="Mobile 1" value={supplier.mobile1} />
                        <Field label="Mobile 2" value={supplier.mobile2} />
                        <Field label="GSTIN Number" value={supplier.gstin_number} />
                        <Field label="PAN Number" value={supplier.pan_number} />
                        <Field label="Category" value={supplier.category} />
                        <Field
                            label="Supplier Type"
                            value={
                                supplier.supplier_type?.length ? (
                                    <div className="flex flex-wrap gap-1.5">
                                        {supplier.supplier_type.map((type) => (
                                            <Badge
                                                key={type}
                                                variant="outline"
                                                className="border-brand/30 bg-brand-selected text-brand"
                                            >
                                                {type}
                                            </Badge>
                                        ))}
                                    </div>
                                ) : (
                                    "—"
                                )
                            }
                        />
                    </div>
                </DetailCard>

                <DetailCard icon={<MapPin className="w-[18px] h-[18px] text-gray-500" />} title="Address">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Address" value={supplier.address} />
                        <Field label="Address 2" value={supplier.address2} />
                        <Field label="Country" value={supplier.country} />
                        <Field label="State" value={supplier.state} />
                        <Field label="City" value={supplier.city} />
                        <Field label="Pincode" value={supplier.pincode} />
                    </div>
                </DetailCard>
            </div>
        </div>
    );
};

export default SupplierDetailsPage;
