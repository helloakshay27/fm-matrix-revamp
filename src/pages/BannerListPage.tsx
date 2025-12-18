import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable"
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ColumnConfig } from "@/hooks/useEnhancedTable"
import { Edit, Eye, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const columns: ColumnConfig[] = [
    {
        key: "title",
        label: "Title",
        sortable: true,
        draggable: true,
        defaultVisible: true,
    },
    {
        key: "banners",
        label: "Banners",
        sortable: false,
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

const BannerListPage = () => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token');
    const baseUrl = localStorage.getItem('baseUrl');

    const [banners, setBanners] = useState([])
    const [updatingStatus, setUpdatingStatus] = useState<{ [key: string]: boolean }>({});
    const [loadingData, setLoadingData] = useState(true)

    const fetchBanners = async () => {
        setLoadingData(true);
        try {
            const response = await axios.get(`https://${baseUrl}/banners.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    banner_name: true,
                    title: true,
                    image: true,
                    banners_list: true
                }
            });

            setBanners(response.data.banners || []);
        } catch (error) {
            toast.error("Failed to fetch banners. Please try again later.");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchBanners()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onToggle = async (item: any) => {
        const bannerId = item.id;
        const currentStatus = item.active;
        const newStatus = !currentStatus;

        if (updatingStatus[bannerId]) return;

        try {
            setUpdatingStatus((prev) => ({ ...prev, [bannerId]: true }));

            const response = await axios.put(
                `https://${baseUrl}/banners/${bannerId}.json`,
                {
                    banner: {
                        active: newStatus
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setBanners((prevBanners: any[]) =>
                    prevBanners.map((banner) =>
                        banner.id === bannerId
                            ? { ...banner, active: newStatus }
                            : banner
                    )
                );
                toast.success("Banner status updated successfully!");
            }
        } catch (error) {
            toast.error("Limit reached: only 5 active banners allowed. Please deactivate one before activating another.");
        } finally {
            setUpdatingStatus((prev) => ({ ...prev, [bannerId]: false }));
        }
    };

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "title":
                return item.title || "-";
            case "banners":
                return (
                    <div className="flex gap-2 flex-wrap justify-center">
                        {[
                            { key: "banner_video_9_by_16", ratio: "9:16" },
                            { key: "banner_video_1_by_1", ratio: "1:1" },
                            { key: "banner_video_16_by_9", ratio: "16:9" },
                            { key: "banner_video_3_by_2", ratio: "3:2" },
                        ]
                            .filter((bannerItem) => item[bannerItem.key])
                            .map((bannerItem) => {
                                const media = item[bannerItem.key];
                                const isVideo = media?.document_content_type?.startsWith("video/");
                                const url = media?.document_url || "-";

                                return (
                                    <div key={bannerItem.key} className="relative">
                                        {isVideo ? (
                                            <video
                                                width="100"
                                                height="65"
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className="rounded object-cover"
                                            >
                                                <source src={url} type={media?.document_content_type} />
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : (
                                            <img
                                                src={url}
                                                alt={`Banner ${bannerItem.ratio}`}
                                                className="w-[100px] h-[100px] object-cover rounded"
                                            />
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-0.5">
                                            {bannerItem.ratio}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                );
            case "active":
                return (
                    <Switch
                        checked={item.active}
                        onCheckedChange={() => onToggle(item)}
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
                {/* <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/pulse/community-modules/banner-list/${item.id}`)}
                >
                    <Eye className="w-4 h-4" />
                </Button> */}
                <Button
                    size="sm"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate(`/pulse/community-modules/banner-list/edit/${item.id}`)}
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
                onClick={() => navigate('/pulse/community-modules/banner-list/add')}
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
        </div>
    )
}

export default BannerListPage;
