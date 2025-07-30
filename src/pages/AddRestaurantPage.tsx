import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Store, Clock, Ban, Users, ShoppingCart, Paperclip, ArrowLeft, Loader2, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox as MuiCheckbox, FormControlLabel } from '@mui/material';
import { FileUploadSection } from '@/components/FileUploadSection';
import { useAppDispatch } from '@/store/hooks';
import { createRestaurant } from '@/store/slices/f&bSlice';
import { toast } from 'sonner';

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
  const dispatch = useAppDispatch();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

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

  const [loadingSubmit, setLoadingSubmit] = useState(false)

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

  const validateForm = () => {
    if (!formData.restaurantName) {
      toast.error('Please enter Restaurant Name');
      return false;
    } else if (!formData.costForTwo) {
      toast.error('Please enter Cost For Two');
      return false;
    } else if (!formData.mobileNumber || !/^\d{10}$/.test(formData.mobileNumber)) {
      toast.error('Please enter a valid 10-digit Mobile Number');
      return false;
    } else if (formData.anotherMobileNumber && !/^\d{10}$/.test(formData.anotherMobileNumber)) {
      toast.error('Alternate number must be 10 digits');
      return false;
    } else if (!formData.landlineNumber) {
      toast.error('Please enter a valid Landline Number');
      return false;
    } else if (!formData.deliveryTime) {
      toast.error('Please enter Delivery Time');
      return false;
    } else if (!formData.servesAlcohol) {
      toast.error('Please enter Serves Alcohol');
      return false;
    } else if (!formData.wheelchairAccessible) {
      toast.error('Please enter Wheelchair Accessible');
      return false;
    } else if (!formData.cashOnDelivery) {
      toast.error('Please enter Cash On Delivery');
      return false;
    } else if (!formData.pureVeg) {
      toast.error('Please enter Pure Veg');
      return false;
    } else if (!formData.address) {
      toast.error('Please enter Address');
      return false;
    } else if (!formData.tAndC) {
      toast.error('Please enter Terms and Conditions');
      return false;
    } else if (!formData.disclaimer) {
      toast.error('Please enter Disclaimer');
      return false;
    } else if (!formData.closingMessage) {
      toast.error('Please enter Closing Message');
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoadingSubmit(true)
    try {
      const dataToSubmit = new FormData();

      // Append restaurant details
      dataToSubmit.append('restaurant[name]', formData.restaurantName);
      dataToSubmit.append('restaurant[cost_for_two]', formData.costForTwo);
      dataToSubmit.append('restaurant[contact1]', formData.mobileNumber);
      dataToSubmit.append('restaurant[contact2]', formData.anotherMobileNumber);
      dataToSubmit.append('restaurant[contact3]', formData.landlineNumber);
      dataToSubmit.append('restaurant[delivery_time]', formData.deliveryTime);
      dataToSubmit.append('restaurant[cuisines]', formData.cuisines);
      dataToSubmit.append('restaurant[alcohol]', formData.servesAlcohol);
      dataToSubmit.append('restaurant[wheelchair]', formData.wheelchairAccessible);
      dataToSubmit.append('restaurant[cod]', formData.cashOnDelivery);
      dataToSubmit.append('restaurant[pure_veg]', formData.pureVeg);
      dataToSubmit.append('restaurant[address]', formData.address);
      dataToSubmit.append('restaurant[terms]', formData.tAndC);
      dataToSubmit.append('restaurant[disclaimer]', formData.disclaimer);
      dataToSubmit.append('restaurant[booking_closed]', formData.closingMessage);
      dataToSubmit.append('restaurant[min_people]', tableBooking.minPerson);
      dataToSubmit.append('restaurant[max_people]', tableBooking.maxPerson);
      dataToSubmit.append('restaurant[cancel_before]', tableBooking.canCancelBefore);
      dataToSubmit.append('restaurant[booking_not_allowed]', tableBooking.bookingNotAvailableText);
      dataToSubmit.append('restaurant[gst]', orderConfig.gst);
      dataToSubmit.append('restaurant[delivery_charge]', orderConfig.deliveryCharge);
      dataToSubmit.append('restaurant[min_amount]', orderConfig.minimumOrder);
      dataToSubmit.append('restaurant[order_not_allowed]', orderConfig.orderNotAllowedText);

      // Attach files
      coverImages.forEach((file) => {
        dataToSubmit.append('restaurant[cover_images][]', file);
      });
      menuFiles.forEach((file) => {
        dataToSubmit.append('restaurant[menu_images][]', file);
      });
      galleryImages.forEach((file) => {
        dataToSubmit.append('restaurant[main_images][]', file);
      });

      // Append only enabled schedules
      schedule
        .filter((item) => item.enabled) // Only include enabled days
        .forEach((item, index) => {
          const [startHour, startMin] = item.startTime.split(':');
          const [endHour, endMin] = item.endTime.split(':');
          const [breakStartHour, breakStartMin] = item.breakStartTime.split(':');
          const [breakEndHour, breakEndMin] = item.breakEndTime.split(':');
          const [lastHour, lastMin] = item.lastBookingTime.split(':');

          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][is_open]`, '1');
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][dayofweek]`, item.day.toLowerCase());
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][start_hour]`, startHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][start_min]`, startMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][end_hour]`, endHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][end_min]`, endMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_start_hour]`, breakStartHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_start_min]`, breakStartMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_end_hour]`, breakEndHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_end_min]`, breakEndMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][booking_allowed]`, item.bookingAllowed ? '1' : '0');
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][order_allowed]`, item.orderAllowed ? '1' : '0');
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][last_hour]`, lastHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][last_min]`, lastMin);
        });

      // Append blocked days
      blockedDays.forEach((day, index) => {
        dataToSubmit.append(`restaurant[blocked_days_attributes][${index}][date]`, day.date);
        dataToSubmit.append(`restaurant[blocked_days_attributes][${index}][order_blocked]`, day.orderBlocked ? '1' : '0');
        dataToSubmit.append(`restaurant[blocked_days_attributes][${index}][booking_blocked]`, day.bookingBlocked ? '1' : '0');
      });

      await dispatch(createRestaurant({ baseUrl, token, data: dataToSubmit })).unwrap();
      toast.success('Restaurant added successfully');
      navigate('/settings/vas/fnb/setup');
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/vas/fnb/setup');
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
            className="text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            <p className="text-gray-600 text-sm">Back</p>
          </button>
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
                type="number"
                value={formData.costForTwo}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || parseFloat(value) >= 0) {
                    setFormData((prev) => ({ ...prev, costForTwo: value }));
                  }
                }}
                onKeyDown={(e) => {
                  if (['e', 'E', '+', '-'].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ min: 0 }}
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
                type="text"
                placeholder="Enter Number"
                value={formData.mobileNumber}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  if (onlyDigits.length <= 10) {
                    setFormData((prev) => ({ ...prev, mobileNumber: onlyDigits }));
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    ['e', 'E', '+', '-', '.'].includes(e.key) ||
                    (e.key.length === 1 && !/\d/.test(e.key))
                  ) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 10 }}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Another Mobile Number"
                placeholder="Enter Number"
                type="text"
                value={formData.anotherMobileNumber}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  if (onlyDigits.length <= 10) {
                    setFormData((prev) => ({ ...prev, anotherMobileNumber: onlyDigits }));
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    ['e', 'E', '+', '-', '.', ' '].includes(e.key) ||
                    (e.key.length === 1 && !/\d/.test(e.key))
                  ) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 10 }}
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
                type="text"
                value={formData.landlineNumber}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  if (onlyDigits.length <= 10) {
                    setFormData((prev) => ({ ...prev, landlineNumber: onlyDigits }));
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    ['e', 'E', '+', '-', '.', ' '].includes(e.key) ||
                    (e.key.length === 1 && !/\d/.test(e.key))
                  ) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 10 }}
                fullWidth
                variant="outlined"
                sx={fieldStyles}
                InputLabelProps={{ shrink: true }}
              />
            </div>
            <div>
              <TextField
                label="Delivery Time"
                required
                placeholder="Mins"
                type="text"
                value={formData.deliveryTime}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, '');
                  setFormData((prev) => ({ ...prev, deliveryTime: onlyDigits }));
                }}
                onKeyDown={(e) => {
                  if (
                    ['e', 'E', '+', '-', '.', ' '].includes(e.key) ||
                    (e.key.length === 1 && !/\d/.test(e.key))
                  ) {
                    e.preventDefault();
                  }
                }}
                inputProps={{ inputMode: 'numeric' }}
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
                required
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
                required
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
                required
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
                required
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                            className="border border-gray-300 rounded px-2 py-1 text-xs w-14"
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
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, '');
                    setTableBooking((prev) => ({ ...prev, minPerson: digitsOnly }));
                  }}
                  onKeyDown={(e) => {
                    if (
                      ['e', 'E', '+', '-', '.', ' '].includes(e.key) ||
                      (e.key.length === 1 && !/\d/.test(e.key))
                    ) {
                      e.preventDefault();
                    }
                  }}
                  inputProps={{ inputMode: 'numeric' }}
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
                  label={`Delivery Charge (${localStorage.getItem('currency')})`}
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
                  label={`Minimum Order (${localStorage.getItem('currency')})`}
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
          disabled={loadingSubmit}
          onClick={handleSubmit}
          className="bg-[#C72030] hover:bg-[#A61B28] text-white px-8 text-center"
        >
          {loadingSubmit ? <Loader className="animate-spin mr-2" /> : 'Save'}
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
