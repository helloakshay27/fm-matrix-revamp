import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

interface UserDetail {
    firstname?: string;
    lastname?: string;
    registration_id?: string;
    email?: string;
    mobile?: string;
    gender?: string;
    employee_number?: string;
    access_card_number?: string;
    organization?: { name?: string };
    address?: string;
    designation?: string;
}

interface TransactionDetail {
    registration_id?: string;
    amount?: number | string;
    payment_status?: string;
    transaction_id?: string;
    name?: string;
    mode_of_payment?: string;
    total_amount?: number | string;
    pg_transaction_id?: string;
    payment_mode?: string;
}

interface EventUserDetailResponse {
    user: UserDetail;
    lock_payment: TransactionDetail;
}

const EventUserDetailsPage = () => {
    const navigate = useNavigate();
    const { id, userid } = useParams();
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<EventUserDetailResponse | null>(null);

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://${baseUrl}/pms/admin/events/${id}/event_user_detail.json`, {
                    params: { event_user_id: userid },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDetails(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Failed to fetch user details");
            } finally {
                setLoading(false);
            }
        };

        if (id && userid) {
            fetchUserDetails();
        }
    }, [id, userid, baseUrl, token]);

    const DetailItem = ({ label, value, className = "" }: { label: string; value: string | number | undefined; className?: string }) => (
        <div className={`flex items-start gap-4 ${className}`}>
            <span className="text-sm text-[#8E8E8E] min-w-[160px]">{label}</span>
            <span className="text-sm font-semibold text-gray-900 break-words">{value || '-'}</span>
        </div>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!details) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-gray-500">No user details found.</p>
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    const { user, lock_payment } = details;

    return (
        <div className="p-4 md:px-8 py-6 bg-white min-h-screen">
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Button>
            </div>

            {/* View User Detail Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-[#F6F4EE] px-6 py-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <FileText size={22} />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">View User Detail</h2>
                </div>
                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <DetailItem label="Name" value={user?.firstname + " " + user?.lastname} />
                        <DetailItem label="Registration ID" value={user?.registration_id} />

                        <DetailItem label="Email Address" value={user?.email} />
                        <DetailItem label="Mobile Number" value={user?.mobile} />

                        <DetailItem label="Gender" value={user?.gender} />
                        <DetailItem label="Employee Number" value={user?.employee_number} />

                        <DetailItem label="Access Card Number" value={user?.access_card_number} />
                        <DetailItem label="Organisation" value={user?.organization?.name} />

                        {/* <DetailItem label="Address" value={user?.address} /> */}
                        <DetailItem label="Designation" value={user?.designation} />
                    </div>
                </div>
            </div>

            {/* Transition Detail Section */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#F6F4EE] px-6 py-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                            <FileText size={22} />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Transition Detail</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className={`text-xs font-semibold px-6 py-1.5 rounded-full ${lock_payment?.payment_status?.toLowerCase() === 'success'
                            ? 'bg-[#D1FAE5] text-[#10B981]'
                            : 'bg-red-100 text-red-600'
                            }`}>
                            {lock_payment?.payment_status || 'Pending'}
                        </span>
                    </div>
                </div>
                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <div className="grid grid-cols-1 gap-y-6">
                            <DetailItem label="Registration ID" value={lock_payment?.registration_id} />
                            <DetailItem label="Amount" value={lock_payment?.total_amount ? `₹${lock_payment.total_amount}` : undefined} />
                            <DetailItem label="Payment" value={lock_payment?.payment_status} />
                        </div>
                        <div className="grid grid-cols-1 gap-y-6">
                            <DetailItem label="Transition ID" value={lock_payment?.pg_transaction_id} />
                            <DetailItem label="Name" value={lock_payment?.name} />
                            <DetailItem label="Mode Of Payment" value={lock_payment?.payment_mode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventUserDetailsPage;