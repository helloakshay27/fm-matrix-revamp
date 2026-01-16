import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, AlertCircle, File, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface UserDetail {
    id: number;
    name: string;
    email: string;
    mobile: string;
    gender: string;
    access_card_no: string;
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
        try {
            await axios.get(`https://${baseUrl}/communities/${communityId}/remove_report.json?report_id=${reportId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            toast.success("Report deleted successfully");
            fetchUserDetails();
        } catch (error) {
            console.log(error)
        }
    }

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
            <div className="flex items-center justify-between gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            {/* Main Content Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Header with Title and Icon */}
                <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <FileText size={22} />
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
                                <span className="text-gray-500 min-w-[140px]">Name</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.name || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Email Address</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.email || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Gender</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.gender || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Access Card Number</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.access_card_no || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Address</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.address || "-"}</span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Mobile Number</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.mobile || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Employee Number</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.employee_number || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Organisation</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.organization || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Designation</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">{userDetails.designation || "-"}</span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Community Joined</span>
                                <span className="text-gray-500 mx-2">:</span>
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
                                    <span className={`${getStatusColor(report.status).bg} ${getStatusColor(report.status).text} px-3 py-1 rounded text-sm font-medium`}>
                                        {formatStatusDisplay(report.status)}
                                    </span>
                                    <Button variant="ghost" className="p-2" onClick={() => deleteReport(report.id)}>
                                        <Trash2 size={16} color="#c72030" />
                                    </Button>
                                </div>
                            </div>
                            <div className="p-6 bg-white">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 block mb-2">Report:</label>
                                        <span
                                            className="bg-[#e06060] text-white px-3 py-2 rounded text-xs font-medium inline-flex items-center gap-2 cursor-pointer"
                                            onClick={() => navigate(`/pulse/community/${communityId}/reports/details/${report.id}`)}
                                        >
                                            <File size={16} /> 1 Report
                                        </span>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 block">Reported On {formatReportedDate(report.created_at)}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default CommunityUserDetails;
