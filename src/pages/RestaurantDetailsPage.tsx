import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  cuisines: string;
  costForTwo: string;
  address: string;
  deliveryTime: string;
  phoneNumber: string;
  bookingAllowed: boolean;
  cancelBeforeSchedule: string;
  closingMessage: string;
  openDays: string;
  orderAllowed: boolean;
  active: boolean;
}

const mockRestaurantDetails: Restaurant = {
  id: 1,
  name: 'Test restaurant',
  cuisines: 'Indian',
  costForTwo: '₹499',
  address: 'test 123',
  deliveryTime: '45 Mins',
  phoneNumber: '3534534634',
  bookingAllowed: false,
  cancelBeforeSchedule: '30 min.',
  closingMessage: '',
  openDays: 'M T W T F S S',
  orderAllowed: false,
  active: false
};

const scheduleData = [
  { day: 'Monday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } },
  { day: 'Tuesday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } },
  { day: 'Wednesday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } },
  { day: 'Thursday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } },
  { day: 'Friday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } },
  { day: 'Saturday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } },
  { day: 'Sunday', startTime: { hour: '06', minute: '00' }, endTime: { hour: '23', minute: '00' }, breakStartTime: { hour: '13', minute: '00' }, breakEndTime: { hour: '14', minute: '00' }, bookingAllowed: false, orderAllowed: false, lastBookingTime: { hour: '00', minute: '00' } }
];

export const RestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant>(mockRestaurantDetails);
  const [schedule, setSchedule] = useState(scheduleData);
  const [isEditing, setIsEditing] = useState(false);

  const generateHourOptions = () => {
    return Array.from({ length: 24 }, (_, i) => {
      const hour = i.toString().padStart(2, '0');
      return <SelectItem key={hour} value={hour}>{hour}</SelectItem>;
    });
  };

  const generateMinuteOptions = () => {
    return Array.from({ length: 60 }, (_, i) => {
      const minute = i.toString().padStart(2, '0');
      return <SelectItem key={minute} value={minute}>{minute}</SelectItem>;
    });
  };

  const handleScheduleChange = (dayIndex: number, field: string, timeType: string, value: string) => {
    setSchedule(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          [field]: {
            ...day[field as keyof typeof day],
            [timeType]: value
          }
        };
      }
      return day;
    }));
  };

  const handleToggleChange = (dayIndex: number, field: string) => {
    setSchedule(prev => prev.map((day, index) => {
      if (index === dayIndex) {
        return {
          ...day,
          [field]: !day[field as keyof typeof day]
        };
      }
      return day;
    }));
  };

  const handleSave = () => {
    // Here you would typically save the data to your backend
    console.log('Saving restaurant data:', { restaurant, schedule });
    setIsEditing(false);
    // Show success message or redirect
  };

  const handleBack = () => {
    navigate('/vas/fnb');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <button onClick={handleBack} className="flex items-center gap-1 hover:text-[#C72030]">
            <ArrowLeft className="w-4 h-4" />
            F&B List
          </button>
          <span>&gt;</span>
          <span>F&B Detail</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#1a1a1a] uppercase">F&B DETAIL</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#C72030] hover:bg-[#C72030]/90 text-white"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="restaurant" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Restaurant</TabsTrigger>
          <TabsTrigger value="status-setup" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Status Setup</TabsTrigger>
          <TabsTrigger value="categories-setup" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Categories Setup</TabsTrigger>
          <TabsTrigger value="sub-categories-setup" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Sub Categories Setup</TabsTrigger>
          <TabsTrigger value="restaurant-menu" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Restaurant Menu</TabsTrigger>
          <TabsTrigger value="restaurant-bookings" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Restaurant Bookings</TabsTrigger>
          <TabsTrigger value="restaurant-orders" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white">Restaurant Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Basic Detail Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h2 className="text-lg font-semibold text-[#C72030] uppercase">BASIC DETAIL</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Restaurant Name</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.name}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Cuisines</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.cuisines}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Cost for Two</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.costForTwo}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.address}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Delivery Time</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.deliveryTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Schedule Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <h2 className="text-lg font-semibold text-[#C72030] uppercase">RESTAURANT SCHEDULE</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operational Days</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Break Start Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Break End Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Allowed</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Allowed</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Booking & Order Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((day, index) => (
                      <tr key={day.day} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-900">{day.day}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Select 
                              value={day.startTime.hour} 
                              onValueChange={(value) => handleScheduleChange(index, 'startTime', 'hour', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateHourOptions()}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={day.startTime.minute} 
                              onValueChange={(value) => handleScheduleChange(index, 'startTime', 'minute', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateMinuteOptions()}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Select 
                              value={day.endTime.hour} 
                              onValueChange={(value) => handleScheduleChange(index, 'endTime', 'hour', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateHourOptions()}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={day.endTime.minute} 
                              onValueChange={(value) => handleScheduleChange(index, 'endTime', 'minute', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateMinuteOptions()}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Select 
                              value={day.breakStartTime.hour} 
                              onValueChange={(value) => handleScheduleChange(index, 'breakStartTime', 'hour', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateHourOptions()}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={day.breakStartTime.minute} 
                              onValueChange={(value) => handleScheduleChange(index, 'breakStartTime', 'minute', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateMinuteOptions()}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Select 
                              value={day.breakEndTime.hour} 
                              onValueChange={(value) => handleScheduleChange(index, 'breakEndTime', 'hour', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateHourOptions()}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={day.breakEndTime.minute} 
                              onValueChange={(value) => handleScheduleChange(index, 'breakEndTime', 'minute', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateMinuteOptions()}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={day.bookingAllowed}
                            onChange={() => handleToggleChange(index, 'bookingAllowed')}
                            disabled={!isEditing}
                            className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={day.orderAllowed}
                            onChange={() => handleToggleChange(index, 'orderAllowed')}
                            disabled={!isEditing}
                            className="w-4 h-4 text-[#C72030] border-gray-300 rounded focus:ring-[#C72030]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <Select 
                              value={day.lastBookingTime.hour} 
                              onValueChange={(value) => handleScheduleChange(index, 'lastBookingTime', 'hour', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateHourOptions()}
                              </SelectContent>
                            </Select>
                            <Select 
                              value={day.lastBookingTime.minute} 
                              onValueChange={(value) => handleScheduleChange(index, 'lastBookingTime', 'minute', value)}
                              disabled={!isEditing}
                            >
                              <SelectTrigger className="w-16 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {generateMinuteOptions()}
                              </SelectContent>
                            </Select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Info Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                <h2 className="text-lg font-semibold text-[#C72030] uppercase">Other Info</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.phoneNumber}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Cancel Before Schedule</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.cancelBeforeSchedule}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Booking Allowed</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.bookingAllowed ? 'YES' : 'NO'}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="text-sm font-medium text-gray-700">Closing Message</label>
                    <div className="text-sm text-[#C72030] font-medium">: {restaurant.closingMessage || '-'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="px-8"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Other tab contents would go here */}
        <TabsContent value="status-setup" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Status Setup content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="categories-setup" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Categories Setup content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="sub-categories-setup" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Sub Categories Setup content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="restaurant-menu" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Restaurant Menu content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="restaurant-bookings" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Restaurant Bookings content will be implemented here.</p>
          </div>
        </TabsContent>

        <TabsContent value="restaurant-orders" className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Restaurant Orders content will be implemented here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
