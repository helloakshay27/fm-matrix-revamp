import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Bike } from "lucide-react";

interface ParkingSlot {
  id: string;
  number: string;
  status: "occupied" | "vacant";
  type: "car" | "bike";
  bookingId?: number;
  userName?: string;
  scheduledDate?: string;
}

interface ParkingFloorLayoutProps {
  floor?: string;
  building?: string;
  slots?: ParkingSlot[];
  onSlotClick?: (slot: ParkingSlot) => void;
}

export const ParkingFloorLayout: React.FC<ParkingFloorLayoutProps> = ({
  floor = "G (Live)",
  building = "Main Building",
  slots = [],
  onSlotClick,
}) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<"car" | "bike">("car");

  // Generate default slots if none provided
  const defaultSlots: ParkingSlot[] = Array.from({ length: 36 }, (_, i) => ({
    id: `S-${i + 1}`,
    number: `S-${i + 1}`,
    status: [1, 5, 9, 13, 17, 21, 25, 29, 33].includes(i + 1) ? "occupied" : "vacant",
    type: i % 2 === 0 ? "car" : "bike",
  }));

  const parkingSlots = slots.length > 0 ? slots : defaultSlots;

  // Filter slots by vehicle type
  const filteredSlots = parkingSlots.filter(
    (slot) => slot.type === selectedVehicleType
  );

  const handleSlotClick = (slot: ParkingSlot) => {
    if (onSlotClick) {
      onSlotClick(slot);
    }
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-[#1A1A1A]">
            Floor Layout – {floor}
          </CardTitle>
          
          {/* Vehicle Type Toggle */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setSelectedVehicleType("car")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedVehicleType === "car"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <Car className="w-4 h-4" />
              CAR
            </button>
            <button
              onClick={() => setSelectedVehicleType("bike")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                selectedVehicleType === "bike"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              <Bike className="w-4 h-4" />
              BIKE
            </button>
          </div>

          {/* Building/Floor Selector - Optional */}
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 border border-gray-200 rounded-md text-sm bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#C72030]">
              <option>G</option>
              <option>1st Floor</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Parking Grid */}
        <div className="grid grid-cols-6 gap-3">
          {filteredSlots.map((slot) => {
            const Icon = slot.type === "car" ? Car : Bike;
            const isOccupied = slot.status === "occupied";
            
            return (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot)}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                  isOccupied
                    ? "bg-[#EF4444] border-[#DC2626] text-white hover:bg-[#DC2626]"
                    : "bg-[#F3F4F6] border-[#E5E7EB] text-[#6B7280] hover:bg-[#E5E7EB]"
                }`}
              >
                {/* Slot Number */}
                <div className={`text-xs font-medium mb-2 ${
                  isOccupied ? "text-white" : "text-[#1F2937]"
                }`}>
                  {slot.number}
                </div>

                {/* Vehicle Icon */}
                <Icon className={`w-6 h-6 ${
                  isOccupied ? "text-white" : "text-[#6B7280]"
                }`} />

                {/* Status Indicator */}
                {slot.userName && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white"></div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#EF4444] border border-[#DC2626]"></div>
            <span className="text-sm text-[#6B7280]">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#F3F4F6] border border-[#E5E7EB]"></div>
            <span className="text-sm text-[#6B7280]">Vacant</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
