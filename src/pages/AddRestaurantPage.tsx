import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Schedule {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  bookingAllowed: boolean;
  orderAllowed: boolean;
  lastBookingTime: string;
}

interface BlockedDay {
  date: string;
  orderBlocked: boolean;
  bookingBlocked: boolean;
}

const initialSchedule: Schedule[] = [
  { day: 'Monday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  { day: 'Tuesday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  { day: 'Wednesday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  { day: 'Thursday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  { day: 'Friday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  { day: 'Saturday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  { day: 'Sunday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
];

export const AddRestaurantPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    restaurantName: '',
    costForTwo: '',
    mobileNumber: '',
    anotherMobileNumber: '',
    landlineNumber: '',
    deliveryTime: '',
    cuisines: '',
    servesAlcohol: '',
    wheelchairAccessible: '',
    cashOnDelivery: '',
    pureVeg: 'No',
    address: '',
    tAndC: '',
    disclaimer: '',
    closingMessage: ''
  });

  const [schedule, setSchedule] = useState<Schedule[]>(initialSchedule);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [tableBooking, setTableBooking] = useState({
    minPerson: '',
    maxPerson: '',
    canCancelBefore: '',
    bookingNotAvailableText: ''
  });
  const [orderConfig, setOrderConfig] = useState({
    gst: '',
    deliveryCharge: '0',
    minimumOrder: '',
    orderNotAllowedText: ''
  });
  const [attachments, setAttachments] = useState({
    coverImage: null,
    menu: null,
    gallery: null
  });

  const [expandedSections, setExpandedSections] = useState({
    basicDetails: true,
    schedule: false,
    blockedDays: false,
    tableBooking: false,
    orderConfig: false,
    attachments: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateSchedule = (index: number, field: keyof Schedule, value: any) => {
    setSchedule(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addBlockedDay = () => {
    setBlockedDays(prev => [...prev, { date: '', orderBlocked: false, bookingBlocked: false }]);
  };

  const removeBlockedDay = (index: number) => {
    setBlockedDays(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const data = {
      ...formData,
      schedule,
      blockedDays,
      tableBooking,
      orderConfig,
      attachments
    };
    
    console.log('Restaurant data:', data);
    toast({
      title: "Success",
      description: "Restaurant saved successfully!",
    });
    navigate('/vas/fnb');
  };

  const handleBack = () => {
    navigate('/vas/fnb');
  };

  const renderSectionHeader = (title: string, section: keyof typeof expandedSections, icon: string) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-[#F5F3F0] border border-gray-200 rounded-lg mb-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-[#C72030] text-lg">{icon}</span>
        <span className="font-medium text-[#1a1a1a]">{title}</span>
      </div>
      {expandedSections[section] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <p className="text-gray-600 mb-2 text-sm">F&B List &gt; Create New F&B</p>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">NEW F&B</h1>
      </div>

      <div className="space-y-4">
        {/* Basic Details */}
        {renderSectionHeader('BASIC DETAILS', 'basicDetails', '🏪')}
        {expandedSections.basicDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <Label htmlFor="restaurantName">Restaurant Name<span className="text-red-500">*</span></Label>
              <Input
                id="restaurantName"
                value={formData.restaurantName}
                onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="costForTwo">Cost For Two<span className="text-red-500">*</span></Label>
              <Input
                id="costForTwo"
                value={formData.costForTwo}
                onChange={(e) => setFormData(prev => ({ ...prev, costForTwo: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="mobileNumber">Mobile Number<span className="text-red-500">*</span></Label>
              <Input
                id="mobileNumber"
                placeholder="Enter Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="anotherMobileNumber">Another Mobile Number<span className="text-red-500">*</span></Label>
              <Input
                id="anotherMobileNumber"
                placeholder="Enter Number"
                value={formData.anotherMobileNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, anotherMobileNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="landlineNumber">Landline Number<span className="text-red-500">*</span></Label>
              <Input
                id="landlineNumber"
                placeholder="Enter Number"
                value={formData.landlineNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, landlineNumber: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                placeholder="Mins"
                value={formData.deliveryTime}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="cuisines">Cuisines</Label>
              <Input
                id="cuisines"
                value={formData.cuisines}
                onChange={(e) => setFormData(prev => ({ ...prev, cuisines: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="servesAlcohol">Serves Alcohol<span className="text-red-500">*</span></Label>
              <Select value={formData.servesAlcohol} onValueChange={(value) => setFormData(prev => ({ ...prev, servesAlcohol: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="wheelchairAccessible">Wheelchair Accessible<span className="text-red-500">*</span></Label>
              <Select value={formData.wheelchairAccessible} onValueChange={(value) => setFormData(prev => ({ ...prev, wheelchairAccessible: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cashOnDelivery">Cash on Delivery<span className="text-red-500">*</span></Label>
              <Select value={formData.cashOnDelivery} onValueChange={(value) => setFormData(prev => ({ ...prev, cashOnDelivery: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pureVeg">Pure Veg<span className="text-red-500">*</span></Label>
              <Select value={formData.pureVeg} onValueChange={(value) => setFormData(prev => ({ ...prev, pureVeg: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="tAndC">T&C</Label>
              <Textarea
                id="tAndC"
                value={formData.tAndC}
                onChange={(e) => setFormData(prev => ({ ...prev, tAndC: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="disclaimer">Disclaimer</Label>
              <Textarea
                id="disclaimer"
                value={formData.disclaimer}
                onChange={(e) => setFormData(prev => ({ ...prev, disclaimer: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="closingMessage">Closing Message</Label>
              <Textarea
                id="closingMessage"
                value={formData.closingMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, closingMessage: e.target.value }))}
                className="min-h-[80px]"
              />
            </div>
          </div>
        )}

        {/* Restaurant Schedule */}
        {renderSectionHeader('RESTAURANT SCHEDULE', 'schedule', '🕒')}
        {expandedSections.schedule && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Operational Days</th>
                    <th className="text-left p-2">Start Time</th>
                    <th className="text-left p-2">End Time</th>
                    <th className="text-left p-2">Break Start Time</th>
                    <th className="text-left p-2">Break End Time</th>
                    <th className="text-left p-2">Booking Allowed</th>
                    <th className="text-left p-2">Order Allowed</th>
                    <th className="text-left p-2">Last Booking & Order Time</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, index) => (
                    <tr key={item.day} className="border-b">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={item.enabled}
                            onCheckedChange={(checked) => updateSchedule(index, 'enabled', checked)}
                          />
                          <span>{item.day}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <select
                            value={item.startTime.split(':')[0]}
                            onChange={(e) => updateSchedule(index, 'startTime', `${e.target.value}:${item.startTime.split(':')[1]}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.startTime.split(':')[1]}
                            onChange={(e) => updateSchedule(index, 'startTime', `${item.startTime.split(':')[0]}:${e.target.value}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <select
                            value={item.endTime.split(':')[0]}
                            onChange={(e) => updateSchedule(index, 'endTime', `${e.target.value}:${item.endTime.split(':')[1]}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.endTime.split(':')[1]}
                            onChange={(e) => updateSchedule(index, 'endTime', `${item.endTime.split(':')[0]}:${e.target.value}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <select
                            value={item.breakStartTime.split(':')[0]}
                            onChange={(e) => updateSchedule(index, 'breakStartTime', `${e.target.value}:${item.breakStartTime.split(':')[1]}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.breakStartTime.split(':')[1]}
                            onChange={(e) => updateSchedule(index, 'breakStartTime', `${item.breakStartTime.split(':')[0]}:${e.target.value}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <select
                            value={item.breakEndTime.split(':')[0]}
                            onChange={(e) => updateSchedule(index, 'breakEndTime', `${e.target.value}:${item.breakEndTime.split(':')[1]}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.breakEndTime.split(':')[1]}
                            onChange={(e) => updateSchedule(index, 'breakEndTime', `${item.breakEndTime.split(':')[0]}:${e.target.value}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="p-2">
                        <Checkbox
                          checked={item.bookingAllowed}
                          onCheckedChange={(checked) => updateSchedule(index, 'bookingAllowed', checked)}
                        />
                      </td>
                      <td className="p-2">
                        <Checkbox
                          checked={item.orderAllowed}
                          onCheckedChange={(checked) => updateSchedule(index, 'orderAllowed', checked)}
                        />
                      </td>
                      <td className="p-2">
                        <div className="flex gap-1">
                          <select
                            value={item.lastBookingTime.split(':')[0]}
                            onChange={(e) => updateSchedule(index, 'lastBookingTime', `${e.target.value}:${item.lastBookingTime.split(':')[1]}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.lastBookingTime.split(':')[1]}
                            onChange={(e) => updateSchedule(index, 'lastBookingTime', `${item.lastBookingTime.split(':')[0]}:${e.target.value}`)}
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-12"
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i.toString().padStart(2, '0')}>
                                {i.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blocked Days */}
        {renderSectionHeader('BLOCKED DAYS', 'blockedDays', '🚫')}
        {expandedSections.blockedDays && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="space-y-4">
              {blockedDays.map((day, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded">
                  <Input
                    type="date"
                    value={day.date}
                    onChange={(e) => setBlockedDays(prev => prev.map((item, i) => 
                      i === index ? { ...item, date: e.target.value } : item
                    ))}
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={day.orderBlocked}
                      onCheckedChange={(checked) => setBlockedDays(prev => prev.map((item, i) => 
                        i === index ? { ...item, orderBlocked: checked === true } : item
                      ))}
                    />
                    <Label>Order Blocked</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={day.bookingBlocked}
                      onCheckedChange={(checked) => setBlockedDays(prev => prev.map((item, i) => 
                        i === index ? { ...item, bookingBlocked: checked === true } : item
                      ))}
                    />
                    <Label>Booking Blocked</Label>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeBlockedDay(index)}
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addBlockedDay}
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                Add Blocked Day
              </Button>
            </div>
          </div>
        )}

        {/* Table Booking Configuration */}
        {renderSectionHeader('TABLE BOOKING CONFIGURATION', 'tableBooking', '🪑')}
        {expandedSections.tableBooking && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minPerson">Min Person</Label>
                <Input
                  id="minPerson"
                  value={tableBooking.minPerson}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, minPerson: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxPerson">Max Person</Label>
                <Input
                  id="maxPerson"
                  value={tableBooking.maxPerson}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, maxPerson: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="canCancelBefore">Can Cancel Before (Hours)</Label>
                <Input
                  id="canCancelBefore"
                  value={tableBooking.canCancelBefore}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, canCancelBefore: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="bookingNotAvailableText">Booking Not Available Text</Label>
                <Textarea
                  id="bookingNotAvailableText"
                  value={tableBooking.bookingNotAvailableText}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, bookingNotAvailableText: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Configuration */}
        {renderSectionHeader('ORDER CONFIGURATION', 'orderConfig', '🛍️')}
        {expandedSections.orderConfig && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gst">GST (%)</Label>
                <Input
                  id="gst"
                  value={orderConfig.gst}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, gst: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryCharge">Delivery Charge (₹)</Label>
                <Input
                  id="deliveryCharge"
                  value={orderConfig.deliveryCharge}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, deliveryCharge: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="minimumOrder">Minimum Order (₹)</Label>
                <Input
                  id="minimumOrder"
                  value={orderConfig.minimumOrder}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, minimumOrder: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="orderNotAllowedText">Order Not Allowed Text</Label>
                <Textarea
                  id="orderNotAllowedText"
                  value={orderConfig.orderNotAllowedText}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, orderNotAllowedText: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Attachments */}
        {renderSectionHeader('ATTACHMENTS', 'attachments', '📎')}
        {expandedSections.attachments && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAttachments(prev => ({ ...prev, coverImage: e.target.files?.[0] || null }))}
                />
              </div>
              <div>
                <Label htmlFor="menu">Menu</Label>
                <Input
                  id="menu"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setAttachments(prev => ({ ...prev, menu: e.target.files?.[0] || null }))}
                />
              </div>
              <div>
                <Label htmlFor="gallery">Gallery</Label>
                <Input
                  id="gallery"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setAttachments(prev => ({ ...prev, gallery: e.target.files }))}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 mt-6">
        <Button 
          onClick={handleSubmit}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8"
        >
          Save
        </Button>
        <Button 
          onClick={handleBack}
          variant="outline"
          className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white px-8"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default AddRestaurantPage;