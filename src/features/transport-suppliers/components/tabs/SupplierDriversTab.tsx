import { useState } from "react";
import { Edit, Plus, RefreshCw } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useSupplierDriversQuery } from "../../hooks/useSupplierDriversQuery";
import {
    SUPPLIER_DRIVERS_PAGE_SIZE,
    SUPPLIER_DRIVERS_TABLE_STORAGE_KEY,
} from "../../const/transportSupplierConstants";
import type { TransportDriver } from "../../types/transportDriver";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";
import { DriverFormDialog } from "../DriverFormDialog";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, hideable: true, defaultVisible: true },
    { key: "name", label: "Name", sortable: true, hideable: true, defaultVisible: true },
    { key: "email", label: "Email", sortable: true, hideable: true, defaultVisible: true },
    { key: "mobile", label: "Mobile", sortable: false, hideable: true, defaultVisible: true },
    { key: "active", label: "Status", sortable: true, hideable: true, defaultVisible: true },
];

// Name is derived so the table can sort/search on it like a real column.
type DriverRow = TransportDriver & { name: string };

export function SupplierDriversTab({ supplierId }: { supplierId: number }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    // null = add, driver = edit that driver.
    const [editingDriver, setEditingDriver] = useState<TransportDriver | null>(null);

    const openAdd = () => {
        setEditingDriver(null);
        setIsFormOpen(true);
    };

    const openEdit = (driver: TransportDriver) => {
        setEditingDriver(driver);
        setIsFormOpen(true);
    };
    const { data, isLoading, isFetching, isError, error, refetch } = useSupplierDriversQuery(supplierId);

    const drivers: DriverRow[] = (data ?? []).map((driver) => ({
        ...driver,
        name: [driver.firstname, driver.lastname].filter(Boolean).join(" "),
    }));

    const renderCell = (driver: DriverRow, columnKey: string) => {
        switch (columnKey) {
            case "name":
                return <span className="font-medium text-gray-900">{driver.name || "—"}</span>;
            case "email":
                return driver.email || "—";
            case "mobile":
                return driver.mobile || "—";
            case "active":
                return (
                    <StatusBadge status={driver.active ? "active" : "inactive"} size="sm">
                        {driver.active ? "Active" : "Inactive"}
                    </StatusBadge>
                );
            default:
                return String(driver[columnKey as keyof DriverRow] ?? "—");
        }
    };

    const renderActions = (driver: DriverRow) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(driver)}
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
                    <span>
                        Failed to load drivers. {getApiErrorMessage(error, "")}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            <EnhancedTable
                data={drivers}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                getItemId={(driver) => String(driver.id)}
                storageKey={SUPPLIER_DRIVERS_TABLE_STORAGE_KEY}
                loading={isLoading}
                loadingMessage="Loading drivers..."
                emptyMessage={isError ? "Unable to load drivers" : "No drivers found for this supplier"}
                enableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search drivers..."
                pagination
                pageSize={SUPPLIER_DRIVERS_PAGE_SIZE}
                leftActions={
                    <Button
                        className="bg-brand hover:bg-brand-hover text-white"
                        onClick={openAdd}
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

            <DriverFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                supplierId={supplierId}
                driver={editingDriver}
            />
        </div>
    );
}
