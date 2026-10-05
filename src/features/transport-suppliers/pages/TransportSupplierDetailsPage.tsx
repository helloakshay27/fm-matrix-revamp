import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, Edit, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTransportSupplierDetailQuery } from "../hooks/useTransportSupplierDetailQuery";
import { TRANSPORT_SUPPLIERS_LIST_PATH } from "../const/transportSupplierConstants";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import { TransportSupplierFormDialog } from "../components/TransportSupplierFormDialog";

function SectionCard({
    icon: Icon,
    title,
    subtitle,
    children,
}: {
    icon: typeof Building2;
    title: string;
    subtitle: string;
    children: ReactNode;
}) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-brand-bg p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        <p className="text-xs text-gray-500">{subtitle}</p>
                    </div>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
    const isEmpty = value === null || value === undefined || value === "";
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            <div className="mt-1 text-sm text-gray-900 break-words">{isEmpty ? "—" : value}</div>
        </div>
    );
}

// The slab's shape isn't known yet (null in every sample), so render it
// generically: scalars as text, objects as label/value pairs.
function SlabContent({ slab }: { slab: unknown }) {
    if (slab === null || slab === undefined) {
        return <p className="text-sm text-gray-500">No transportation slab assigned.</p>;
    }
    if (typeof slab !== "object") {
        return <p className="text-sm text-gray-900">{String(slab)}</p>;
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(slab as Record<string, unknown>).map(([key, value]) => (
                <Field
                    key={key}
                    label={key.replace(/_/g, " ")}
                    value={value !== null && typeof value === "object" ? JSON.stringify(value) : (value as ReactNode)}
                />
            ))}
        </div>
    );
}

const CenteredMessage = ({ children }: { children: ReactNode }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">{children}</div>
    </div>
);

const TransportSupplierDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const supplierId = id ? Number.parseInt(id, 10) : Number.NaN;
    const hasValidId = !Number.isNaN(supplierId);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: supplier, isLoading, isError, error, refetch } = useTransportSupplierDetailQuery(
        hasValidId ? supplierId : null
    );

    const goBack = () => navigate(TRANSPORT_SUPPLIERS_LIST_PATH);

    if (!hasValidId) {
        return (
            <CenteredMessage>
                <p className="text-sm text-brand-error">Invalid supplier.</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={goBack}>
                    Back to suppliers
                </Button>
            </CenteredMessage>
        );
    }

    if (isLoading) {
        return (
            <CenteredMessage>
                <p className="text-sm text-gray-500">Loading supplier...</p>
            </CenteredMessage>
        );
    }

    if (isError || !supplier) {
        return (
            <CenteredMessage>
                <p className="text-sm text-brand-error">Failed to load supplier.</p>
                <p className="mt-1 text-xs text-gray-500">
                    {getApiErrorMessage(error, "Unable to reach the server.")}
                </p>
                <div className="mt-3 flex justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={goBack}>
                        Back to suppliers
                    </Button>
                    <Button
                        size="sm"
                        className="bg-brand hover:bg-brand-hover text-white"
                        onClick={() => refetch()}
                    >
                        Try again
                    </Button>
                </div>
            </CenteredMessage>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-6">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        <button
                            onClick={goBack}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Back to suppliers"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold text-gray-900 truncate">
                                {supplier.company_name?.trim() || "Supplier Details"}
                            </h1>
                            <p className="text-sm text-gray-500">Supplier ID: {supplier.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge className="rounded-[10px]" status={supplier.active ? "active" : "inactive"}>
                            {supplier.active ? "Active" : "Inactive"}
                        </StatusBadge>
                        <Button
                            className="bg-brand hover:bg-brand-hover text-white"
                            onClick={() => setIsEditOpen(true)}
                        >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full mx-auto px-6 pb-6 space-y-6">
                <SectionCard icon={Building2} title="Supplier Details" subtitle="Basic and contact information">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Company Name" value={supplier.company_name} />
                        <Field label="Email" value={supplier.email} />
                        <Field label="Mobile" value={supplier.mobile1} />
                    </div>
                </SectionCard>

                <SectionCard icon={MapPin} title="Address" subtitle="Location details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <Field label="Address" value={supplier.address} />
                        </div>
                        <Field label="City" value={supplier.city} />
                        <Field label="State" value={supplier.state} />
                        <Field label="Pincode" value={supplier.pincode} />
                    </div>
                </SectionCard>

                <SectionCard icon={Truck} title="Transportation Slab" subtitle="Currently applicable slab">
                    <SlabContent slab={supplier.current_transportation_slab} />
                </SectionCard>
            </div>

            <TransportSupplierFormDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                supplierId={supplier.id}
            />
        </div>
    );
};

export default TransportSupplierDetailsPage;
