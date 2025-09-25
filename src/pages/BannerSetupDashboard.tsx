import { AddBannerModal } from "@/components/AddBannerModal";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { useAppDispatch } from "@/store/hooks";
import { editBanner, fetchBanners } from "@/store/slices/bannerSlice";
import { Edit, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const columns: ColumnConfig[] = [
    {
        key: "geo_link",
        label: "Banner URL",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "banner",
        label: "Banner",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "active",
        label: "Status",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
]

const BannerSetupDashboard = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch();
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');
    const siteId = localStorage.getItem('selectedSiteId');

    const [showAddModal, setShowAddModal] = useState(false);
    const [banners, setBanners] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [record, setRecord] = useState({})
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
    const [loadingData, setLoadingData] = useState(true)

    const fetchData = async () => {
        setLoadingData(true)
        try {
            const response = await dispatch(fetchBanners({ baseUrl, token, siteId })).unwrap();
            setBanners(response.society_banners)
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingData(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCheckboxChange = async (item: any) => {
        const newStatus = !item.active;
        const itemId = item.id;

        if (updatingStatus[itemId]) return;

        try {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: true }));

            await dispatch(
                editBanner({
                    baseUrl,
                    token,
                    id: itemId,
                    data: {
                        society_banner: {
                            active: newStatus,
                        },
                    },
                })
            ).unwrap();

            setBanners((prevData: any[]) =>
                prevData.map((row) =>
                    row.id === itemId ? { ...row, active: newStatus } : row
                )
            );

            toast.success(`Banner ${newStatus ? "activated" : "deactivated"} successfully`);
        } catch (error) {
            console.error("Error updating active status:", error);
            toast.error(error || "Failed to update active status. Please try again.");
        } finally {
            setUpdatingStatus((prev) => ({ ...prev, [itemId]: false }));
        }
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "banner":
                return (
                    <div className="flex justify-center">
                        <img
                            src={item.url}
                            alt=""
                            className="w-14 h-14 object-cover"
                        />
                    </div>
                )
            case "active":
                return (
                    <Switch
                        checked={item.active}
                        onCheckedChange={() =>
                            handleCheckboxChange(item)
                        }
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                        disabled={updatingStatus[item.id]}
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
                    onClick={() => navigate(`/settings/community-modules/banner-setup/${item.id}`)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => {
                        setIsEditing(true)
                        setShowAddModal(true)
                        setRecord(item)
                    }}
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </div>
        )
    };

    const leftActions = (
        <>
            <Button
                className="bg-[#C72030] hover:bg-[#A01020] text-white"
                onClick={() => setShowAddModal(true)}
            >
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </>
    );

    return (
        <div className="p-6">
            <EnhancedTable
                data={[...banners].reverse()}
                columns={columns}
                renderCell={renderCell}
                renderActions={renderActions}
                leftActions={leftActions}
                pagination={true}
                pageSize={10}
                loading={loadingData}
            />

            <AddBannerModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false)
                    setIsEditing(false)
                    setRecord({})
                }}
                fetchData={fetchData}
                isEditing={isEditing}
                record={record}
            />
        </div>
    )
}

export default BannerSetupDashboard