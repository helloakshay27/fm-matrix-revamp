import type { ReactNode } from "react";
import { Building2, MapPin, Truck } from "lucide-react";
import type { TransportSupplierDetail } from "../../types/transportSupplier";

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

export function SupplierDetailsTab({ supplier }: { supplier: TransportSupplierDetail }) {
    return (
        <div className="space-y-6">
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
    );
}
