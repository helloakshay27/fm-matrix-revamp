import { useEffect, useRef, useState } from 'react';
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
  id: number;
  dayofweek: string;
  start_hour: number;
  start_min: number;
  end_hour: number;
  end_min: number;
  break_start_hour: number;
  break_start_min: number;
  break_end_hour: number;
  break_end_min: number;
  is_open: boolean;
  booking_allowed: boolean;
  order_allowed: boolean;
  last_hour: number;
  last_min: number;
  day_name: string;
  start_time: string;         // format: "HH:mm"
  end_time: string;           // format: "HH:mm"
  break_start_time: string;   // format: "HH:mm"
  break_end_time: string;     // format: "HH:mm"
  last_order_time: string;
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

  const schedule: DaySchedule[] = apiData.restaurant_operations;

  console.log(schedule)

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
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [menuImages, setMenuImages] = useState<string[]>([]);
  const [mainImages, setMainImages] = useState<string[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Use API instead of Redux dispatch for simplicity
        const response = await dispatch(fetchRestaurantDetails({ baseUrl, token, id })).unwrap();
        const { restaurant, schedule, coverImages, menuImages, mainImages, blockedDays } = mapRestaurantData(response);
        console.log(restaurant)
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

  console.log(scheduleData)

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
        .forEach((item, index) => {
          const [startHour, startMin] = item.start_time.split(':');
          const [endHour, endMin] = item.end_time.split(':');
          const [breakStartHour, breakStartMin] = item.break_start_time.split(':');
          const [breakEndHour, breakEndMin] = item.break_end_time.split(':');
          const [lastHour, lastMin] = item.last_order_time.split(':');

          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][id]`, item.id.toString());
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][is_open]`, item.is_open ? '1' : '0');
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][dayofweek]`, item.dayofweek.toLowerCase());
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][start_hour]`, startHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][start_min]`, startMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][end_hour]`, endHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][end_min]`, endMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_start_hour]`, breakStartHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_start_min]`, breakStartMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_end_hour]`, breakEndHour);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][break_end_min]`, breakEndMin);
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][booking_allowed]`, item.booking_allowed ? '1' : '0');
          dataToSubmit.append(`restaurant[restaurant_operations_attributes][${index}][order_allowed]`, item.order_allowed ? '1' : '0');
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
      backgroundColor: '#F6F7F7',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
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
      backgroundColor: '#F6F7F7',
    },
  };

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="p-6">
      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 bg-[#FAFAFA] gap-1 sm:gap-2 p-1 h-auto" style={{ border: "1px solid #D9D9D9" }}>
          <TabsTrigger value="restaurant" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Restaurant
          </TabsTrigger>
          <TabsTrigger value="status-setup" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Status
          </TabsTrigger>
          <TabsTrigger value="categories-setup" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Categories
          </TabsTrigger>
          <TabsTrigger value="sub-categories-setup" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Sub Categories
          </TabsTrigger>
          <TabsTrigger value="restaurant-menu" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Menu
          </TabsTrigger>
          <TabsTrigger value="restaurant-bookings" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Table Bookings
          </TabsTrigger>
          <TabsTrigger value="restaurant-order" className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3">
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#C72030]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#C72030] rounded-full flex items-center justify-center text-md font-bold">1</span>
                  BASIC DETAIL
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
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
              <CardHeader className="bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#C72030]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#C72030] rounded-full flex items-center justify-center text-md font-bold">2</span>
                  RESTAURANT SCHEDULE
                </CardTitle>
              </CardHeader>
              <CardContent className="py-[31px] bg-[#F6F7F7]"
                style={{ border: "1px solid #D9D9D9" }} >
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
                        <tr key={dayData.dayofweek} className="border-b">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={dayData.is_open}
                                onCheckedChange={(checked) => handleScheduleChange(index, 'is_open', checked)}
                              />
                              <span>{dayData.day_name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Select
                              value={dayData.start_time}
                              onValueChange={(value) => handleScheduleChange(index, 'start_time', value)}
                            >
                              <SelectTrigger className="w-20 bg-transparent">
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
                              value={dayData.end_time}
                              onValueChange={(value) => handleScheduleChange(index, 'end_time', value)}
                            >
                              <SelectTrigger className="w-20  bg-transparent">
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
                              value={dayData.break_start_time}
                              onValueChange={(value) => handleScheduleChange(index, 'break_start_time', value)}
                            >
                              <SelectTrigger className="w-20  bg-transparent">
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
                              value={dayData.break_end_time}
                              onValueChange={(value) => handleScheduleChange(index, 'break_end_time', value)}
                            >
                              <SelectTrigger className="w-20  bg-transparent">
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
                              checked={dayData.booking_allowed}
                              onCheckedChange={(checked) => handleScheduleChange(index, 'booking_allowed', checked)}
                            />
                          </td>
                          <td className="p-3">
                            <Checkbox
                              checked={dayData.order_allowed}
                              onCheckedChange={(checked) => handleScheduleChange(index, 'order_allowed', checked)}
                            />
                          </td>
                          <td className="p-3">
                            <Select
                              value={dayData.last_order_time}
                              onValueChange={(value) => handleScheduleChange(index, 'last_order_time', value)}
                            >
                              <SelectTrigger className="w-20  bg-transparent">
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
              <CardHeader className="bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#C72030]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#C72030] rounded-full flex items-center justify-center text-md font-bold">3</span>
                  OTHER INFO
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 py-[31px] bg-[#F6F7F7]" style={{ border: "1px solid #D9D9D9" }}>
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
              <CardHeader className="bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#C72030]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#C72030] rounded-full flex items-center justify-center text-md font-bold">4</span>
                  COVER
                </CardTitle>
              </CardHeader>
              <CardContent className='py-[31px] bg-[#F6F7F7]' style={{ border: "1px solid #D9D9D9" }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Cover image upload functionality would be implemented here</p>
                  <Button className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                    Upload Cover Image
                  </Button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // handle upload logic here
                        console.log('Cover image selected:', file.name);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#C72030]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#C72030] rounded-full flex items-center justify-center text-md font-bold">5</span>
                  MENU
                </CardTitle>
              </CardHeader>
              <CardContent className='py-[31px] bg-[#F6F7F7]' style={{ border: "1px solid #D9D9D9" }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Menu management functionality would be implemented here</p>
                  <Button className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                    Add Menu Items
                  </Button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // handle upload logic here
                        console.log('Cover image selected:', file.name);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-[#F6F4EE]"
                style={{ border: "1px solid #D9D9D9" }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#C72030]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#C72030] rounded-full flex items-center justify-center text-md font-bold">6</span>
                  GALLERY
                </CardTitle>
              </CardHeader>
              <CardContent className='py-[31px] bg-[#F6F7F7]' style={{ border: "1px solid #D9D9D9" }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Gallery management functionality would be implemented here</p>
                  <Button className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white">
                    Add Gallery Images
                  </Button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // handle upload logic here
                        console.log('Cover image selected:', file.name);
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            <div className='flex justify-end'>
              <Button
                onClick={handleSave}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status-setup" className="mt-6">
          <div className="space-y-4">
            {/* <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT STATUS</h2> */}
            <StatusSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="categories-setup" className="mt-6">
          <div className="space-y-4">
            {/* <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT CATEGORIES</h2> */}
            <CategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="sub-categories-setup" className="mt-6">
          <div className="space-y-4">
            {/* <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT SUB CATEGORIES</h2> */}
            <SubCategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-menu" className="mt-6">
          <div className="space-y-4">
            {/* <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT MENU</h2> */}
            <RestaurantMenuTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-bookings" className="mt-6">
          <div className="space-y-4">
            {/* <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">TABLE BOOKING</h2> */}
            <RestaurantBookingsTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-order" className="mt-6">
          <div className="space-y-4">
            {/* <h2 className="text-xl font-bold text-[#1a1a1a] mb-4">RESTAURANT ORDERS</h2> */}
            <RestaurantOrdersTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};