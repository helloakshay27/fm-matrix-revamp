
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const FacilityBooking = () => {
  const [userType, setUserType] = useState('occupant');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    console.log('Submitting booking:', {
      userType,
      selectedUser,
      selectedFacility,
      selectedDate,
      comment
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Facility Booking</h1>
      </div>

      <div className="space-y-6">
        {/* User Type Selection */}
        <div className="space-y-3">
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="occupant"
                name="userType"
                value="occupant"
                checked={userType === 'occupant'}
                onChange={(e) => setUserType(e.target.value)}
                className="text-blue-600"
              />
              <Label htmlFor="occupant">Occupant User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="fm"
                name="userType"
                value="fm"
                checked={userType === 'fm'}
                onChange={(e) => setUserType(e.target.value)}
                className="text-blue-600"
              />
              <Label htmlFor="fm">FM User</Label>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
                <SelectItem value="user3">Mike Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Facility Selection */}
          <div className="space-y-2">
            <Label htmlFor="facility">Facility</Label>
            <Select value={selectedFacility} onValueChange={setSelectedFacility}>
              <SelectTrigger>
                <SelectValue placeholder="Select Facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting-room-1">Meeting Room 1</SelectItem>
                <SelectItem value="meeting-room-2">Meeting Room 2</SelectItem>
                <SelectItem value="conference-hall">Conference Hall</SelectItem>
                <SelectItem value="training-room">Training Room</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Select Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your comment here..."
            className="min-h-[100px]"
          />
        </div>

        {/* Select Slot Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Slot</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Available time slots will appear here based on selected facility and date.</p>
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payment Method</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Payment options will be displayed here.</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSubmit}
            className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>

        {/* Policy Links */}
        <div className="flex gap-6 pt-4 border-t">
          <button className="text-orange-500 hover:text-orange-600 text-sm">
            Cancellation Policy
          </button>
          <button className="text-orange-500 hover:text-orange-600 text-sm">
            Terms & Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacilityBooking;
