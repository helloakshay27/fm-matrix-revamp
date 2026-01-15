import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, QrCode, Share2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchEventById } from '@/store/slices/eventSlice';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';

interface Event {
  id: string;
  created_by: string;
  event_name: string;
  event_at: string;
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
  total_registration?: number;
  remaining_seats?: number;
  created_at?: string;
  sharedwith?: {
    user_name: string;
  }[];
  pms_sites?: { name: string }[];
  communities?: { name: string }[];
}

export const CRMEventDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem("token");

  const [eventData, setEventData] = useState<Event>({} as Event);

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

  if (!eventData.id) {
    return <div className="p-6 bg-[#F6F7F7] min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-8 bg-[#F6F7F7] min-h-screen font-sans">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-0 hover:bg-transparent text-gray-600 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-[#E5E0D3] border-none text-gray-800 hover:bg-[#d8d1c0] flex items-center gap-2 h-9 px-4 rounded-md text-sm font-medium"
          >
            <QrCode className="w-4 h-4" />
            View QR
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/pulse/events/edit/${id}`)}
            className="border-[#C72030] border text-[#C72030] hover:bg-[#C72030] hover:text-white p-2 h-9 w-9 rounded-md flex items-center justify-center"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Card: Event Details */}
      <div className="bg-white rounded-none shadow-sm overflow-hidden border border-[#D9D9D9] mb-8">
        {/* Card Header */}
        <div className="bg-[#F6F4EE] px-6 py-4 flex flex-col md:flex-row justify-between items-center border-b border-[#D9D9D9]">
          <div className="flex items-center gap-3">
            <div className="bg-[#E5E0D3] p-2 rounded flex items-center justify-center">
              <Info className="w-5 h-5 text-gray-800" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Event Details</h2>
          </div>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Seat's Remaining</span>
              <span className="text-sm font-bold text-gray-800">
                {eventData.remaining_seats ?? 0}/{eventData.capacity ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={eventData.active} className="data-[state=checked]:bg-[#22C55E]" />
              <span className="text-sm font-bold text-gray-800">Active</span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 mb-12">
            {/* Banner Image */}
            <div className="lg:w-1/2 aspect-[16/6] relative rounded-sm overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={(eventData.documents && eventData.documents.length > 0) ? eventData.documents[0].document : "https://images.unsplash.com/photo-1540747913346-19e3adbb17c3?q=80&w=1600&auto=format&fit=crop"}
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-transparent">
                <span className="text-2xl font-black text-blue-500 italic opacity-80 select-none">PULSE</span>
              </div>
            </div>

            {/* Description */}
            <div className="lg:w-1/2">
              <h3 className="text-sm text-gray-400 font-bold mb-3 uppercase tracking-wider">Description</h3>
              <p className="text-sm text-gray-800 leading-relaxed font-medium">
                {eventData.description || "No description provided for this event."}
              </p>
            </div>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
            <DetailItem label="Event Name" value={eventData.event_name} />
            <DetailItem label="Event Category" value={eventData.event_category || "General"} />
            <DetailItem label="Pulse Category" value={eventData.pulse_category || "Play"} />

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
            <DetailItem label="Total Registration" value={eventData.total_registration ?? 0} />
            <DetailItem label="Requestable" value={eventData.rsvp_action === "1" ? "Yes" : "No"} />

            <DetailItem label="Amount" value={eventData.amount_per_member ? `₹${eventData.amount_per_member}` : "Free"} />
            <DetailItem label="Member Capacity" value={eventData.capacity ?? 0} />
            <DetailItem label="Member Per Limit" value={eventData.per_member_limit ?? 1} />
          </div>
        </div>
      </div>

      {/* Share Section Card */}
      <div className="bg-white rounded-none shadow-sm overflow-hidden border border-[#D9D9D9]">
        <div className="bg-[#F6F4EE] px-6 py-4 flex items-center gap-3 border-b border-[#D9D9D9]">
          <div className="bg-[#E5E0D3] p-2 rounded flex items-center justify-center">
            <Share2 className="w-5 h-5 text-gray-800" />
          </div>
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-tight">Share</h2>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm text-gray-400 font-bold mb-4 uppercase tracking-wider">Share With</h3>
              {eventData.share_with === 'all' ? (
                <p className="text-sm font-bold text-gray-800">All Tech Parks</p>
              ) : (
                <div className="space-y-1 mt-1">
                  {eventData.pms_sites && eventData.pms_sites.length > 0 ? (
                    eventData.pms_sites.map((site, index) => (
                      <p key={index} className="text-sm font-bold text-gray-800">{site.name}</p>
                    ))
                  ) : (
                    <p className="text-sm font-bold text-gray-800">Tech Park 1<br />Tech Park 2<br />Tech Park 3</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm text-gray-400 font-bold mb-4 uppercase tracking-wider">Share With Communities</h3>
              <div className="space-y-1 mt-1">
                {eventData.communities && eventData.communities.length > 0 ? (
                  eventData.communities.map((community, index) => (
                    <p key={index} className="text-sm font-bold text-gray-800">{community.name}</p>
                  ))
                ) : (
                  <p className="text-sm font-bold text-gray-800">Community 1<br />Community 2<br />Community 3</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for Data Points
const DetailItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="grid grid-cols-[140px_1fr] items-baseline">
    <span className="text-[12px] md:text-[13px] text-gray-400 font-medium whitespace-nowrap">
      {label}
    </span>
    <span className="text-[14px] font-bold text-gray-800">
      {value || "-"}
    </span>
  </div>
);