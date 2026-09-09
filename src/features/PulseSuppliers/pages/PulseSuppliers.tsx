import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Eye, Plus } from "lucide-react";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useSuppliersQuery } from "../hooks/useSuppliersQuery";
import { useToggleSupplierActiveMutation } from "../hooks/useToggleSupplierActiveMutation";
import { getApiErrorMessage } from "@/features/pulse_notifications/utils/apiErrorMessage";
import {
    SUPPLIERS_PAGE_SIZE,
    SUPPLIERS_TABLE_STORAGE_KEY,
} from "../const/supplierConstants";
import type { Supplier } from "../types/supplier";

const columns: ColumnConfig[] = [
    {
        key: "id",
        label: "ID",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "company_name",
        label: "Company",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "contact_name",
        label: "Supplier Name",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "email",
        label: "Email",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "mobile1",
        label: "Mobile",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "category",
        label: "Category",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "supplier_type",
        label: "Type",
        sortable: false,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "city",
        label: "City",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "state",
        label: "State",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
    {
        key: "active",
        label: "Status",
        sortable: true,
        hideable: true,
        defaultVisible: true,
    },
];

const PulseSuppliers = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isFetching } = useSuppliersQuery({
        page: currentPage,
        per_page: SUPPLIERS_PAGE_SIZE,
    });

    const suppliers = data?.pms_suppliers ?? [];
    const totalPages = data?.pagination.total_pages ?? 1;

    const toggleActive = useToggleSupplierActiveMutation();

    const handleToggleActive = async (supplier: Supplier, active: boolean) => {
        try {
            await toggleActive.mutateAsync({ supplier, active });
            toast.success(`Supplier marked ${active ? "active" : "inactive"}`);
        } catch (error: unknown) {
            toast.error(getApiErrorMessage(error, "Failed to update supplier status"));
        }
    };

    const renderCell = (supplier: Supplier, columnKey: string) => {
        switch (columnKey) {
            case "company_name":
                return (
                    <span className="font-medium text-gray-900">
                        {supplier.company_name || "—"}
                    </span>
                );
            case "contact_name":
                return (
                    [supplier.first_name, supplier.last_name].filter(Boolean).join(" ") ||
                    "—"
                );
            case "email":
                return supplier.email || "—";
            case "mobile1":
                return supplier.mobile1 || "—";
            case "category":
                return supplier.category || "—";
            case "supplier_type":
                return supplier.supplier_type?.length
                    ? supplier.supplier_type.join(", ")
                    : "—";
            case "city":
                return supplier.city || "—";
            case "state":
                return supplier.state || "—";
            case "active":
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={supplier.active}
                            onCheckedChange={(checked) => handleToggleActive(supplier, checked)}
                            disabled={toggleActive.isPending}
                        />
                        <span className="text-sm text-gray-700">
                            {supplier.active ? "Active" : "Inactive"}
                        </span>
                    </div>
                );
            default:
                return String(supplier[columnKey as keyof Supplier] ?? "—");
        }
    };

    const renderActions = (supplier: Supplier) => (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/supplier-setup/view/${supplier.id}`)}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="View"
            >
                <Eye className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/pulse/supplier-setup/edit/${supplier.id}`)}
                className="h-8 w-8 p-0 text-black hover:bg-gray-100"
                title="Edit"
            >
                <Edit className="w-4 h-4" />
            </Button>
        </>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <EnhancedTable
                data={suppliers}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                storageKey={SUPPLIERS_TABLE_STORAGE_KEY}
                loading={isLoading || isFetching}
                emptyMessage="No suppliers found"
                pagination
                pageSize={SUPPLIERS_PAGE_SIZE}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                leftActions={
                    <Button
                        className="bg-brand hover:bg-brand-hover text-white"
                        onClick={() => navigate("/pulse/supplier-setup/add")}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                }
            />
        </div>
    );
};

export default PulseSuppliers;
