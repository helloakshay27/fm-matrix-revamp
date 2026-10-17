import { useState } from "react";
import { Edit, Plus, Power, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSupplierVehiclesQuery } from "../../hooks/useSupplierVehiclesQuery";
import { useSupplierDriversQuery } from "../../hooks/useSupplierDriversQuery";
import { useSetSupplierVehicleActiveMutation } from "../../hooks/useSetSupplierVehicleActiveMutation";
import {
    SUPPLIER_VEHICLES_PAGE_SIZE,
    SUPPLIER_VEHICLES_TABLE_STORAGE_KEY,
    VEHICLE_FUEL_TYPE_OPTIONS,
} from "../../const/transportSupplierConstants";
import type { TransportVehicle } from "../../types/transportVehicle";
import { getApiErrorMessage } from "../../utils/apiErrorMessage";
import { VehicleFormDialog } from "../VehicleFormDialog";
import {
    EMPTY_VEHICLE_FILTERS,
    VehicleFilterDialog,
    driverDisplayName,
    type VehicleFilterValues,
} from "../VehicleFilterDialog";

const columns: ColumnConfig[] = [
    { key: "id", label: "ID", sortable: true, hideable: true, defaultVisible: true },
    { key: "registration_number", label: "Registration No.", sortable: true, hideable: true, defaultVisible: true },
    { key: "car_model_name", label: "Car Model", sortable: true, hideable: true, defaultVisible: true },
    { key: "driverName", label: "Driver", sortable: true, hideable: true, defaultVisible: true },
    { key: "colour", label: "Colour", sortable: true, hideable: true, defaultVisible: true },
    { key: "seats", label: "Seats", sortable: true, hideable: true, defaultVisible: true },
    { key: "fuel_type", label: "Fuel Type", sortable: true, hideable: true, defaultVisible: true },
    { key: "active", label: "Status", sortable: true, hideable: true, defaultVisible: true },
];

// Driver name is derived so the table can sort/search on it like a real column.
type VehicleRow = TransportVehicle & { driverName: string };

const fuelLabel = (value: string | null) =>
    VEHICLE_FUEL_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? value ?? "—";

export function SupplierVehiclesTab({ supplierId }: { supplierId: number }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    // null = add, vehicle = edit that vehicle.
    const [editingVehicle, setEditingVehicle] = useState<TransportVehicle | null>(null);
    // Vehicle waiting for the activate/deactivate confirmation.
    const [statusTarget, setStatusTarget] = useState<TransportVehicle | null>(null);

    // Server-side filters (?driver_id=, ?active=true), edited in the filter modal.
    const [filters, setFilters] = useState<VehicleFilterValues>(EMPTY_VEHICLE_FILTERS);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, isLoading, isFetching, isError, error, refetch } = useSupplierVehiclesQuery(supplierId, {
        active: filters.activeOnly || undefined,
        driverId: filters.driverId ? Number(filters.driverId) : undefined,
    });
    const { data: drivers = [] } = useSupplierDriversQuery(supplierId);
    const setActive = useSetSupplierVehicleActiveMutation();

    const driverNameById = new Map(drivers.map((driver) => [driver.id, driverDisplayName(driver)]));

    // Chips for the applied filters, each removable on its own.
    const activeFilterChips = [
        filters.driverId && {
            key: "driver",
            label: `Driver: ${driverNameById.get(Number(filters.driverId)) ?? `#${filters.driverId}`}`,
            clear: () => setFilters((f) => ({ ...f, driverId: "" })),
        },
        filters.activeOnly && {
            key: "status",
            label: "Status: Active only",
            clear: () => setFilters((f) => ({ ...f, activeOnly: false })),
        },
    ].filter(Boolean) as { key: string; label: string; clear: () => void }[];

    const vehicles: VehicleRow[] = (data ?? []).map((vehicle) => ({
        ...vehicle,
        driverName:
            [vehicle.driver?.firstname, vehicle.driver?.lastname].filter(Boolean).join(" ") ||
            (vehicle.driver_id != null ? driverNameById.get(vehicle.driver_id) ?? `Driver #${vehicle.driver_id}` : ""),
    }));

    const openAdd = () => {
        setEditingVehicle(null);
        setIsFormOpen(true);
    };

    const openEdit = (vehicle: TransportVehicle) => {
        setEditingVehicle(vehicle);
        setIsFormOpen(true);
    };

    const confirmStatusChange = async () => {
        if (!statusTarget) return;
        const activate = !statusTarget.active;
        try {
            await setActive.mutateAsync({ supplierId, vehicleId: statusTarget.id, active: activate });
            toast.success(activate ? "Vehicle activated" : "Vehicle deactivated");
            setStatusTarget(null);
        } catch (err: unknown) {
            toast.error(getApiErrorMessage(err, activate ? "Failed to activate vehicle" : "Failed to deactivate vehicle"));
        }
    };

    const renderCell = (vehicle: VehicleRow, columnKey: string) => {
        switch (columnKey) {
            case "registration_number":
                return <span className="font-medium text-gray-900">{vehicle.registration_number || "—"}</span>;
            case "driverName":
                return vehicle.driverName || "—";
            case "fuel_type":
                return fuelLabel(vehicle.fuel_type);
            case "active":
                return (
                    <StatusBadge status={vehicle.active ? "active" : "inactive"} size="sm">
                        {vehicle.active ? "Active" : "Inactive"}
                    </StatusBadge>
                );
            default:
                return String(vehicle[columnKey as keyof VehicleRow] ?? "—");
        }
    };

    const renderActions = (vehicle: VehicleRow) => (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => openEdit(vehicle)}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="Edit"
            >
                <Edit className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setStatusTarget(vehicle)}
                className={`h-8 w-8 p-0 hover:bg-gray-100 ${vehicle.active ? "text-brand-error" : "text-brand-success"}`}
                title={vehicle.active ? "Deactivate" : "Activate"}
            >
                <Power className="w-4 h-4" />
            </Button>
        </div>
    );

    return (
        <div>
            {isError && (
                <div className="mb-4 flex items-center justify-between gap-3 rounded-md border border-brand-error bg-brand-error-bg px-4 py-3 text-sm text-gray-800">
                    <span>Failed to load vehicles. {getApiErrorMessage(error, "")}</span>
                    <Button variant="outline" size="sm" onClick={() => refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {activeFilterChips.length > 0 && (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                    {activeFilterChips.map((chip) => (
                        <span
                            key={chip.key}
                            className="inline-flex items-center gap-1 rounded-full border border-brand bg-brand-selected px-3 py-1 text-gray-800"
                        >
                            {chip.label}
                            <button
                                type="button"
                                aria-label={`Remove ${chip.label}`}
                                onClick={chip.clear}
                                className="text-gray-500 hover:text-gray-900"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        onClick={() => setFilters(EMPTY_VEHICLE_FILTERS)}
                        className="text-brand hover:underline"
                    >
                        Clear all
                    </button>
                </div>
            )}

            <EnhancedTable
                data={vehicles}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                getItemId={(vehicle) => String(vehicle.id)}
                storageKey={SUPPLIER_VEHICLES_TABLE_STORAGE_KEY}
                loading={isLoading}
                loadingMessage="Loading vehicles..."
                emptyMessage={isError ? "Unable to load vehicles" : "No vehicles found for this supplier"}
                enableSearch
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search vehicles..."
                pagination
                pageSize={SUPPLIER_VEHICLES_PAGE_SIZE}
                leftActions={
                    <Button className="bg-brand hover:bg-brand-hover text-white" onClick={openAdd}>
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                }
                onFilterClick={() => setIsFilterOpen(true)}
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

            <VehicleFilterDialog
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                drivers={drivers}
                value={filters}
                onApply={setFilters}
            />

            <VehicleFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                supplierId={supplierId}
                vehicle={editingVehicle}
            />

            <AlertDialog
                open={statusTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !setActive.isPending) setStatusTarget(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {statusTarget?.active ? "Deactivate vehicle?" : "Activate vehicle?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {statusTarget?.active
                                ? `${statusTarget?.registration_number ?? "This vehicle"} will be marked inactive.`
                                : `${statusTarget?.registration_number ?? "This vehicle"} will be marked active again.`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={setActive.isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={setActive.isPending}
                            className="bg-brand hover:bg-brand-hover text-white"
                            onClick={(event) => {
                                // Keep the dialog open until the request settles.
                                event.preventDefault();
                                void confirmStatusChange();
                            }}
                        >
                            {setActive.isPending
                                ? "Saving..."
                                : statusTarget?.active
                                  ? "Deactivate"
                                  : "Activate"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
