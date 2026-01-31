import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CheckCircle, FileText, Shield, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { fetchEntities } from '@/store/slices/entitiesSlice';
import { fetchActiveFacilities } from '@/store/slices/facilitySetupsSlice';
import { fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';
import axios from 'axios';

const fieldStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '0.375rem',
    backgroundColor: 'white',
    height: {
      xs: '36px',
      sm: '45px'
    },
    '& fieldset': {
      borderColor: '#d1d5db',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
    },
  },
  '& .MuiInputLabel-root': {
    '&.Mui-focused': {
      color: '#3b82f6',
    },
  },
};

export const AddFacilityBookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  // Get URL parameters
  const urlFacilityId = searchParams.get('facility_id');
  const urlDate = searchParams.get('date');
  const urlSlotTime = searchParams.get('slot_time');

  const { data: fmUsersResponse, loading: fmUsersLoading, error: fmUsersError } = useAppSelector((state) => state.fmUsers);
  const fmUsers = fmUsersResponse?.users || [];

  const occupantUsersState = useAppSelector((state) => state.occupantUsers);
  const occupantUsers = occupantUsersState?.users?.transformedUsers || [];
  const occupantUsersLoading = occupantUsersState?.loading;
  const occupantUsersError = occupantUsersState?.error;

  const [guestUsers, setGuestUsers] = useState([]);
  const [guestUsersLoading, setGuestUsersLoading] = useState(false);
  const [guestUsersError, setGuestUsersError] = useState(null);

  const { data: entitiesResponse, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const entities = Array.isArray(entitiesResponse?.entities) ? entitiesResponse.entities :
    Array.isArray(entitiesResponse) ? entitiesResponse : [];

  const { data: facilitySetupsResponse, loading: facilitySetupsLoading, error: facilitySetupsError } = useAppSelector((state) => state.fetchActiveFacilities);
  const facilities = Array.isArray(facilitySetupsResponse?.facility_setups) ? facilitySetupsResponse.facility_setups :
    Array.isArray(facilitySetupsResponse) ? facilitySetupsResponse : [];

  const [userType, setUserType] = useState('self');
  const [selectedUser, setSelectedUser] = useState(JSON.parse(localStorage.getItem('user') || '{}').id);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [comment, setComment] = useState('');
  const [users, setUsers] = useState([])
  const [facilityDetails, setFacilityDetails] = useState<{
    bill_to_company: number;
    postpaid: number;
    prepaid: number;
    pay_on_facility: number;
    complementary: number;
    fac_type?: string;
    max_people?: number;
    facility_charge?: {
      adult_member_charge?: number;
      adult_guest_charge?: number;
      child_member_charge?: number;
      child_guest_charge?: number;
      per_slot_charge?: number;
    };
    gst?: number;
    sgst?: number;
    facility_setup_accessories?: Array<{
      facility_setup_accessory: {
        id: number;
        pms_inventory_id: number;
        pms_inventory?: {
          id: number;
          name: string;
        };
      };
    }>;
  } | null>(null);
  const [selectedAccessories, setSelectedAccessories] = useState<{ [id: number]: number }>({});
  const [availableAccessories, setAvailableAccessories] = useState<Array<{
    id: number;
    name: string;
    inventoryId: number;
    price: number;
  }>>([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [slots, setSlots] = useState<Array<{
    id: number;
    start_minute: number;
    end_minute: number;
    start_hour: number;
    end_hour: number;
    ampm: string;
    wrap_time: number;
    booked_by: string;
    formated_start_hour: string;
    formated_end_hour: string;
    formated_start_minute: string;
    formated_end_minute: string;
    is_premium: boolean | null;
    premium_percentage: number | null;
  }>>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [bookingRuleData, setBookingRuleData] = useState<{
    can_book: boolean;
    rate: number;
    multiple_bookings?: boolean;
    multiple_booking_count?: number;
    concurrent_slots?: number;
  } | null>(null);
  const [flexiblePriceData, setFlexiblePriceData] = useState<{
    success: boolean;
    total_minutes: number;
    total_hours_charged: number;
    slab_price: number;
    cgst_amount: number;
    sgst_amount: number;
    total_amount: number;
    used_slab: {
      id: number;
      duration_hours: number;
      price: string;
    };
  } | null>(null);

  // Helper: Check if facility is requestable type
  const isRequestableType = facilityDetails?.fac_type === 'request';

  // Helper: Check if slot selection is allowed
  const canSelectSlots = (facilityDetails?.fac_type === 'request' && bookingRuleData) ? bookingRuleData.can_book !== false : true;
  // Helper: Max slots user can select
  const maxSelectableSlots = isRequestableType
    ? Infinity // For requestable, allow unlimited consecutive slots
    : (bookingRuleData && bookingRuleData.multiple_bookings ? (bookingRuleData.multiple_booking_count || 1) : 1);
  // Helper: Max concurrent slots
  const maxConcurrentSlots = isRequestableType
    ? (facilityDetails?.max_people || 10) // For requestable, enforce consecutive slots up to max_people
    : (bookingRuleData && bookingRuleData.concurrent_slots ? bookingRuleData.concurrent_slots : 1);

  // Helper: Check if consecutive selection is valid
  const isConsecutiveSelection = (slots: number[]) => {
    if (slots.length === 0) return true;
    const sorted = [...slots].sort((a, b) => a - b);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) {
        return false;
      }
    }
    return true;
  };

  // Helper: Check if a slot can be selected (enforce consecutive rule for requestable)
  const isSlotSelectable = (slotId: number) => {
    if (!canSelectSlots) return false;
    if (selectedSlots.includes(slotId)) return true; // allow deselect

    if (isRequestableType) {
      // For requestable type, enforce consecutive slots only
      const newSelection = [...selectedSlots, slotId];

      // Check if adding this slot maintains consecutive pattern
      if (!isConsecutiveSelection(newSelection)) return false;

      // Check if total doesn't exceed max
      if (newSelection.length > maxSelectableSlots) return false;

      return true;
    } else {
      // For bookable type, use existing logic
      if (selectedSlots.length >= maxSelectableSlots) return false;
      const all = [...selectedSlots, slotId].sort((a, b) => a - b);
      let maxConsec = 1, curr = 1;
      for (let i = 1; i < all.length; i++) {
        if (all[i] === all[i - 1] + 1) {
          curr++;
          maxConsec = Math.max(maxConsec, curr);
        } else {
          curr = 1;
        }
      }
      return maxConsec <= maxConcurrentSlots;
    }
  };
  const [openCancelPolicy, setOpenCancelPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [complementaryReason, setComplementaryReason] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(1);

  // Helper: Get max people allowed from facility details
  const maxPeople = facilityDetails?.max_people || 0;
  const [peopleTable, setPeopleTable] = useState<Array<{
    srNo: number;
    role: string;
    user: string;
    level: string;
  }>>([]);

  // Fetch guest users
  const fetchGuestUsers = async () => {
    setGuestUsersLoading(true);
    setGuestUsersError(null);
    try {
      const response = await apiClient.get('/pms/account_setups/occupant_users.json', {
        params: {
          'q[lock_user_permissions_user_type_eq]': 'pms_guest'
        }
      });
      if (response.data && response.data.occupant_users) {
        setGuestUsers(response.data.occupant_users);
      }
    } catch (error) {
      console.error('Error fetching guest users:', error);
      setGuestUsersError(error);
      setGuestUsers([]);
    } finally {
      setGuestUsersLoading(false);
    }
  };

  const getUsers = async () => {
    try {
      const reseponse = await axios.get(`https://${localStorage.getItem('baseUrl')}/pms/users/get_escalate_to_users.json?type=Asset`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setUsers(reseponse.data.users)
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    // dispatch(fetchFMUsers());
    getUsers()
    dispatch(fetchActiveFacilities({ baseUrl: localStorage.getItem('baseUrl'), token: localStorage.getItem('token') }));
  }, [dispatch]);

  // Load all user types when facility is selected for the people table
  useEffect(() => {
    if (facilityDetails) {
      // Load FM users if not already loaded
      if (fmUsers.length === 0 && !fmUsersLoading) {
        dispatch(fetchFMUsers());
      }
      // Load occupant users if not already loaded
      if (occupantUsers.length === 0 && !occupantUsersLoading) {
        dispatch(fetchOccupantUsers({ page: 1, perPage: 100 }));
      }
      // Load guest users if not already loaded
      if (guestUsers.length === 0 && !guestUsersLoading) {
        fetchGuestUsers();
      }
    }
  }, [facilityDetails]);

  // Pre-populate facility and date from URL parameters
  useEffect(() => {
    if (urlFacilityId && facilities.length > 0) {
      const facility = facilities.find(f => f.id.toString() === urlFacilityId);
      if (facility) {
        setSelectedFacility(facility);
        fetchFacilityDetails(facility.id);
      }
    }
  }, [urlFacilityId, facilities]);

  useEffect(() => {
    if (urlDate) {
      // Convert from dd/mm/yyyy to yyyy-mm-dd format
      const [day, month, year] = urlDate.split('/');
      if (day && month && year) {
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        setSelectedDate(formattedDate);
      }
    }
  }, [urlDate]);

  // Fetch facility details when facility is selected
  const fetchFacilityDetails = async (facilityId: string) => {
    try {
      const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}.json`);
      if (response.data && response.data.facility_setup) {
        setFacilityDetails(response.data.facility_setup);
        setPaymentMethod(''); // Reset payment method when facility changes
        setSelectedAccessories({}); // Reset selected accessories

        // Extract and set available accessories from facility setup
        if (response.data.facility_setup.facility_setup_accessories && Array.isArray(response.data.facility_setup.facility_setup_accessories)) {
          const accessories = response.data.facility_setup.facility_setup_accessories.map(item => ({
            id: item.facility_setup_accessory?.id || 0,
            name: item.facility_setup_accessory?.inventory_name || 'Unnamed Accessory',
            inventoryId: item.facility_setup_accessory?.pms_inventory_id || 0,
            price: item.facility_setup_accessory?.cost || 0
          }));
          setAvailableAccessories(accessories);
        } else {
          setAvailableAccessories([]);
        }

        // Initialize people table based on max_people
        const maxPeople = response.data.facility_setup.max_people || 1;
        const initialTable = Array.from({ length: maxPeople }, (_, index) => ({
          srNo: index + 1,
          role: '',
          user: '',
          level: index === 0 ? 'primary' : 'secondary'
        }));
        setPeopleTable(initialTable);
      }
    } catch (error) {
      console.error('Error fetching facility details:', error);
      setFacilityDetails(null);
      setAvailableAccessories([]);
      setSelectedAccessories({});
    }
  };

  // Handle facility selection change
  const handleFacilityChange = (facility: any) => {
    setSelectedFacility(facility);
    if (facility) {
      fetchFacilityDetails(facility.id);
    } else {
      setFacilityDetails(null);
      setPaymentMethod('');
      setAvailableAccessories([]);
      setSelectedAccessories({});
    }
  };

  const fetchSlots = async (facilityId: string, date: string, userId?: string) => {
    try {
      const formattedDate = date.replace(/-/g, '/');
      const params: any = {
        on_date: formattedDate
      };

      // Only add user_id if it's provided
      if (userId) {
        params.user_id = userId;
      }

      const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}/get_schedules.json`, {
        params
      });

      if (response.data && response.data.slots) {
        setSlots(response.data.slots);
        setSelectedSlots([]); // Reset selected slots when new slots are fetched
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    }
  };

  // Fetch flexible pricing for requestable facilities
  const fetchFlexiblePrice = async (facilityId: string, slotIds: number[]) => {
    if (!isRequestableType || slotIds.length === 0) {
      setFlexiblePriceData(null);
      return;
    }

    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `https://${baseUrl}/pms/admin/facility_setups/${facilityId}/calculate_flexible_price.json`,
        { slot_ids: slotIds },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.success) {
        console.log('Flexible Price Response:', response.data);
        setFlexiblePriceData(response.data);
      }
    } catch (error) {
      console.error('Error fetching flexible price:', error);
      setFlexiblePriceData(null);
    }
  };

  // Effect to fetch slots when facility and date are selected (user is optional)
  useEffect(() => {

    if (selectedFacility && selectedDate) {
      const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;
      fetchSlots(facilityId, selectedDate, selectedUser || undefined);
    } else {
      setSlots([]);
      setSelectedSlots([]);
    }
  }, [selectedFacility, selectedDate, selectedUser]);

  // Effect to fetch flexible pricing when slots are selected for requestable facilities
  useEffect(() => {
    if (isRequestableType && selectedSlots.length > 0 && selectedFacility) {
      const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;
      fetchFlexiblePrice(facilityId, selectedSlots);
    } else if (!isRequestableType) {
      setFlexiblePriceData(null);
    }
  }, [selectedSlots, isRequestableType, selectedFacility]);

  // Call amenity booking API when member user type is selected with user and facility
  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log('Token for Amenity API:', token);
    if (selectedUser && selectedFacility) {
      const fetchAmenityBooking = async () => {
        try {
          const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;
          // Fetch booking rule for user
          console.log('=== Calling Booking Rule API ===');
          const baseUrl = localStorage.getItem('baseUrl');
          const bookingRuleResponse = await axios.get(`https://${baseUrl}/pms/admin/facility_setups/${facilityId}/booking_rule_for_user?user_id=${selectedUser}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          });
          console.log('Booking Rule for User Response:', bookingRuleResponse.data);
          // Store booking rule data in state
          if (bookingRuleResponse.data) {
            setBookingRuleData(bookingRuleResponse.data);
            console.log('Booking rule rate:', bookingRuleResponse.data.rate);
          }
          console.log('================================');
        } catch (amenityError: any) {
          console.error('Error fetching amenity booking by club plan:', amenityError);
          if (amenityError.response) {
            console.error('Error response status:', amenityError.response.status);
            console.error('Error response data:', amenityError.response.data);
            console.error('Error response headers:', amenityError.response.headers);
            // If it's a 500 error, the API might have specific validation requirements
            if (amenityError.response.status === 500) {
              console.warn('Server error (500): The API encountered an internal error. Check if user_id and facility_setup_id are valid.');
            }
          }
        }
      };
      fetchAmenityBooking();
    } else {
      console.log('❌ Amenity API not called - condition not met');
    }
  }, [userType, selectedUser, selectedFacility]);

  useEffect(() => {
    if (urlSlotTime && slots.length > 0 && selectedSlots.length === 0) {
      const decodedSlotTime = decodeURIComponent(urlSlotTime);
      const matchingSlot = slots.find(slot => {
        const slotTimeNormalized = slot.ampm
          .replace(/\s+/g, '')
          .replace('to', '-')
          .toLowerCase();

        const urlTimeNormalized = decodedSlotTime
          .replace(/\s+/g, '')
          .toLowerCase();

        return slotTimeNormalized === urlTimeNormalized;
      });

      if (matchingSlot) {
        setSelectedSlots([matchingSlot.id]);
      }
    }
  }, [urlSlotTime, slots]);

  // Handle slot selection
  const handleSlotSelection = (slotId: number) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        // Enforce selection rules
        if (!isSlotSelectable(slotId)) return prev;
        return [...prev, slotId];
      }
    });
  };

  // Handle accessory quantity change
  const handleAccessoryQuantityChange = (accessoryId: number, quantity: number) => {
    setSelectedAccessories(prev => {
      if (quantity <= 0) {
        const newState = { ...prev };
        delete newState[accessoryId];
        return newState;
      } else {
        return { ...prev, [accessoryId]: quantity };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!selectedUser) {
        toast.error('Please select a user');
        return;
      }
      if (!selectedFacility) {
        toast.error('Please select a facility');
        return;
      }
      if (!selectedDate) {
        toast.error('Please select a date');
        return;
      }
      if (comment && comment.length > 255) {
        toast.error('Comment should not exceed 255 characters');
        return;
      }
      if (!paymentMethod) {
        toast.error('Please select a payment method');
        return;
      }
      if (paymentMethod === 'complementary' && !complementaryReason.trim()) {
        toast.error('Please enter a reason for complementary booking');
        return;
      }
      if (selectedSlots.length === 0) {
        toast.error('Please select at least one slot');
        return;
      }

      const selectedSiteId = localStorage.getItem('selectedSiteId') || '7';
      const userString = localStorage.getItem('user');
      let userId = '2844';

      if (userString) {
        try {
          const user = JSON.parse(userString);
          if (user && user.id) {
            userId = user.id.toString();
          }
        } catch (error) {
          console.error('Error parsing user from localStorage:', error);
        }
      }

      const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;

      // --- Cost calculation based on per_slot_charge and accessories ---
      const perSlotCharge = facilityDetails?.facility_charge?.per_slot_charge ?? 0;
      const slotsCount = selectedSlots.length;

      // Calculate slot total
      const slotTotal = slotsCount * perSlotCharge;

      // Calculate accessory total with quantities
      const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
        const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
        return total + ((accessory?.price || 0) * (quantity || 0));
      }, 0);

      // Subtotal includes slots and accessories
      const subtotalBeforeDiscount = slotTotal + accessoryTotal;
      const discountAmount = (subtotalBeforeDiscount * (discountPercentage || 0)) / 100;
      const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
      const gstPercentage = facilityDetails?.gst || 0;
      const sgstPercentage = facilityDetails?.sgst || 0;
      const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
      const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
      const amountFull = subtotalAfterDiscount + gstAmount + sgstAmount;

      // Build booked_members_attributes array from people table
      const bookedMembersAttributes = peopleTable
        .filter(row => row.role && row.user) // Only include rows with both role and user selected
        .map(row => {
          // Set charge to 0 since we're only using per_slot_charge
          const totalCharge = 0;

          return {
            user_id: parseInt(row.user),
            oftype: row.level, // 'primary' or 'secondary'
            total_charge: totalCharge
          };
        });

      // Use cost summary calculation (from UI) for payload values
      const costSummary = (() => {
        // Calculate accessory total with quantities
        const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
          const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
          return total + ((accessory?.price || 0) * (quantity || 0));
        }, 0);

        let basePrice = 0;

        // For requestable type, use slab_price from API; for others, use slot charges
        if (isRequestableType && flexiblePriceData) {
          basePrice = flexiblePriceData.slab_price;
        } else {
          const perSlotCharge = facilityDetails?.facility_charge?.per_slot_charge ?? 0;
          const slotsCount = selectedSlots.length;
          basePrice = slotsCount * perSlotCharge;
        }

        // Subtotal includes base price and accessories
        const subtotalBeforeDiscount = basePrice + accessoryTotal;

        // Calculate discount based on type
        const calculatedDiscountAmount = discountType === 'percentage'
          ? (subtotalBeforeDiscount * (discountPercentage || 0)) / 100
          : (discountAmount || 0);

        const subtotalAfterDiscount = subtotalBeforeDiscount - calculatedDiscountAmount;

        let gstPercentage = 0;
        let sgstPercentage = 0;

        // For requestable type, use API values; for others, use facility setup values
        if (isRequestableType && flexiblePriceData) {
          // Extract percentages from API response if available, otherwise use facility defaults
          gstPercentage = facilityDetails?.gst || 0;
          sgstPercentage = facilityDetails?.sgst || 0;
        } else {
          gstPercentage = facilityDetails?.gst || 0;
          sgstPercentage = facilityDetails?.sgst || 0;
        }

        const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
        const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
        const amountFull = subtotalAfterDiscount + gstAmount + sgstAmount;

        return {
          basePrice,
          accessoryTotal,
          subtotalBeforeDiscount,
          discountAmount: calculatedDiscountAmount,
          subtotalAfterDiscount,
          gstPercentage,
          sgstPercentage,
          gstAmount,
          sgstAmount,
          amountFull
        };
      })();

      console.log(costSummary)

      const payload = {
        facility_booking: {
          user_id: selectedUser,
          user_society_type: 'User',
          resource_type: 'Pms::Site',
          resource_id: selectedSiteId,
          book_by_id: selectedSlots[0],
          book_by: 'slot',
          facility_id: facilityId,
          startdate: selectedDate.replace(/-/g, '/'),
          comment: comment || '',
          payment_method: paymentMethod,
          selected_slots: selectedSlots,
          accessories: Object.entries(selectedAccessories).map(([accessoryId, quantity]) => {
            const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
            return {
              id: parseInt(accessoryId),
              quantity: quantity,
              total_price: (accessory?.price || 0) * quantity
            };
          }),
          entity_id: selectedCompany,
          member_charges: 0,
          guest_charges: 0,
          guest_premium_details: [],
          discount: costSummary.discountAmount,
          cgst_amount: costSummary.gstAmount,
          sgst_amount: costSummary.sgstAmount,
          gst: costSummary.gstPercentage,
          sgst: costSummary.sgstPercentage,
          sub_total: costSummary.subtotalAfterDiscount,
          amount_full: costSummary.amountFull,
          booked_members_attributes: bookedMembersAttributes,
          member_count: userType === 'occupant' ? 1 : 0,
          guest_count: numberOfGuests,
          ...(paymentMethod === 'complementary' && { complementary_payment_reason: complementaryReason }),
        },
        on_behalf_of: userType === 'occupant' ? 'occupant-user' : userType === 'guest' ? 'guest-user' : 'fm-user',
        occupant_user_id: userType === 'occupant' ? selectedUser : '',
        fm_user_id: userType === 'fm' ? selectedUser : '',
        guest_user_id: userType === 'guest' ? selectedUser : ''
      };

      console.log('Payload being sent:', JSON.stringify(payload, null, 2));
      console.log('About to submit to API...');

      const response = await apiClient.post('/pms/admin/facility_bookings.json', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      // Check if payment method is prepaid
      if (paymentMethod === 'prepaid') {
        // Get the booking ID from response
        const bookingId = response.data.facility_booking?.id || response.data.id;
        const token = localStorage.getItem('token');

        if (bookingId && token) {
          toast.success('Booking created successfully! Redirecting to payment gateway...');
          // Navigate to payment gateway redirection page with booking ID and token
          navigate(`/payment-redirect?bookingId=${bookingId}&token=${token}&amount=${costSummary.amountFull}`);
        } else {
          toast.error('Booking created but payment redirection failed. Please contact support.');
          navigate(-1);
        }
      } else {
        toast.success('Booking created successfully!');
        navigate(-1);
      }
    } catch (error: any) {
      console.error('Error creating facility booking:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      toast.error('Error creating booking. Please check the console for details.');
    }
  };

  const handleBackToList = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
            <CheckCircle className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold" style={{ color: '#C72030' }}>Facility Booking</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
        {/* User Type Selection */}
        <div>
          <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-6">

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="self" id="self" />
              <Label htmlFor="self">Self</Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="user" id="user" />
              <Label htmlFor="user">Users</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Form Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          {/* User Selection - occupant, fm, or guest users */}
          <div className="space-y-2">
            <TextField
              select
              required
              label="User"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              variant="outlined"
              fullWidth
              SelectProps={{ displayEmpty: true }}
              InputLabelProps={{
                classes: {
                  asterisk: "text-red-500", // Tailwind class for red color
                },
                shrink: true
              }}
              sx={fieldStyles}
              disabled={userType === 'self'}
            >
              <MenuItem value="" disabled>
                <em>
                  Select User
                </em>
              </MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Facility Selection */}
          <div className="space-y-2">
            <TextField
              select
              required
              label="Facility"
              value={selectedFacility}
              onChange={(e) => handleFacilityChange(e.target.value)}
              variant="outlined"
              fullWidth
              SelectProps={{ displayEmpty: true }}
              InputLabelProps={{
                classes: {
                  asterisk: "text-red-500", // Tailwind class for red color
                },
                shrink: true
              }}
              sx={fieldStyles}
              disabled={facilitySetupsLoading}
              helperText={facilitySetupsError ? "Error loading facilities" : ""}
              error={!!facilitySetupsError}
            >
              <MenuItem value="" disabled>
                <em>
                  Select Facility
                </em>
              </MenuItem>
              {facilitySetupsLoading && (
                <MenuItem value="" disabled>
                  Loading facilities...
                </MenuItem>
              )}
              {!facilitySetupsLoading && !facilitySetupsError && facilities.length === 0 && (
                <MenuItem value="" disabled>
                  No facilities available
                </MenuItem>
              )}
              {facilities.map((facility) => (
                <MenuItem key={facility.id} value={facility}>
                  {facility.fac_name} ({facility.fac_type.charAt(0).toUpperCase() + facility.fac_type.slice(1)})
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <TextField
              type="date"
              label="Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                classes: {
                  asterisk: "text-red-500", // Tailwind class for red color
                },
                shrink: true
              }}
              inputProps={{
                min: new Date().toISOString().split("T")[0],
              }}
              sx={fieldStyles}
            />
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <TextField
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            InputLabelProps={{ shrink: true }}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                height: "auto !important",
                padding: "2px !important",
                display: "flex",
              },
              "& .MuiInputBase-input[aria-hidden='true']": {
                flex: 0,
                width: 0,
                height: 0,
                padding: "0 !important",
                margin: 0,
                display: "none",
              },
              "& .MuiInputBase-input": {
                resize: "none !important",
              },
            }}
            helperText={<span style={{ textAlign: 'right', display: 'block' }}>{`${comment.length}/255 characters`}</span>}
            error={comment.length > 255}
          />
        </div>

        {/* Select Slot Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Slot<span className="text-red-500"> *</span></h2>
          {slots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const disabled = !isSlotSelectable(slot.id);
                return (
                  <div key={slot.id} className={`flex items-center space-x-2 p-3 border rounded-lg ${disabled ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'}`}>
                    <input
                      type="checkbox"
                      id={`slot-${slot.id}`}
                      checked={selectedSlots.includes(slot.id)}
                      onChange={() => handleSlotSelection(slot.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      disabled={!canSelectSlots || disabled}
                    />
                    <Label
                      htmlFor={`slot-${slot.id}`}
                      className={`cursor-pointer text-sm font-medium flex items-center gap-2 ${disabled ? 'text-gray-400' : ''}`}
                    >
                      {slot.ampm}
                      {slot.is_premium && slot.premium_percentage && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                          </svg>
                          +{slot.premium_percentage}%
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">
              {selectedFacility && selectedDate
                ? "No slots available for the selected date"
                : "Please select facility and date to see available slots"
              }
            </p>
          )}
          {/* Show booking rule info/warnings */}
          {bookingRuleData && !canSelectSlots && (
            <div className="mt-2 text-red-600 text-sm font-medium">You are not allowed to book slots for this user.</div>
          )}
          {canSelectSlots && (
            <div className="mt-2 text-gray-600 text-xs">
              {isRequestableType ? (
                `You can select multiple consecutive slots. Selected slots must be continuous.`
              ) : (
                <>
                  {bookingRuleData?.multiple_bookings
                    ? `You can select up to ${maxSelectableSlots} slots. `
                    : 'You can select only one slot. '}
                  {maxConcurrentSlots > 1 && `You can select up to ${maxConcurrentSlots} consecutive slots.`}
                </>
              )}
            </div>
          )}
        </div>

        {/* Select Accessories Section */}
        {availableAccessories.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Accessories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAccessories.map((accessory) => (
                <div key={accessory.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`accessory-${accessory.id}`}
                      checked={selectedAccessories[accessory.id] ? true : false}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleAccessoryQuantityChange(accessory.id, 1);
                        } else {
                          handleAccessoryQuantityChange(accessory.id, 0);
                        }
                      }}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={`accessory-${accessory.id}`}
                      className="cursor-pointer text-sm font-medium flex-1"
                    >
                      <span>{accessory.name}</span>
                    </Label>
                    {accessory.price > 0 && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">₹{accessory.price.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Quantity Input - Only show if selected */}
                  {selectedAccessories[accessory.id] && (
                    <div className="flex items-center gap-2 ml-6">
                      <Label className="text-xs text-gray-600">Quantity:</Label>
                      <input
                        type="number"
                        min="1"
                        value={selectedAccessories[accessory.id]}
                        onChange={(e) => handleAccessoryQuantityChange(accessory.id, Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <span className="text-xs text-gray-600 ml-auto">
                        Total: ₹{(accessory.price * selectedAccessories[accessory.id]).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Method Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment Method<span className="text-red-500"> *</span></h2>
          {facilityDetails && (
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              {facilityDetails.postpaid === 1 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="postpaid" id="postpaid" />
                  <Label htmlFor="postpaid">Postpaid</Label>
                </div>
              )}
              {facilityDetails.prepaid === 1 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="prepaid" id="prepaid" />
                  <Label htmlFor="prepaid">Prepaid</Label>
                </div>
              )}
              {facilityDetails.pay_on_facility === 1 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pay_on_facility" id="pay_on_facility" />
                  <Label htmlFor="pay_on_facility">Pay on Facility</Label>
                </div>
              )}
              {facilityDetails.complementary === 1 && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="complementary" id="complementary" />
                  <Label htmlFor="complementary">Complementary</Label>
                </div>
              )}
              {facilityDetails.bill_to_company && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bill_to_company" id="bill_to_company" />
                  <Label htmlFor="bill_to_company">Bill to Company</Label>
                </div>
              )}
            </RadioGroup>
          )}
          {!facilityDetails && selectedFacility && (
            <p className="text-gray-500">Please select a facility to see available payment methods</p>
          )}

          {/* Complementary Reason Input */}
          {paymentMethod === 'complementary' && (
            <div className="mt-4">
              <TextField
                label="Reason"
                required
                value={complementaryReason}
                onChange={(e) => setComplementaryReason(e.target.value)}
                variant="outlined"
                fullWidth
                InputLabelProps={{
                  classes: {
                    asterisk: "text-red-500",
                  },
                  shrink: true
                }}
                sx={fieldStyles}
                placeholder="Enter reason for complementary booking"
              />
            </div>
          )}
        </div>

        {/* Cost Summary Section */}
        {selectedUser && facilityDetails && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
            <div className="space-y-3">
              {/* For Requestable Type - Use Flexible Price API Response */}
              {isRequestableType && flexiblePriceData ? (
                <>
                  {/* Calculate accessory total */}
                  {(() => {
                    const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
                      const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
                      return total + ((accessory?.price || 0) * (quantity || 0));
                    }, 0);
                    const subtotalWithAccessories = flexiblePriceData.slab_price + accessoryTotal;
                    const calculatedDiscountAmount = discountType === 'percentage'
                      ? (subtotalWithAccessories * (discountPercentage || 0)) / 100
                      : (discountAmount || 0);
                    const subtotalAfterDiscount = subtotalWithAccessories - calculatedDiscountAmount;
                    const grandTotal = subtotalAfterDiscount + flexiblePriceData.cgst_amount + flexiblePriceData.sgst_amount;

                    return (
                      <>
                        {/* Slab Price */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700">Base Price</span>
                          <span className="font-medium">₹{flexiblePriceData.slab_price.toFixed(2)}</span>
                        </div>

                        {/* Booking Duration */}
                        {flexiblePriceData.used_slab && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700">Booking Duration</span>
                            <span className="font-medium">{flexiblePriceData.used_slab.duration_hours} hour{flexiblePriceData.used_slab.duration_hours > 1 ? 's' : ''}</span>
                          </div>
                        )}

                        {/* Accessory Charges */}
                        {accessoryTotal > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-700">Accessory Charges</span>
                              <span className="text-sm text-gray-500">({Object.values(selectedAccessories).reduce((sum, qty) => sum + qty, 0)} items)</span>
                            </div>
                            <span className="font-medium">₹{accessoryTotal.toFixed(2)}</span>
                          </div>
                        )}

                        {/* Subtotal (Slab Price + Accessories) */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 font-semibold">
                          <span className="text-gray-700">Subtotal</span>
                          <span className="font-medium">₹{subtotalWithAccessories.toFixed(2)}</span>
                        </div>

                        {/* Discount - Editable */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Discount</span>
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1 items-center">
                                <select
                                  value={discountType}
                                  onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount')}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                                  style={{ height: '36px' }}
                                >
                                  <option value="percentage">%</option>
                                  <option value="amount">₹</option>
                                </select>
                                <TextField
                                  type="number"
                                  size="small"
                                  value={discountType === 'percentage' ? discountPercentage : discountAmount}
                                  onChange={(e) => {
                                    if (discountType === 'percentage') {
                                      setDiscountPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)));
                                    } else {
                                      setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0));
                                    }
                                  }}
                                  variant="outlined"
                                  sx={{
                                    width: '80px',
                                    '& .MuiOutlinedInput-root': {
                                      height: '36px',
                                      '& input': {
                                        textAlign: 'right',
                                        padding: '8px 12px'
                                      }
                                    }
                                  }}
                                  inputProps={{
                                    min: 0,
                                    step: discountType === 'percentage' ? 0.1 : 1
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <span className="font-medium">₹{calculatedDiscountAmount.toFixed(2)}</span>
                        </div>

                        {/* Subtotal After Discount */}
                        {calculatedDiscountAmount > 0 && (
                          <div className="flex justify-between items-center py-2 border-b border-gray-200">
                            <span className="text-gray-700 font-medium">Subtotal After Discount</span>
                            <span className="font-medium">₹{subtotalAfterDiscount.toFixed(2)}</span>
                          </div>
                        )}

                        {/* CGST from API */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700">CGST</span>
                          <span className="font-medium">₹{flexiblePriceData.cgst_amount.toFixed(2)}</span>
                        </div>

                        {/* SGST from API */}
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700">SGST</span>
                          <span className="font-medium">₹{flexiblePriceData.sgst_amount.toFixed(2)}</span>
                        </div>

                        {/* Grand Total */}
                        <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                          <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                          <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{grandTotal.toFixed(2)}</span>
                        </div>
                      </>
                    );
                  })()}
                </>
              ) : isRequestableType && selectedSlots.length === 0 ? (
                <p className="text-gray-500 text-sm">Select slots to calculate pricing</p>
              ) : !isRequestableType ? (
                (() => {
                  const perSlotCharge = facilityDetails.facility_charge?.per_slot_charge ?? 0;
                  const slotsCount = selectedSlots.length;
                  const hasSlots = slotsCount > 0;

                  // Calculate slot total
                  const slotTotal = slotsCount * perSlotCharge;

                  // Calculate accessory total with quantities
                  const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
                    const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
                    return total + ((accessory?.price || 0) * (quantity || 0));
                  }, 0);
                  const hasAccessories = accessoryTotal > 0;

                  // Subtotal includes slots and accessories
                  const subtotalBeforeDiscount = slotTotal + accessoryTotal;
                  const calculatedDiscountAmount = discountType === 'percentage'
                    ? (subtotalBeforeDiscount * (discountPercentage || 0)) / 100
                    : (discountAmount || 0);
                  const subtotalAfterDiscount = subtotalBeforeDiscount - calculatedDiscountAmount;

                  const gstPercentage = facilityDetails.gst || 0;
                  const sgstPercentage = facilityDetails.sgst || 0;
                  const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
                  const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
                  const totalTax = gstAmount + sgstAmount;
                  const grandTotal = subtotalAfterDiscount + totalTax;

                  return (
                    <>
                      {/* Slots Count - Only show when slots are selected */}
                      {hasSlots && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50">
                          <span className="text-gray-700 font-medium">Number of Slots Selected</span>
                          <span className="font-semibold text-blue-600">{slotsCount}</span>
                        </div>
                      )}

                      {/* Slot Charges */}
                      {hasSlots && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Slot Charges</span>
                            <span className="text-sm text-gray-500">({selectedSlots.length} x ₹{perSlotCharge.toFixed(2)})</span>
                          </div>
                          <span className="font-medium">₹{slotTotal.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Accessory Charges */}
                      {hasAccessories && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">Accessory Charges</span>
                            <span className="text-sm text-gray-500">({Object.values(selectedAccessories).reduce((sum, qty) => sum + qty, 0)} items)</span>
                          </div>
                          <span className="font-medium">₹{accessoryTotal.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Subtotal Before Discount */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Subtotal</span>
                        <span className="font-medium">₹{subtotalBeforeDiscount.toFixed(2)}</span>
                      </div>

                      {/* Discount - Editable */}
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">Discount</span>
                          <div className="flex items-center gap-1">
                            <div className="flex gap-1 items-center">
                              <select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount')}
                                className="px-2 py-1 border border-gray-300 rounded text-sm"
                                style={{ height: '36px' }}
                              >
                                <option value="percentage">%</option>
                                <option value="amount">₹</option>
                              </select>
                              <TextField
                                type="number"
                                size="small"
                                value={discountType === 'percentage' ? discountPercentage : discountAmount}
                                onChange={(e) => {
                                  if (discountType === 'percentage') {
                                    setDiscountPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)));
                                  } else {
                                    setDiscountAmount(Math.max(0, parseFloat(e.target.value) || 0));
                                  }
                                }}
                                variant="outlined"
                                sx={{
                                  width: '80px',
                                  '& .MuiOutlinedInput-root': {
                                    height: '36px',
                                    '& input': {
                                      textAlign: 'right',
                                      padding: '8px 12px'
                                    }
                                  }
                                }}
                                inputProps={{
                                  min: 0,
                                  step: discountType === 'percentage' ? 0.1 : 1
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <span className="font-medium"> ₹{calculatedDiscountAmount.toFixed(2)}</span>
                      </div>

                      {/* Subtotal After Discount */}
                      {calculatedDiscountAmount > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <span className="text-gray-700 font-medium">Subtotal After Discount</span>
                          <span className="font-medium">₹{subtotalAfterDiscount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* GST */}
                      {gstPercentage > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">GST</span>
                            <span className="text-sm text-gray-500">({gstPercentage}%)</span>
                          </div>
                          <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* SGST */}
                      {sgstPercentage > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-gray-200">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700">SGST</span>
                            <span className="text-sm text-gray-500">({sgstPercentage}%)</span>
                          </div>
                          <span className="font-medium">₹{sgstAmount.toFixed(2)}</span>
                        </div>
                      )}

                      {/* Grand Total */}
                      <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                        <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                        <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </>
                  );
                })()
              ) : (
                <p className="text-gray-500 text-sm">Loading cost information...</p>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            type="submit"
            className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8 py-2"
          >
            Submit
          </Button>
        </div>

        {/* Footer Links with Dialogs */}
        <div className="space-y-2 text-sm">
          <div
            className="flex items-center gap-2 cursor-pointer hover:underline"
            style={{ color: '#C72030' }}
            onClick={() => setOpenCancelPolicy(true)}
          >
            <FileText className="w-4 h-4" />
            Cancellation Policy
          </div>
          <div
            className="flex items-center gap-2 cursor-pointer hover:underline"
            style={{ color: '#C72030' }}
            onClick={() => setOpenTerms(true)}
          >
            <Shield className="w-4 h-4" />
            Terms & Conditions
          </div>
        </div>

        {/* Cancellation Policy Dialog */}
        <Dialog
          open={openCancelPolicy}
          onClose={() => setOpenCancelPolicy(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Cancellation Policy</DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              {
                selectedFacility && typeof selectedFacility === 'object'
                  ? selectedFacility.cancellation_policy || 'No cancellation policy available'
                  : 'No cancellation policy available'
              }
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenCancelPolicy(false)}
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Terms & Conditions Dialog */}
        <Dialog
          open={openTerms}
          onClose={() => setOpenTerms(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Terms & Conditions</DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              {
                selectedFacility && typeof selectedFacility === 'object'
                  ? selectedFacility.terms || 'No terms and conditions available'
                  : 'No terms and conditions available'
              }
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenTerms(false)}
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};