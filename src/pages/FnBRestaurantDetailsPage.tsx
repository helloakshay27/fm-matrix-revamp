import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TextField } from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { StatusSetupTable } from '../components/StatusSetupTable';
import { CategoriesSetupTable } from '../components/CategoriesSetupTable';
import { SubCategoriesSetupTable } from '../components/SubCategoriesSetupTable';
import { RestaurantMenuTable } from '../components/RestaurantMenuTable';
import { RestaurantBookingsTable } from '../components/RestaurantBookingsTable';
import { RestaurantOrdersTable } from '../components/RestaurantOrdersTable';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { editRestaurant, fetchRestaurantDetails } from '@/store/slices/f&bSlice';

interface Restaurant {
  id: number;
  name: string;
  cuisines: string;
  cost_for_two: string;
  address: string;
  delivery_time: string;
  phoneNumber: string;
  cancelBeforeSchedule: string;
  bookingAllowed: boolean;
  closingMessage: string;
  openDays: string;
  orderAllowed: boolean;
  active: boolean;
}

type DaySchedule = {
  day:
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  bookingAllowed: boolean;
  orderAllowed: boolean;
  lastBookingTime: string;
};

type BlockedDay = {
  date: string;
  orderBlocked: boolean;
  bookingBlocked: boolean;
};

const mockRestaurants: Restaurant[] = [
  {
    id: 80,
    name: '',
    cuisines: '',
    cost_for_two: '',
    address: '',
    delivery_time: '',
    phoneNumber: '',
    cancelBeforeSchedule: '',
    bookingAllowed: true,
    closingMessage: '',
    openDays: 'M T W T F S S',
    orderAllowed: false,
    active: true,
  },
];

const mapRestaurantData = (apiData: any): {
  restaurant: Restaurant;
  schedule: DaySchedule[];
  coverImages: string[];
  menuImages: string[];
  mainImages: string[];
  blockedDays: BlockedDay[];
} => {
  const restaurant: Restaurant = {
    id: apiData.id,
    name: apiData.name,
    cuisines: apiData.cuisines,
    cost_for_two: apiData.cost_for_two.toString(),
    address: apiData.address,
    delivery_time: apiData.delivery_time.toString(),
    phoneNumber: apiData.contact1,
    cancelBeforeSchedule: apiData.cancel_before.toString(),
    bookingAllowed: !!apiData.booking_allowed,
    closingMessage: apiData.booking_closed || apiData.disclaimer || '-',
    openDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      .filter((day) => apiData[day])
      .map((day) => day.charAt(0).toUpperCase())
      .join(' '),
    orderAllowed: !!apiData.can_order,
    active: !!apiData.status,
  };

  const schedule: DaySchedule[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ].map((day, index) => {
    const op = apiData.restaurant_operations.find(
      (o: any) => o.day_name === day
    ) || {
      day_name: day,
      is_open: false,
      start_time: '00:00',
      end_time: '00:00',
      break_start_time: '00:00',
      break_end_time: '00:00',
      booking_allowed: false,
      order_allowed: false,
      last_order_time: '00:00',
    };
    return {
      day: op.day_name as DaySchedule['day'],
      enabled: op.is_open,
      startTime: op.start_time,
      endTime: op.end_time,
      breakStartTime: op.break_start_time,
      breakEndTime: op.break_end_time,
      bookingAllowed: op.booking_allowed,
      orderAllowed: op.order_allowed,
      lastBookingTime: op.last_order_time,
    };
  });

  const coverImages = apiData.cover_images || [];
  const menuImages = apiData.menu_images || [];
  const mainImages = apiData.main_images || [];
  const blockedDays = apiData.blocked_days || [];

  return { restaurant, schedule, coverImages, menuImages, mainImages, blockedDays };
};

export const FnBRestaurantDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const restaurant = mockRestaurants.find(r => r.id === parseInt(id || '80'));
  const [formData, setFormData] = useState<Restaurant>(restaurant || mockRestaurants[0]);
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([
    { day: 'Monday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
    { day: 'Tuesday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
    { day: 'Wednesday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
    { day: 'Thursday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
    { day: 'Friday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
    { day: 'Saturday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
    { day: 'Sunday', enabled: true, startTime: '00:00', endTime: '00:00', breakStartTime: '00:00', breakEndTime: '00:00', bookingAllowed: true, orderAllowed: true, lastBookingTime: '00:00' },
  ]);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [menuImages, setMenuImages] = useState<string[]>([]);
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Use API instead of Redux dispatch for simplicity
        const response = await dispatch(fetchRestaurantDetails({ baseUrl, token, id })).unwrap();
        const { restaurant, schedule, coverImages, menuImages, mainImages, blockedDays } = mapRestaurantData(response);
        setFormData(restaurant);
        setScheduleData(schedule);
        setCoverImages(coverImages);
        setMenuImages(menuImages);
        setMainImages(mainImages);
        setBlockedDays(blockedDays);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch restaurant details');
      }
    };

    fetchDetails();
  }, [dispatch, baseUrl, token, id]);

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

  const handleSave = async () => {
    try {
      const dataToSubmit = new FormData();

      // Append restaurant details
      dataToSubmit.append('restaurant[name]', formData.name);
      dataToSubmit.append('restaurant[cost_for_two]', formData.cost_for_two);
      dataToSubmit.append('restaurant[contact1]', formData.phoneNumber);
      dataToSubmit.append('restaurant[contact2]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[contact3]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[delivery_time]', formData.delivery_time);
      dataToSubmit.append('restaurant[cuisines]', formData.cuisines);
      dataToSubmit.append('restaurant[alcohol]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[wheelchair]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[cod]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[pure_veg]', 'false'); // Not in UI, set as default
      dataToSubmit.append('restaurant[address]', formData.address);
      dataToSubmit.append('restaurant[terms]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[disclaimer]', formData.closingMessage); // Map closingMessage to disclaimer
      dataToSubmit.append('restaurant[booking_closed]', formData.closingMessage);
      dataToSubmit.append('restaurant[min_people]', '0'); // Not in UI, set as default
      dataToSubmit.append('restaurant[max_people]', '0'); // Not in UI, set as default
      dataToSubmit.append('restaurant[cancel_before]', formData.cancelBeforeSchedule);
      dataToSubmit.append('restaurant[booking_not_allowed]', ''); // Not in UI, set as empty
      dataToSubmit.append('restaurant[gst]', '0'); // Not in UI, set as default
      dataToSubmit.append('restaurant[delivery_charge]', '0'); // Not in UI, set as default
      dataToSubmit.append('restaurant[min_amount]', '0'); // Not in UI, set as default
      dataToSubmit.append('restaurant[order_not_allowed]', ''); // Not in UI, set as empty

      // Attach files (empty since UI doesn't support uploads)
      coverImages.forEach((file) => {
        dataToSubmit.append('restaurant[cover_images][]', file);
      });
      menuImages.forEach((file) => {
        dataToSubmit.append('restaurant[menu_images][]', file);
      });
      mainImages.forEach((file) => {
        dataToSubmit.append('restaurant[main_images][]', file);
      });

      // Append only enabled schedules
      scheduleData
        .filter((item) => item.enabled)
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

      // Make API call to update restaurant
      await dispatch(editRestaurant({ token, baseUrl, id, data: dataToSubmit })).unwrap();

      toast.success('Restaurant details saved successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to save restaurant details');
    }
  };

  const fieldStyles = {
    '& .MuiInputBase-root': {
      height: { xs: '36px', sm: '45px' },
      borderRadius: '6px',
    },
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
    '& .MuiInputBase-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="p-6">
      <div className="flex items-center text-sm text-gray-600 mb-4">
        <span>F&B List</span>
        <span className="mx-2">{'>'}</span>
        <span>F&B Detail</span>
      </div>

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

      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 bg-gray-100 gap-1 sm:gap-2 p-1 h-auto">
          <TabsTrigger value="restaurant" className="data-[state=active]:bg-[#C72030] data-[state=active]:text-white whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="status-setup" className="whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Status Setup
          </TabsTrigger>
          <TabsTrigger value="categories-setup" className="whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Categories Setup
          </TabsTrigger>
          <TabsTrigger value="sub-categories-setup" className="whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Sub Categories Setup
          </TabsTrigger>
          <TabsTrigger value="restaurant-menu" className="whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Restaurant Menu
          </TabsTrigger>
          <TabsTrigger value="restaurant-bookings" className="whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Restaurant Bookings
          </TabsTrigger>
          <TabsTrigger value="restaurant-order" className="whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Restaurant Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="mt-6">
          <div className="space-y-6">
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
                    value={formData.delivery_time}
                    onChange={(e) => handleInputChange('delivery_time', e.target.value)}
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
                    value={formData.cost_for_two}
                    onChange={(e) => handleInputChange('cost_for_two', e.target.value)}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={fieldStyles}
                  />
                </div>
              </CardContent>
            </Card>

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
                      className={`relative inline-flex items-center h-6 rounded-full w-11 cursor-pointer transition-colors ${formData.bookingAllowed ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      onClick={() => handleInputChange('bookingAllowed', !formData.bookingAllowed)}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${formData.bookingAllowed ? 'translate-x-6' : 'translate-x-1'
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