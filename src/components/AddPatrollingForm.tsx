
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X } from "lucide-react";

interface AddPatrollingFormProps {
  onClose: () => void;
}

export const AddPatrollingForm = ({ onClose }: AddPatrollingFormProps) => {
  const [frequencyType, setFrequencyType] = useState("every");
  const [selectedHours, setSelectedHours] = useState<string[]>([]);

  const handleHourToggle = (hour: string) => {
    setSelectedHours(prev => 
      prev.includes(hour) 
        ? prev.filter(h => h !== hour)
        : [...prev, hour]
    );
  };

  const hours = [
    "00", "01", "02", "03", "04", "05",
    "06", "07", "08", "09", "10", "11",
    "12", "13", "14", "15", "16", "17",
    "18", "19", "20", "21", "22", "23"
  ];

  return (
    <div className="space-y-6">
      {/* Building, Wing, Floor, Room */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="building">Building*</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Building" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="building1">Building 1</SelectItem>
              <SelectItem value="building2">Building 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="wing">Wing</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Wing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wing1">Wing A</SelectItem>
              <SelectItem value="wing2">Wing B</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="floor">Floor</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="floor1">Floor 1</SelectItem>
              <SelectItem value="floor2">Floor 2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="room">Room</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="room1">Room 1</SelectItem>
              <SelectItem value="room2">Room 2</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grace Time */}
      <div>
        <Label htmlFor="graceTime">Grace Time (Hours)</Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Hours" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Hour</SelectItem>
            <SelectItem value="2">2 Hours</SelectItem>
            <SelectItem value="3">3 Hours</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-gray-500 mt-1">Select grace period in hours (1 to 12)</p>
      </div>

      {/* Frequency */}
      <div>
        <Label className="text-base font-medium">Frequency</Label>
        
        <div className="mt-3 space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="dateValidity" 
              className="rounded"
            />
            <Label htmlFor="dateValidity" className="text-sm">Date Validity</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time*</Label>
              <Select defaultValue="12:00 AM">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12:00 AM">12:00 AM</SelectItem>
                  <SelectItem value="1:00 AM">1:00 AM</SelectItem>
                  <SelectItem value="2:00 AM">2:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="endTime">End Time*</Label>
              <Select defaultValue="11:00 PM">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                  <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                  <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <RadioGroup value={frequencyType} onValueChange={setFrequencyType} className="mt-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="every" id="every" />
              <Label htmlFor="every" className="flex items-center gap-2">
                Every 
                <Select defaultValue="1">
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                  </SelectContent>
                </Select>
                hour(s)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="specific" />
              <Label htmlFor="specific">Specific Time</Label>
            </div>
          </RadioGroup>

          {frequencyType === "specific" && (
            <div className="mt-4">
              <div className="grid grid-cols-6 gap-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    type="button"
                    variant={selectedHours.includes(hour) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleHourToggle(hour)}
                    className={`h-8 text-xs ${
                      selectedHours.includes(hour) 
                        ? 'bg-[#C72030] hover:bg-[#C72030]/90 text-white border-[#C72030]' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          style={{ backgroundColor: '#C72030' }}
          className="hover:bg-[#C72030]/90 text-white px-8 border-0"
          onClick={onClose}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};
