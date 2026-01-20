import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const RideDetail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("Ride Details");

  // Mock ride data - in production this would come from an API
  const rideData = {
    driver: "Hamza",
    registrationNumber: "MH 01 AB 2345",
    departureTime: "10:00 AM",
    rideDate: "13 October 2025",
    bookingDate: "13 October 2025",
    passengers: "Raj, Tiwari, Pooja",
    expectedArrivalTime: "10:30 AM",
    seat: "3/4",
    genderPreference: "All",
    status: "Active",
    leavingFrom: "Panchshil Teck Park One",
    destination: "Pune Rly Station",
    pricePerPerson: "₹250",
  };

  const tabs = ["Ride Details", "Car Detail", "Driver's Detail", "Passenger's Detail"];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <button 
            onClick={handleBack}
            className="hover:text-gray-900 transition-colors cursor-pointer"
          >
            Carpool
          </button>
          <span>&gt;</span>
          <span className="text-gray-900 font-medium">Ride Detail</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-gray-900 bg-[#F6F4EE] border-b-2 border-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Ride Details Tab */}
      {activeTab === "Ride Details" && (
        <div className="space-y-6">
          {/* Header with Report Button */}
          <Card className="bg-[#F6F4EE]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#C72030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Ride Detail</h2>
                </div>
                <Button className="bg-[#C72030] hover:bg-[#A01828] text-white">
                  <span className="mr-2">⚠</span> Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ride Information Grid */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-500">Driver</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.driver}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ride Date</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.rideDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Booking Date</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.bookingDate}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        {rideData.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Price Per Person</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.pricePerPerson}</p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-500">Registration Number</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.registrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Passenger's</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.passengers}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Seat</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.seat}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Leaving From</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.leavingFrom}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Destination</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.destination}</p>
                  </div>
                </div>

                {/* Full Width Items */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                  <div>
                    <label className="text-sm text-gray-500">Departure Time</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.departureTime}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Expected Arrival Time</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.expectedArrivalTime}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Gender Preference</label>
                    <p className="text-base font-medium text-gray-900 mt-1">{rideData.genderPreference}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attachment Section */}
          <Card className="bg-[#F6F4EE]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#C72030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Attachment</h3>
              </div>
              
              <div>
                <label className="text-sm text-gray-500 mb-3 block">Car Image</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center bg-white">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Other Tabs - Placeholder Content */}
      {activeTab === "Car Detail" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Car details will be displayed here.</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "Driver's Detail" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Driver's details will be displayed here.</p>
          </CardContent>
        </Card>
      )}

      {activeTab === "Passenger's Detail" && (
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500">Passenger's details will be displayed here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
