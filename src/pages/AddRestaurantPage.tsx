import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Store, Clock, Ban, Users, ShoppingCart, Paperclip, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { FileUploadSection } from '@/components/FileUploadSection';

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb'
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af'
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6'
    }
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    fontSize: '16px',
    '&.Mui-focused': {
      color: '#3b82f6'
    }
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    fontSize: '14px'
  }
};

const checkboxStyles = {
  color: '#C72030',
  '&.Mui-checked': {
    color: '#C72030',
  },
};

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

  // File states
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [menuFiles, setMenuFiles] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

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
      coverImages,
      menuFiles,
      galleryImages
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

  const handleGoBack = () => {
    navigate(-1);
  };

  const renderSectionHeader = (title: string, section: keyof typeof expandedSections, IconComponent: React.ComponentType<{ className?: string }>) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-4 bg-[#F5F3F0] border border-gray-200 rounded-lg mb-4"
    >
      <div className="flex items-center gap-2">
        <IconComponent className="w-5 h-5 text-[#C72030]" />
        <span className="font-medium text-[#1a1a1a]">{title}</span>
      </div>
      {expandedSections[section] ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
    </button>
  );

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={handleGoBack}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <p className="text-gray-600 text-sm">F&B List &gt; Create New F&B</p>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] uppercase">NEW F&B</h1>
      </div>

      <div className="space-y-4">
        {/* Basic Details */}
        {renderSectionHeader('BASIC DETAILS', 'basicDetails', Store)}
        {expandedSections.basicDetails && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-lg">
            <div>
              <TextField
                label="Restaurant Name"
                required
                value={formData.restaurantName}
                onChange={(e) => setFormData(prev => ({ ...prev, restaurantName: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Cost For Two"
                required
                value={formData.costForTwo}
                onChange={(e) => setFormData(prev => ({ ...prev, costForTwo: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Mobile Number"
                required
                placeholder="Enter Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Another Mobile Number"
                required
                placeholder="Enter Number"
                value={formData.anotherMobileNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, anotherMobileNumber: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Landline Number"
                required
                placeholder="Enter Number"
                value={formData.landlineNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, landlineNumber: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Delivery Time"
                placeholder="Mins"
                value={formData.deliveryTime}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Cuisines"
                value={formData.cuisines}
                onChange={(e) => setFormData(prev => ({ ...prev, cuisines: e.target.value }))}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel required shrink>Serves Alcohol</InputLabel>
                <Select
                  value={formData.servesAlcohol}
                  onChange={(e) => setFormData(prev => ({ ...prev, servesAlcohol: e.target.value }))}
                  label="Serves Alcohol"
                  displayEmpty
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel required shrink>Wheelchair Accessible</InputLabel>
                <Select
                  value={formData.wheelchairAccessible}
                  onChange={(e) => setFormData(prev => ({ ...prev, wheelchairAccessible: e.target.value }))}
                  label="Wheelchair Accessible"
                  displayEmpty
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel required shrink>Cash on Delivery</InputLabel>
                <Select
                  value={formData.cashOnDelivery}
                  onChange={(e) => setFormData(prev => ({ ...prev, cashOnDelivery: e.target.value }))}
                  label="Cash on Delivery"
                  displayEmpty
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div>
              <FormControl fullWidth variant="outlined" sx={fieldStyles}>
                <InputLabel required shrink>Pure Veg</InputLabel>
                <Select
                  value={formData.pureVeg}
                  onChange={(e) => setFormData(prev => ({ ...prev, pureVeg: e.target.value }))}
                  label="Pure Veg"
                  displayEmpty
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className="md:col-span-3">
              <TextField
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="T&C"
                value={formData.tAndC}
                onChange={(e) => setFormData(prev => ({ ...prev, tAndC: e.target.value }))}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Disclaimer"
                value={formData.disclaimer}
                onChange={(e) => setFormData(prev => ({ ...prev, disclaimer: e.target.value }))}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Closing Message"
                value={formData.closingMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, closingMessage: e.target.value }))}
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
          </div>
        )}

        {/* Restaurant Schedule */}
        {renderSectionHeader('RESTAURANT SCHEDULE', 'schedule', Clock)}
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
                          <FormControlLabel
                            control={
                              <MuiCheckbox
                                checked={item.enabled}
                                onChange={(e) => updateSchedule(index, 'enabled', e.target.checked)}
                                size="small"
                                sx={checkboxStyles}
                              />
                            }
                            label={item.day}
                            sx={{ margin: 0 }}
                          />
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
                        <MuiCheckbox
                          checked={item.bookingAllowed}
                          onChange={(e) => updateSchedule(index, 'bookingAllowed', e.target.checked)}
                          size="small"
                          sx={checkboxStyles}
                        />
                      </td>
                      <td className="p-2">
                        <MuiCheckbox
                          checked={item.orderAllowed}
                          onChange={(e) => updateSchedule(index, 'orderAllowed', e.target.checked)}
                          size="small"
                          sx={checkboxStyles}
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
        {renderSectionHeader('BLOCKED DAYS', 'blockedDays', Ban)}
        {expandedSections.blockedDays && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="space-y-4">
              {blockedDays.map((day, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded">
                  <TextField
                    type="date"
                    value={day.date}
                    onChange={(e) => setBlockedDays(prev => prev.map((item, i) => 
                      i === index ? { ...item, date: e.target.value } : item
                    ))}
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={day.orderBlocked}
                        onChange={(e) => setBlockedDays(prev => prev.map((item, i) => 
                          i === index ? { ...item, orderBlocked: e.target.checked } : item
                        ))}
                        sx={checkboxStyles}
                      />
                    }
                    label="Order Blocked"
                  />
                  <FormControlLabel
                    control={
                      <MuiCheckbox
                        checked={day.bookingBlocked}
                        onChange={(e) => setBlockedDays(prev => prev.map((item, i) => 
                          i === index ? { ...item, bookingBlocked: e.target.checked } : item
                        ))}
                        sx={checkboxStyles}
                      />
                    }
                    label="Booking Blocked"
                  />
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
        {renderSectionHeader('TABLE BOOKING CONFIGURATION', 'tableBooking', Users)}
        {expandedSections.tableBooking && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextField
                  label="Min Person"
                  value={tableBooking.minPerson}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, minPerson: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  label="Max Person"
                  value={tableBooking.maxPerson}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, maxPerson: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  label="Can Cancel Before (Hours)"
                  value={tableBooking.canCancelBefore}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, canCancelBefore: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  label="Booking Not Available Text"
                  value={tableBooking.bookingNotAvailableText}
                  onChange={(e) => setTableBooking(prev => ({ ...prev, bookingNotAvailableText: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Order Configuration */}
        {renderSectionHeader('ORDER CONFIGURATION', 'orderConfig', ShoppingCart)}
        {expandedSections.orderConfig && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextField
                  label="GST (%)"
                  value={orderConfig.gst}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, gst: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  label="Delivery Charge (₹)"
                  value={orderConfig.deliveryCharge}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, deliveryCharge: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  label="Minimum Order (₹)"
                  value={orderConfig.minimumOrder}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, minimumOrder: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div>
                <TextField
                  label="Order Not Allowed Text"
                  value={orderConfig.orderNotAllowedText}
                  onChange={(e) => setOrderConfig(prev => ({ ...prev, orderNotAllowedText: e.target.value }))}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  sx={fieldStyles}
                  InputLabelProps={{ shrink: true }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Attachments */}
        {renderSectionHeader('ATTACHMENTS', 'attachments', Paperclip)}
        {expandedSections.attachments && (
          <div className="p-4 border border-gray-200 rounded-lg space-y-8">
            <FileUploadSection
              title="COVER"
              sectionNumber={4}
              acceptedTypes="image/*"
              multiple={false}
              buttonText="Upload Cover Image"
              description="Drag and drop files here or click to browse"
              files={coverImages}
              onFilesChange={setCoverImages}
            />

            <FileUploadSection
              title="MENU"
              sectionNumber={5}
              acceptedTypes="image/*,.pdf,.doc,.docx"
              multiple={true}
              buttonText="Add Menu Items"
              description="Drag and drop files here or click to browse"
              files={menuFiles}
              onFilesChange={setMenuFiles}
            />

            <FileUploadSection
              title="GALLERY"
              sectionNumber={6}
              acceptedTypes="image/*"
              multiple={true}
              buttonText="Add Gallery Images"
              description="Drag and drop files here or click to browse"
              files={galleryImages}
              onFilesChange={setGalleryImages}
            />
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
