import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeStatusDialog } from '@/components/ChangeStatusDialog';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchBroadcastById } from '@/store/slices/broadcastSlice';
import { format } from 'date-fns';

interface BroadcastDetails {
  id?: string;
  created_by?: string;
  notice_type?: string;
  notice_heading?: string;
  created_at?: string | Date;
  status?: string;
  expire_time?: string | Date;
  isImportant?: boolean;
  notice_text?: string;
  attachments?: any[]; // Uncomment if the attachments section is used
}

export const BroadcastDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem("token");

  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState('Published');
  const [broadcastDetails, setBroadcastDetails] = useState<BroadcastDetails>({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchBroadcastById({ id, baseUrl, token })).unwrap();
        setBroadcastDetails(response)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch broadcast details")
      }
    }

    fetchData();
  }, [])

  const handleStatusChange = (newStatus: string) => {
    setBroadcastStatus(newStatus);
    console.log('Status changed to:', newStatus);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/crm/broadcast')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Broadcasts
        </Button>
      </div>

      {/* Broadcast Details Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4 text-[20px] fw-semibold text-[#000] bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
          <div className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
            B
          </div>
          <h2 className="text-lg font-bold text-gray-900">BROADCAST DETAILS</h2>
        </div>

        <div className="px-[80px] py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <span className="text-gray-500 text-sm">Broadcast ID</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.id}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Created by</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.created_by}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Type</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.notice_type || "-"}</span>
            </div>

            <div>
              <span className="text-gray-500 text-sm">Title</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.notice_heading}</span>
            </div>
            {/* <div>
              <span className="text-gray-500 text-sm">Share With</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.shareWith}</span>
            </div> */}
            <div>
              <span className="text-gray-500 text-sm">Created Date</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.created_at && format(broadcastDetails.created_at, "dd-MM-yyyy")}</span>
            </div>

            <div>
              <span className="text-gray-500 text-sm">Status</span>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-4">
                {broadcastDetails.status}
              </span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Created Time</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.created_at && format(broadcastDetails.created_at, "hh:mm a")}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">End Date</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.expire_time && format(broadcastDetails.expire_time, "dd-MM-yyyy")}</span>
            </div>

            <div>
              <span className="text-gray-500 text-sm">End Time</span>
              <span className="text-gray-900 font-medium ml-4">{broadcastDetails.expire_time && format(broadcastDetails.expire_time, "hh:mm a")}</span>
            </div>
            <div>
              <span className="text-gray-500 text-sm">Important</span>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-4">
                {broadcastDetails.isImportant ? 'Yes' : 'No'}
              </span>
            </div>
            <div className='flex items-center'>
              <span className="text-gray-500 text-sm">Description</span>
              <span
                className="text-gray-900 font-medium ml-4 truncate max-w-[170px] overflow-hidden whitespace-nowrap"
                title={broadcastDetails.notice_text}
              >
                {broadcastDetails.notice_text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4 text-[20px] fw-semibold text-[#000] bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
          <div className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
            A
          </div>
          <h2 className="text-lg font-bold text-gray-900">ATTACHMENTS</h2>
        </div>

        <div className="px-[40px] py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
          {
            broadcastDetails?.attachments ? (
              <img src={broadcastDetails?.attachments[0]?.document_url} alt="" height={100} width={150} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No attachments available for this event.
              </div>
            )
          }
        </div>
      </div>

      {/* Change Status Dialog */}
      <ChangeStatusDialog
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        currentStatus={broadcastStatus}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
