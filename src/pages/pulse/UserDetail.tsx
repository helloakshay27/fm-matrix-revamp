import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, FileCheck, AlertCircle, Star, Eye, Loader2, X } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PassengerDocument {
  id: number;
  name: string;
  url: string;
  verified: number;
  created_at: string;
}

interface PassengerReview {
  id: number;
  ratings: number;
  reviews: string;
  created_at: string;
  created_by: number;
}

interface PassengerReportPerson {
  id: number;
  name: string;
  role: string;
}

interface PassengerReport {
  id: number;
  report_by: PassengerReportPerson;
  report_against: PassengerReportPerson;
  report_date: string;
  report_time: string;
  status: string;
  active: boolean;
  issue_type: string;
  issue_description: string;
}

interface PassengerDetailApiResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobile: string;
  gender: string;
  birth_date: string;
  profile_image_url: string;
  aadhar_documents: PassengerDocument[];
  organization_name: string;
  correspondence_address: string;
  has_driving_license: boolean;
  driving_licenses: PassengerDocument[];
  reviews_count: number;
  reviews: PassengerReview[];
  reports_count: number;
  reports: PassengerReport[];
}

interface RideVehicleAttachment {
  id: number;
  document_url: string;
  document_file_name: string;
}

interface RideVehicle {
  id: number;
  car_model_name: string;
  colour: string;
  seats: number;
  registration_number: string;
  attachments: RideVehicleAttachment[];
}

interface RideDriver {
  id: number;
  name: string;
  gender: string;
  profile_image_url: string;
  rating: number | null;
}

interface RidePassenger {
  request_id: number;
  joined_at: string;
  status: string;
  user: {
    id: number;
    name: string;
    gender: string;
    profile_image_url: string;
  };
}

interface RideHistoryItem {
  id: number;
  status: string;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  gender_preference: string;
  available_seats: number;
  price: number;
  created_at: string;
  vehicle: RideVehicle;
  driver: RideDriver;
  passengers: RidePassenger[];
}

interface RideHistoryApiResponse {
  rides: RideHistoryItem[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export const UserDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("User's Detail");

  const userId = searchParams.get("id");
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Passenger detail state
  const [passengerDetail, setPassengerDetail] = useState<PassengerDetailApiResponse | null>(null);
  const [passengerLoading, setPassengerLoading] = useState(false);
  const [passengerError, setPassengerError] = useState<string | null>(null);

  // Ride history state
  const [rideHistory, setRideHistory] = useState<RideHistoryItem[]>([]);
  const [rideHistoryLoading, setRideHistoryLoading] = useState(false);
  const [rideHistoryError, setRideHistoryError] = useState<string | null>(null);
  const [rideHistoryFetched, setRideHistoryFetched] = useState(false);

  // Image preview modal
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  // ── Fetch passenger detail (on mount) ────────────────────────────────────────
  useEffect(() => {
    if (!userId || !baseUrl || !token) return;
    setPassengerLoading(true);
    setPassengerError(null);
    axios
      .get<PassengerDetailApiResponse>(`https://${baseUrl}/api/users/${userId}/passenger_detail.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPassengerDetail(res.data))
      .catch((err: unknown) => {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Failed to load user details";
        setPassengerError(msg);
      })
      .finally(() => setPassengerLoading(false));
  }, [userId, baseUrl, token]);

  // ── Fetch ride history (lazy — only when Ride History tab is opened) ──────────
  useEffect(() => {
    if (activeTab !== "Ride History") return;
    if (rideHistoryFetched) return;
    if (!userId || !baseUrl || !token) return;
    setRideHistoryLoading(true);
    setRideHistoryError(null);
    axios
      .get<RideHistoryApiResponse>(
        `https://${baseUrl}/rides/all_rides.json?q[ride_requests_user_id_eq]=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setRideHistory(res.data.rides ?? []);
        setRideHistoryFetched(true);
      })
      .catch((err: unknown) => {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Failed to load ride history";
        setRideHistoryError(msg);
      })
      .finally(() => setRideHistoryLoading(false));
  }, [activeTab, userId, baseUrl, token, rideHistoryFetched]);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const fmt = (ds: string | null | undefined) => {
    if (!ds) return "N/A";
    const d = new Date(ds);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  const fmtTime = (ds: string | null | undefined) => {
    if (!ds) return "N/A";
    const d = new Date(ds);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  // ── Computed review stats ─────────────────────────────────────────────────────
  const averageRating = useMemo(() => {
    if (!passengerDetail?.reviews?.length) return 0;
    const sum = passengerDetail.reviews.reduce((acc, r) => acc + r.ratings, 0);
    return (sum / passengerDetail.reviews.length).toFixed(1);
  }, [passengerDetail]);

  // ── Ride history table data ───────────────────────────────────────────────────
  const rideTableData = useMemo(
    () =>
      rideHistory.map((r) => ({
        id: String(r.id),
        carImageUrl: r.vehicle?.attachments?.[0]?.document_url ?? "",
        driver: r.driver?.name ?? "N/A",
        registrationNumber: r.vehicle?.registration_number ?? "N/A",
        passengers: r.passengers.map((p) => p.user.name).join(", ") || "No passengers",
        leavingFrom: r.start_location ?? "N/A",
        destination: r.end_location ?? "N/A",
        status: r.status,
        departureTime: fmtTime(r.start_time),
        rideDate: fmt(r.start_time),
        price: r.price ? `₹${r.price}` : "N/A",
      })),
    [rideHistory]
  );

  const fullName = passengerDetail
    ? `${passengerDetail.firstname} ${passengerDetail.lastname}`.trim()
    : "N/A";

  return (
    <div className="bg-white px-6 py-4">
      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-medium text-gray-700 truncate pr-4">{previewImage.name}</p>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImage.url}
              alt={previewImage.name}
              className="w-full max-h-[70vh] object-contain rounded"
            />
            <a
              href={previewImage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs text-[#C72030] hover:underline block text-center"
            >
              Open in new tab
            </a>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span
          className="cursor-pointer hover:text-gray-700"
          onClick={() => navigate("/pulse/carpool")}
        >
          Carpool
        </span>{" "}
        &gt; <span className="text-gray-700">User Detail</span>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white border">
          <TabsTrigger
            value="User's Detail"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            User's Detail
          </TabsTrigger>
          <TabsTrigger
            value="Ride History"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Ride History
          </TabsTrigger>
        </TabsList>

        {/* ── User's Detail Tab ── */}
        <TabsContent value="User's Detail">
          {passengerLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
            </div>
          )}

          {passengerError && !passengerDetail && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-10 h-10 text-[#C72030] mb-3" />
              <p className="text-gray-500 text-sm">{passengerError}</p>
            </div>
          )}

          {!passengerLoading && passengerDetail && (
            <>
              {/* User Detail card */}
              <div className="border border-gray-200 mb-6">
                <div className="bg-[#F9F7F4] px-6 py-4 flex items-center gap-3 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#E91E63]" />
                  </div>
                  <h2 className="font-semibold text-base">User Detail</h2>
                </div>
                <div className="px-8 py-6 flex gap-8">
                  {/* Profile image */}
                  {/* {passengerDetail.profile_image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={passengerDetail.profile_image_url}
                        alt={fullName}
                        className="w-24 h-24 rounded-full object-cover border border-gray-200"
                      />
                    </div>
                  )} */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-x-32 gap-y-6 text-sm">
                      <InfoField label="Name" value={fullName} />
                      <InfoField label="Mobile Number" value={passengerDetail.mobile || "N/A"} />
                      <InfoField label="Email Address" value={passengerDetail.email || "N/A"} />
                      <InfoField label="Gender" value={passengerDetail.gender || "N/A"} />
                      <InfoField label="Organisation" value={passengerDetail.organization_name || "N/A"} />
                      <InfoField label="Correspondence Address" value={passengerDetail.correspondence_address || "N/A"} />
                      <InfoField label="Date of Birth" value={fmt(passengerDetail.birth_date)} />
                      <InfoField
                        label="Has Driving License"
                        value={passengerDetail.has_driving_license ? "Yes" : "No"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Aadhaar Card Documents */}
              {passengerDetail.aadhar_documents.length > 0 && (
                <Section
                  title="Aadhaar Card"
                  icon={<FileCheck />}
                  right={
                    passengerDetail.aadhar_documents[0].verified === 1 ? (
                      <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-0 flex items-center gap-1.5 px-3 py-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#4CAF50] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A] px-3 py-1.5">Pending</Badge>
                    )
                  }
                >
                  <div className="grid grid-cols-4 gap-4">
                    {passengerDetail.aadhar_documents.map((doc) => (
                      <button
                        key={doc.id}
                        className="border border-dashed border-gray-300 rounded p-2 flex flex-col items-center gap-2 hover:border-[#C72030] transition-colors group"
                        onClick={() => setPreviewImage({ url: doc.url, name: doc.name })}
                        title="Click to preview"
                      >
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-full h-24 object-cover rounded group-hover:opacity-80 transition-opacity"
                        />
                        <span className="text-xs text-gray-400 truncate w-full text-center">
                          {fmt(doc.created_at)}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* Driving License Documents */}
              {passengerDetail.driving_licenses.length > 0 && (
                <Section
                  title="Driving License"
                  icon={<FileCheck />}
                  right={
                    passengerDetail.driving_licenses[0].verified === 1 ? (
                      <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-0 flex items-center gap-1.5 px-3 py-1.5">
                        <div className="w-4 h-4 rounded-full bg-[#4CAF50] flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A] px-3 py-1.5">Pending</Badge>
                    )
                  }
                >
                  <div className="grid grid-cols-4 gap-4">
                    {passengerDetail.driving_licenses.map((doc) => (
                      <button
                        key={doc.id}
                        className="border border-dashed border-gray-300 rounded p-2 flex flex-col items-center gap-2 hover:border-[#C72030] transition-colors group"
                        onClick={() => setPreviewImage({ url: doc.url, name: doc.name })}
                        title="Click to preview"
                      >
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="w-full h-24 object-cover rounded group-hover:opacity-80 transition-opacity"
                        />
                        <span className="text-xs text-gray-400 truncate w-full text-center">
                          {fmt(doc.created_at)}
                        </span>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* Reports */}
              {passengerDetail.reports_count > 0 && (
                <Section
                  title="Reports"
                  icon={<AlertCircle />}
                  right={
                    <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A] px-3 py-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {passengerDetail.reports[0]?.status ?? "Under Review"}
                    </Badge>
                  }
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Report:</p>
                    <Badge className="bg-[#FCE4E4] text-[#C72030] border border-[#F9A8A8] flex items-center gap-1.5 px-4 py-1.5 mb-3 w-fit">
                      <FileText className="w-3.5 h-3.5" />
                      {passengerDetail.reports_count} Report{passengerDetail.reports_count > 1 ? "s" : ""}
                    </Badge>
                    {passengerDetail.reports[0]?.report_date && (
                      <p className="text-sm text-gray-500">
                        Reported On {fmt(passengerDetail.reports[0].report_date)}
                      </p>
                    )}
                  </div>
                </Section>
              )}

              {/* Reviews */}
              <Section title="Reviews" icon={<Star />} right={undefined}>
                <div>
                  <p className="text-sm text-gray-500 mb-3">Reviews:</p>
                  {passengerDetail.reviews_count > 0 ? (
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(Number(averageRating))
                              ? "fill-[#C4A96A] text-[#C4A96A]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="text-sm font-medium ml-1">
                        {averageRating} / 5 ({passengerDetail.reviews_count} review{passengerDetail.reviews_count > 1 ? "s" : ""})
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 mb-3">No reviews yet</p>
                  )}
                  {passengerDetail.reviews_count > 0 && (
                    <button
                      className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-[#C72030] transition-colors"
                      onClick={() =>
                        navigate(`/pulse/carpool/ride-reviews?userId=${userId}`)
                      }
                    >
                      <Star className="w-3.5 h-3.5 fill-[#C4A96A] text-[#C4A96A]" />
                      View All Reviews
                    </button>
                  )}
                </div>
              </Section>
            </>
          )}
        </TabsContent>

        {/* ── Ride History Tab ── */}
        <TabsContent value="Ride History">
          {rideHistoryLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
            </div>
          )}

          {rideHistoryError && !rideHistoryFetched && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-10 h-10 text-[#C72030] mb-3" />
              <p className="text-gray-500 text-sm">{rideHistoryError}</p>
            </div>
          )}

          {!rideHistoryLoading && (
            <EnhancedTaskTable
              data={rideTableData}
              columns={[
                { key: "actions",            label: "Action",              sortable: false, hideable: false, draggable: false },
                { key: "carImage",           label: "Car Image",           sortable: false, hideable: true,  draggable: true  },
                { key: "driver",             label: "Driver",              sortable: true,  hideable: true,  draggable: true  },
                { key: "registrationNumber", label: "Registration Number", sortable: true,  hideable: true,  draggable: true  },
                { key: "passengers",         label: "Passenger's",         sortable: true,  hideable: true,  draggable: true  },
                { key: "leavingFrom",        label: "Leaving from",        sortable: true,  hideable: true,  draggable: true  },
                { key: "destination",        label: "Destination",         sortable: true,  hideable: true,  draggable: true  },
                { key: "departureTime",      label: "Departure Time",      sortable: true,  hideable: true,  draggable: true  },
                { key: "rideDate",           label: "Ride Date",           sortable: true,  hideable: true,  draggable: true  },
                { key: "price",              label: "Price",               sortable: true,  hideable: true,  draggable: true  },
                { key: "status",             label: "Status",              sortable: true,  hideable: true,  draggable: true  },
              ]}
              renderRow={(ride) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/ride-detail?id=${ride.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                carImage: ride.carImageUrl ? (
                  <img
                    src={ride.carImageUrl}
                    alt="Car"
                    className="w-12 h-10 object-cover rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                ),
                driver: ride.driver,
                registrationNumber: ride.registrationNumber,
                passengers: <span className="max-w-[200px] block">{ride.passengers}</span>,
                leavingFrom: ride.leavingFrom,
                destination: ride.destination,
                departureTime: ride.departureTime,
                rideDate: ride.rideDate,
                price: ride.price,
                status: (
                  <Badge
                    className={
                      ride.status === "open"
                        ? "bg-green-100 text-green-700 border-0"
                        : ride.status === "completed"
                        ? "bg-blue-100 text-blue-700 border-0"
                        : "bg-gray-100 text-gray-600 border-0"
                    }
                  >
                    {ride.status === "open" ? "Active" : ride.status}
                  </Badge>
                ),
              })}
              enableSearch={true}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={true}
              hideTableSearch={false}
              storageKey="user-ride-history-table"
              emptyMessage="No ride history found"
              searchPlaceholder="Search rides..."
              exportFileName="ride-history"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper Components
const InfoField: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-gray-400 mb-1">{label}</p>
    <p className="font-medium text-gray-900">{value}</p>
  </div>
);

const Section: React.FC<{
  title: string;
  icon: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, right, children }) => (
  <div className="border border-gray-200 mb-6">
    <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center text-[#E91E63]">
          {icon}
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      {right}
    </div>
    <div className="bg-white px-6 py-6">
      {children}
    </div>
  </div>
);
