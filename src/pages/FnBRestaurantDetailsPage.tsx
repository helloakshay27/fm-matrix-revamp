import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel } from '@mui/material';
import { ArrowLeft, Save } from 'lucide-react';
import { StatusSetupTable } from '../components/StatusSetupTable';
import { CategoriesSetupTable } from '../components/CategoriesSetupTable';
import { SubCategoriesSetupTable } from '../components/SubCategoriesSetupTable';
import { RestaurantMenuTable } from '../components/RestaurantMenuTable';
import { RestaurantBookingsTable } from '../components/RestaurantBookingsTable';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { editRestaurant, fetchRestaurantDetails } from '@/store/slices/f&bSlice';
import { RestaurantOrdersTable } from '@/components/RestaurantOrdersTable';

interface Restaurant {
  id: number;
  name: string;
  cost_for_two: string;
  contact1: string;
  contact2: string;
  contact3: string;
  delivery_time: string;
  cuisines: string;
  alcohol: string;
  wheelchair: string;
  cod: string;
  pure_veg: string;
  address: string;
  terms: string;
  disclaimer: string;
  booking_closed: string;
  min_people: string;
  max_people: string;
  cancel_before: string;
  booking_not_allowed: string;
  gst: string;
  delivery_charge: string;
  min_amount: string;
  order_not_allowed: string;
  bookingAllowed: boolean;
  orderAllowed: boolean;
  active: boolean;
}

interface DaySchedule {
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
  start_time: string;
  end_time: string;
  break_start_time: string;
  break_end_time: string;
  last_order_time: string;
}

interface BlockedDay {
  date: string;
  orderBlocked: boolean;
  bookingBlocked: boolean;
}

const mapRestaurantData = (apiData: any): {
  restaurant: Restaurant;
  schedule: DaySchedule[];
  coverImages: string[];
  menuImages: string[];
  mainImages: string[];
  blockedDays: BlockedDay[];
} => {
  console.log(apiData)
  const restaurant: Restaurant = {
    id: apiData.id,
    name: apiData.name || '',
    cost_for_two: apiData.cost_for_two || '',
    contact1: apiData.contact1 || '',
    contact2: apiData.contact2 || '',
    contact3: apiData.contact3 || '',
    delivery_time: apiData.delivery_time || '',
    cuisines: apiData.cuisines || '',
    alcohol: apiData.alcohol || '',
    wheelchair: apiData.wheelchair || '',
    cod: apiData.cod || '',
    pure_veg: apiData.pure_veg ? "yes" : "no",
    address: apiData.address || '',
    terms: apiData.terms || '',
    disclaimer: apiData.disclaimer || '',
    booking_closed: apiData.booking_closed || '',
    min_people: apiData.min_people || '',
    max_people: apiData.max_people || '',
    cancel_before: apiData.cancel_before || '',
    booking_not_allowed: apiData.booking_not_allowed || '',
    gst: apiData.gst || '',
    delivery_charge: apiData.delivery_charge || '0',
    min_amount: apiData.min_amount || '',
    order_not_allowed: apiData.order_not_allowed || '',
    bookingAllowed: !!apiData.booking_allowed,
    orderAllowed: !!apiData.can_order,
    active: !!apiData.status,
  };

  const schedule: DaySchedule[] = apiData.restaurant_operations || [];
  const coverImages: string[] = apiData.cover_images?.map((img: any) => img?.document) || [];
  const menuImages: string[] = apiData.menu_images?.map((img: any) => img?.document) || [];
  const mainImages: string[] = apiData.main_images?.map((img: any) => img?.document) || [];
  const blockedDays: BlockedDay[] = apiData.blocked_days || [];

  return { restaurant, schedule, coverImages, menuImages, mainImages, blockedDays };
};

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'transperent',
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

export const FnBRestaurantDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState<Restaurant>({
    id: 0,
    name: '',
    cost_for_two: '',
    contact1: '',
    contact2: '',
    contact3: '',
    delivery_time: '',
    cuisines: '',
    alcohol: '',
    wheelchair: '',
    cod: '',
    pure_veg: 'No',
    address: '',
    terms: '',
    disclaimer: '',
    booking_closed: '',
    min_people: '',
    max_people: '',
    cancel_before: '',
    booking_not_allowed: '',
    gst: '',
    delivery_charge: '0',
    min_amount: '',
    order_not_allowed: '',
    bookingAllowed: true,
    orderAllowed: false,
    active: true,
  });
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [blockedDays, setBlockedDays] = useState<BlockedDay[]>([]);
  const [coverImages, setCoverImages] = useState<File[]>([]);
  const [menuImages, setMenuImages] = useState<File[]>([]);
  const [mainImages, setMainImages] = useState<File[]>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string[]>([]);
  const [menuImagesPreview, setMenuImagesPreview] = useState<string[]>([]);
  const [mainImagesPreview, setMainImagesPreview] = useState<string[]>([]);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImages(file);
      setCoverImagePreview(prev => [...prev, imageUrl]);
      console.log('Cover image selected:', file.name);
    }
  };

  const handleMenuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setMenuImages((prev) => [...prev, ...files]);
      setMenuImagesPreview((prev) => [...prev, ...imageUrls]);
      files.forEach((file) => console.log('Menu image selected:', file.name));
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const imageUrls = files.map((file) => URL.createObjectURL(file));
      setMainImages((prev) => [...prev, ...files]);
      setMainImagesPreview((prev) => [...prev, ...imageUrls]);
      files.forEach((file) => console.log('Gallery image selected:', file.name));
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await dispatch(fetchRestaurantDetails({ baseUrl, token, id })).unwrap();
        const { restaurant, schedule, coverImages, menuImages, mainImages, blockedDays } = mapRestaurantData(response);
        setFormData(restaurant);
        setScheduleData(schedule);
        setCoverImagePreview(coverImages);
        setMenuImagesPreview(menuImages);
        setMainImagesPreview(mainImages);
        setBlockedDays(blockedDays);
      } catch (error) {
        console.log(error);
        toast.error('Failed to fetch restaurant details');
      }
    };

    fetchDetails();
  }, [dispatch, baseUrl, token, id]);

  const handleInputChange = (field: keyof Restaurant, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScheduleChange = (dayIndex: number, field: keyof DaySchedule, value: any) => {
    setScheduleData((prev) =>
      prev.map((day, index) => (index === dayIndex ? { ...day, [field]: value } : day))
    );
  };

  const addBlockedDay = () => {
    setBlockedDays((prev) => [...prev, { date: '', orderBlocked: false, bookingBlocked: false }]);
  };

  const removeBlockedDay = (index: number) => {
    setBlockedDays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const dataToSubmit = new FormData();

      dataToSubmit.append('restaurant[name]', formData.name);
      dataToSubmit.append('restaurant[cost_for_two]', formData.cost_for_two);
      dataToSubmit.append('restaurant[contact1]', formData.contact1);
      dataToSubmit.append('restaurant[contact2]', formData.contact2);
      dataToSubmit.append('restaurant[contact3]', formData.contact3);
      dataToSubmit.append('restaurant[delivery_time]', formData.delivery_time);
      dataToSubmit.append('restaurant[cuisines]', formData.cuisines);
      dataToSubmit.append('restaurant[alcohol]', formData.alcohol);
      dataToSubmit.append('restaurant[wheelchair]', formData.wheelchair);
      dataToSubmit.append('restaurant[cod]', formData.cod);
      dataToSubmit.append('restaurant[pure_veg]', formData.pure_veg);
      dataToSubmit.append('restaurant[address]', formData.address);
      dataToSubmit.append('restaurant[terms]', formData.terms);
      dataToSubmit.append('restaurant[disclaimer]', formData.disclaimer);
      dataToSubmit.append('restaurant[booking_closed]', formData.booking_closed);
      dataToSubmit.append('restaurant[min_people]', formData.min_people);
      dataToSubmit.append('restaurant[max_people]', formData.max_people);
      dataToSubmit.append('restaurant[cancel_before]', formData.cancel_before);
      dataToSubmit.append('restaurant[booking_not_allowed]', formData.booking_not_allowed);
      dataToSubmit.append('restaurant[gst]', formData.gst);
      dataToSubmit.append('restaurant[delivery_charge]', formData.delivery_charge);
      dataToSubmit.append('restaurant[min_amount]', formData.min_amount);
      dataToSubmit.append('restaurant[order_not_allowed]', formData.order_not_allowed);

      if (coverImages) {
        dataToSubmit.append('restaurant[cover_images][]', coverImages);
      }
      menuImages.forEach((file) => {
        dataToSubmit.append('restaurant[menu_images][]', file);
      });
      mainImages.forEach((file) => {
        dataToSubmit.append('restaurant[main_images][]', file);
      });

      scheduleData.forEach((item, index) => {
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

      blockedDays.forEach((day, index) => {
        dataToSubmit.append(`restaurant[blocked_days_attributes][${index}][date]`, day.date);
        dataToSubmit.append(`restaurant[blocked_days_attributes][${index}][order_blocked]`, day.orderBlocked ? '1' : '0');
        dataToSubmit.append(`restaurant[blocked_days_attributes][${index}][booking_blocked]`, day.bookingBlocked ? '1' : '0');
      });

      await dispatch(editRestaurant({ token, baseUrl, id, data: dataToSubmit })).unwrap();
      toast.success('Restaurant details saved successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to save restaurant details');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6">
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
      </div>

      <Tabs defaultValue="restaurant" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 bg-[#FAFAFA] gap-1 sm:gap-2 p-1 h-auto" style={{ border: '1px solid #D9D9D9' }}>
          <TabsTrigger
            value="restaurant"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Restaurant
          </TabsTrigger>
          <TabsTrigger
            value="status-setup"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Status
          </TabsTrigger>
          <TabsTrigger
            value="categories-setup"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="sub-categories-setup"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Sub Categories
          </TabsTrigger>
          <TabsTrigger
            value="restaurant-menu"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Menu
          </TabsTrigger>
          <TabsTrigger
            value="restaurant-bookings"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Table Bookings
          </TabsTrigger>
          <TabsTrigger
            value="restaurant-orders"
            className="data-[state=active]:bg-[#EDEAE3] bg-[#FAFAFA] data-[state=active]:text-[#C72030] text-[#1A1A1A] whitespace-nowrap text-xs sm:text-sm px-2 py-2 sm:px-3"
          >
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="restaurant" className="mt-6">
          <div className="space-y-6">
            {/* Basic Details */}
            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">1</span>
                  BASIC DETAIL
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div>
                  <TextField
                    label="Restaurant Name"
                    required
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
                    label="Cost For Two"
                    required
                    type="number"
                    value={formData.cost_for_two}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || parseFloat(value) >= 0) {
                        handleInputChange('cost_for_two', value);
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
                    value={formData.contact1}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      if (onlyDigits.length <= 10) {
                        handleInputChange('contact1', onlyDigits);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.'].includes(e.key) || (e.key.length === 1 && !/\d/.test(e.key))) {
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
                    type="text"
                    value={formData.contact2}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      if (onlyDigits.length <= 10) {
                        handleInputChange('contact2', onlyDigits);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.', ' '].includes(e.key) || (e.key.length === 1 && !/\d/.test(e.key))) {
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
                    type="text"
                    value={formData.contact3}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      if (onlyDigits.length <= 10) {
                        handleInputChange('contact3', onlyDigits);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.', ' '].includes(e.key) || (e.key.length === 1 && !/\d/.test(e.key))) {
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
                    type="text"
                    value={formData.delivery_time}
                    onChange={(e) => {
                      const onlyDigits = e.target.value.replace(/\D/g, '');
                      handleInputChange('delivery_time', onlyDigits);
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.', ' '].includes(e.key) || (e.key.length === 1 && !/\d/.test(e.key))) {
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
                    onChange={(e) => handleInputChange('cuisines', e.target.value)}
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
                      value={formData.alcohol}
                      onChange={(e) => handleInputChange('alcohol', e.target.value)}
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
                      value={formData.wheelchair}
                      onChange={(e) => handleInputChange('wheelchair', e.target.value)}
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
                      value={formData.cod}
                      onChange={(e) => handleInputChange('cod', e.target.value)}
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
                      value={formData.pure_veg}
                      onChange={(e) => handleInputChange('pure_veg', e.target.value)}
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
                    value={formData.terms}
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
                    value={formData.booking_closed}
                    onChange={(e) => setFormData(prev => ({ ...prev, closingMessage: e.target.value }))}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Restaurant Schedule */}
            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">2</span>
                  RESTAURANT SCHEDULE
                </CardTitle>
              </CardHeader>
              <CardContent className="py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
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
                            <div className="flex gap-1">
                              <select
                                value={dayData.start_time.split(':')[0]}
                                onChange={(e) => handleScheduleChange(index, 'start_time', `${e.target.value}:${dayData.start_time.split(':')[1] || '00'}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={dayData.start_time.split(':')[1] || '00'}
                                onChange={(e) => handleScheduleChange(index, 'start_time', `${dayData.start_time.split(':')[0]}:${e.target.value}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <select
                                value={dayData.end_time.split(':')[0]}
                                onChange={(e) => handleScheduleChange(index, 'end_time', `${e.target.value}:${dayData.end_time.split(':')[1] || '00'}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={dayData.end_time.split(':')[1] || '00'}
                                onChange={(e) => handleScheduleChange(index, 'end_time', `${dayData.end_time.split(':')[0]}:${e.target.value}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <select
                                value={dayData.break_start_time.split(':')[0]}
                                onChange={(e) => handleScheduleChange(index, 'break_start_time', `${e.target.value}:${dayData.break_start_time.split(':')[1] || '00'}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={dayData.break_start_time.split(':')[1] || '00'}
                                onChange={(e) => handleScheduleChange(index, 'break_start_time', `${dayData.break_start_time.split(':')[0]}:${e.target.value}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <select
                                value={dayData.break_end_time.split(':')[0]}
                                onChange={(e) => handleScheduleChange(index, 'break_end_time', `${e.target.value}:${dayData.break_end_time.split(':')[1] || '00'}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={dayData.break_end_time.split(':')[1] || '00'}
                                onChange={(e) => handleScheduleChange(index, 'break_end_time', `${dayData.break_end_time.split(':')[0]}:${e.target.value}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 60 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                            </div>
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
                            <div className="flex gap-1">
                              <select
                                value={dayData.last_order_time.split(':')[0]}
                                onChange={(e) => handleScheduleChange(index, 'last_order_time', `${e.target.value}:${dayData.last_order_time.split(':')[1] || '00'}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
                              >
                                {Array.from({ length: 24 }, (_, i) => (
                                  <option key={i} value={i.toString().padStart(2, '0')}>
                                    {i.toString().padStart(2, '0')}
                                  </option>
                                ))}
                              </select>
                              <select
                                value={dayData.last_order_time.split(':')[1] || '00'}
                                onChange={(e) => handleScheduleChange(index, 'last_order_time', `${dayData.last_order_time.split(':')[0]}:${e.target.value}`)}
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-14 bg-transparent"
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
              </CardContent>
            </Card>

            {/* Blocked Days */}
            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">3</span>
                  BLOCKED DAYS
                </CardTitle>
              </CardHeader>
              <CardContent className="py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div className="space-y-4">
                  {blockedDays.map((day, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded">
                      <TextField
                        type="date"
                        value={day.date}
                        onChange={(e) =>
                          setBlockedDays((prev) =>
                            prev.map((item, i) => (i === index ? { ...item, date: e.target.value } : item))
                          )
                        }
                        sx={fieldStyles}
                        InputLabelProps={{ shrink: true }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={day.orderBlocked}
                            onChange={(e) =>
                              setBlockedDays((prev) =>
                                prev.map((item, i) => (i === index ? { ...item, orderBlocked: e.target.checked } : item))
                              )
                            }
                            sx={checkboxStyles}
                          />
                        }
                        label="Order Blocked"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={day.bookingBlocked}
                            onChange={(e) =>
                              setBlockedDays((prev) =>
                                prev.map((item, i) => (i === index ? { ...item, bookingBlocked: e.target.checked } : item))
                              )
                            }
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
              </CardContent>
            </Card>

            {/* Table Booking Configuration */}
            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">4</span>
                  TABLE BOOKING CONFIGURATION
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div>
                  <TextField
                    label="Min Person"
                    value={formData.min_people}
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, '');
                      handleInputChange('min_people', digitsOnly);
                    }}
                    onKeyDown={(e) => {
                      if (['e', 'E', '+', '-', '.', ' '].includes(e.key) || (e.key.length === 1 && !/\d/.test(e.key))) {
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
                    value={formData.max_people}
                    onChange={(e) => handleInputChange('max_people', e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <TextField
                    label="Can Cancel Before (Hours)"
                    value={formData.cancel_before}
                    onChange={(e) => handleInputChange('cancel_before', e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <TextField
                    label="Booking Not Available Text"
                    value={formData.booking_not_allowed}
                    onChange={(e) => handleInputChange('booking_not_allowed', e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Configuration */}
            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">5</span>
                  ORDER CONFIGURATION
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div>
                  <TextField
                    label="GST (%)"
                    value={formData.gst}
                    onChange={(e) => handleInputChange('gst', e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <TextField
                    label={`Delivery Charge (${localStorage.getItem('currency')})`}
                    value={formData.delivery_charge}
                    onChange={(e) => handleInputChange('delivery_charge', e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <TextField
                    label={`Minimum Order (${localStorage.getItem('currency')})`}
                    value={formData.min_amount}
                    onChange={(e) => handleInputChange('min_amount', e.target.value)}
                    fullWidth
                    variant="outlined"
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div>
                  <TextField
                    label="Order Not Allowed Text"
                    value={formData.order_not_allowed}
                    onChange={(e) => handleInputChange('order_not_allowed', e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    sx={fieldStyles}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}

            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">6</span>
                  COVER
                </CardTitle>
              </CardHeader>
              <CardContent className="py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Upload a cover image for the restaurant</p>
                  <Button
                    className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Upload Cover Image
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverInputRef}
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                </div>
                {coverImagePreview.length > 0 && (
                  <div className="mt-4 flex items-center gap-4">
                    {coverImagePreview.map((url, index) => (
                      <img key={index} src={url || url.document} alt={`Menu Preview ${index}`} className="w-24 h-24" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">7</span>
                  MENU
                </CardTitle>
              </CardHeader>
              <CardContent className="py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Upload menu images for the restaurant</p>
                  <Button
                    className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                    onClick={() => menuInputRef.current?.click()}
                  >
                    Add Menu Images
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={menuInputRef}
                    className="hidden"
                    onChange={handleMenuChange}
                  />
                </div>
                {menuImagesPreview.length > 0 && (
                  <div className="mt-4 flex items-center gap-4">
                    {menuImagesPreview.map((url, index) => (
                      <img key={index} src={url || url.document} alt={`Menu Preview ${index}`} className="w-24 h-24" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-[#F6F4EE]" style={{ border: '1px solid #D9D9D9' }}>
                <CardTitle className="flex items-center gap-4 text-[20px] fw-semibold text-[#000]">
                  <span className="w-[40px] h-[40px] bg-[#E5E0D3] text-[#000] rounded-full flex items-center justify-center text-md font-bold">8</span>
                  GALLERY
                </CardTitle>
              </CardHeader>
              <CardContent className="py-[31px] bg-[#F6F7F7]" style={{ border: '1px solid #D9D9D9' }}>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Upload gallery images for the restaurant</p>
                  <Button
                    className="mt-4 bg-[#C72030] hover:bg-[#C72030]/90 text-white"
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    Add Gallery Images
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={galleryInputRef}
                    className="hidden"
                    onChange={handleGalleryChange}
                  />
                </div>
                {mainImagesPreview.length > 0 && (
                  <div className="mt-4 flex items-center gap-4">
                    {mainImagesPreview.map((url, index) => (
                      <img key={index} src={url || url.document} alt={`Gallery Preview ${index}`} className="w-24 h-24" />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button
                onClick={handleSave}
                className="bg-[#C72030] hover:bg-[#C72030]/90 text-white flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
              >
                Back
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status-setup" className="mt-6">
          <div className="space-y-4">
            <StatusSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="categories-setup" className="mt-6">
          <div className="space-y-4">
            <CategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="sub-categories-setup" className="mt-6">
          <div className="space-y-4">
            <SubCategoriesSetupTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-menu" className="mt-6">
          <div className="space-y-4">
            <RestaurantMenuTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-bookings" className="mt-6">
          <div className="space-y-4">
            <RestaurantBookingsTable />
          </div>
        </TabsContent>

        <TabsContent value="restaurant-orders" className="mt-6">
          <div className="space-y-4">
            <RestaurantOrdersTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FnBRestaurantDetailsPage;