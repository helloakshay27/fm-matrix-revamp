
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";

interface BookingSetupFormProps {
  onClose: () => void;
}

export const BookingSetupForm: React.FC<BookingSetupFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    facilityName: '',
    isBookable: true,
    isRequest: false,
    active: 'Select',
    department: 'Select Department',
    appKey: '',
    postpaid: false,
    prepaid: false,
    payOnFacility: false,
    complimentary: false,
    gstPercentage: '0.0',
    sgstPercentage: '',
    perSlotCharge: '0.0',
    bookingAllowedBefore: { day: 'd', hour: 'h', minute: 'm' },
    advanceBooking: { day: 'd', hour: 'h', minute: 'm' },
    canCancelBefore: { day: 'd', hour: 'h', minute: 'm' },
    allowMultipleSlots: false,
    facilityBookedTimes: '',
    termsConditions: '',
    cancellationText: '',
    amenities: {
      tv: false,
      whiteboard: false,
      casting: false,
      smartPenForTV: false,
      wirelessCharging: false,
      meetingRoomInventory: false
    },
    seaterInfo: 'Select a seater',
    floorInfo: 'Select a floor',
    sharedContentInfo: 'Text content will appear on meeting room share icon in Application'
  });

  const [slots, setSlots] = useState([
    {
      startTime: { hour: '00', minute: '00' },
      breakTimeStart: { hour: '00', minute: '00' },
      breakTimeEnd: { hour: '00', minute: '00' },
      endTime: { hour: '00', minute: '00' },
      concurrentSlots: '',
      slotBy: '15 Minutes',
      wrapTime: ''
    }
  ]);

  const [cancellationRules, setCancellationRules] = useState([
    {
      description: 'If user cancel the booking selected hours/days prior to schedule given percentage of amount will be deducted',
      time: { type: 'Hr', value: '00' },
      deduction: ''
    },
    {
      description: 'If user cancel the booking selected hours/days prior to schedule given percentage of amount will be deducted',
      time: { type: 'Hr', value: '00' },
      deduction: ''
    },
    {
      description: 'If user cancel the booking selected hours/days prior to schedule given percentage of amount will be deducted',
      time: { type: 'Hr', value: '00' },
      deduction: ''
    }
  ]);

  const handleSave = () => {
    console.log('Saving booking setup:', formData);
    onClose();
  };

  const addSlot = () => {
    setSlots([...slots, {
      startTime: { hour: '00', minute: '00' },
      breakTimeStart: { hour: '00', minute: '00' },
      breakTimeEnd: { hour: '00', minute: '00' },
      endTime: { hour: '00', minute: '00' },
      concurrentSlots: '',
      slotBy: '15 Minutes',
      wrapTime: ''
    }]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 pt-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 mb-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50">
          <div>
            <p className="text-sm text-gray-600 mb-1">Booking Setup List &gt; New Booking Setup</p>
            <h2 className="text-xl font-bold text-gray-800">NEW BOOKING SETUP</h2>
          </div>
          <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="facilityName">Facility Name*</Label>
              <Input
                id="facilityName"
                placeholder="Enter Facility Name"
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
              />
            </div>
            <div>
              <Label>Active*</Label>
              <Select value={formData.active} onValueChange={(value) => setFormData({ ...formData, active: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select">Select</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select Department">Select Department</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Radio Buttons */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="bookable"
                name="type"
                checked={formData.isBookable}
                onChange={() => setFormData({ ...formData, isBookable: true, isRequest: false })}
                className="text-blue-600"
              />
              <Label htmlFor="bookable">Bookable</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="request"
                name="type"
                checked={formData.isRequest}
                onChange={() => setFormData({ ...formData, isBookable: false, isRequest: true })}
                className="text-blue-600"
              />
              <Label htmlFor="request">Request</Label>
            </div>
          </div>

          {/* Configure App Key */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-orange-600">CONFIGURE APP KEY</h3>
            </div>
            <div>
              <Label htmlFor="appKey">App Key</Label>
              <Input
                id="appKey"
                placeholder="Enter Alphanumeric Key"
                value={formData.appKey}
                onChange={(e) => setFormData({ ...formData, appKey: e.target.value })}
              />
            </div>
          </div>

          {/* Configure Payment */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              <h3 className="text-lg font-semibold text-orange-600">CONFIGURE PAYMENT</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="postpaid"
                  checked={formData.postpaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, postpaid: !!checked })}
                />
                <Label htmlFor="postpaid">Postpaid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prepaid"
                  checked={formData.prepaid}
                  onCheckedChange={(checked) => setFormData({ ...formData, prepaid: !!checked })}
                />
                <Label htmlFor="prepaid">Prepaid</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="payOnFacility"
                  checked={formData.payOnFacility}
                  onCheckedChange={(checked) => setFormData({ ...formData, payOnFacility: !!checked })}
                />
                <Label htmlFor="payOnFacility">Pay on Facility</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="complimentary"
                  checked={formData.complimentary}
                  onCheckedChange={(checked) => setFormData({ ...formData, complimentary: !!checked })}
                />
                <Label htmlFor="complimentary">Complimentary</Label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sgst">SGST(%)</Label>
                <Input
                  id="sgst"
                  value={formData.sgstPercentage}
                  onChange={(e) => setFormData({ ...formData, sgstPercentage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="gst">GST(%)</Label>
                <Input
                  id="gst"
                  value={formData.gstPercentage}
                  onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Configure Slot */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              <h3 className="text-lg font-semibold text-orange-600">CONFIGURE SLOT</h3>
            </div>
            <Button onClick={addSlot} className="mb-4 bg-purple-600 hover:bg-purple-700">
              Add
            </Button>
            
            {/* Slot Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-sm font-medium text-gray-600">
              <div>Start Time</div>
              <div>Break Time Start</div>
              <div>Break Time End</div>
              <div>End Time</div>
              <div>Concurrent Slots</div>
              <div>Slot by</div>
              <div>Wrap Time</div>
            </div>

            {/* Slot Rows */}
            {slots.map((slot, index) => (
              <div key={index} className="grid grid-cols-7 gap-2 mb-2">
                <div className="flex gap-1">
                  <Select value={slot.startTime.hour}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={slot.startTime.minute}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-1">
                  <Select value={slot.breakTimeStart.hour}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={slot.breakTimeStart.minute}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-1">
                  <Select value={slot.breakTimeEnd.hour}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={slot.breakTimeEnd.minute}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-1">
                  <Select value={slot.endTime.hour}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={slot.endTime.minute}>
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 60 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input className="h-8" value={slot.concurrentSlots} placeholder="" />
                <Select value={slot.slotBy}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 Minutes">15 Minutes</SelectItem>
                    <SelectItem value="30 Minutes">30 Minutes</SelectItem>
                    <SelectItem value="60 Minutes">60 Minutes</SelectItem>
                  </SelectContent>
                </Select>
                <Input className="h-8" value={slot.wrapTime} placeholder="" />
              </div>
            ))}
          </div>

          {/* Charge Setup */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">4</div>
              <h3 className="text-lg font-semibold text-orange-600">CHARGE SETUP</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="perSlotCharge">Per Slot Charge</Label>
                <Input
                  id="perSlotCharge"
                  value={formData.perSlotCharge}
                  onChange={(e) => setFormData({ ...formData, perSlotCharge: e.target.value })}
                />
              </div>
              <div>
                <Label>Booking Allowed before :</Label>
                <p className="text-sm text-gray-600 mb-2">(Enter Time: DD Days, HH Hours, MM Minutes)</p>
                <div className="flex gap-2 items-center">
                  <Input placeholder="Day" className="w-20" />
                  <span>d</span>
                  <Input placeholder="Hour" className="w-20" />
                  <span>h</span>
                  <Input placeholder="Mins" className="w-20" />
                  <span>m</span>
                </div>
              </div>
              <div>
                <Label>Advance Booking :</Label>
                <div className="flex gap-2 items-center">
                  <Input placeholder="Day" className="w-20" />
                  <span>d</span>
                  <Input placeholder="Hour" className="w-20" />
                  <span>h</span>
                  <Input placeholder="Mins" className="w-20" />
                  <span>m</span>
                </div>
              </div>
              <div>
                <Label>Can Cancel Before Schedule :</Label>
                <div className="flex gap-2 items-center">
                  <Input placeholder="Day" className="w-20" />
                  <span>d</span>
                  <Input placeholder="Hour" className="w-20" />
                  <span>h</span>
                  <Input placeholder="Mins" className="w-20" />
                  <span>m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slot Setup */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">5</div>
              <h3 className="text-lg font-semibold text-orange-600">SLOT SETUP</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowMultipleSlots"
                  checked={formData.allowMultipleSlots}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowMultipleSlots: !!checked })}
                />
                <Label htmlFor="allowMultipleSlots">Allow Multiple Slots</Label>
              </div>
              <div className="text-sm text-gray-600">
                Facility can be booked <span className="mx-4">times per day by User</span>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">6</div>
              <h3 className="text-lg font-semibold text-orange-600">COVER IMAGE</h3>
            </div>
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
              <div className="text-orange-500 mb-2">
                <Upload className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">
                Drag & Drop or <span className="text-orange-500 cursor-pointer">Choose File</span> No file chosen
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Accepted file formats: PNG/JPEG (height: 142px, width: 328px) (max 5 mb)
              </p>
            </div>
          </div>

          {/* Booking Summary Image */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">7</div>
              <h3 className="text-lg font-semibold text-orange-600">Booking Summary Image</h3>
            </div>
            <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
              <div className="text-orange-500 mb-2">
                <Upload className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">
                Drag & Drop or <span className="text-orange-500 cursor-pointer">Choose File</span> No file chosen
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Accepted file formats: PNG/JPEG (height: 91px, width: 108px) (max 5 mb)
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">8</div>
              <h3 className="text-lg font-semibold text-orange-600">DESCRIPTION</h3>
            </div>
            <Textarea
              placeholder="Enter description"
              value={formData.termsConditions}
              onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Terms & Conditions and Cancellation Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">9</div>
                <h3 className="text-lg font-semibold text-orange-600">TERMS & CONDITIONS</h3>
              </div>
              <Textarea
                placeholder="Enter terms and conditions"
                value={formData.termsConditions}
                onChange={(e) => setFormData({ ...formData, termsConditions: e.target.value })}
                className="min-h-[100px]"
              />
            </div>

            <div className="border border-orange-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">10</div>
                <h3 className="text-lg font-semibold text-orange-600">CANCELLATION TEXT</h3>
              </div>
              <Textarea
                placeholder="Enter cancellation text"
                value={formData.cancellationText}
                onChange={(e) => setFormData({ ...formData, cancellationText: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Cancellation Rules */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="font-medium text-gray-700">Rules Description</div>
              <div className="font-medium text-gray-700">Time</div>
              <div className="font-medium text-gray-700">Deduction</div>
            </div>
            {cancellationRules.map((rule, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 mb-2 items-center">
                <div className="text-sm text-gray-600">{rule.description}</div>
                <div className="flex gap-2">
                  <Input placeholder="Day" className="w-16 h-8" />
                  <Select value={rule.time.type}>
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hr">Hr</SelectItem>
                      <SelectItem value="Day">Day</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={rule.time.value}>
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }, (_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="%" className="h-8" />
              </div>
            ))}
          </div>

          {/* Configure Amenity Info */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">11</div>
              <h3 className="text-lg font-semibold text-orange-600">CONFIGURE AMENITY INFO</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tv"
                  checked={formData.amenities.tv}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, tv: !!checked }
                  })}
                />
                <Label htmlFor="tv">TV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="whiteboard"
                  checked={formData.amenities.whiteboard}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, whiteboard: !!checked }
                  })}
                />
                <Label htmlFor="whiteboard">Whiteboard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="casting"
                  checked={formData.amenities.casting}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, casting: !!checked }
                  })}
                />
                <Label htmlFor="casting">Casting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smartPenForTV"
                  checked={formData.amenities.smartPenForTV}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, smartPenForTV: !!checked }
                  })}
                />
                <Label htmlFor="smartPenForTV">Smart Pen for TV</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="wirelessCharging"
                  checked={formData.amenities.wirelessCharging}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, wirelessCharging: !!checked }
                  })}
                />
                <Label htmlFor="wirelessCharging">Wireless Charging</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meetingRoomInventory"
                  checked={formData.amenities.meetingRoomInventory}
                  onCheckedChange={(checked) => setFormData({
                    ...formData,
                    amenities: { ...formData.amenities, meetingRoomInventory: !!checked }
                  })}
                />
                <Label htmlFor="meetingRoomInventory">Meeting Room Inventory</Label>
              </div>
            </div>
          </div>

          {/* Seater Info */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">12</div>
              <h3 className="text-lg font-semibold text-orange-600">SEATER INFO</h3>
            </div>
            <div>
              <Label>Seater Info</Label>
              <Select value={formData.seaterInfo} onValueChange={(value) => setFormData({ ...formData, seaterInfo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select a seater">Select a seater</SelectItem>
                  <SelectItem value="2-4 People">2-4 People</SelectItem>
                  <SelectItem value="5-10 People">5-10 People</SelectItem>
                  <SelectItem value="10+ People">10+ People</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Floor Info */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">13</div>
              <h3 className="text-lg font-semibold text-orange-600">FLOOR INFO</h3>
            </div>
            <div>
              <Label>Floor Info</Label>
              <Select value={formData.floorInfo} onValueChange={(value) => setFormData({ ...formData, floorInfo: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Select a floor">Select a floor</SelectItem>
                  <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                  <SelectItem value="1st Floor">1st Floor</SelectItem>
                  <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Shared Content Info */}
          <div className="border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">14</div>
              <h3 className="text-lg font-semibold text-orange-600">Shared Content Info</h3>
            </div>
            <Textarea
              placeholder="Text content will appear on meeting room share icon in Application"
              value={formData.sharedContentInfo}
              onChange={(e) => setFormData({ ...formData, sharedContentInfo: e.target.value })}
              className="min-h-[100px]"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-center pt-6">
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 px-8">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
