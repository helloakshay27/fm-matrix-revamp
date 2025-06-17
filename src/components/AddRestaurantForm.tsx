
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface AddRestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

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

export const AddRestaurantForm = ({ isOpen, onClose, onSubmit }: AddRestaurantFormProps) => {
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
    onSubmit(data);
  };

  const renderSectionHeader = (title: string, section: keyof typeof expandedSections, icon: string) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-orange-50 border border-orange-200 rounded-lg mb-4"
    >
      <div className="flex items-center gap-2">
        <span className="text-orange-600 text-lg">{icon}</span>
        <span className="font-medium text-gray-800">{title}</span>
      </div>
      {expandedSections[section] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span>F&B List</span>
            <span className="mx-2">&gt;</span>
            <span>Create New F&B</span>
          </div>
          <DialogTitle className="text-xl font-bold">NEW F&B</DialogTitle>
        </DialogHeader>

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
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span>Order</span>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <span>Booking</span>
                </div>
                <Input placeholder="Select date" className="w-48" />
                <Button
                  onClick={addBlockedDay}
                  className="bg-[#8B5A5A] hover:bg-[#7A4949] text-white"
                >
                  Add
                </Button>
              </div>
              {blockedDays.map((day, index) => (
                <div key={index} className="flex items-center gap-4 mb-2">
                  <Checkbox checked={day.orderBlocked} />
                  <span>Order</span>
                  <Checkbox checked={day.bookingBlocked} />
                  <span>Booking</span>
                  <Input value={day.date} className="w-48" />
                  <Button
                    onClick={() => removeBlockedDay(index)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Table Booking */}
          {renderSectionHeader('TABLE BOOKING', 'tableBooking', '🍽️')}
          {expandedSections.tableBooking && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <Label htmlFor="minPerson">Minimum Person</Label>
                <Input
                  id="minPerson"
                  value={tableBooking.minPerson}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, minPerson: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="maxPerson">Maximum Person</Label>
                <Input
                  id="maxPerson"
                  value={tableBooking.maxPerson}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, maxPerson: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="canCancelBefore">Can Cancel Before</Label>
                <Input
                  id="canCancelBefore"
                  placeholder="In Mins"
                  value={tableBooking.canCancelBefore}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, canCancelBefore: e.target.value }))}
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="bookingNotAvailableText">Booking Not Available Text</Label>
                <Textarea
                  id="bookingNotAvailableText"
                  value={tableBooking.bookingNotAvailableText}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, bookingNotAvailableText: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Order Configure */}
          {renderSectionHeader('ORDER CONFIGURE', 'orderConfig', '⚙️')}
          {expandedSections.orderConfig && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
              <div>
                <Label htmlFor="gst">GST(%)</Label>
                <Input
                  id="gst"
                  value={orderConfig.gst}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, gst: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryCharge">Delivery Charge</Label>
                <Input
                  id="deliveryCharge"
                  value={orderConfig.deliveryCharge}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, deliveryCharge: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="minimumOrder">Minimum Order</Label>
                <Input
                  id="minimumOrder"
                  value={orderConfig.minimumOrder}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, minimumOrder: e.target.value }))}
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="orderNotAllowedText">Order Not Allowed Text</Label>
                <Textarea
                  id="orderNotAllowedText"
                  value={orderConfig.orderNotAllowedText}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, orderNotAllowedText: e.target.value }))}
                />
              </div>
            </div>
          )}

          {/* Attachments */}
          {renderSectionHeader('ATTACHMENTS', 'attachments', '📎')}
          {expandedSections.attachments && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg">
              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="mt-2 border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="coverImage"
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="coverImage" className="cursor-pointer">
                    <span className="text-orange-500">Choose File</span>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </label>
                </div>
              </div>
              <div>
                <Label htmlFor="menu">Menu</Label>
                <div className="mt-2 border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="menu"
                    className="hidden"
                    accept="image/*,application/pdf"
                  />
                  <label htmlFor="menu" className="cursor-pointer">
                    <span className="text-orange-500">Choose File</span>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </label>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="gallery">Gallery</Label>
                <div className="mt-2 border-2 border-dashed border-orange-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="gallery"
                    className="hidden"
                    accept="image/*"
                    multiple
                  />
                  <label htmlFor="gallery" className="cursor-pointer">
                    <span className="text-orange-500">Choose File</span>
                    <span className="ml-2 text-gray-500">No file chosen</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSubmit}
            className="bg-[#8B5A5A] hover:bg-[#7A4949] text-white px-8"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
