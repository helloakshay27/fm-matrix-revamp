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
} from "lucide-react";
import axios from "axios";
import carGrayImage from "@/assets/car_gray.png";
import carBlackImage from "@/assets/car_black.png";
import carRedImage from "@/assets/car_red.png";
import carBeigeImage from "@/assets/car_beige.png";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";

// Mock ride data - same structure as in CarpoolDashboard
const allRides = [
  {
    id: "1",
    driver: "Hamza",
    registrationNumber: "MH 01 AB 2345",
    passengers: "Raj, Tiwari, Pooja",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carGrayImage,
    carModel: "Maruti Suzuki Wagonr",
    carColor: "White",
    status: "Active",
    departureTime: "10:00 AM",
    rideDate: "13 October 2025",
    bookingDate: "13 October 2025",
    expectedArrivalTime: "10:30 AM",
    seat: "3/4",
    genderPreference: "All",
    pricePerPerson: "₹250",
    emergencyContact: "+91 1234567890",
    passengersList: [],
  },
  {
    id: "2",
    driver: "Shahab",
    registrationNumber: "MH 12 CD 6789",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carBlackImage,
    carModel: "Honda City",
    carColor: "Black",
    status: "Active",
    departureTime: "11:00 AM",
    rideDate: "13 October 2025",
    bookingDate: "12 October 2025",
    expectedArrivalTime: "11:30 AM",
    seat: "4/4",
    genderPreference: "All",
    pricePerPerson: "₹260",
    emergencyContact: "+91 9876543210",
    passengersList: [],
  },
  {
    id: "3",
    driver: "Yukta",
    registrationNumber: "MH 04 GH 4455",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carRedImage,
    carModel: "Hyundai Verna",
    carColor: "Red",
    status: "Active",
    departureTime: "12:00 PM",
    rideDate: "13 October 2025",
    bookingDate: "11 October 2025",
    expectedArrivalTime: "12:30 PM",
    seat: "3/4",
    genderPreference: "Female",
    pricePerPerson: "₹270",
    emergencyContact: "+91 5555666677",
    passengersList: [],
  },
  {
    id: "4",
    driver: "Rahul",
    registrationNumber: "MH 12 ST 1010",
    passengers: "Raj, Tiwari, Pooja, Rohan",
    leavingFrom: "Panchshil Tech Park One",
    destination: "Pune Rly Station",
    carImage: carBeigeImage,
    carModel: "Toyota Etios",
    carColor: "Beige",
    status: "Active",
    departureTime: "1:00 PM",
    rideDate: "13 October 2025",
    bookingDate: "13 October 2025",
    expectedArrivalTime: "1:30 PM",
    seat: "2/4",
    genderPreference: "Male",
    pricePerPerson: "₹240",
    emergencyContact: "+91 8888999900",
    passengersList: [],
  },
];

export const RideDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("Ride Details");

  // API state management
  const [apiRide, setApiRide] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rideId = searchParams.get("id");

  // Initialize baseUrl if not set
  useEffect(() => {
    if (!localStorage.getItem("baseUrl")) {
      localStorage.setItem("baseUrl", "pulse-api.lockated.com");
      console.log("✓ baseUrl initialized to: pulse-api.lockated.com");
    }
  }, []);

  const baseUrl = localStorage.getItem("baseUrl");
  const token = localStorage.getItem("token");

  // Fetch ride detail from API
  useEffect(() => {
    const fetchRideDetail = async () => {
      // Debug logging
      console.log("=== API Call Debug Info ===");
      console.log("rideId:", rideId);
      console.log("baseUrl:", baseUrl);
      console.log("token:", token ? `${token.substring(0, 20)}...` : "null");
      console.log("Full URL:", `https://${baseUrl}/rides/${rideId}.json`);

      if (!rideId || !baseUrl || !token) {
        console.log("⚠️ API call skipped - Missing required values:");
        console.log("- rideId:", rideId ? "✓" : "✗");
        console.log("- baseUrl:", baseUrl ? "✓" : "✗");
        console.log("- token:", token ? "✓" : "✗");
        setLoading(false);
        return;
      }

      console.log("✓ Making API call...");
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://${baseUrl}/rides/${rideId}.json`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("✓ API Response:", response.data);
        setApiRide(response.data);
      } catch (err: any) {
        console.error("✗ API Error:", err);
        console.error("✗ Error response:", err.response?.data);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetail();
  }, [rideId, baseUrl, token]);

  // Map API data to UI format, or fallback to mock data
  const rideData = useMemo(() => {
    // If we have API data, use it
    if (apiRide) {
      // Helper function to format date/time
      const formatDateTime = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const formatTime = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

      // Map API response to UI format
      return {
        id: apiRide.id?.toString() || rideId || "1",
        driver: apiRide.driver?.name || "N/A",
        registrationNumber: apiRide.vehicle?.registration_number || "N/A",
        passengers:
          apiRide.passengers?.map((p: any) => p.name).join(", ") ||
          "No passengers yet",
        leavingFrom: apiRide.start_location || "N/A",
        destination: apiRide.end_location || "N/A",
        carImage: apiRide.vehicle?.attachments?.[0] || carGrayImage, // Fallback to default image
        carModel: apiRide.vehicle?.car_model_name || "N/A",
        carColor: apiRide.vehicle?.colour || "N/A",
        status: apiRide.status === "open" ? "Active" : apiRide.status || "N/A",
        departureTime: formatTime(apiRide.start_time),
        rideDate: formatDate(apiRide.start_time),
        bookingDate: formatDate(apiRide.created_at),
        expectedArrivalTime: formatTime(apiRide.end_time),
        seat: `${apiRide.passengers?.length || 0}/${apiRide.available_seats || 0}`,
        genderPreference:
          apiRide.gender_preference === "all"
            ? "All"
            : apiRide.gender_preference || "All",
        pricePerPerson: `₹${apiRide.price || 0}`,
        emergencyContact: "+91 1234567890", // Not in API response, using default
        driverGender: apiRide.driver?.gender || "N/A",
        driverImage: apiRide.driver?.profile_image_url || "",
        driverRating: apiRide.driver?.rating || "N/A",
        passengersList: apiRide.passengers || [],
      };
    }

    // Fallback to mock data if API data is not available
    const ride = allRides.find((r) => r.id === rideId);
    return ride || allRides[0];
  }, [apiRide, rideId]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  // Show error state
  if (error && !apiRide) {
    return (
      <div className="bg-white px-6 py-4">
        <div className="text-sm text-gray-500 mb-6">
          <span
            className="cursor-pointer hover:text-gray-700"
            onClick={() => navigate(-1)}
          >
            Carpool
          </span>{" "}
          &gt; <span className="text-gray-700">Ride Detail</span>
        </div>
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="w-12 h-12 text-[#C72030] mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Failed to Load Ride Details
          </h2>
          <p className="text-gray-500 mb-4">{error}</p>
          {!token && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4 max-w-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Authentication token is missing. Please
                ensure you're logged in.
              </p>
            </div>
          )}
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white px-6 py-4">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <span
          className="cursor-pointer hover:text-gray-700"
          onClick={() => navigate(-1)}
        >
          Carpool
        </span>{" "}
        &gt; <span className="text-gray-700">Ride Detail</span>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border">
          <TabsTrigger
            value="Ride Details"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Ride Details
          </TabsTrigger>
          <TabsTrigger
            value="Car Detail"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Car Detail
          </TabsTrigger>
          <TabsTrigger
            value="Driver's Detail"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Driver's Detail
          </TabsTrigger>
          <TabsTrigger
            value="Passenger's Detail"
            className="data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none"
          >
            Passenger's Detail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Ride Details">
          {/* Ride Detail Section - Combined Header and Info */}
          <div className="border border-gray-200 mb-6">
            {/* Header */}
            <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E91E63]" />
                </div>
                <h2 className="font-semibold text-base">Ride Detail</h2>
              </div>
              <Badge className="bg-[#E57373] hover:bg-[#E57373] text-white px-4 py-1.5 text-sm rounded">
                1 Report
              </Badge>
            </div>

            {/* Info Grid */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-3 gap-x-20 gap-y-5 text-sm">
                <Info label="Driver" value={rideData.driver} />
                <Info
                  label="Registration Number"
                  value={rideData.registrationNumber}
                />
                <Info label="Departure Time" value={rideData.departureTime} />

                <Info label="Ride Date" value={rideData.rideDate} />
                <Info label="Passenger's" value={rideData.passengers} />
                <Info
                  label="Expected Arrival Time"
                  value={rideData.expectedArrivalTime}
                />

                <Info label="Booking Date" value={rideData.bookingDate} />
                <Info label="Seat" value={rideData.seat} />
                <Info
                  label="Gender Preference"
                  value={rideData.genderPreference}
                />

                <Info label="Status" value={rideData.status} />
                <Info label="Leaving From" value={rideData.leavingFrom} />

                <Info
                  label="Price Per Person"
                  value={rideData.pricePerPerson}
                />
                <Info label="Destination" value={rideData.destination} />
              </div>
            </div>
          </div>

          {/* Attachment */}
          <Section title="Attachment" icon={<Paperclip />} right={undefined}>
            <p className="font-semibold mb-4">Car Image</p>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-dashed border-gray-400 p-4 flex items-center justify-center"
                >
                  <img
                    src={rideData.carImage}
                    className="object-contain h-24"
                    alt={`Car ${i}`}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Reports */}
          <Section
            title="Reports"
            icon={<AlertCircle />}
            right={
              <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A]">
                Under Review
              </Badge>
            }
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-2">Report:</p>
                <Badge className="bg-[#E57373] text-white px-4 py-1 mb-2">
                  1 Report
                </Badge>
                <p className="text-sm text-gray-500">
                  Reported On Oct 21, 2025
                </p>
              </div>
              <Button variant="outline" className="px-8">
                View Reports
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="Car Detail">
          {/* Car Detail Section */}
          <div className="border border-gray-200 mb-6">
            {/* Header */}
            <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E91E63]" />
                </div>
                <h2 className="font-semibold text-base">Car Detail</h2>
              </div>
            </div>

            {/* Car Info */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-x-32 gap-y-5 text-sm">
                <Info label="Driver" value={rideData.driver} />
                <Info
                  label="Registration Number"
                  value={rideData.registrationNumber}
                />

                <Info label="Car Model Name" value={rideData.carModel} />
                <Info label="Seat" value={rideData.seat} />

                <Info label="Car Color" value={rideData.carColor} />
              </div>
            </div>
          </div>

          {/* Attachment Section */}
          <Section title="Attachment" icon={<Paperclip />} right={undefined}>
            <p className="font-semibold mb-4">Car Image</p>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-dashed border-gray-400 p-4 flex items-center justify-center"
                >
                  <img
                    src={rideData.carImage}
                    className="object-contain h-24"
                    alt={`Car ${i}`}
                  />
                </div>
              ))}
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="Driver's Detail">
          {/* Driver's Detail Section */}
          <div className="border border-gray-200 mb-6">
            {/* Header */}
            <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E91E63]" />
                </div>
                <h2 className="font-semibold text-base">Driver's Detail</h2>
              </div>
            </div>

            {/* Driver Info */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-x-32 gap-y-5 text-sm">
                <Info label="Driver" value={rideData.driver} />
                <Info
                  label="Registration Number"
                  value={rideData.registrationNumber}
                />

                <Info label="Ride Date" value={rideData.rideDate} />
                <Info
                  label="Gender Preference"
                  value={rideData.genderPreference}
                />

                <Info label="Booking Date" value={rideData.bookingDate} />
                <Info label="Leaving From" value={rideData.leavingFrom} />

                <Info label="Status" value={rideData.status} />
                <Info label="Destination" value={rideData.destination} />

                <Info label="Seat" value={rideData.seat} />
                <Info
                  label="Emergency Contact No."
                  value={rideData.emergencyContact}
                />

                <Info
                  label="Price Per Person"
                  value={rideData.pricePerPerson}
                />
              </div>
            </div>
          </div>

          {/* Attachment Section */}
          <Section title="Attachment" icon={<Paperclip />} right={undefined}>
            <p className="font-semibold mb-4">Car Image</p>
            <div className="grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border border-dashed border-gray-400 p-4 flex items-center justify-center"
                >
                  <img
                    src={rideData.carImage}
                    className="object-contain h-24"
                    alt={`Car ${i}`}
                  />
                </div>
              ))}
            </div>
          </Section>

          {/* Documents Section */}
          <Section
            title="Documents"
            icon={<FileCheck />}
            right={
              <Badge className="bg-[#E8F5E9] text-[#2E7D32] border-0 flex items-center gap-1.5 px-3 py-1.5">
                <div className="w-4 h-4 rounded-full bg-[#4CAF50] flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Verified
              </Badge>
            }
          >
            <div>
              <p className="text-sm text-gray-500 mb-2">Documents Submitted</p>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Driving License</span>
                <FileText className="w-4 h-4 text-gray-400 ml-4" />
                <span className="text-sm">Aadhaar Card</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Submitted On Dec 15, 2024
              </p>
            </div>
          </Section>

          {/* Reports Section */}
          <Section
            title="Reports"
            icon={<AlertCircle />}
            right={
              <Badge className="bg-[#FFF7CC] text-[#8A6D1D] border border-[#F5E08A] px-3 py-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                Under Review
              </Badge>
            }
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-2">Report:</p>
                <Badge className="bg-[#E57373] text-white px-4 py-1 mb-2">
                  1 Report
                </Badge>
                <p className="text-sm text-gray-500">
                  Reported On Oct 21, 2025
                </p>
              </div>
              <Button variant="outline" className="px-8">
                View Reports
              </Button>
            </div>
          </Section>

          {/* Reviews Section */}
          <Section title="Reviews" icon={<Star />} right={undefined}>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 mb-2">Reviews:</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-base font-medium">
                    4.2 Rating Out Of 5
                  </span>
                </div>
              </div>
              <Button variant="outline" className="px-8">
                View Reviews
              </Button>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="Passenger's Detail">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Total User's</h2>

            {/* Passengers Table with EnhancedTaskTable */}
            <EnhancedTaskTable
              data={
                rideData.passengersList && rideData.passengersList.length > 0
                  ? rideData.passengersList.map(
                      (passenger: any, index: number) => ({
                        id: passenger.id?.toString() || index.toString(),
                        accessCardNumber: passenger.access_card_number || "N/A",
                        name: passenger.name || "N/A",
                        mobileNumber:
                          passenger.mobile_number || passenger.phone || "N/A",
                        emailAddress: passenger.email || "N/A",
                        employeeNumber: passenger.employee_number || "N/A",
                        gender: passenger.gender || "N/A",
                      })
                    )
                  : [] // Empty array when no passengers
              }
              columns={[
                {
                  key: "actions",
                  label: "Action",
                  sortable: false,
                  hideable: false,
                  draggable: false,
                },
                {
                  key: "accessCardNumber",
                  label: "Access card Number",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "name",
                  label: "Name",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "mobileNumber",
                  label: "Mobile Number",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "emailAddress",
                  label: "Email Address",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "employeeNumber",
                  label: "Employee Number",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
                {
                  key: "gender",
                  label: "Gender",
                  sortable: true,
                  hideable: true,
                  draggable: true,
                },
              ]}
              renderRow={(passenger) => ({
                actions: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pulse/carpool/user-detail?id=${passenger.id}`);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ),
                accessCardNumber: passenger.accessCardNumber,
                name: passenger.name,
                mobileNumber: passenger.mobileNumber,
                emailAddress: passenger.emailAddress,
                employeeNumber: passenger.employeeNumber,
                gender: passenger.gender,
              })}
              enableSearch={true}
              hideColumnsButton={true}
              enableSelection={false}
              hideTableExport={true}
              selectable={false}
              enableExport={true}
              hideTableSearch={true}
              storageKey="passenger-detail-table"
              emptyMessage="No passengers found"
              searchPlaceholder="Search passengers..."
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
  <div className="bg-[#FAF8F4] border border-gray-200 px-6 py-6 mb-8">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#EFE7DB] flex items-center justify-center text-[#E11D48]">
          {icon}
        </div>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {right}
    </div>
    {children}
  </div>
);
