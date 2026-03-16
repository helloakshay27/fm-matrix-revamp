import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Paperclip,
  AlertCircle,
  Star,
  FileCheck,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReportImage {
  id: number;
  document_url: string;
  document_file_name: string;
}

interface ReportPerson {
  id: number;
  name: string;
  role: string;
}

interface Report {
  id: number;
  report_by: ReportPerson;
  report_against: ReportPerson;
  report_date: string;
  report_time: string;
  status: string;
  active: boolean;
  issue_type: string;
  issue_description: string;
  images: ReportImage[];
}

interface PassengerUser {
  id: number;
  name: string;
  gender: string;
  profile_image_url: string;
}

interface Passenger {
  request_id: number;
  joined_at: string;
  status: string;
  user: PassengerUser;
  reports_count: number;
  reports: Report[];
}

interface VehicleAttachment {
  id: number;
  document_url: string;
  document_file_name: string;
}

interface Vehicle {
  id: number;
  car_model_name: string;
  colour: string;
  seats: number;
  registration_number: string;
  attachments: VehicleAttachment[];
}

interface Driver {
  id: number;
  name: string;
  gender: string;
  profile_image_url: string;
  rating: number | null;
}

interface RideApiResponse {
  id: number;
  status: string;
  regular: boolean;
  start_location: string;
  end_location: string;
  start_time: string;
  end_time: string;
  gender_preference: string;
  available_seats: number;
  price: number;
  created_at: string;
  vehicle: Vehicle;
  driver: Driver;
  passengers: Passenger[];
}

// ─── Driver Detail API Types ──────────────────────────────────────────────────
interface DriverDocument {
  id: number;
  name: string;
  url: string;
  verified: number;
  created_at: string;
}

interface DriverReview {
  id: number;
  ratings: number;
  reviews: string;
  created_at: string;
  created_by: number;
}

interface DriverReport {
  id: number;
  report_by: ReportPerson;
  report_against: ReportPerson;
  report_date: string;
  report_time: string;
  status: string;
  active: boolean;
  issue_type: string;
  issue_description: string;
  images: ReportImage[];
}

interface DriverDetailApiResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobile: string;
  gender: string;
  birth_date: string;
  profile_image_url: string;
  aadhar_documents: DriverDocument[];
  organization_name: string;
  correspondence_address: string;
  has_driving_license: boolean;
  driving_licenses: DriverDocument[];
  reviews_count: number;
  reviews: DriverReview[];
  reports_count: number;
  reports: DriverReport[];
}

export const RideDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Ride Details");
  const [showReportTab, setShowReportTab] = useState(false);
  // Which passenger's reports we're viewing (index into passengers array)
  const [reportPassengerIdx, setReportPassengerIdx] = useState(0);
  // Active report index within that passenger's reports
  const [activeReportIdx, setActiveReportIdx] = useState(0);
  // Whether the report tab is showing passenger reports or driver reports
  const [reportSource, setReportSource] = useState<"passenger" | "driver">("passenger");
  // Active driver report index (when reportSource === "driver")
  const [activeDriverReportIdx, setActiveDriverReportIdx] = useState(0);
  // Status update loading per report id
  const [updatingReportId, setUpdatingReportId] = useState<number | null>(null);
  // Local report statuses for optimistic UI
  const [reportStatuses, setReportStatuses] = useState<Record<number, string>>({});

  const [apiRide, setApiRide] = useState<RideApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Driver detail state
  const [driverDetail, setDriverDetail] = useState<DriverDetailApiResponse | null>(null);
  const [driverDetailLoading, setDriverDetailLoading] = useState(false);
  const [driverDetailError, setDriverDetailError] = useState<string | null>(null);
  const [driverDetailFetched, setDriverDetailFetched] = useState(false);

  // Image preview modal
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const rideId = searchParams.get("id");
  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // ── Fetch ride ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!rideId || !baseUrl || !token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get<RideApiResponse>(`https://${baseUrl}/rides/${rideId}.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setApiRide(res.data))
      .catch((err: unknown) => {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Failed to load ride";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [rideId, baseUrl, token]);

  // ── Fetch driver detail (lazy — only when Driver's Detail tab is opened) ──────
  useEffect(() => {
    if (activeTab !== "Driver's Detail") return;
    if (driverDetailFetched) return;
    const driverId = apiRide?.driver?.id;
    if (!driverId || !baseUrl || !token) return;
    setDriverDetailLoading(true);
    setDriverDetailError(null);
    axios
      .get<DriverDetailApiResponse>(`https://${baseUrl}/api/users/${driverId}/driver_detail.json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setDriverDetail(res.data);
        setDriverDetailFetched(true);
      })
      .catch((err: unknown) => {
        const msg = axios.isAxiosError(err)
          ? err.response?.data?.error ?? err.message
          : "Failed to load driver details";
        setDriverDetailError(msg);
      })
      .finally(() => setDriverDetailLoading(false));
  }, [activeTab, apiRide?.driver?.id, baseUrl, token, driverDetailFetched]);

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

  // ── Derived data ──────────────────────────────────────────────────────────────
  const ride = apiRide;
  const driver = ride?.driver;
  const vehicle = ride?.vehicle;
  const passengers = useMemo(() => ride?.passengers ?? [], [ride?.passengers]);

  // Collect ALL reports across all passengers
  const allPassengerReports = useMemo(() => {
    return passengers.flatMap((p) =>
      p.reports.map((r) => ({ ...r, passengerName: p.user.name }))
    );
  }, [passengers]);

  const totalReportsCount = passengers.reduce((acc, p) => acc + (p.reports_count ?? 0), 0);

  // Current report for the Report Detail tab
  const currentPassengerReports = passengers[reportPassengerIdx]?.reports ?? [];
  // Driver reports list (from driver_detail API)
  const currentDriverReports: Report[] = useMemo(
    () => (driverDetail?.reports ?? []) as Report[],
    [driverDetail]
  );

  const currentReport =
    reportSource === "driver"
      ? (currentDriverReports[activeDriverReportIdx] ?? null)
      : (currentPassengerReports[activeReportIdx] ?? null);
  const currentReportStatus = currentReport
    ? (reportStatuses[currentReport.id] ?? currentReport.status)
    : "";

  // ── Open report tab ───────────────────────────────────────────────────────────
  const handleViewReports = (passengerIdx = 0) => {
    setReportSource("passenger");
    setReportPassengerIdx(passengerIdx);
    setActiveReportIdx(0);
    setShowReportTab(true);
    setActiveTab("Report Detail");
  };

  const handleViewDriverReports = () => {
    setReportSource("driver");
    setActiveDriverReportIdx(0);
    setShowReportTab(true);
    setActiveTab("Report Detail");
  };

  const handleTabChange = (value: string) => {
    if (value !== "Report Detail") setShowReportTab(false);
    setActiveTab(value);
  };

  // ── Update report status ──────────────────────────────────────────────────────
  const handleReportStatusChange = async (reportId: number, newStatus: string) => {
    if (!baseUrl || !token) return;
    setUpdatingReportId(reportId);
    // Optimistic
    setReportStatuses((prev) => ({ ...prev, [reportId]: newStatus }));
    try {
      await axios.patch(
        `https://${baseUrl}/reports/${reportId}.json`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error ?? err.message
        : "Failed to update status";
      toast.error(msg);
      // Revert
      setReportStatuses((prev) => ({ ...prev, [reportId]: currentReportStatus }));
    } finally {
      setUpdatingReportId(null);
    }
  };

  // ── Passenger table data ──────────────────────────────────────────────────────
  const passengerTableData = passengers.map((p, idx) => ({
    id: String(p.user.id),
    name: p.user.name,
    gender: p.user.gender || "N/A",
    status: p.status,
    joinedAt: fmt(p.joined_at),
    reportsCount: p.reports_count,
    _idx: idx,
  }));

  // ── Loading / Error ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  if (error && !apiRide) {
    return (
      <div className="bg-white px-6 py-4">
        <div className="text-sm text-gray-500 mb-6">
          <span className="cursor-pointer hover:text-gray-700" onClick={() => navigate(-1)}>
            Carpool
          </span>{" "}&gt; <span className="text-gray-700">Ride Detail</span>
        </div>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-[#C72030] mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Ride Details</h2>
          <p className="text-gray-500 mb-4">{error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white px-6 py-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span className="cursor-pointer hover:text-gray-700" onClick={() => navigate(-1)}>
          Carpool
        </span>{" "}&gt; <span className="text-gray-700">Ride Detail</span>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          className="grid w-full mb-6 bg-white border"
          style={{ gridTemplateColumns: `repeat(${showReportTab ? 5 : 4}, minmax(0, 1fr))` }}
        >
          {showReportTab && (
            <TabsTrigger
              value="Report Detail"
              className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
            >
              Report Detail
            </TabsTrigger>
          )}
          <TabsTrigger value="Ride Details" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Ride Details</TabsTrigger>
          <TabsTrigger value="Car Detail" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Car Detail</TabsTrigger>
          <TabsTrigger value="Driver's Detail" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Driver's Detail</TabsTrigger>
          <TabsTrigger value="Passenger's Detail" className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none">Passenger's Detail</TabsTrigger>
        </TabsList>

        {/* ── Report Detail Tab ─────────────────────────────────────────── */}
        {showReportTab && (
          <TabsContent value="Report Detail">
            <div className="border border-gray-200 mb-6">
              {/* Header */}
              <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#E91E63]" />
                  </div>
                  <h2 className="font-semibold text-base">Report Detail</h2>
                </div>
                <div className="flex items-center gap-2">
                  {currentReport && (
                    <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A] px-3 py-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3" />
                      {currentReportStatus}
                    </Badge>
                  )}
                  <button
                    onClick={() => { setShowReportTab(false); setActiveTab("Ride Details"); }}
                    className="ml-2 text-gray-400 hover:text-gray-600 text-xl leading-none"
                    title="Close report tab"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Passenger selector tabs — only when showing passenger reports */}
              {reportSource === "passenger" && passengers.filter((p) => p.reports_count > 0).length > 1 && (
                <div className="flex border-b border-gray-200 bg-white px-6 gap-2 pt-2">
                  {passengers.map((p, idx) =>
                    p.reports_count > 0 ? (
                      <button
                        key={idx}
                        onClick={() => { setReportPassengerIdx(idx); setActiveReportIdx(0); }}
                        className={`px-4 py-2 text-sm font-medium rounded-t border-b-2 transition-colors ${
                          reportPassengerIdx === idx
                            ? "border-[#C72030] text-[#C72030]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        {p.user.name}
                        <span className="ml-1.5 bg-[#FCE4E4] text-[#C72030] text-xs px-1.5 py-0.5 rounded-full">
                          {p.reports_count}
                        </span>
                      </button>
                    ) : null
                  )}
                </div>
              )}

              {/* Driver source label */}
              {reportSource === "driver" && (
                <div className="flex items-center gap-2 bg-[#FFF5F5] border-b border-gray-100 px-6 py-2">
                  <span className="text-xs font-medium text-[#C72030]">
                    Showing reports for driver: {driverDetail ? `${driverDetail.firstname} ${driverDetail.lastname}` : "Driver"}
                  </span>
                  <span className="text-xs text-gray-400">({currentDriverReports.length} report{currentDriverReports.length !== 1 ? "s" : ""})</span>
                </div>
              )}

              {/* Report index tabs — passenger source */}
              {reportSource === "passenger" && currentPassengerReports.length > 1 && (
                <div className="flex border-b border-gray-100 bg-gray-50 px-6 gap-2 pt-2">
                  {currentPassengerReports.map((r, idx) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveReportIdx(idx)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-t border-b-2 transition-colors ${
                        activeReportIdx === idx
                          ? "border-[#C72030] text-[#C72030]"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Report #{idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Report index tabs — driver source */}
              {reportSource === "driver" && currentDriverReports.length > 1 && (
                <div className="flex border-b border-gray-100 bg-gray-50 px-6 gap-2 pt-2">
                  {currentDriverReports.map((r, idx) => (
                    <button
                      key={r.id}
                      onClick={() => setActiveDriverReportIdx(idx)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-t border-b-2 transition-colors ${
                        activeDriverReportIdx === idx
                          ? "border-[#C72030] text-[#C72030]"
                          : "border-transparent text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      Report #{idx + 1}
                    </button>
                  ))}
                </div>
              )}

              {/* Report Info */}
              {currentReport ? (
                <div className="px-8 py-6">
                  <div className="grid grid-cols-2 gap-x-20 gap-y-6 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Report by</p>
                      <p className="font-medium text-gray-900">
                        {currentReport.report_by.name} ({currentReport.report_by.role})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Report Against</p>
                      <p className="font-medium text-gray-900">
                        {currentReport.report_against.name} ({currentReport.report_against.role})
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Report Date</p>
                      <p className="font-medium text-gray-900">{currentReport.report_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Report Time</p>
                      <p className="font-medium text-gray-900">{currentReport.report_time}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Issue Type</p>
                      <p className="font-medium text-gray-900">{currentReport.issue_type}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Review Status</p>
                      <div className="flex items-center gap-2">
                        <select
                          aria-label="Review Status"
                          value={currentReportStatus}
                          disabled={updatingReportId === currentReport.id}
                          onChange={(e) => handleReportStatusChange(currentReport.id, e.target.value)}
                          className="border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-1 focus:ring-[#C72030] w-48 disabled:opacity-50"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Action in Progress">Action in Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                        {updatingReportId === currentReport.id && (
                          <Loader2 className="w-4 h-4 animate-spin text-[#C72030]" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 mb-1">Issue Description</p>
                      <p className="font-medium text-gray-900">{currentReport.issue_description}</p>
                    </div>
                    {/* Evidence Images */}
                    {currentReport.images && currentReport.images.length > 0 && (
                      <div className="col-span-2">
                        <p className="text-gray-400 mb-2">Evidence Images</p>
                        <div className="grid grid-cols-4 gap-3">
                          {currentReport.images.map((img) => (
                            <a
                              key={img.id}
                              href={img.document_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border border-dashed border-gray-300 rounded p-2 flex items-center justify-center hover:border-[#C72030] transition-colors"
                            >
                              <img
                                src={img.document_url}
                                alt={img.document_file_name}
                                className="object-contain h-20 w-full"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-8 py-10 text-center text-gray-400 text-sm">
                  No reports found.
                </div>
              )}
            </div>
          </TabsContent>
        )}

        {/* ── Ride Details Tab ──────────────────────────────────────────── */}
        <TabsContent value="Ride Details">
          <div className="border border-gray-200 mb-6">
            <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E91E63]" />
                </div>
                <h2 className="font-semibold text-base">Ride Detail</h2>
              </div>
              {totalReportsCount > 0 && (
                <Badge className="bg-[#E57373] hover:bg-[#E57373] text-white px-4 py-1.5 text-sm rounded">
                  {totalReportsCount} Report{totalReportsCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <div className="px-8 py-6">
              <div className="grid grid-cols-3 gap-x-20 gap-y-5 text-sm">
                <Info label="Driver" value={driver?.name ?? "N/A"} />
                <Info label="Registration Number" value={vehicle?.registration_number ?? "N/A"} />
                <Info label="Departure Time" value={fmtTime(ride?.start_time)} />
                <Info label="Ride Date" value={fmt(ride?.start_time)} />
                <Info label="Passenger's" value={passengers.map((p) => p.user.name).join(", ") || "No passengers"} />
                <Info label="Expected Arrival Time" value={fmtTime(ride?.end_time)} />
                <Info label="Booking Date" value={fmt(ride?.created_at)} />
                <Info label="Seat" value={`${passengers.length}/${ride?.available_seats ?? 0}`} />
                <Info label="Gender Preference" value={ride?.gender_preference ?? "N/A"} />
                <Info label="Status" value={ride?.status === "open" ? "Active" : (ride?.status ?? "N/A")} />
                <Info label="Leaving From" value={ride?.start_location ?? "N/A"} />
                <Info label="Price Per Person" value={ride?.price ? `₹${ride.price}` : "N/A"} />
                <Info label="Destination" value={ride?.end_location ?? "N/A"} />
              </div>
            </div>
          </div>

          {/* Attachment */}
          <Section title="Attachment" icon={<Paperclip />} right={undefined}>
            <p className="font-semibold mb-4">Car Images</p>
            <div className="grid grid-cols-4 gap-6">
              {vehicle?.attachments && vehicle.attachments.length > 0 ? (
                vehicle.attachments.map((att) => (
                  <div key={att.id} className="border border-dashed border-gray-400 p-4 flex items-center justify-center">
                    <img src={att.document_url} className="object-contain h-24 w-full" alt={att.document_file_name} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 col-span-4">No images available</p>
              )}
            </div>
          </Section>

          {/* Reports */}
          {totalReportsCount > 0 && (
            <Section
              title="Reports"
              icon={<AlertCircle />}
              right={
                <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A]">
                  {allPassengerReports[0]?.status ?? "Under Review"}
                </Badge>
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Report:</p>
                  <Badge className="bg-[#E57373] text-white px-4 py-1 mb-2">
                    {totalReportsCount} Report{totalReportsCount > 1 ? "s" : ""}
                  </Badge>
                  {allPassengerReports[0]?.report_date && (
                    <p className="text-sm text-gray-500">Reported On {allPassengerReports[0].report_date}</p>
                  )}
                </div>
                <Button variant="outline" className="px-8" onClick={() => handleViewReports(0)}>
                  View Reports
                </Button>
              </div>
            </Section>
          )}
        </TabsContent>

        {/* ── Car Detail Tab ────────────────────────────────────────────── */}
        <TabsContent value="Car Detail">
          <div className="border border-gray-200 mb-6">
            <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E91E63]" />
                </div>
                <h2 className="font-semibold text-base">Car Detail</h2>
              </div>
            </div>
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-x-32 gap-y-5 text-sm">
                <Info label="Driver" value={driver?.name ?? "N/A"} />
                <Info label="Registration Number" value={vehicle?.registration_number ?? "N/A"} />
                <Info label="Car Model Name" value={vehicle?.car_model_name ?? "N/A"} />
                <Info label="Total Seats" value={vehicle?.seats?.toString() ?? "N/A"} />
                <Info label="Car Color" value={vehicle?.colour ?? "N/A"} />
              </div>
            </div>
          </div>

          <Section title="Attachment" icon={<Paperclip />} right={undefined}>
            <p className="font-semibold mb-4">Car Images</p>
            <div className="grid grid-cols-4 gap-6">
              {vehicle?.attachments && vehicle.attachments.length > 0 ? (
                vehicle.attachments.map((att) => (
                  <div key={att.id} className="border border-dashed border-gray-400 p-4 flex items-center justify-center">
                    <img src={att.document_url} className="object-contain h-24 w-full" alt={att.document_file_name} />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 col-span-4">No images available</p>
              )}
            </div>
          </Section>
        </TabsContent>

        {/* ── Driver's Detail Tab ───────────────────────────────────────── */}
        <TabsContent value="Driver's Detail">
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
                  <p className="text-sm font-medium text-gray-700 truncate">{previewImage.name}</p>
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="text-gray-400 hover:text-gray-600 ml-3 shrink-0"
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

          {/* Loading state */}
          {driverDetailLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
            </div>
          )}

          {/* Error state */}
          {driverDetailError && !driverDetail && (
            <div className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="w-10 h-10 text-[#C72030] mb-3" />
              <p className="text-gray-500 text-sm">{driverDetailError}</p>
            </div>
          )}

          {/* Content — shown once data is available */}
          {!driverDetailLoading && driverDetail && (
            <>
              {/* Driver Info card */}
              <div className="border border-gray-200 mb-6">
                <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#E91E63]" />
                    </div>
                    <h2 className="font-semibold text-base">Driver's Detail</h2>
                  </div>
                </div>
                <div className="px-8 py-6 flex gap-8">
                  {/* {driverDetail.profile_image_url && (
                    <img
                      src={driverDetail.profile_image_url}
                      alt={`${driverDetail.firstname} ${driverDetail.lastname}`}
                      className="w-20 h-20 rounded-full object-cover border border-gray-200 shrink-0"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  )} */}
                  <div className="grid grid-cols-2 gap-x-32 gap-y-5 text-sm flex-1">
                    <Info label="Driver" value={`${driverDetail.firstname} ${driverDetail.lastname}`.trim() || "N/A"} />
                    <Info label="Mobile" value={driverDetail.mobile || "N/A"} />
                    <Info label="Email" value={driverDetail.email || "N/A"} />
                    <Info label="Gender" value={driverDetail.gender || "N/A"} />
                    <Info label="Organisation" value={driverDetail.organization_name || "N/A"} />
                    <Info label="Correspondence Address" value={driverDetail.correspondence_address || "N/A"} />
                    <Info label="Registration Number" value={vehicle?.registration_number ?? "N/A"} />
                    <Info label="Ride Date" value={fmt(ride?.start_time)} />
                    <Info label="Status" value={ride?.status === "open" ? "Active" : (ride?.status ?? "N/A")} />
                    <Info label="Leaving From" value={ride?.start_location ?? "N/A"} />
                    <Info label="Destination" value={ride?.end_location ?? "N/A"} />
                    <Info label="Price Per Person" value={ride?.price ? `₹${ride.price}` : "N/A"} />
                  </div>
                </div>
              </div>

              {/* Documents — Aadhaar Card */}
              {driverDetail.aadhar_documents.length > 0 && (
                <Section
                  title="Aadhaar Card"
                  icon={<FileCheck />}
                  right={
                    driverDetail.aadhar_documents[0].verified === 1 ? (
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
                    {driverDetail.aadhar_documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setPreviewImage({ url: doc.url, name: doc.name })}
                        className="border border-dashed border-gray-300 rounded p-3 flex flex-col items-center justify-center gap-2 hover:border-[#C72030] hover:bg-[#FFF5F5] transition-colors group"
                      >
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="object-contain h-20 w-full"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                          }}
                        />
                        <span className="text-xs text-gray-400 group-hover:text-[#C72030] transition-colors">Click to preview</span>
                        <p className="text-xs text-gray-500 text-center">
                          Submitted {new Date(doc.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* Documents — Driving License */}
              {driverDetail.driving_licenses.length > 0 && (
                <Section
                  title="Driving License"
                  icon={<FileCheck />}
                  right={
                    driverDetail.driving_licenses[0].verified === 1 ? (
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
                    {driverDetail.driving_licenses.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setPreviewImage({ url: doc.url, name: doc.name })}
                        className="border border-dashed border-gray-300 rounded p-3 flex flex-col items-center justify-center gap-2 hover:border-[#C72030] hover:bg-[#FFF5F5] transition-colors group"
                      >
                        <img
                          src={doc.url}
                          alt={doc.name}
                          className="object-contain h-20 w-full"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2'%3E%3Crect x='3' y='3' width='18' height='18' rx='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                          }}
                        />
                        <span className="text-xs text-gray-400 group-hover:text-[#C72030] transition-colors">Click to preview</span>
                        <p className="text-xs text-gray-500 text-center">
                          Submitted {new Date(doc.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </button>
                    ))}
                  </div>
                </Section>
              )}

              {/* Reports from driver_detail */}
              {driverDetail.reports_count > 0 && (
                <Section
                  title="Reports"
                  icon={<AlertCircle />}
                  right={
                    <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A] px-3 py-1.5 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      {driverDetail.reports[0]?.status ?? "Under Review"}
                    </Badge>
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Report:</p>
                      <Badge className="bg-[#E57373] text-white px-4 py-1 mb-2">
                        {driverDetail.reports_count} Report{driverDetail.reports_count > 1 ? "s" : ""}
                      </Badge>
                      {driverDetail.reports[0]?.report_date && (
                        <p className="text-sm text-gray-500">Reported On {driverDetail.reports[0].report_date}</p>
                      )}
                    </div>
                    <Button variant="outline" className="px-8" onClick={() => handleViewDriverReports()}>
                      View Reports
                    </Button>
                  </div>
                </Section>
              )}

              {/* Reviews from driver_detail */}
              <Section title="Reviews" icon={<Star />} right={undefined}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Reviews:</p>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-base font-medium">
                        {driverDetail.reviews_count > 0
                          ? `${(driverDetail.reviews.reduce((s, r) => s + r.ratings, 0) / driverDetail.reviews.length).toFixed(1)} Rating Out Of 5 (${driverDetail.reviews_count} review${driverDetail.reviews_count > 1 ? "s" : ""})`
                          : "No ratings yet"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="px-8"
                    onClick={() => navigate(`/pulse/carpool/ride-reviews?id=${ride?.id}&userId=${driverDetail.id}`)}
                  >
                    View Reviews
                  </Button>
                </div>
              </Section>
            </>
          )}
        </TabsContent>

        {/* ── Passenger's Detail Tab ────────────────────────────────────── */}
        <TabsContent value="Passenger's Detail">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Total User's</h2>
            <EnhancedTaskTable
              data={passengerTableData}
              columns={[
                { key: "actions",       label: "Action",         sortable: false, hideable: false, draggable: false },
                { key: "name",          label: "Name",           sortable: true,  hideable: true,  draggable: true  },
                { key: "gender",        label: "Gender",         sortable: true,  hideable: true,  draggable: true  },
                { key: "status",        label: "Status",         sortable: true,  hideable: true,  draggable: true  },
                { key: "joinedAt",      label: "Joined At",      sortable: true,  hideable: true,  draggable: true  },
                { key: "reportsCount",  label: "Reports",        sortable: true,  hideable: true,  draggable: true  },
              ]}
              renderRow={(p) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/user-detail?id=${p.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                name: p.name,
                gender: p.gender,
                status: (
                  <Badge className={p.status === "accepted" ? "bg-green-100 text-green-700 border-0" : "bg-gray-100 text-gray-600 border-0"}>
                    {p.status}
                  </Badge>
                ),
                joinedAt: p.joinedAt,
                reportsCount: p.reportsCount > 0 ? (
                  <button
                    className="text-[#C72030] underline text-sm"
                    onClick={() => handleViewReports(p._idx)}
                  >
                    {p.reportsCount} Report{p.reportsCount > 1 ? "s" : ""}
                  </button>
                ) : (
                  <span className="text-gray-400 text-sm">0</span>
                ),
              })}
              enableSearch={false}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={false}
              hideTableSearch={true}
              storageKey="passenger-detail-table"
              emptyMessage="No passengers found"
              exportFileName="passengers"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* Reusable helpers */
const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => (
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

