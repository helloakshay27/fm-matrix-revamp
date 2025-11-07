import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Printer } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeStatusDialog } from '@/components/ChangeStatusDialog';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { fetchBroadcastById } from '@/store/slices/broadcastSlice';
import { format } from 'date-fns';
import axios from 'axios';

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
  shared_notices?: string[];
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
  const [isPrinting, setIsPrinting] = useState(false)

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

  const handlePrint = async () => {
    setIsPrinting(true)
    try {
      const response = await axios.get(`https://${baseUrl}/pms/admin/noticeboards/${id}/print_notice.pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })
      console.log(response)
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `notice-${id}.pdf`); // Set the file name

      // Append to body and trigger click
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url); // optional: free memory
    } catch (error) {
      console.log(error)
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Broadcasts
        </Button>
        <Button
          variant="outline"
          onClick={handlePrint}
          disabled={isPrinting}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          {
            isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />
          }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Broadcast ID</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.id || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Created by</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.created_by || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Type</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.notice_type || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Title</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.notice_heading || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Created Date</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.created_at && format(broadcastDetails.created_at, "dd-MM-yyyy")}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Status</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {broadcastDetails.status || "-"}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Created Time</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.created_at && format(broadcastDetails.created_at, "hh:mm a")}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">End Date</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.expire_time && format(broadcastDetails.expire_time, "dd-MM-yyyy")}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">End Time</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="text-gray-900 font-medium">
                {broadcastDetails.expire_time && format(broadcastDetails.expire_time, "hh:mm a")}
              </span>
            </div>

            <div className="flex items-start">
              <span className="text-gray-500 min-w-[140px]">Important</span>
              <span className="text-gray-500 mx-2">:</span>
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {broadcastDetails.isImportant ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4 text-[20px] fw-semibold text-[#000] bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
          <div className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
            D
          </div>
          <h2 className="text-lg font-bold text-gray-900">Description</h2>
        </div>

        <div className="px-[80px] py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
          {broadcastDetails.notice_text}
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

      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="flex items-center gap-4 text-[20px] fw-semibold text-[#000] bg-[#F6F4EE] p-6" style={{ border: "1px solid #D9D9D9" }}>
          <div className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
            S
          </div>
          <h2 className="text-lg font-bold text-gray-900">Shared With</h2>
        </div>

        <div className="px-[80px] py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
          <ol className="list-decimal pl-6">
            {
              broadcastDetails.shared_notices?.map(((data, idx) => (
                <li key={idx} className="text-14">
                  <span className="fw-medium text-13">{data}</span>
                </li>
              )))
            }
          </ol>
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
