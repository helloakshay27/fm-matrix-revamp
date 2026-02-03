import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, QrCode, Share2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchEventById, updateEvent } from '@/store/slices/eventSlice';
import { format } from 'date-fns';
import { Switch } from '@mui/material';


interface Event {
    id: string;
    created_by: string;
    event_name: string;
    event_at: string;
    isPaid: boolean;
    from_time: string;
    to_time: string;
    description: string;
    documents?: { document: string }[];
    shared: number;
    share_with?: string;
    status: string;
    show_on_home: boolean;
    active: boolean;
    rsvp_action: string;
    capacity?: number;
    per_member_limit?: number;
    amount_per_member?: string;
    pulse_category?: string;
    event_category?: string;
    interested_count?: number;
    uninterested_count?: number;
    total_registed_count?: number;
    remaining_seats?: number;
    created_at?: string;
    sharedwith?: {
        user_name: string;
    }[];
    pms_sites?: { name: string }[];
    communities?: { name: string }[];
}

export const EventDetailsTab = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem("token");

    const [eventData, setEventData] = useState<Event>({} as Event);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await dispatch(fetchEventById({ id, baseUrl, token })).unwrap();
                setEventData(response)
            } catch (error) {
                console.log(error)
                toast.error("Failed to fetch event")
            }
        }

        fetchEvent();
    }, [])

    const handleStatusChange = async (checked: boolean) => {
        const newStatus = checked ? 1 : 0;

        // Store previous state for rollback
        const previousStatus = eventData.active;

        // Optimistic update
        setUpdatingStatus(true);
        setEventData((prev) => ({ ...prev, active: checked }));

        try {
            await dispatch(
                updateEvent({
                    id: eventData.id,
                    data: { event: { active: newStatus } },
                    baseUrl,
                    token,
                })
            ).unwrap();

            toast.success("Event status updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update event status");

            // Revert optimistic update on error
            setEventData((prev) => ({ ...prev, active: previousStatus }));
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (!eventData.id) {
        return <div className="p-6 bg-[#F6F7F7] min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Top Header */}
            <div className="flex items-center justify-end gap-4 mb-6">
                <div className="flex gap-2">
                    <Button
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-2 hover:bg-transparent"
                    >
                        <QrCode size={18} />
                        View QR
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => navigate(`/pulse/events/edit/${id}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-2 hover:bg-transparent"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Main Content Card: Event Details */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                {/* Card Header */}
                <div className="bg-[#F6F4EE] px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                                <Info size={22} />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                EVENT DETAILS
                            </h2>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Seat's Remaining</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {eventData.remaining_seats ?? 0}/{eventData.capacity ?? 0}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch
                                    checked={eventData.active}
                                    onChange={(e) => handleStatusChange(e.target.checked)}
                                    disabled={updatingStatus}
                                    sx={{
                                        '& .MuiSwitch-switchBase': {
                                            color: '#ef4444',
                                            '&.Mui-checked': {
                                                color: '#22c55e',
                                            },
                                            '&.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#22c55e',
                                            },
                                        },
                                        '& .MuiSwitch-track': {
                                            backgroundColor: '#ef4444',
                                        },
                                    }}
                                />
                                <span className="text-sm font-medium text-gray-700">{eventData.active ? 'Active' : 'Inactive'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-6 bg-white border-b border-gray-200">
                    <div className="flex flex-col lg:flex-row gap-8 mb-8">
                        {/* Banner Image */}
                        <div className="lg:w-1/2 aspect-[16/6] relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img
                                src={(eventData.documents && eventData.documents.length > 0) ? eventData.documents[0].document : "https://images.unsplash.com/photo-1540747913346-19e3adbb17c3?q=80&w=1600&auto=format&fit=crop"}
                                alt="Event Banner"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Description */}
                        <div className="lg:w-1/2">
                            <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {eventData.description || "No description provided for this event."}
                            </p>
                        </div>
                    </div>

                    {/* Attributes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-6">
                        <DetailItem label="Event Name" value={eventData.event_name} />
                        <DetailItem label="Event Category" value={eventData.isPaid ? "Paid" : "Complimentary"} />
                        <DetailItem label="Pulse Category" value={eventData.event_category || "Play"} />

                        <DetailItem
                            label="Event Date"
                            value={eventData.from_time ? format(new Date(eventData.from_time), "dd MMMM yyyy") : "-"}
                        />
                        <DetailItem label="Interested" value={eventData.interested_count ?? 0} />
                        <DetailItem label="Event Created By" value={eventData.created_by} />

                        <DetailItem
                            label="Event Time"
                            value={eventData.from_time ? format(new Date(eventData.from_time), "hh:mm a") : "-"}
                        />
                        <DetailItem label="Uninterested" value={eventData.uninterested_count ?? 0} />
                        <DetailItem
                            label="Event Created On"
                            value={eventData.created_at ? format(new Date(eventData.created_at), "dd MMMM yyyy") : "-"}
                        />

                        <DetailItem label="Event Location" value={eventData.event_at} />
                        <DetailItem label="Total Registration" value={eventData.total_registed_count ?? 0} />
                        <DetailItem label="Requestable" value={eventData.rsvp_action === "1" ? "Yes" : "No"} />

                        <DetailItem label="Amount" value={eventData.amount_per_member ? `₹${eventData.amount_per_member}` : "Free"} />
                        <DetailItem label="Member Capacity" value={eventData.capacity ?? 0} />
                        <DetailItem label="Member Per Limit" value={eventData.per_member_limit ?? 1} />
                    </div>
                </div>
            </div>

            {/* Share Section Card */}
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                <div className="bg-[#F6F4EE] p-4 flex items-center gap-3 border-b border-gray-200">
                    <div className="w-8 h-8 rounded-full bg-[#E5E0D3] flex items-center justify-center text-[#C72030]">
                        <Share2 size={16} />
                    </div>
                    <span className="font-semibold text-lg text-gray-800">Share</span>
                </div>

                <div className="p-6 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[160px]">Share With</span>
                            <span className="text-sm font-medium text-gray-900">
                                {eventData.share_with === 'all' ? 'All Tech Parks' : (
                                    eventData.pms_sites && eventData.pms_sites.length > 0
                                        ? eventData.pms_sites.map(s => s.name).join(', ')
                                        : '-'
                                )}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <span className="text-sm text-gray-500 min-w-[160px]">Share With Communities</span>
                            <span className="text-sm font-medium text-gray-900">
                                {eventData.communities && eventData.communities.length > 0
                                    ? eventData.communities.map(c => c.name).join(', ')
                                    : 'No'
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Component for Data Points
const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex items-center gap-8">
        <span className="text-sm text-gray-500 min-w-[140px] md:min-w-[160px]">
            {label}
        </span>
        <span className="text-sm font-medium text-gray-900">
            {value ?? "-"}
        </span>
    </div>
);