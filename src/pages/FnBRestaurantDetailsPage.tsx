import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem, SelectChangeEvent } from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { StatusSetupTable } from '../components/StatusSetupTable';
import { CategoriesSetupTable } from '../components/CategoriesSetupTable';
import { SubCategoriesSetupTable } from '../components/SubCategoriesSetupTable';
import { RestaurantMenuTable } from '../components/RestaurantMenuTable';
import { RestaurantBookingsTable } from '../components/RestaurantBookingsTable';
import { RestaurantOrdersTable } from '../components/RestaurantOrdersTable';
import { toast } from 'sonner';

interface Restaurant {
  id: number;
  name: string;
  cuisines: string;
  costForTwo: string;
  address: string;
  deliveryTime: string;
  phoneNumber: string;
  cancelBeforeSchedule: string;
  bookingAllowed: boolean;
  closingMessage: string;
  openDays: string;
  orderAllowed: boolean;
  active: boolean;
}

interface DaySchedule {
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

const mockRestaurants: Restaurant[] = [
  { 
    id: 1, 
    name: 'Test restaurant', 
    cuisines: 'Indian',
    costForTwo: '₹499',
    address: 'test 123',
    deliveryTime: '45 Mins',
    phoneNumber: '9534534634',
    cancelBeforeSchedule: '30 min.',
    bookingAllowed: false, 
    closingMessage: '-',
    openDays: 'M T W T F S S', 
    orderAllowed: false, 
    active: false 
  },
  { 
    id: 2, 
    name: 'Haven', 
    cuisines: 'Indian',
    costForTwo: '₹499',
    address: 'test 123',
    deliveryTime: '45 Mins',
    phoneNumber: '9534534634',
    cancelBeforeSchedule: '30 min.',
    bookingAllowed: true, 
    closingMessage: '-',
    openDays: 'M T W T F S S', 
    orderAllowed: false, 
    active: false 
  },
  { 
    id: 3, 
    name: 'twjas', 
    cuisines: 'Indian',
    costForTwo: '₹499',
    address: 'test 123',
    deliveryTime: '45 Mins',
    phoneNumber: '9534534634',
    cancelBeforeSchedule: '30 min.',
    bookingAllowed: true, 
    closingMessage: '-',
    openDays: 'M T W T F S S', 
    orderAllowed: false, 
    active: false 
  },
  { 
    id: 4, 
    name: 'Love & Latte', 
    cuisines: 'Indian',
    costForTwo: '₹499',
    address: 'test 123',
    deliveryTime: '45 Mins',
    phoneNumber: '9534534634',
    cancelBeforeSchedule: '30 min.',
    bookingAllowed: true, 
    closingMessage: '-',
    openDays: 'M T W T F S S', 
    orderAllowed: true, 
    active: true 
  },
];

export const FnBRestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const restaurant = mockRestaurants.find(r => r.id === parseInt(id || '1'));
  const [formData, setFormData] = useState<Restaurant>(restaurant || mockRestaurants[0]);

  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([
    { day: 'Monday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
    { day: 'Tuesday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
    { day: 'Wednesday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
    { day: 'Thursday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
    { day: 'Friday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
    { day: 'Saturday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
    { day: 'Sunday', enabled: true, startTime: '06:00', endTime: '23:00', breakStartTime: '13:00', breakEndTime: '14:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '22:00' },
  ]);

  const handleInputChange = (field: keyof Restaurant, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setScheduleData(prev => prev.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    ));
  };

  const handleSave = () => {
    console.log('Saving restaurant data:', formData);
    console.log('Saving schedule data:', scheduleData);
    
    // Update the mock data (in a real app, this would be an API call)
    const updatedRestaurants = mockRestaurants.map(r => 
      r.id === formData.id ? formData : r
    );
    
    toast.success('Restaurant details saved successfully!');
  };

  const fieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      backgroundColor: '#FFFFFF',
      '& fieldset': {
        borderColor: '#E0E0E0',
        borderRadius: '6px',
      },
      '&:hover fieldset': {
        borderColor: '#1A1A1A',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#C72030',
        borderWidth: 2,
      },
    },
    '& .MuiInputLabel-root': {
      color: '#1A1A1A',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#C72030',
      },
    },
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>F&B List</span>
        <span className="mx-2">{'>'}</span>
        <span>F&B Detail</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/vas/fnb')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-2xl font-bold text-[#1a1a1a]">F&B DETAIL</h1>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-gray-100">
          <TabsTrigger value="restaurant" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="status-setup">Status Setup</TabsTrigger>
          <TabsTrigger value="categories-setup">Categories Setup</TabsTrigger>
          <TabsTrigger value="sub-categories-setup">Sub Categories Setup</TabsTrigger>
          <TabsTrigger value="restaurant-menu">Restaurant Menu</TabsTrigger>
          <TabsTrigger value="restaurant-bookings">Restaurant Bookings</TabsTrigger>
          <TabsTrigger value="restaurant-order">Restaurant Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="mt-6">
          <div className="space-y-6">
            {/* Basic Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#C72030] flex items-center gap-2">
                  <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  BASIC DETAIL
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <TextField
                    label="Restaurant Name"
                    placeholder="Restaurant Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
                <div>
                  <TextField
                    label="Address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
                <div>
                  <TextField
                    label="Cuisines"
                    placeholder="Cuisines"
                    value={formData.cuisines}
                    onChange={(e) => handleInputChange('cuisines', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
                <div>
                  <TextField
                    label="Delivery Time"
                    placeholder="Delivery Time"
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
                <div>
                  <TextField
                    label="Cost for Two"
                    placeholder="Cost for Two"
                    value={formData.costForTwo}
                    onChange={(e) => handleInputChange('costForTwo', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#C72030] flex items-center gap-2">
                  <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                  RESTAURANT SCHEDULE
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Operational Days</th>
                        <th className="text-left p-3 font-medium">Start Time</th>
                        <th className="text-left p-3 font-medium">End Time</th>
                        <th className="text-left p-3 font-medium">Break Start Time</th>
                        <th className="text-left p-3 font-medium">Break End Time</th>
                        <th className="text-left p-3 font-medium">Booking Allowed</th>
                        <th className="text-left p-3 font-medium">Order Allowed</th>
                        <th className="text-left p-3 font-medium">Last Booking & Order Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((dayData, index) => (
                        <tr key={dayData.day} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={dayData.enabled}
                                onCheckedChange={(checked) => handleScheduleChange(index, 'enabled', checked)}
                              />
                              <span>{dayData.day}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Select 
                              value={dayData.startTime} 
                              onValueChange={(value) => handleScheduleChange(index, 'startTime', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Select 
                              value={dayData.endTime}
                              onValueChange={(value) => handleScheduleChange(index, 'endTime', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Select 
                              value={dayData.breakStartTime}
                              onValueChange={(value) => handleScheduleChange(index, 'breakStartTime', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Select 
                              value={dayData.breakEndTime}
                              onValueChange={(value) => handleScheduleChange(index, 'breakEndTime', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-3">
                            <Checkbox 
                              checked={dayData.bookingAllowed} 
                              onCheckedChange={(checked) => handleScheduleChange(index, 'bookingAllowed', checked)}
                            />
                          </td>
                          <td className="p-3">
                            <Checkbox 
                              checked={dayData.orderAllowed}
                              onCheckedChange={(checked) => handleScheduleChange(index, 'orderAllowed', checked)}
                            />
                          </td>
                          <td className="p-3">
                            <Select 
                              value={dayData.lastBookingTime}
                              onValueChange={(value) => handleScheduleChange(index, 'lastBookingTime', value)}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {timeOptions.map(time => (
                                  <SelectItem key={time} value={time}>{time}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Other Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#C72030] flex items-center gap-2">
                  <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  OTHER INFO
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <TextField
                    label="Phone Number"
                    placeholder="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
                <div>
                  <Label htmlFor="booking-allowed" className="text-sm font-medium">Booking Allowed</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm">No</span>
                    <div
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${
                        formData.bookingAllowed ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                      onClick={() => handleInputChange('bookingAllowed', !formData.bookingAllowed)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                          formData.bookingAllowed ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </div>
                    <span className="text-sm">Yes</span>
                  </div>
                </div>
                <div>
                  <TextField
                    label="Cancel Before Schedule"
                    placeholder="Cancel Before Schedule"
                    value={formData.cancelBeforeSchedule}
                    onChange={(e) => handleInputChange('cancelBeforeSchedule', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
                <div>
                  <TextField
                    label="Closing Message"
                    placeholder="Closing Message"
                    value={formData.closingMessage}
                    onChange={(e) => handleInputChange('closingMessage', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#C72030] flex items-center gap-2">
                  <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  COVER
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Cover image upload functionality would be implemented here</p>
                  <Button className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                    Upload Cover Image
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Menu */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#C72030] flex items-center gap-2">
                  <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                  MENU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Menu management functionality would be implemented here</p>
                  <Button className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                    Add Menu Items
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-[#C72030] flex items-center gap-2">
                  <span className="bg-[#C72030] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                  GALLERY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Gallery management functionality would be implemented here</p>
                  <Button className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                    Add Gallery Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status-setup" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
              <span>Restaurant</span>
              <span className="mx-2">{'>'}</span>
              <span>Restaurant Status</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT STATUS</h2>
            <StatusSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="categories-setup" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
              <span>Restaurant</span>
              <span className="mx-2">{'>'}</span>
              <span>Restaurant Categories</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT CATEGORIES</h2>
            <CategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="sub-categories-setup" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
              <span>Restaurant</span>
              <span className="mx-2">{'>'}</span>
              <span>Restaurant Sub Categories</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT SUB CATEGORIES</h2>
            <SubCategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-menu" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
              <span>Restaurant</span>
              <span className="mx-2">{'>'}</span>
              <span>Restaurant Menu</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT MENU</h2>
            <RestaurantMenuTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-bookings" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
              <span>Restaurant</span>
              <span className="mx-2">{'>'}</span>
              <span>Table Bookings</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">TABLE BOOKING</h2>
            <RestaurantBookingsTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-order" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center text-sm text-[#1a1a1a] opacity-70 mb-2">
              <span>Restaurant</span>
              <span className="mx-2">{'>'}</span>
              <span>Restaurant Orders</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT ORDERS</h2>
            <RestaurantOrdersTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
