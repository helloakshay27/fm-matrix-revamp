import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Plus, RefreshCw } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useTransportSuppliersQuery } from "../hooks/useTransportSuppliersQuery";
import { TransportSupplierFormDialog } from "../components/TransportSupplierFormDialog";
import {
    TRANSPORT_SUPPLIERS_PAGE_SIZE,
    TRANSPORT_SUPPLIERS_TABLE_STORAGE_KEY,
    transportSupplierDetailsPath,
} from "../const/transportSupplierConstants";
import type { TransportSupplier } from "../types/transportSupplier";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, hideable: true, defaultVisible: true },
    { key: "company_name", label: "Company Name", sortable: true, hideable: true, defaultVisible: true },
    { key: "email", label: "Email", sortable: true, hideable: true, defaultVisible: true },
    { key: "mobile1", label: "Mobile", sortable: false, hideable: true, defaultVisible: true },
    { key: "active", label: "Status", sortable: true, hideable: true, defaultVisible: true },
    { key: "created_at", label: "Created On", sortable: true, hideable: true, defaultVisible: true },
];

const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const TransportSuppliers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    // null = create, id = edit that supplier.
    const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);

    const openCreate = () => {
        setEditingSupplierId(null);
        setIsFormOpen(true);
    };

    const openEdit = (id: number) => {
        setEditingSupplierId(id);
        setIsFormOpen(true);
    };

    const { data, isLoading, isFetching, isError, refetch } = useTransportSuppliersQuery();

    // Newest first — the API returns suppliers in no useful order.
    const suppliers = useMemo(
        () =>
            [...(data ?? [])].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ),
        [data]
    );

    const renderCell = (supplier: TransportSupplier, columnKey: string) => {
        switch (columnKey) {
            case "company_name":
                return (
                    <span className="font-medium text-gray-900">
                        {supplier.company_name?.trim() || "—"}
                    </span>
                );
            case "email":
                return supplier.email || "—";
            case "mobile1":
                return supplier.mobile1 || "—";
            case "active":
                return (
                    <StatusBadge status={supplier.active ? "active" : "inactive"} size="sm">
                        {supplier.active ? "Active" : "Inactive"}
                    </StatusBadge>
                );
            case "created_at":
                return formatDate(supplier.created_at);
            default:
                return String(supplier[columnKey as keyof TransportSupplier] ?? "—");
        }
    };

    const renderActions = (supplier: TransportSupplier) => (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(transportSupplierDetailsPath(supplier.id))}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="View"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit(supplier.id)}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="Edit"
            >
                <Edit className="w-4 h-4" />
            </Button>
        </>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="mt-1 mb-4 text-sm text-gray-500">Transport suppliers</p>

            {isError && (
                <div className="mb-4 flex items-center justify-between rounded-md border border-brand-error bg-brand-error-bg px-4 py-3 text-sm text-gray-800">
                    <span>Failed to load suppliers.</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            <EnhancedTable
                data={suppliers}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                getItemId={(supplier) => String(supplier.id)}
                storageKey={TRANSPORT_SUPPLIERS_TABLE_STORAGE_KEY}
                loading={isLoading}
                loadingMessage="Loading suppliers..."
                emptyMessage={isError ? "Unable to load suppliers" : "No suppliers found"}
                enableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search suppliers..."
                pagination
                pageSize={TRANSPORT_SUPPLIERS_PAGE_SIZE}
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

            <TransportSupplierFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                supplierId={editingSupplierId}
            />
        </div>
    );
};

export default TransportSuppliers;
