import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const BookingSetupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app this would come from API based on id
  const [bookingData] = useState({
    facilityName: "conference room now",
    active: true,
    department: "Slot",
    appKey: "TEST123",
    paymentPortland: false,
    paymentPrepaid: true,
    paymentGSTN: "05",
    configureSlotData: {
      startTime: "09",
      endTime: "18",
      bookTimeSlots: "30",
      breakTimeEnd: "30",
      consumptionSlots: "30",
      slotBy: "30",
      wrapTime: "15"
    },
    perSlotCharge: "1000.0",
    bookingAllowedService: true,
    allowMultipleSlots: true,
    facilityCanBeBooked: true,
    viewPerSlotByUser: true,
    seaterInfo: "8 Seater"
  });

  const handleBack = () => {
    navigate('/vas/booking/setup');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4 p-0 h-auto font-normal text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Booking Setup &gt; Booking Setup List
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">BOOKING SETUP DETAIL</h1>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="p-6">
              {/* Radio buttons */}
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="bookable" 
                    name="type" 
                    value="bookable" 
                    defaultChecked 
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="bookable" className="text-sm font-medium">Bookable</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="radio" 
                    id="request" 
                    name="type" 
                    value="request" 
                    disabled
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="request" className="text-sm font-medium">Request</label>
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium">
                    Facility Name<span className="text-red-500">*</span>
                  </Label>
                  <Input value={bookingData.facilityName} className="mt-1" readOnly />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Active<span className="text-red-500">*</span>
                  </Label>
                  <Select value="Yes" disabled>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Department</Label>
                  <Select value={bookingData.department} disabled>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Slot">Slot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configure App Key */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                CONFIGURE APP KEY
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium">App Key</Label>
                <Input value={bookingData.appKey} className="mt-1" readOnly />
              </div>
            </CardContent>
          </Card>

          {/* Configure Payment */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                CONFIGURE PAYMENT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={bookingData.paymentPortland} disabled />
                  <Label className="text-sm">Portland</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={bookingData.paymentPrepaid} disabled />
                  <Label className="text-sm">Prepaid</Label>
                </div>
                <div>
                  <Label className="text-sm font-medium">Complimentary</Label>
                  <div className="mt-1 text-sm text-gray-500">Not configured</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">GST(%) :</Label>
                  <Input value={bookingData.paymentGSTN} className="mt-1" readOnly />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configure Slot */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                CONFIGURE SLOT
                <Button size="sm" className="ml-auto bg-[#C72030] hover:bg-[#A01E2A] text-white">
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-600">Start Time</Label>
                  <Select value={bookingData.configureSlotData.startTime} disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Break Time Start</Label>
                  <Select disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Break Time End</Label>
                  <Select value={bookingData.configureSlotData.breakTimeEnd} disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">End Time</Label>
                  <Select value={bookingData.configureSlotData.endTime} disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Consumption Slots</Label>
                  <Select value={bookingData.configureSlotData.consumptionSlots} disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Slot by</Label>
                  <Select value={bookingData.configureSlotData.slotBy} disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Wrap Time</Label>
                  <Select value={bookingData.configureSlotData.wrapTime} disabled>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
              <div className="text-right">
                <Select disabled>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue placeholder="15 Minutes" />
                  </SelectTrigger>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Charge Setup */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
                CHARGE SETUP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Per Slot Charge:</Label>
                  <Input value={bookingData.perSlotCharge} className="mt-1 w-32" readOnly />
                </div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium">Booking Allowed Service :</Label>
                    <div className="mt-1 text-sm">{bookingData.bookingAllowedService ? 'Yes' : 'No'}</div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Allow Booking</Label>
                      <Switch disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Allow Booking</Label>
                      <Switch disabled />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Can Cancel Before Schedule</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Day</Label>
                        <Switch disabled />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Hr</Label>
                        <Switch disabled />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Slot Setup */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">5</span>
                SLOT SETUP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch checked={bookingData.allowMultipleSlots} disabled />
                  <Label className="text-sm">Allow Multiple Slots</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={bookingData.facilityCanBeBooked} disabled />
                  <Label className="text-sm">Facility can be booked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={bookingData.viewPerSlotByUser} disabled />
                  <Label className="text-sm">View per slot by User</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Image & Booking Summary Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                  <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">6</span>
                  COVER IMAGE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drop & Drop or Choose file</p>
                  <p className="text-xs text-gray-400 mt-1">Accepted file formats: JPG/JPEG (format: 516px, width: 516px), max 2 MB</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                  <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">6</span>
                  Booking Summary Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Drop & Drop or Choose file</p>
                  <p className="text-xs text-gray-400 mt-1">Accepted file formats: JPG/JPEG (format: 516px, width: 516px), max 2 MB</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">7</span>
                DESCRIPTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Enter description..." 
                className="min-h-[100px]" 
                readOnly 
              />
            </CardContent>
          </Card>

          {/* Terms & Conditions and Cancellation Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                  <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">8</span>
                  TERMS & CONDITIONS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter terms and conditions..." 
                  className="min-h-[100px]" 
                  readOnly 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                  <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">8</span>
                  CANCELLATION TEXT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea 
                  placeholder="Enter cancellation text..." 
                  className="min-h-[100px]" 
                  readOnly 
                />
              </CardContent>
            </Card>
          </div>

          {/* Block Days */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">9</span>
                BLOCK DAYS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Select Days</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" disabled />
                      <Label className="text-sm">Define Day</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" disabled />
                      <Label className="text-sm">Selected Days</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Block Start</Label>
                  <div className="mt-1 text-sm text-gray-500">No data</div>
                  <Label className="text-sm font-medium mt-4 block">Block Reason</Label>
                  <div className="mt-1 text-sm text-gray-500">No data</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configure Amenity Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">10</span>
                CONFIGURE AMENITY INFO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">TV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">Whiteboard</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">Cooking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">Sound bar for TV</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">Wireless Charging</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" disabled />
                  <Label className="text-sm">Meeting Room - Hartomy</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seater Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">11</span>
                SEATER INFO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium">Seater Info</Label>
                <Select value={bookingData.seaterInfo} disabled>
                  <SelectTrigger className="mt-1 w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8 Seater">8 Seater</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Floor Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">12</span>
                FLOOR INFO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium">Floor Info</Label>
                <Select disabled>
                  <SelectTrigger className="mt-1 w-48">
                    <SelectValue placeholder="1st Floor" />
                  </SelectTrigger>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shared Content Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-[#C72030] flex items-center">
                <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-3">13</span>
                Shared Content Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Text content will appear on booking room share icon in Application
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};