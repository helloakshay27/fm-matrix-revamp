import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, AlertCircle, File, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";

interface UserDetail {
    id: number;
    user_name: string;
    email: string;
    mobile: string;
    gender: string;
    access_card_number: string;
    organization: string;
    designation: string;
    address: string;
    employee_number: string;
    community_joined: string;
    reports: any[];
}

const CommunityUserDetails = () => {
    const { userId, communityId } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [userDetails, setUserDetails] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; reportId: number | null }>({ open: false, reportId: null });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://${baseUrl}/community_members/${userId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserDetails(response.data);
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatStatusDisplay = (status: string): string => {
        const statusMap: Record<string, string> = {
            under_review: "Under Review",
            action_in_progress: "In Progress",
            resolved: "Resolved",
            closed: "Closed",
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string): { bg: string; text: string } => {
        const colorMap: Record<string, { bg: string; text: string }> = {
            under_review: { bg: "bg-[rgba(217,202,32,0.24)]", text: "text-yellow-700" },
            action_in_progress: { bg: "bg-[rgba(59,130,246,0.24)]", text: "text-blue-700" },
            resolved: { bg: "bg-[rgba(34,197,94,0.24)]", text: "text-green-700" },
            closed: { bg: "bg-[rgba(107,114,128,0.24)]", text: "text-gray-700" },
        };
        return colorMap[status] || { bg: "bg-gray-100", text: "text-gray-700" };
    };

    const formatReportedDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const deleteReport = async (reportId: number) => {
        setDeleteConfirmation({ open: true, reportId });
    };

    const confirmDeleteReport = async () => {
        if (!deleteConfirmation.reportId) return;

        setIsDeleting(true);
        try {
            await axios.get(`https://${baseUrl}/communities/${communityId}/remove_report.json?report_id=${deleteConfirmation.reportId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            toast.success("Report deleted successfully");
            await fetchUserDetails();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete report");
        } finally {
            setIsDeleting(false);
            setDeleteConfirmation({ open: false, reportId: null });
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <p>User details not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            {/* Header with back button */}
            {/* <div className="flex items-center justify-between gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div> */}
            <h1 className="font-medium text-[15px] text-[rgba(26,26,26,0.5)] mb-4"><Link to={'/pulse/community'}>Community</Link> <span className="font-normal">{">"}</span> View User Details</h1>

            {/* Main Content Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Header with Title and Icon */}
                <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <File size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            View User Detail
                        </h2>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 bg-white">
                    {/* Details Grid - 2 columns */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Name</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.user_name || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Email Address</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.email || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Gender</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.gender || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Access Card Number</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.access_card_number || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Address</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.address || "-"}</span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Mobile Number</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">+91 {userDetails.mobile || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Employee Number</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.employee_number || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Organisation</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.organization || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Designation</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.designation || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[170px]">Community Joined</span>
                                {/* <span className="text-gray-500 mx-2">:</span> */}
                                <span className="text-gray-900 font-medium">{userDetails.community_joined || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports Section */}
            <div className="space-y-6">
                {
                    userDetails.reports.length > 0 && userDetails.reports.map((report: any) => (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-[#F6F4EE] px-6 py-4 flex items-center justify-between border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                                        <AlertCircle size={16} />
                                    </div>
                                    <span className="font-semibold text-lg text-gray-800">Reports</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`${getStatusColor(report.status).bg} text-black px-3 py-1 rounded text-sm flex items-center gap-2`}>
                                        <svg width="13" height="14" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.1875 6.75V3.9375C6.1875 3.78832 6.24676 3.64524 6.35225 3.53975C6.45774 3.43426 6.60082 3.375 6.75 3.375C6.89918 3.375 7.04226 3.43426 7.14775 3.53975C7.25324 3.64524 7.3125 3.78832 7.3125 3.9375V6.75C7.3125 6.89918 7.25324 7.04226 7.14775 7.14775C7.04226 7.25324 6.89918 7.3125 6.75 7.3125C6.60082 7.3125 6.45774 7.25324 6.35225 7.14775C6.24676 7.04226 6.1875 6.89918 6.1875 6.75ZM6.75 10.125C6.91688 10.125 7.08001 10.0755 7.21876 9.9828C7.35752 9.89009 7.46566 9.75831 7.52952 9.60414C7.59338 9.44996 7.61009 9.28031 7.57754 9.11664C7.54498 8.95297 7.46462 8.80263 7.34662 8.68463C7.22862 8.56663 7.07828 8.48627 6.91461 8.45371C6.75094 8.42116 6.58129 8.43787 6.42711 8.50173C6.27294 8.56559 6.14116 8.67373 6.04845 8.81249C5.95573 8.95124 5.90625 9.11437 5.90625 9.28125C5.90625 9.50503 5.99514 9.71964 6.15338 9.87787C6.31161 10.0361 6.52622 10.125 6.75 10.125ZM13.5 1.125V5.0625C13.5 8.76937 11.7056 11.0159 10.2002 12.2477C8.57883 13.5738 6.96586 14.0245 6.89555 14.0428C6.79887 14.0691 6.69692 14.0691 6.60023 14.0428C6.52992 14.0245 4.91906 13.5738 3.29555 12.2477C1.79438 11.0159 0 8.76937 0 5.0625V1.125C0 0.826631 0.118526 0.540483 0.329505 0.329505C0.540483 0.118526 0.826631 0 1.125 0H12.375C12.6734 0 12.9595 0.118526 13.1705 0.329505C13.3815 0.540483 13.5 0.826631 13.5 1.125ZM12.375 1.125H1.125V5.0625C1.125 7.68516 2.09672 9.8093 4.01273 11.3773C4.82853 12.0445 5.75498 12.5635 6.75 12.9108C7.75821 12.5573 8.69624 12.0289 9.52102 11.3498C11.4145 9.78469 12.375 7.66898 12.375 5.0625V1.125Z" fill="#1A1A1A" />
                                        </svg>
                                        {formatStatusDisplay(report.status)}
                                    </span>
                                    <Button variant="ghost" className="p-2" onClick={() => deleteReport(report.id)}>
                                        <Trash2 size={16} color="#c72030" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 bg-white grid grid-cols-3 items-start">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 block mb-2">Report:</label>
                                        <span
                                            className="bg-[rgba(199,32,48,0.5)] text-white w-[139px] px-3 py-2 rounded text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
                                            onClick={() => navigate(`/pulse/community/${communityId}/reports/details/${report.id}`)}
                                        >
                                            <FileText size={16} /> 1 Report
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 block">Reported On {formatReportedDate(report.created_at)}</label>
                                    </div>
                                </div>

                                {
                                    report.report_type === "Community" && (
                                        <div className="space-y-4 flex items-center gap-3">
                                            <div className="flex items-start">
                                                <span className="text-sm text-gray-500 block min-w-[120px]">Issue</span>
                                                <span className="text-gray-900 font-medium">
                                                    {report.description}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmation.open} onOpenChange={(open) => {
                if (!open) setDeleteConfirmation({ open: false, reportId: null });
            }}>
                <DialogContent className="max-w-sm bg-white rounded-lg p-0 flex flex-col border-0 shadow-lg">
                    <div className="bg-white pt-12 text-center flex flex-col">
                        <h2 className="text-base font-semibold text-gray-900 mb-12 leading-tight">
                            Are you sure you want to Delete<br />this Report?
                        </h2>
                        <div className="flex mt-auto">
                            <button
                                onClick={() => setDeleteConfirmation({ open: false, reportId: null })}
                                className="flex-1 px-3 py-4 bg-[#D3D3D3] text-[#6C6C6C] font-semibold text-[14px] hover:bg-[#C0C0C0] transition-colors"
                            >
                                No
                            </button>
                            <button
                                onClick={confirmDeleteReport}
                                disabled={isDeleting}
                                className="flex-1 px-3 py-4 bg-[#C72030] !text-white font-semibold text-[14px] hover:bg-[#A01020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? "Deleting..." : "Yes"}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CommunityUserDetails;
