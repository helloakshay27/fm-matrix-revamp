import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "@/store/hooks";
import {
  FacilityBookingDetails,
  fetchBookingDetails,
  getLogs,
} from "@/store/slices/facilityBookingsSlice";
import { ArrowLeft, Logs, Ticket } from "lucide-react";
import { CustomTabs } from "@/components/CustomTabs";
import { LogsTimeline } from "@/components/LogTimeline";

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<FacilityBookingDetails | null>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [logs, setLogs] = useState([
    {
      id: "",
      description: "",
      timestamp: "",
    }
  ]);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await dispatch(
          fetchBookingDetails({ baseUrl, token, id })
        ).unwrap();
        setBookings(response);
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    const fetchLogs = async () => {
      try {
        const response = await dispatch(
          getLogs({ baseUrl, token, id })
        ).unwrap();
        setLogs(response.logs.map((log, index) => ({
          id: index,
          description: log.text,
          timestamp: log.date + " " + log.time,
        })));
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchDetails();
    fetchLogs();
  }, []);

  console.log(logs)

  const tabs = [
    {
      value: "details",
      label: "Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Ticket className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">BOOKING DETAILS</h3>
          </div>
          <div
            className="grid grid-cols-3 gap-8 px-3"
          >

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booking ID</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.id}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Comment</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.comment}>
                  {bookings?.comment}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Status</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className={`text-gray-900 px-2 py-[2px] flex items-center gap-2 text-sm ${bookings?.current_status === "Cancelled"
                  ? "bg-red-100"
                  : bookings?.current_status === "Confirmed"
                    ? "bg-green-100"
                    : "bg-yellow-100"
                  }`} title={bookings?.comment} style={{ borderRadius: "4px" }}>
                  <span className={`rounded-full w-2 h-2 inline-block ${bookings?.current_status === "Cancelled"
                    ? "bg-[#D92E14]"
                    : bookings?.current_status === "Confirmed"
                      ? "bg-[#16B364]"
                      : "bg-[#D9CA20]"
                    }`}></span>
                  {bookings?.current_status}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Payment Method</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.payment_method === "NA" ? "Complimentory" : bookings?.payment_method}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booked by</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.created_by_name}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">GST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.gst || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Scheduled Date</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.startdate.split(" ")[0]}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Schedule Slot</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium truncate max-w-[170px] overflow-hidden whitespace-nowrap" title={bookings?.show_schedule_24_hour}>
                  {bookings?.show_schedule_24_hour}
                </span>
              </div>

              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">SGST</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.sgst || "-"}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-gray-500 min-w-[140px]">Booked On</span>
                <span className="text-gray-500 mx-2">:</span>
                <span className="text-gray-900 font-medium">
                  {bookings?.sgst || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      value: "logs",
      label: "Logs",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              <Logs className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">LOGS</h3>
          </div>
          <div className="overflow-x-auto px-3">
            <LogsTimeline logs={logs} />
          </div>
        </div>
      )
    }
  ]

  if (!bookings) {
    return <div className="p-10 text-gray-600">Loading booking details...</div>;
  }

  return (
    <div className="p-[30px] min-h-screen bg-transparent">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>
      <>
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-[24px] font-semibold text-[#1a1a1a]">
            {bookings.facility_name}
          </h1>
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200">
          <CustomTabs tabs={tabs} defaultValue="details" onValueChange={setActiveTab} />
        </div>
      </>
    </div>
  );
};
