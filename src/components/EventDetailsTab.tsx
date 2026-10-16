import { useParams, useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Pencil,
  QrCode,
  Share2,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchEventById, updateEvent } from "@/store/slices/eventSlice";
import { ClassFormSection } from "@/pages/ClubManagement/ClassFormSection";
import { format } from "date-fns";


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

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  const [eventData, setEventData] = useState<Event>({} as Event);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentAttachmentIndex, setCurrentAttachmentIndex] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await dispatch(
          fetchEventById({ id, baseUrl, token })
        ).unwrap();
        setEventData(response);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch event");
      }
    };

    fetchEvent();
  }, []);

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

  const handlePrevAttachment = () => {
    setCurrentAttachmentIndex((prev) =>
      prev === 0 ? (eventData.documents?.length ?? 1) - 1 : prev - 1
    );
  };

  const handleNextAttachment = () => {
    setCurrentAttachmentIndex((prev) =>
      prev === (eventData.documents?.length ?? 1) - 1 ? 0 : prev + 1
    );
  };

  if (!eventData.id) {
    return (
      <div className="p-6 bg-[#F6F7F7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-700">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Top Header */}
      <div className="flex items-center justify-end gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="fm-button-fix fm-button-brand px-4 py-2"
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
      <div className="mb-6">
      <ClassFormSection
        title="Event Details"
        icon={<Info />}
        actions={
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
                  onCheckedChange={(checked) => handleStatusChange(checked)}
                  disabled={updatingStatus}
                />
                <span className="text-sm font-medium text-gray-700">
                  {eventData.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
        }
      >
        <div>
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            {/* Banner Image Carousel */}
            <div className="lg:w-1/2 aspect-[16/6] relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group">
              <img
                src={
                  eventData.documents && eventData.documents.length > 0
                    ? eventData.documents[currentAttachmentIndex].document
                    : "https://images.unsplash.com/photo-1540747913346-19e3adbb17c3?q=80&w=1600&auto=format&fit=crop"
                }
                alt="Event Banner"
                className="w-full h-full object-contain transition-opacity duration-300"
              />

              {/* Navigation Arrows */}
              {eventData.documents && eventData.documents.length > 1 && (
                <>
                  <button
                    onClick={handlePrevAttachment}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={handleNextAttachment}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-[8px] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    title="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {currentAttachmentIndex + 1} / {eventData.documents.length}
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            <div className="lg:w-1/2">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                Description
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {eventData.description ||
                  "No description provided for this event."}
              </p>
            </div>
          </div>

          {/* Attributes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-6">
            <DetailItem label="Event Name" value={eventData.event_name} />
            <DetailItem
              label="Event Category"
              value={eventData.isPaid ? "Paid" : "Complimentary"}
            />
            <DetailItem
              label="Pulse Category"
              value={eventData.event_category || "Play"}
            />

            <DetailItem
              label="Event Date"
              value={
                eventData.from_time
                  ? format(new Date(eventData.from_time), "dd MMMM yyyy")
                  : "-"
              }
            />
            <DetailItem
              label="Interested"
              value={eventData.interested_count ?? 0}
            />
            <DetailItem label="Event Created By" value={eventData.created_by} />

            <DetailItem
              label="Event Time"
              value={
                eventData.from_time && eventData.to_time
                  ? `${format(new Date(eventData.from_time), "hh:mm a")} - ${format(new Date(eventData.to_time), "hh:mm a")}`
                  : "-"
              }
            />
            <DetailItem
              label="Uninterested"
              value={eventData.uninterested_count ?? 0}
            />
            <DetailItem
              label="Event Created On"
              value={
                eventData.created_at
                  ? format(new Date(eventData.created_at), "dd MMMM yyyy")
                  : "-"
              }
            />

            <DetailItem label="Event Location" value={eventData.event_at} />
            <DetailItem
              label="Total Registration"
              value={eventData.total_registed_count ?? 0}
            />
            <DetailItem
              label="Requestable"
              value={eventData.rsvp_action === "1" ? "Yes" : "No"}
            />

            <DetailItem
              label="Amount"
              value={
                eventData.amount_per_member
                  ? `₹${eventData.amount_per_member}`
                  : "Free"
              }
            />
            <DetailItem
              label="Member Capacity"
              value={eventData.capacity ?? 0}
            />
            <DetailItem
              label="Member Per Limit"
              value={eventData.per_member_limit ?? 1}
            />
          </div>
        </div>
      </ClassFormSection>
      </div>

      {/* Share Section Card */}
      <div className="mb-6">
      <ClassFormSection title="Share" icon={<Share2 />}>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-start">
              <span className="text-sm text-gray-500 min-w-[160px]">
                Share With
              </span>
              <span className="text-sm text-gray-500 mx-2">:</span>
              <span className="text-sm font-medium text-gray-900">
                {eventData.share_with === "all"
                  ? "All Tech Parks"
                  : eventData.pms_sites && eventData.pms_sites.length > 0
                    ? eventData.pms_sites.map((s) => s.name).join(", ")
                    : "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-sm text-gray-500 min-w-[160px]">
                Share With Communities
              </span>
              <span className="text-sm text-gray-500 mx-2">:</span>
              <span className="text-sm font-medium text-gray-900">
                {eventData.communities && eventData.communities.length > 0
                  ? eventData.communities.map((c) => c.name).join(", ")
                  : "No"}
              </span>
            </div>
          </div>
        </div>
      </ClassFormSection>
      </div>
    </div>
  );
};

// Helper Component for Data Points
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex items-start">
    <span className="text-sm text-gray-500 min-w-[140px] md:min-w-[160px]">
      {label}
    </span>
    <span className="text-sm text-gray-500 mx-2">:</span>
    <span className="text-sm font-medium text-gray-900">{value ?? "-"}</span>
  </div>
);
