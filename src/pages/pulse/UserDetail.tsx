import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FileCheck, AlertCircle, Star, Eye } from "lucide-react";
import { EnhancedTaskTable } from "@/components/enhanced-table/EnhancedTaskTable";
import carGrayImage from "@/assets/car_gray.png";
import carBlackImage from "@/assets/car_black.png";
import carRedImage from "@/assets/car_red.png";
import carBeigeImage from "@/assets/car_beige.png";

export const UserDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("User's Detail");

  const userId = searchParams.get("id");

  // Mock user data for all passengers
  const allUsers = [
    {
      id: "1",
      name: "Hamza",
      emailAddress: "hamza.quasi@lockated.com",
      gender: "Male",
      accessCardNumber: "54647",
      correspondenceAddress:
        "1A / 1005, Tiger Peninsula, Cluster A Bavdhan, Pune.",
      mobileNumber: "+91 882818O163",
      emergencyContactNo: "+91 1234567890",
      organisation: "Lockated",
      designation: "UI/UX Designer",
      employeeNumber: "346347",
    },
    {
      id: "2",
      name: "Shahab",
      emailAddress: "shahab.khan@lockated.com",
      gender: "Male",
      accessCardNumber: "54647",
      correspondenceAddress:
        "2B / 2006, Green Valley, Cluster B Bavdhan, Pune.",
      mobileNumber: "+91 9876543210",
      emergencyContactNo: "+91 9876543210",
      organisation: "Lockated",
      designation: "Backend Developer",
      employeeNumber: "346347",
    },
    {
      id: "3",
      name: "Yukta",
      emailAddress: "yukta.jasal@lockated.com",
      gender: "Female",
      accessCardNumber: "64647",
      correspondenceAddress:
        "3C / 3007, Blue Heights, Cluster C Bavdhan, Pune.",
      mobileNumber: "+91 5555666677",
      emergencyContactNo: "+91 5555666677",
      organisation: "Lockated",
      designation: "Frontend Developer",
      employeeNumber: "346347",
    },
    {
      id: "4",
      name: "Rahul",
      emailAddress: "rahul.sharma@lockated.com",
      gender: "Male",
      accessCardNumber: "54647",
      correspondenceAddress:
        "4D / 4008, Sunset Plaza, Cluster D Bavdhan, Pune.",
      mobileNumber: "+91 8888999900",
      emergencyContactNo: "+91 8888999900",
      organisation: "Lockated",
      designation: "Full Stack Developer",
      employeeNumber: "346347",
    },
  ];

  // Find the user data based on ID from URL, default to first user if not found
  const userData = useMemo(() => {
    const user = allUsers.find((u) => u.id === userId);
    return user || allUsers[0];
  }, [userId]);

  const tabs = ["User's Detail", "Ride History"];

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
        &gt; <span className="text-gray-700">User Detail</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Ride History</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-12 py-3 text-sm font-medium ${
              activeTab === tab
                ? "bg-[#F3EFE8] text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "User's Detail" && (
        <>
          {/* User Detail Section */}
          <div className="border border-gray-200 mb-6">
            {/* Header */}
            <div className="bg-[#F9F7F4] px-6 py-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-[#FCE4E4] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#E91E63]" />
                </div>
                <h2 className="font-semibold text-base">User Detail</h2>
              </div>
            </div>

            {/* User Info */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-2 gap-x-32 gap-y-5 text-sm">
                <InfoField label="Name" value={userData.name} />
                <InfoField
                  label="Mobile Number"
                  value={userData.mobileNumber}
                />

                <InfoField
                  label="Email Address"
                  value={userData.emailAddress}
                />
                <InfoField
                  label="Emergency Contact No."
                  value={userData.emergencyContactNo}
                />

                <InfoField label="Gender" value={userData.gender} />
                <InfoField label="Organisation" value={userData.organisation} />

                <InfoField
                  label="Access Card Number"
                  value={userData.accessCardNumber}
                />
                <InfoField label="Designation" value={userData.designation} />

                <InfoField
                  label="Correspondence Address"
                  value={userData.correspondenceAddress}
                />
                <InfoField
                  label="Employee Number"
                  value={userData.employeeNumber}
                />
              </div>
            </div>
          </div>

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
            <div>
              <p className="text-sm text-gray-500 mb-2">Report:</p>
              <Badge className="bg-[#E57373] text-white px-4 py-1 mb-2">
                1 Report
              </Badge>
              <p className="text-sm text-gray-500">Reported On Oct 21, 2025</p>
            </div>
          </Section>

          {/* Reviews Section */}
          <Section title="Reviews" icon={<Star />} right={undefined}>
            <div>
              <p className="text-sm text-gray-500 mb-2">Reviews:</p>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-base font-medium">
                  4.2 Rating Out Of 5
                </span>
              </div>
              <button className="text-sm underline">View All Reviews</button>
            </div>
          </Section>
        </>
      )}

      {activeTab === "Ride History" && (
        <div className="space-y-6">
          <EnhancedTaskTable
            data={[
              {
                id: "1",
                carImage: carGrayImage,
                driver: "Hamza",
                registrationNumber: "MH 01 AB 2345",
                passengers: "Raj, Tiwari, Pooja",
                leavingFrom: "Panchshil Tech Park One",
                destination: "Pune Rly Station",
              },
              {
                id: "2",
                carImage: carBlackImage,
                driver: "Shahab",
                registrationNumber: "MH 12 CD 6789",
                passengers: "Raj, Tiwari, Pooja, Roh",
                leavingFrom: "Panchshil Tech Park One",
                destination: "Pune Rly Station",
              },
              {
                id: "3",
                carImage: carRedImage,
                driver: "Yukta",
                registrationNumber: "MH 04 GH 4455",
                passengers: "Raj, Tiwari, Pooja, Roh",
                leavingFrom: "Panchshil Tech Park One",
                destination: "Pune Rly Station",
              },
              {
                id: "4",
                carImage: carBeigeImage,
                driver: "Rahul",
                registrationNumber: "MH 12 ST 1010",
                passengers: "Raj, Tiwari, Pooja, Roh",
                leavingFrom: "Panchshil Tech Park One",
                destination: "Pune Rly Station",
              },
            ]}
            columns={[
              {
                key: "actions",
                label: "Action",
                sortable: false,
                hideable: false,
                draggable: false,
              },
              {
                key: "carImage",
                label: "Car Image",
                sortable: false,
                hideable: true,
                draggable: true,
              },
              {
                key: "driver",
                label: "Driver",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "registrationNumber",
                label: "Registration Number",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "passengers",
                label: "Passenger's",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "leavingFrom",
                label: "Leaving from",
                sortable: true,
                hideable: true,
                draggable: true,
              },
              {
                key: "destination",
                label: "Destination",
                sortable: true,
                hideable: true,
                draggable: true,
              },
            ]}
            renderRow={(ride) => ({
              actions: (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle view ride detail
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              ),
              carImage: (
                <img
                  src={ride.carImage}
                  alt="Car"
                  className="w-10 h-auto object-contain"
                />
              ),
              driver: ride.driver,
              registrationNumber: ride.registrationNumber,
              passengers: (
                <div className="max-w-[200px]">{ride.passengers}</div>
              ),
              leavingFrom: ride.leavingFrom,
              destination: ride.destination,
            })}
            enableSearch={true}
            hideColumnsButton={true}
            enableSelection={false}
            hideTableExport={true}  
            selectable={false}
            enableExport={true}
            hideTableSearch={true}
            storageKey="user-ride-history-table"
            emptyMessage="No ride history found"
            searchPlaceholder="Search rides..."
            exportFileName="ride-history"
          />
        </div>
      )}
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
  <div className="bg-[#FAF8F4] border border-gray-200 px-6 py-6 mb-6">
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
