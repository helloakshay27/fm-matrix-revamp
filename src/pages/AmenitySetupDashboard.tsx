import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Eye, Edit } from "lucide-react";

const columns: ColumnConfig[] = [
    {
        key: "siteName",
        label: "Site",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "amenityName",
        label: "Amenity Name",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "amenityType",
        label: "Amenity Type",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const AmenitySetupDashboard = () => {
    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "status":
                return (
                    <Switch
                        checked={item.status}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                );
            default:
                return item[columnKey] || "-";
        }
    };

    const renderActions = (item: any) => {
        return (
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                // onClick={() => navigate(`/settings/community-modules/testimonial-setup/${item.id}`)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    return (
        <div className="p-6">
            <EnhancedTable
                columns={columns}
                data={[]}
                renderCell={renderCell}
                renderActions={renderActions}
            />
        </div>
    )
}

export default AmenitySetupDashboard