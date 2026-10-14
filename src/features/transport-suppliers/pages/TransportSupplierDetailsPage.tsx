import type { ReactNode } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTransportSupplierDetailQuery } from "../hooks/useTransportSupplierDetailQuery";
import {
    SUPPLIER_DETAIL_TABS,
    TRANSPORT_SUPPLIERS_LIST_PATH,
    type SupplierDetailTab,
} from "../const/transportSupplierConstants";
import { getApiErrorMessage } from "../utils/apiErrorMessage";
import { SupplierDetailsTab } from "../components/tabs/SupplierDetailsTab";
import { SupplierDriversTab } from "../components/tabs/SupplierDriversTab";
import { SupplierSlabsTab } from "../components/tabs/SupplierSlabsTab";
import { SupplierVehiclesTab } from "../components/tabs/SupplierVehiclesTab";

const TAB_LABELS: Record<SupplierDetailTab, string> = {
    details: "Details",
    slab: "Slab",
    drivers: "Drivers",
    vehicles: "Vehicles",
};

const isSupplierDetailTab = (value: string | null): value is SupplierDetailTab =>
    SUPPLIER_DETAIL_TABS.includes(value as SupplierDetailTab);

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

    // Active tab lives in the URL (?tab=) so refresh/back keeps it.
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get("tab");
    const activeTab: SupplierDetailTab = isSupplierDetailTab(tabParam) ? tabParam : "details";

    const handleTabChange = (value: string) => {
        setSearchParams(
            (params) => {
                const next = new URLSearchParams(params);
                if (value === "details") next.delete("tab");
                else next.set("tab", value);
                return next;
            },
            { replace: true }
        );
    };

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
                    <StatusBadge className="rounded-[10px] shrink-0" status={supplier.active ? "active" : "inactive"}>
                        {supplier.active ? "Active" : "Inactive"}
                    </StatusBadge>
                </div>
            </div>

            <div className="flex-1 w-full mx-auto px-6 pb-6">
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-100">
                        {SUPPLIER_DETAIL_TABS.map((tab) => (
                            <TabsTrigger
                                key={tab}
                                value={tab}
                                className="data-[state=active]:bg-brand data-[state=active]:text-white rounded"
                            >
                                {TAB_LABELS[tab]}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <TabsContent value="details" className="mt-4">
                        <SupplierDetailsTab supplier={supplier} />
                    </TabsContent>

                    <TabsContent value="slab" className="mt-4">
                        <SupplierSlabsTab supplierId={supplier.id} />
                    </TabsContent>

                    <TabsContent value="drivers" className="mt-4">
                        <SupplierDriversTab supplierId={supplier.id} />
                    </TabsContent>

                    <TabsContent value="vehicles" className="mt-4">
                        <SupplierVehiclesTab supplierId={supplier.id} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default TransportSupplierDetailsPage;
