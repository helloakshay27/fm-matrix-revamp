import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchEventById } from '@/store/slices/eventSlice';
import { format } from 'date-fns';

interface Event {
  id: string;
  created_by: string;
  event_type?: string;
  event_name: string;
  event_at: string;
  attendeeCount?: number;
  status: string;
  from_time: string;
  to_time: string;
  description: string;
  documents?: any[];
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

  return <div className="p-6 bg-gray-50 min-h-screen">
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" onClick={() => navigate('/crm/events')} className="flex items-center gap-2 px-0 text-gray-600 hover:text-gray-800">
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </Button>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center gap-4 text-[20px] fw-semibold text-[#000] bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
        <div className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
          E
        </div>
        <h2 className="text-lg font-bold text-gray-900">EVENT DETAILS</h2>
      </div>

      <div className="px-[80px] py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
        <div className="grid grid-cols-3 gap-x-8 gap-y-4">
          <div>
            <span className="text-gray-500 text-sm">Event ID</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.id}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Created by</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.created_by}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Event Type</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.event_type || "-"}</span>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Title</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.event_name}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Venue</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.event_at}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Attendees</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.attendeeCount || "-"}</span>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Status</span>
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-4">
              {eventData.status}
            </span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">Start Date</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.from_time && format(eventData.from_time, "dd-MM-yyyy")}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">End Date</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.to_time && format(eventData.to_time, "dd-MM-yyyy")}</span>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Start Time</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.from_time && format(eventData.from_time, "hh:mm a")}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm">End Time</span>
            <span className="text-gray-900 font-medium ml-4">{eventData.to_time && format(eventData.to_time, "hh:mm a")}</span>
          </div>
          <div className='flex items-center'>
            <span className="text-gray-500 text-sm">Description</span>
            <span
              className="text-gray-900 font-medium ml-4 truncate max-w-[170px] overflow-hidden whitespace-nowrap"
              title={eventData.description}
            >
              {eventData.description}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center gap-4 text-[20px] fw-semibold text-[#000] bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
        <div className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
          A
        </div>
        <h2 className="text-lg font-bold text-gray-900">ATTACHMENTS</h2>
      </div>

      <div className="px-[40px] py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
        {
          eventData?.documents ? (
            <img src={eventData?.documents[0]?.document} alt="" height={100} width={150} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No attachments available for this event.
            </div>
          )
        }

      </div>
    </div>
  </div >;
};