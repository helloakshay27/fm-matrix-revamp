import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/store/hooks";
import {
  FacilityBookingDetails,
  fetchBookingDetails,
  getLogs,
} from "@/store/slices/facilityBookingsSlice";
import { ArrowLeft } from "lucide-react";
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
        setLogs(response.logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchDetails();
    fetchLogs();
  }, []);

  const tabs = [
    {
      value: "details",
      label: "Details",
      content: (
        <div className="bg-white rounded-lg shadow border-2 p-6 space-y-6">
          {/* <CardHeader
            className="bg-[#F6F4EE]"
            style={{ border: "1px solid #D9D9D9" }}
          >
            <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
              <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">
                B
              </span>
              BOOKING DETAILS
            </CardTitle>
          </CardHeader> */}

          <div className="flex items-center gap-3">
            <div className="w-12  h-12  rounded-full flex items-center justify-center bg-[#E5E0D3] text-[#C72030]">
              B
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
                <span className={`text-gray-900 font-medium px-2 ${bookings?.current_status === "Cancelled"
                  ? "bg-red-100 text-red-800"
                  : bookings?.current_status === "Confirmed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                  }`} title={bookings?.comment}>
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
              L
            </div>
            <h3 className="text-lg font-semibold uppercase text-[#1A1A1A]">LOGS</h3>
          </div>
          {/* <CardContent
            className="px-6 bg-[#F6F7F7]"
            style={{ border: "1px solid #D9D9D9" }}
          >
            <div className="text-gray-500">
              <div className="timeline">
                {logs.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon"></div>
                    <div className="timeline-content">
                      <span className="date">
                        {item.date} <span className="time">{item.time}</span>
                      </span>
                      <p className="mb-0">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent> */}
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
        <div className="flex items-center gap-4 mb-[30px]">
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
