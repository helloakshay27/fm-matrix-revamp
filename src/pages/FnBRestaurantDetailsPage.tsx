import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';
import { StatusSetupTable } from '../components/StatusSetupTable';
import { CategoriesSetupTable } from '../components/CategoriesSetupTable';

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

  const handleInputChange = (field: keyof Restaurant, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving restaurant data:', formData);
    alert('Restaurant details saved successfully!');
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
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
        <TabsList className="grid w-full grid-cols-6 bg-gray-100">
          <TabsTrigger value="restaurant" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="status-setup">Status Setup</TabsTrigger>
          <TabsTrigger value="categories-setup">Categories Setup</TabsTrigger>
          <TabsTrigger value="sub-categories-setup">Sub Categories Setup</TabsTrigger>
          <TabsTrigger value="restaurant-menu">Restaurant Menu</TabsTrigger>
          <TabsTrigger value="restaurant-bookings">Restaurant Bookings</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="mt-6">
          <div className="space-y-6">
            {/* Basic Detail */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                  BASIC DETAIL
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="restaurant-name" className="text-sm font-medium">Restaurant Name</Label>
                  <Input
                    id="restaurant-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cuisines" className="text-sm font-medium">Cuisines</Label>
                  <Input
                    id="cuisines"
                    value={formData.cuisines}
                    onChange={(e) => handleInputChange('cuisines', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="delivery-time" className="text-sm font-medium">Delivery Time</Label>
                  <Input
                    id="delivery-time"
                    value={formData.deliveryTime}
                    onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cost-for-two" className="text-sm font-medium">Cost for Two</Label>
                  <Input
                    id="cost-for-two"
                    value={formData.costForTwo}
                    onChange={(e) => handleInputChange('costForTwo', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
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
                      {daysOfWeek.map((day) => (
                        <tr key={day} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Checkbox />
                              <span>{day}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Select defaultValue="06:00">
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
                            <Select defaultValue="23:00">
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
                            <Select defaultValue="13:00">
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
                            <Select defaultValue="14:00">
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
                            <Checkbox checked={formData.bookingAllowed} />
                          </td>
                          <td className="p-3">
                            <Checkbox checked={formData.orderAllowed} />
                          </td>
                          <td className="p-3">
                            <Select defaultValue="00:00">
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
                <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                  Other Info
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="phone-number" className="text-sm font-medium">Phone Number</Label>
                  <Input
                    id="phone-number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="booking-allowed" className="text-sm font-medium">Booking Allowed</Label>
                  <div className="mt-1 flex items-center">
                    <span className="mr-2">No</span>
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
                  </div>
                </div>
                <div>
                  <Label htmlFor="cancel-before-schedule" className="text-sm font-medium">Cancel Before Schedule</Label>
                  <Input
                    id="cancel-before-schedule"
                    value={formData.cancelBeforeSchedule}
                    onChange={(e) => handleInputChange('cancelBeforeSchedule', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="closing-message" className="text-sm font-medium">Closing Message</Label>
                  <Input
                    id="closing-message"
                    value={formData.closingMessage}
                    onChange={(e) => handleInputChange('closingMessage', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cover, Menu, Gallery sections would be added here */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                  Cover
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Cover image upload functionality would be implemented here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">5</span>
                  MENU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Menu management functionality would be implemented here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium text-orange-600 flex items-center gap-2">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">6</span>
                  GALLERY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Gallery management functionality would be implemented here</p>
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
              <span>Restaurant Status</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT STATUS</h2>
            <CategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="sub-categories-setup">
          <div className="p-8 text-center text-gray-500">
            Sub Categories Setup content would be implemented here
          </div>
        </TabsContent>

        <TabsContent value="restaurant-menu">
          <div className="p-8 text-center text-gray-500">
            Restaurant Menu content would be implemented here
          </div>
        </TabsContent>

        <TabsContent value="restaurant-bookings">
          <div className="p-8 text-center text-gray-500">
            Restaurant Bookings content would be implemented here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
