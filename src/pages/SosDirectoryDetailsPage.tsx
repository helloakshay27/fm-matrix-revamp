import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DetailCard } from "@/components/ui/detail-card";
import axios from "axios";
import { FileText, Loader2, File, Pencil, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface SosDirectory {
    id: number;
    title: string;
    contact_number: string;
    status: boolean | string;
    document_url?: string;
    created_at?: string;
    created_by?: string;
    shared_sos_directories?: [
        {
            site_id: number;
            site_name: string;
        }
    ];
    user?: {
        name: string;
    }
}

const SosDirectoryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<SosDirectory | null>(null);
    const [status, setStatus] = useState(true);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [darkImagePreview, setDarkImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const response = await axios.get(`https://${baseUrl}/sos_directories/${id}.json`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const dirData = response.data;

            setData(dirData);
            setStatus(dirData.status === true || dirData.status === "true");
            if (dirData.sos_directory_lite_url) {
                setImagePreview(dirData.sos_directory_lite_url);
            }
            if (dirData.sos_directory_dark_url) {
                setDarkImagePreview(dirData.sos_directory_dark_url);
            }
        } catch (error) {
            console.error("Error fetching details:", error);
            toast.error("Failed to fetch details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!id) return;
        const newStatus = e.target.checked;

        // Optimistic update
        setStatus(newStatus);

        try {
            const payload = new FormData();
            payload.append("sos_directory[status]", String(newStatus));

            await axios.put(`https://${baseUrl}/sos_directories/${id}.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Status updated successfully");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
            // Revert on failure
            setStatus(!newStatus);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="p-0"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => navigate(`/pulse/sos-directory/${id}/edit`)}
                >
                    <Pencil size={18} />
                </Button>
            </div>

            {/* Details Card */}
            <DetailCard
                title="Details"
                icon={<FileText className="w-[18px] h-[18px] text-gray-500" />}
                headerActions={
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={status}
                            onCheckedChange={(checked) =>
                                handleStatusChange({ target: { checked } } as React.ChangeEvent<HTMLInputElement>)
                            }
                        />
                        <span className="text-sm font-bold text-gray-900">
                            {status ? "Active" : "Inactive"}
                        </span>
                    </div>
                }
                className="mb-6"
            >
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">{data?.title || "Security"}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Category</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                {data?.title || "Security"}
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Contact Number</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                {data?.contact_number || "+91 1234567890"}
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Tech Park</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <div className="text-gray-900 font-medium space-y-1">
                                {data?.shared_sos_directories?.map((dir: any, index: number) => (
                                    <div key={index}>{dir.site_name}</div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Created On</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                {formatDate(data?.created_at)}
                            </span>
                        </div>
                        <div className="flex items-start">
                            <span className="text-gray-500 min-w-[140px]">Created By</span>
                            <span className="text-gray-500 mx-2">:</span>
                            <span className="text-gray-900 font-medium">
                                {data?.user?.name || data?.created_by || "Admin"}
                            </span>
                        </div>
                    </div>
                </div>
            </DetailCard>

            {/* Attachment Card */}
            <DetailCard
                title="Attachment"
                icon={<File className="w-[18px] h-[18px] text-gray-500" />}
                className="mb-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div>
                        <Label className="text-sm font-bold text-gray-700 mb-4 block">
                            Light Mode Image
                        </Label>

                        <div
                            className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-white"
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt="Directory Cover"
                                        className="w-20 h-20 object-contain"
                                    />
                                </>
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label className="text-sm font-bold text-gray-700 mb-4 block">
                            Dark Mode Image
                        </Label>

                        <div
                            className="relative w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-white"
                        >
                            {darkImagePreview ? (
                                <>
                                    <img
                                        src={darkImagePreview}
                                        alt="Directory Dark Cover"
                                        className="w-20 h-20 object-contain"
                                    />
                                </>
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>
                    </div>
                </div>
            </DetailCard>
        </div>
    );
};

export default SosDirectoryDetailsPage;
