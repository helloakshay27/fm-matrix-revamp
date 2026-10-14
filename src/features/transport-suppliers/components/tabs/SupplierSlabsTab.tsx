import { useMemo, useState } from "react";
import { Edit, Plus, RefreshCw } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useSupplierSlabsQuery } from "../../hooks/useSupplierSlabsQuery";
import {
    SUPPLIER_SLABS_PAGE_SIZE,
    SUPPLIER_SLABS_TABLE_STORAGE_KEY,
} from "../../const/transportSupplierConstants";
import type { TransportSlab } from "../../types/transportSlab";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";
import { SlabFormDialog } from "../SlabFormDialog";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, hideable: true, defaultVisible: true },
    { key: "rate", label: "Rate", sortable: false, hideable: true, defaultVisible: true },
    { key: "max_rides_per_day", label: "Max Rides / Day", sortable: true, hideable: true, defaultVisible: true },
    { key: "max_km_per_day", label: "Max KM / Day", sortable: true, hideable: true, defaultVisible: true },
    { key: "effective_period", label: "Effective Period", sortable: false, hideable: true, defaultVisible: true },
    { key: "availability", label: "Availability", sortable: false, hideable: true, defaultVisible: true },
    { key: "active", label: "Status", sortable: true, hideable: true, defaultVisible: true },
];

const RATE_BASIS_LABELS: Record<string, string> = {
    km: "km",
    ride: "ride",
    trip: "trip",
    day: "day",
    hour: "hour",
};

// Decimal strings like "800.0" → "800", "12.5" → "12.5".
const formatNumber = (value: string | number | null) => {
    if (value === null || value === "") return null;
    const number = Number(value);
    return Number.isNaN(number) ? String(value) : number.toLocaleString("en-IN");
};

// "2026-09-01" is a calendar date — build it locally so it doesn't shift a
// day in timezones behind UTC.
const formatDate = (value: string | null) => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return value;
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatTime = (hour: number | null, minute: number | null) =>
    hour === null ? null : `${String(hour).padStart(2, "0")}:${String(minute ?? 0).padStart(2, "0")}`;

const formatRate = (slab: TransportSlab) => {
    const amount = formatNumber(slab.rate_amount);
    if (!amount) return "—";
    const basis = slab.rate_basis ? RATE_BASIS_LABELS[slab.rate_basis] ?? slab.rate_basis : null;
    return basis ? `₹${amount} / ${basis}` : `₹${amount}`;
};

const formatEffectivePeriod = (slab: TransportSlab) => {
    const from = formatDate(slab.effective_from);
    const to = formatDate(slab.effective_to);
    if (from && to) return `${from} – ${to}`;
    if (from) return `From ${from}`;
    if (to) return `Until ${to}`;
    return "—";
};

const formatAvailability = (slab: TransportSlab) => {
    if (slab.available_24_7) return "24/7";
    const start = formatTime(slab.availability_start_hour, slab.availability_start_min);
    const end = formatTime(slab.availability_end_hour, slab.availability_end_min);
    return start && end ? `${start} – ${end}` : "—";
};

export function SupplierSlabsTab({ supplierId }: { supplierId: number }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    // null = create, slab = edit that slab.
    const [editingSlab, setEditingSlab] = useState<TransportSlab | null>(null);

    const openCreate = () => {
        setEditingSlab(null);
        setIsFormOpen(true);
    };

    const openEdit = (slab: TransportSlab) => {
        setEditingSlab(slab);
        setIsFormOpen(true);
    };
    const { data, isLoading, isFetching, isError, error, refetch } = useSupplierSlabsQuery(supplierId);

    // Newest first.
    const slabs = useMemo(
        () =>
            [...(data ?? [])].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ),
        [data]
    );

    const renderCell = (slab: TransportSlab, columnKey: string) => {
        switch (columnKey) {
            case "rate":
                return formatRate(slab);
            case "max_rides_per_day":
                return formatNumber(slab.max_rides_per_day) ?? "—";
            case "max_km_per_day":
                return formatNumber(slab.max_km_per_day) ?? "—";
            case "effective_period":
                return <span className="whitespace-nowrap">{formatEffectivePeriod(slab)}</span>;
            case "availability":
                return <span className="whitespace-nowrap">{formatAvailability(slab)}</span>;
            case "active":
                return (
                    <StatusBadge status={slab.active ? "active" : "inactive"} size="sm">
                        {slab.active ? "Active" : "Inactive"}
                    </StatusBadge>
                );
            default:
                return String(slab[columnKey as keyof TransportSlab] ?? "—");
        }
    };

    const renderActions = (slab: TransportSlab) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(slab)}
            className="h-8 w-8 p-0 text-black hover:bg-gray-100"
            title="Edit"
        >
            <Edit className="w-4 h-4" />
        </Button>
    );

    return (
        <div>
            {isError && (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-brand-error bg-brand-error-bg px-4 py-3 text-sm text-gray-800">
                    <span>Failed to load slabs. {getApiErrorMessage(error, "")}</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            <EnhancedTable
                data={slabs}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                getItemId={(slab) => String(slab.id)}
                storageKey={SUPPLIER_SLABS_TABLE_STORAGE_KEY}
                loading={isLoading}
                loadingMessage="Loading slabs..."
                emptyMessage={isError ? "Unable to load slabs" : "No slabs found for this supplier"}
                enableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search slabs..."
                pagination
                pageSize={SUPPLIER_SLABS_PAGE_SIZE}
                leftActions={
                    <Button
                        className="bg-brand hover:bg-brand-hover text-white"
                        onClick={openCreate}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                }
                rightActions={
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        title="Refresh"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                }
            />

            <SlabFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                supplierId={supplierId}
                slab={editingSlab}
            />
        </div>
    );
}
