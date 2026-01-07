import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ReportDetail {
    id?: number;
    report_by?: string;
    report_against?: string;
    report_date?: string;
    report_time?: string;
    status?: string;
    review_status?: string;
    issue_description?: string;
}

const ReportsDetailsPage = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    const [reportDetails, setReportDetails] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewStatus, setReviewStatus] = useState("Under Review");

    useEffect(() => {
        fetchReportDetails();
    }, [reportId]);

    const fetchReportDetails = async () => {
        try {
            setLoading(true);
            // Update API endpoint based on actual backend
            const response = await axios.get(
                `https://${baseUrl}/api/reports/${reportId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setReportDetails(response.data);
            setReviewStatus(response.data?.review_status || "Under Review");
        } catch (error) {
            console.error("Error fetching report details:", error);
        } finally {
            setLoading(false);
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
                {/* Header with Title and Status */}
                <div className="bg-[#F6F4EE] px-6 py-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <FileText size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Report Detail
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="bg-[#FFF4E6] text-[#F59E0B] px-3 py-1 rounded text-sm font-medium">
                            🛡️ {reviewStatus}
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 bg-white">
                    {/* Details Grid - 2 columns */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report by</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.report_by || "Hamza"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Date</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.report_date || "12 October 2025"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Status</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.status || "Active"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Issue Description</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium text-sm">
                                    {reportDetails?.issue_description || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                                </span>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Against</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.report_against || "Raj"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Report Time</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <span className="text-gray-900 font-medium">
                                    {reportDetails?.report_time || "10:00 AM"}
                                </span>
                            </div>

                            <div className="flex items-start">
                                <span className="text-gray-500 min-w-[140px]">Review Status</span>
                                <span className="text-gray-500 mx-2">:</span>
                                <select
                                    value={reviewStatus}
                                    onChange={(e) => setReviewStatus(e.target.value)}
                                    className="border border-gray-300 rounded px-3 py-2 text-sm font-medium text-gray-900 bg-white cursor-pointer"
                                >
                                    <option value="Under Review">Under Review</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsDetailsPage;