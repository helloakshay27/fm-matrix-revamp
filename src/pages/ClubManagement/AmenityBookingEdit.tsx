import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CheckCircle, FileText, Shield, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { fetchActiveFacilities } from '@/store/slices/facilitySetupsSlice';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';
import axios from 'axios';

export const AmenityBookingEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: fmUsersResponse, loading: fmUsersLoading, error: fmUsersError } = useAppSelector((state) => state.fmUsers);
  const fmUsers = fmUsersResponse?.users || [];

  const [occupantUsers, setOccupantUsers] = useState([]);
  const [occupantUsersLoading, setOccupantUsersLoading] = useState(false);
  const [occupantUsersError, setOccupantUsersError] = useState(null);

  const fetchOccupantUsersDirect = async () => {
    setOccupantUsersLoading(true);
    setOccupantUsersError(null);
    try {
      const response = await apiClient.get('/pms/account_setups/occupant_users.json', {
        params: {
          'q[lock_user_permissions_user_type_eq]': 'pms_occupant',
          'active': true,
        }
      });
      if (response.data && response.data.occupant_users) {
        setOccupantUsers(response.data.occupant_users);
      }
    } catch (error) {
      console.error('Error fetching occupant users:', error);
      setOccupantUsersError(error);
      setOccupantUsers([]);
    } finally {
      setOccupantUsersLoading(false);
    }
  };

  const [guestUsers, setGuestUsers] = useState([]);
  const [guestUsersLoading, setGuestUsersLoading] = useState(false);
  const [guestUsersError, setGuestUsersError] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState('');

  const { data: facilitySetupsResponse, loading: facilitySetupsLoading, error: facilitySetupsError } = useAppSelector((state) => state.fetchActiveFacilities);
  const facilities = Array.isArray(facilitySetupsResponse?.facility_setups) ? facilitySetupsResponse.facility_setups :
    Array.isArray(facilitySetupsResponse) ? facilitySetupsResponse : [];

  const [userType, setUserType] = useState('occupant');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<any>('');
  const [selectedDate, setSelectedDate] = useState('');
  const [comment, setComment] = useState('');
  const [facilityDetails, setFacilityDetails] = useState<{
    postpaid: number;
    prepaid: number;
    pay_on_facility: number;
    complementary: number;
    facility_charge?: {
      adult_member_charge?: number;
      adult_guest_charge?: number;
      child_member_charge?: number;
      child_guest_charge?: number;
      per_slot_charge?: number;
      hotel_guest_charge?: number;
      full_court_charge?: number;
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
    is_booked: boolean;
  }>>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [bookingRuleData, setBookingRuleData] = useState<{
    can_book: boolean;
    rate: number;
    multiple_bookings?: boolean;
    multiple_booking_count?: number;
    concurrent_slots?: number;
    bookable_slot_count?: number;
  } | null>(null);

  const canSelectSlots = bookingRuleData ? bookingRuleData.can_book !== false : true;
  const maxSelectableSlots = bookingRuleData?.bookable_slot_count ?? (bookingRuleData?.multiple_bookings ? (bookingRuleData.multiple_booking_count || 1) : 1);
  const maxConcurrentSlots = bookingRuleData?.concurrent_slots ?? 1;

  const isSlotSelectable = (slotId: number) => {
    if (!canSelectSlots) return false;
    const slot = slots.find(s => s.id === slotId);
    if (slot && slot.is_booked) return false;
    if (selectedSlots.includes(slotId)) return true;
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
  };

  const [openCancelPolicy, setOpenCancelPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [complementaryReason, setComplementaryReason] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [numberOfGuests, setNumberOfGuests] = useState<number>(0);
  const [isFullCourt, setIsFullCourt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComplimentaryWarning, setShowComplimentaryWarning] = useState(false);
  const maxPeople = facilityDetails?.max_people || 0;
  const [peopleTable, setPeopleTable] = useState<Array<{
    srNo: number;
    role: string;
    user: string;
    level: string;
  }>>([]);

  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchGuestUsers = async () => {
    setGuestUsersLoading(true);
    setGuestUsersError(null);
    try {
      const response = await apiClient.get('/pms/account_setups/occupant_users.json', {
        params: {
          'q[lock_user_permissions_user_type_eq]': 'pms_guest',
          'active': true,
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

  useEffect(() => {
    if (userType === 'occupant') {
      fetchOccupantUsersDirect();
    } else if (userType === 'guest') {
      fetchGuestUsers();
    } else {
      dispatch(fetchFMUsers());
    }
    dispatch(fetchActiveFacilities({ baseUrl: localStorage.getItem('baseUrl'), token: localStorage.getItem('token') }));
  }, [dispatch, userType]);

  useEffect(() => {
    if (facilityDetails) {
      if (fmUsers.length === 0 && !fmUsersLoading) {
        dispatch(fetchFMUsers());
      }
      if (occupantUsers.length === 0 && !occupantUsersLoading) {
        fetchOccupantUsersDirect();
      }
      if (guestUsers.length === 0 && !guestUsersLoading) {
        fetchGuestUsers();
      }
    }
  }, [facilityDetails]);

  const fetchFacilityDetails = async (facilityId: string | number) => {
    try {
      const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}.json`);
      if (response.data && response.data.facility_setup) {
        setFacilityDetails(response.data.facility_setup);
        setShowComplimentaryWarning(false);

        if (response.data.facility_setup.facility_setup_accessories && Array.isArray(response.data.facility_setup.facility_setup_accessories)) {
          const accessories = response.data.facility_setup.facility_setup_accessories.map((item: any) => ({
            id: item.facility_setup_accessory?.id || 0,
            name: item.facility_setup_accessory?.inventory_name || 'Unnamed Accessory',
            inventoryId: item.facility_setup_accessory?.pms_inventory_id || 0,
            price: item.facility_setup_accessory?.inventory_cost || 0
          }));
          setAvailableAccessories(accessories);
        } else {
          setAvailableAccessories([]);
        }

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

  const handleFacilityChange = (facility: any) => {
    setSelectedFacility(facility);
    setSelectedSlots([]);
    setPaymentMethod('');
    setSelectedAccessories({});
    if (facility) {
      fetchFacilityDetails(facility.id);
    } else {
      setFacilityDetails(null);
      setAvailableAccessories([]);
    }
  };

  const fetchSlots = async (facilityId: string | number, date: string, userId?: string) => {
    try {
      const formattedDate = date.replace(/-/g, '/');
      const params: any = { on_date: formattedDate };
      if (userId) {
        params.user_id = userId;
      }
      const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}/get_schedules.json`, { params });
      if (response.data && response.data.slots) {
        setSlots(response.data.slots);
        setSelectedSlots(prev => prev.filter(id => response.data.slots.some(s => s.id === id)));
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
    }
  };

  useEffect(() => {
    if (selectedFacility && selectedDate) {
      const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;
      fetchSlots(facilityId, selectedDate, selectedUser || undefined);
    } else {
      setSlots([]);
      // Don't clear selectedSlots here — it gets cleared in handleFacilityChange when the user
      // manually changes the facility. Clearing here would wipe pre-populated slots during init
      // because selectedFacility is set asynchronously after selectedDate is restored.
    }
  }, [selectedFacility, selectedDate, selectedUser]);

  useEffect(() => {
    if (selectedUser && selectedFacility) {
      const fetchAmenityBooking = async () => {
        try {
          const token = localStorage.getItem('token');
          const baseUrl = localStorage.getItem('baseUrl');
          const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;
          const selectedDateForApi = selectedDate ? selectedDate.replace(/-/g, '/') : '';
          const bookingRuleResponse = await axios.get(`https://${baseUrl}/pms/admin/facility_setups/${facilityId}/booking_rule_for_user?user_id=${selectedUser}&on_date=${selectedDateForApi}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          });
          if (bookingRuleResponse.data) {
            setBookingRuleData(bookingRuleResponse.data);
          }
        } catch (amenityError: any) {
          console.error('Error fetching amenity booking by club plan:', amenityError);
        }
      };
      fetchAmenityBooking();
    }
  }, [userType, selectedUser, selectedFacility, selectedDate]);

  // Initial load: fetch booking details and pre-populate
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/pms/admin/facility_bookings/${id}.json`);
        const raw = response.data;
        const b = (raw as any).facility_booking || (raw as any);
        setBookingData(b);

        // Determine user type from user_type field
        const userTypeFromApi = b.user_type || '';
        let detectedUserType = 'occupant';
        if (userTypeFromApi === 'pms_occupant') detectedUserType = 'occupant';
        else if (userTypeFromApi === 'pms_guest') detectedUserType = 'guest';
        else if (userTypeFromApi === 'pms_admin') detectedUserType = 'fm';
        setUserType(detectedUserType);

        // Pre-populate user
        setSelectedUser(b.user_id?.toString() || '');

        // Pre-populate date
        const dateStr = b.startdate ? b.startdate.split(' ')[0] : '';
        setSelectedDate(dateStr);

        // Pre-populate comment
        setComment(b.comment || '');

        // Pre-populate selected slots
        let slotIds: number[] = [];
        if (b.selected_slots && Array.isArray(b.selected_slots)) {
          slotIds = b.selected_slots.map((s: any) => typeof s === 'object' ? s.id : s);
        }
        setSelectedSlots(slotIds);

        // Pre-populate guest count and discount
        setNumberOfGuests(b.guest_count || 0);
        setDiscountPercentage(b.discount || 0);

        // Pre-populate payment method
        const pm = b.payment_method === 'NA' ? 'complementary' : (b.payment_method || '');
        setPaymentMethod(pm);

        // Pre-populate complementary reason
        if (b.complementary_payment_reason) {
          setComplementaryReason(b.complementary_payment_reason);
        }

        // Pre-populate full court
        if (b.is_full_court) {
          setIsFullCourt(true);
        }

        // Fetch booking rule data eagerly so cost summary has correct memberRate on first render
        try {
          const token = localStorage.getItem('token');
          const baseUrl = localStorage.getItem('baseUrl');
          const dateForApi = dateStr ? dateStr.replace(/-/g, '/') : '';
          const bookingRuleResponse = await axios.get(
            `https://${baseUrl}/pms/admin/facility_setups/${b.facility_id}/booking_rule_for_user?user_id=${b.user_id}&on_date=${dateForApi}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
              }
            }
          );
          if (bookingRuleResponse.data) {
            setBookingRuleData(bookingRuleResponse.data);
          }
        } catch (ruleError) {
          console.error('Error fetching booking rule during init:', ruleError);
        }

        setInitialized(true);
      } catch (error) {
        console.error('Error loading booking details:', error);
        toast.error('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  // When facilities load and booking is initialized, find and set the facility
  useEffect(() => {
    if (initialized && bookingData && facilities.length > 0) {
      const facilityId = bookingData.facility_id;
      if (facilityId) {
        const matching = facilities.find((f: any) => f.id.toString() === facilityId.toString());
        if (matching) {
          setSelectedFacility(matching);
          fetchFacilityDetails(matching.id);
        }
      }
    }
  }, [initialized, bookingData, facilities]);

  // When facilityDetails loads for the first time (after edit init), pre-populate accessories and other values
  useEffect(() => {
    if (facilityDetails && isFirstLoad && bookingData && initialized) {
      // Re-apply values that fetchFacilityDetails may have reset
      const pm = bookingData.payment_method === 'NA' ? 'complementary' : (bookingData.payment_method || '');
      setPaymentMethod(pm);

      if (bookingData.is_full_court) {
        setIsFullCourt(true);
      }
      setNumberOfGuests(bookingData.guest_count || 0);
      setDiscountPercentage(bookingData.discount || 0);

      // Pre-populate accessories from booking data
      if (bookingData.facility_booking_accessories && Array.isArray(bookingData.facility_booking_accessories)) {
        const accMap: { [key: number]: number } = {};
        bookingData.facility_booking_accessories.forEach((item: any) => {
          const acc = item.facility_booking_accessory || item;
          const invId = acc.pms_inventory_id;
          if (invId) {
            const matchingAcc = availableAccessories.find(a => a.inventoryId === invId);
            if (matchingAcc) {
              accMap[matchingAcc.id] = acc.quantity || 1;
            }
          }
        });
        setSelectedAccessories(accMap);
      }

      // Pre-populate people table from booked_members
      if (bookingData.booked_members && Array.isArray(bookingData.booked_members) && bookingData.booked_members.length > 0) {
        const memberRows = bookingData.booked_members.map((m: any, idx: number) => ({
          srNo: idx + 1,
          role: m.oftype === 'primary' ? (idx === 0 ? 'member' : 'guest') : 'guest',
          user: m.user_id?.toString() || '',
          level: m.oftype || 'secondary'
        }));
        setPeopleTable(prev => {
          const updated = [...prev];
          memberRows.forEach((row: any, idx: number) => {
            if (updated[idx]) {
              updated[idx] = row;
            }
          });
          return updated;
        });
      }

      setIsFirstLoad(false);
    }
  }, [facilityDetails, isFirstLoad, bookingData, initialized, availableAccessories]);

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlots(prev => {
      if (prev.includes(slotId)) {
        return prev.filter(id => id !== slotId);
      } else {
        if (!isSlotSelectable(slotId)) return prev;
        return [...prev, slotId];
      }
    });
  };

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

  const handlePeopleTableChange = (index: number, field: 'role' | 'user' | 'level', value: string) => {
    setPeopleTable(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      if (field === 'role' && selectedUser) {
        const roleUsers = getUsersForRole(value);
        const userExists = roleUsers.some((u: any) => u.id.toString() === selectedUser.toString());
        if (userExists) {
          updated[index].user = selectedUser;
        } else {
          updated[index].user = '';
        }
      } else if (field === 'role' && !selectedUser && value === 'guest' && selectedGuest) {
        updated[index].user = selectedGuest;
      } else if (field === 'role' && !selectedUser) {
        updated[index].user = '';
      }
      return updated;
    });
  };

  const getUsersForRole = (role: string) => {
    if (!role) return [];
    switch (role) {
      case 'staff':
        return fmUsers || [];
      case 'member':
        return occupantUsers || [];
      case 'guest':
        return guestUsers || [];
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

      const adultMemberCharge = facilityDetails?.facility_charge?.adult_member_charge ?? 0;
      const adultGuestCharge = facilityDetails?.facility_charge?.adult_guest_charge ?? 0;
      const perSlotCharge = facilityDetails?.facility_charge?.per_slot_charge ?? 0;
      const memberRate = (bookingRuleData && typeof bookingRuleData.rate === 'number') ? bookingRuleData.rate : adultMemberCharge;
      const slotsCount = selectedSlots.length;
      const hasSlots = slotsCount > 0;
      let totalUserCharge = 0;
      let totalGuestCharge = 0;
      if (hasSlots) {
        let maxMemberPremium = 0;
        let maxGuestPremium = 0;
        selectedSlots.forEach((slotId) => {
          const slot = slots.find((s) => s.id === slotId);
          if (slot && slot.is_premium && slot.premium_percentage) {
            const mp = Math.round((memberRate * slot.premium_percentage) / 100);
            const gp = Math.round((adultGuestCharge * slot.premium_percentage) / 100);
            if (mp > maxMemberPremium) maxMemberPremium = mp;
            if (gp > maxGuestPremium) maxGuestPremium = gp;
          }
        });
        totalUserCharge = (userType === 'occupant' ? memberRate + maxMemberPremium : adultGuestCharge + maxGuestPremium);
        totalGuestCharge = isFullCourt
          ? Number(facilityDetails?.facility_charge?.full_court_charge ?? 0) * slotsCount
          : numberOfGuests * (adultGuestCharge + maxGuestPremium);
      } else {
        totalUserCharge = userType === 'occupant' ? memberRate : adultGuestCharge;
        totalGuestCharge = isFullCourt
          ? Number(facilityDetails?.facility_charge?.full_court_charge ?? 0)
          : numberOfGuests * adultGuestCharge;
      }
      const slotTotal = selectedSlots.length * perSlotCharge;

      const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
        const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
        return total + ((accessory?.price || 0) * (quantity || 0));
      }, 0);

      const subtotalBeforeDiscount = totalUserCharge + totalGuestCharge + slotTotal + accessoryTotal;
      const discountAmount = (subtotalBeforeDiscount * (discountPercentage || 0)) / 100;
      const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
      const gstPercentage = facilityDetails?.gst || 0;
      const sgstPercentage = facilityDetails?.sgst || 0;
      const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
      const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
      const amountFull = subtotalAfterDiscount + gstAmount + sgstAmount;

      const bookedMembersAttributes = peopleTable
        .filter(row => row.role && row.user)
        .map(row => {
          let totalCharge = 0;
          if (row.role === 'staff' || row.role === 'member') {
            totalCharge = adultMemberCharge;
          } else if (row.role === 'guest') {
            totalCharge = adultGuestCharge;
          }
          return {
            user_id: parseInt(row.user),
            oftype: row.level,
            total_charge: totalCharge
          };
        });

      let guestPremiumDetails: Array<{ slotLabel: string; slotPremiumPercent: number; guestPremium: number; total: number }> = [];
      if (selectedSlots.length > 0) {
        selectedSlots.forEach((slotId) => {
          const slot = slots.find((s) => s.id === slotId);
          let guestPremium = 0;
          let slotPremiumPercent = 0;
          if (slot && slot.is_premium && slot.premium_percentage) {
            slotPremiumPercent = slot.premium_percentage;
            guestPremium = (facilityDetails?.facility_charge?.adult_guest_charge ?? 0) * slot.premium_percentage / 100;
          }
          guestPremiumDetails.push({
            slotLabel: slot ? slot.ampm : '',
            slotPremiumPercent,
            guestPremium,
            total: (facilityDetails?.facility_charge?.adult_guest_charge ?? 0) + guestPremium
          });
        });
      }

      const costSummary = (() => {
        const adultMemberCharge = facilityDetails?.facility_charge?.adult_member_charge ?? 0;
        const adultGuestCharge = facilityDetails?.facility_charge?.adult_guest_charge ?? 0;
        const perSlotCharge = facilityDetails?.facility_charge?.per_slot_charge ?? 0;
        const memberRate = (bookingRuleData && typeof bookingRuleData.rate === 'number') ? bookingRuleData.rate : adultMemberCharge;
        const slotsCount = selectedSlots.length;
        const hasSlots = slotsCount > 0;
        let totalUserCharge = 0;
        let totalGuestCharge = 0;
        let slotPremiumDetails = [];
        if (hasSlots) {
          selectedSlots.forEach((slotId) => {
            const slot = slots.find((s) => s.id === slotId);
            let memberPremium = 0;
            let guestPremium = 0;
            let slotPremiumPercent = 0;
            if (slot && slot.is_premium && slot.premium_percentage) {
              slotPremiumPercent = slot.premium_percentage;
              memberPremium = (memberRate * slot.premium_percentage) / 100;
              guestPremium = (adultGuestCharge * slot.premium_percentage) / 100;
            }
            slotPremiumDetails.push({
              slotLabel: slot ? slot.ampm : '',
              slotPremiumPercent,
              memberPremium,
              guestPremium
            });
          });
          const maxMemberPremium = slotPremiumDetails.reduce((max, s) => Math.max(max, s.memberPremium), 0);
          const maxGuestPremium = slotPremiumDetails.reduce((max, s) => Math.max(max, s.guestPremium), 0);
          totalUserCharge = (userType === 'occupant' ? memberRate + maxMemberPremium : adultGuestCharge + maxGuestPremium);
          totalGuestCharge = isFullCourt
            ? Number(facilityDetails?.facility_charge?.full_court_charge ?? 0) * slotsCount
            : numberOfGuests * (adultGuestCharge + maxGuestPremium);
        } else {
          totalUserCharge = userType === 'occupant' ? memberRate : adultGuestCharge;
          totalGuestCharge = isFullCourt
            ? Number(facilityDetails?.facility_charge?.full_court_charge ?? 0)
            : numberOfGuests * adultGuestCharge;
        }

        const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
          const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
          return total + ((accessory?.price || 0) * (quantity || 0));
        }, 0);

        const slotTotal = slotsCount * perSlotCharge;
        let subtotalBeforeDiscount = 0;
        if (userType === 'occupant') {
          subtotalBeforeDiscount = totalUserCharge + totalGuestCharge + slotTotal + accessoryTotal;
        } else {
          subtotalBeforeDiscount = totalGuestCharge + slotTotal + accessoryTotal;
        }
        const discountAmount = (subtotalBeforeDiscount * (discountPercentage || 0)) / 100;
        const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
        const gstPercentage = facilityDetails?.gst || 0;
        const sgstPercentage = facilityDetails?.sgst || 0;
        const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
        const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
        const amountFull = subtotalAfterDiscount + gstAmount + sgstAmount;
        return {
          totalUserCharge,
          totalGuestCharge,
          slotPremiumDetails,
          slotTotal,
          accessoryTotal,
          subtotalBeforeDiscount,
          discountAmount,
          subtotalAfterDiscount,
          gstPercentage,
          sgstPercentage,
          gstAmount,
          sgstAmount,
          amountFull
        };
      })();

      const isComplementary = paymentMethod === 'complementary';

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
          entity_id: '',
          member_charges: isComplementary ? 0 : (userType === 'occupant' ? costSummary.totalUserCharge : 0),
          guest_charges: isComplementary ? 0 : (userType === 'occupant' ? costSummary.totalGuestCharge : costSummary.totalUserCharge),
          guest_premium_details: guestPremiumDetails,
          discount: isComplementary ? 0 : costSummary.discountAmount,
          cgst_amount: isComplementary ? 0 : costSummary.gstAmount,
          sgst_amount: isComplementary ? 0 : costSummary.sgstAmount,
          gst: costSummary.gstPercentage,
          sgst: costSummary.sgstPercentage,
          sub_total: isComplementary ? 0 : costSummary.subtotalAfterDiscount,
          amount_full: isComplementary ? 0 : costSummary.amountFull,
          booked_members_attributes: bookedMembersAttributes,
          member_count: userType === 'occupant' ? 1 : 0,
          guest_count: isFullCourt ? 0 : numberOfGuests,
          ...(isFullCourt && { is_full_court: true }),
          ...(paymentMethod === 'complementary' && { complementary_payment_reason: complementaryReason }),
        },
        on_behalf_of: userType === 'occupant' ? 'occupant-user' : userType === 'guest' ? 'guest-user' : 'fm-user',
        occupant_user_id: userType === 'occupant' ? selectedUser : '',
        fm_user_id: userType === 'fm' ? selectedUser : '',
        guest_user_id: userType === 'guest' ? selectedUser : ''
      };

      const response = await apiClient.patch(`/pms/admin/facility_bookings/${id}.json`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success('Booking updated successfully!');
        navigate(-1);
      }
    } catch (error: any) {
      console.error('Error updating facility booking:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      toast.error('Error updating booking. Please check the console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToList = () => {
    navigate(-1);
  };

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

  const availableSlotsForSelect = slots.filter(s => !s.is_booked);
  const allAvailableSelected = availableSlotsForSelect.length > 0 && availableSlotsForSelect.every(s => selectedSlots.includes(s.id));
  const atMaxLimit = availableSlotsForSelect.length > 0 && selectedSlots.length >= maxSelectableSlots;
  const isSelectAllChecked = allAvailableSelected || atMaxLimit;
  const isSelectAllIndeterminate = selectedSlots.length > 0 && !isSelectAllChecked;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C72030]" />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 mx-auto">
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
            <h1 className="text-xl font-semibold" style={{ color: '#C72030' }}>Edit Facility Booking</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <RadioGroup value={userType} onValueChange={(val) => { setUserType(val); if (val !== 'guest') setIsFullCourt(false); }} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="occupant" id="edit_occupant" />
                <Label htmlFor="edit_occupant">Members</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="guest" id="edit_guest" />
                <Label htmlFor="edit_guest">Guest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fm" id="edit_fm" />
                <Label htmlFor="edit_fm">Staff</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  classes: { asterisk: "text-red-500" },
                  shrink: true
                }}
                sx={fieldStyles}
                disabled={userType === 'occupant' ? occupantUsersLoading : userType === 'guest' ? guestUsersLoading : fmUsersLoading}
                helperText={userType === 'occupant' ? (occupantUsersError ? "Error loading users" : "") : userType === 'guest' ? (guestUsersError ? "Error loading guest users" : "") : (fmUsersError ? "Error loading users" : "")}
                error={userType === 'occupant' ? !!occupantUsersError : userType === 'guest' ? !!guestUsersError : !!fmUsersError}
              >
                <MenuItem value="" disabled>
                  <em>Select User</em>
                </MenuItem>
                {userType === 'occupant' && occupantUsersLoading && (
                  <MenuItem value="" disabled>Loading users...</MenuItem>
                )}
                {userType === 'occupant' && !occupantUsersLoading && !occupantUsersError && occupantUsers.length === 0 && (
                  <MenuItem value="" disabled>No users available</MenuItem>
                )}
                {userType === 'occupant' && occupantUsers.map((user: any) => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim()}
                  </MenuItem>
                ))}
                {userType === 'guest' && guestUsersLoading && (
                  <MenuItem value="" disabled>Loading guest users...</MenuItem>
                )}
                {userType === 'guest' && !guestUsersLoading && !guestUsersError && guestUsers.length === 0 && (
                  <MenuItem value="" disabled>No guest users available</MenuItem>
                )}
                {userType === 'guest' && guestUsers.map((guest: any) => (
                  <MenuItem key={guest.id} value={guest.id.toString()}>
                    {guest.firstname} {guest.lastname}
                  </MenuItem>
                ))}
                {userType === 'fm' && fmUsersLoading && (
                  <MenuItem value="" disabled>Loading users...</MenuItem>
                )}
                {userType === 'fm' && !fmUsersLoading && !fmUsersError && fmUsers.length === 0 && (
                  <MenuItem value="" disabled>No users available</MenuItem>
                )}
                {userType === 'fm' && fmUsers.map((user: any) => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.full_name}
                  </MenuItem>
                ))}
              </TextField>
            </div>

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
                  classes: { asterisk: "text-red-500" },
                  shrink: true
                }}
                sx={fieldStyles}
                disabled={true}
                helperText={facilitySetupsError ? "Error loading facilities" : ""}
                error={!!facilitySetupsError}
              >
                <MenuItem value="" disabled>
                  <em>Select Facility</em>
                </MenuItem>
                {facilitySetupsLoading && (
                  <MenuItem value="" disabled>Loading facilities...</MenuItem>
                )}
                {!facilitySetupsLoading && !facilitySetupsError && facilities.length === 0 && (
                  <MenuItem value="" disabled>No facilities available</MenuItem>
                )}
                {facilities.map((facility: any) => (
                  <MenuItem key={facility.id} value={facility}>
                    {facility.fac_name} ({facility.fac_type.charAt(0).toUpperCase() + facility.fac_type.slice(1)})
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="space-y-2">
              <TextField
                type="date"
                label="Date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                fullWidth
                disabled
                InputLabelProps={{
                  classes: { asterisk: "text-red-500" },
                  shrink: true
                }}
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                }}
                sx={fieldStyles}
              />
            </div>
          </div>

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

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Select Slot<span className="text-red-500"> *</span></h2>
              {slots.length > 0 && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-select-all-slots"
                    ref={(el) => { if (el) el.indeterminate = isSelectAllIndeterminate; }}
                    checked={isSelectAllChecked}
                    disabled={!canSelectSlots || availableSlotsForSelect.length === 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        let newSelected = [...selectedSlots];
                        for (const slot of slots) {
                          if (slot.is_booked || newSelected.includes(slot.id)) continue;
                          if (newSelected.length >= maxSelectableSlots) break;
                          const all = [...newSelected, slot.id].sort((a, b) => a - b);
                          let maxConsec = 1, curr = 1;
                          for (let i = 1; i < all.length; i++) {
                            if (all[i] === all[i - 1] + 1) { curr++; maxConsec = Math.max(maxConsec, curr); }
                            else { curr = 1; }
                          }
                          if (maxConsec <= maxConcurrentSlots) {
                            newSelected.push(slot.id);
                          }
                        }
                        setSelectedSlots(newSelected);
                      } else {
                        setSelectedSlots([]);
                      }
                    }}
                    className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <Label htmlFor="edit-select-all-slots" className="cursor-pointer text-sm font-medium text-gray-700 select-none">
                    Select All
                    {selectedSlots.length > 0 && (
                      <span className="ml-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        {selectedSlots.length} selected
                      </span>
                    )}
                  </Label>
                </div>
              )}
            </div>
            {slots.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {slots.map((slot) => {
                    const disabled = !isSlotSelectable(slot.id);
                    const isBooked = slot.is_booked;
                    return (
                      <div key={slot.id} className={`flex items-center space-x-2 p-3 border rounded-lg ${isBooked ? 'bg-red-50 opacity-60 border-red-300' : disabled ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'}`}>
                        <input
                          type="checkbox"
                          id={`edit-slot-${slot.id}`}
                          checked={selectedSlots.includes(slot.id)}
                          onChange={() => handleSlotSelection(slot.id)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          disabled={!canSelectSlots || disabled}
                        />
                        <Label
                          htmlFor={`edit-slot-${slot.id}`}
                          className={`cursor-pointer text-sm font-medium flex items-center gap-2 ${isBooked ? 'text-red-600' : disabled ? 'text-gray-400' : ''}`}
                        >
                          {slot.ampm}
                          {isBooked && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                              </svg>
                              Booked
                            </span>
                          )}
                          {slot.is_premium && slot.premium_percentage && !isBooked && (
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
              </>
            ) : (
              <p className="text-gray-500">
                {selectedFacility && selectedDate
                  ? "No slots available for the selected date"
                  : "Please select facility and date to see available slots"
                }
              </p>
            )}
            {bookingRuleData && !canSelectSlots && (
              <div className="mt-2 text-red-600 text-sm font-medium">You are not allowed to book slots for this user.</div>
            )}
            {bookingRuleData && canSelectSlots && (
              <div className="mt-2 text-gray-600 text-xs">
                {`You can select up to ${maxSelectableSlots} slot${maxSelectableSlots !== 1 ? 's' : ''}. `}
                {maxConcurrentSlots > 1 && `You can select up to ${maxConcurrentSlots} consecutive slots.`}
              </div>
            )}
          </div>

          {availableAccessories.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Select Accessories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableAccessories.map((accessory) => (
                  <div key={accessory.id} className="flex flex-col space-y-2 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`edit-accessory-${accessory.id}`}
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
                        htmlFor={`edit-accessory-${accessory.id}`}
                        className="cursor-pointer text-sm font-medium flex-1"
                      >
                        <span>{accessory.name}</span>
                      </Label>
                      {accessory.price > 0 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">₹{accessory.price.toFixed(2)}</span>
                      )}
                    </div>
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

          <div>
            <h2 className="text-lg font-semibold mb-4">Payment Method<span className="text-red-500"> *</span></h2>
            {facilityDetails && (
              <RadioGroup value={paymentMethod} onValueChange={() => {}} className="space-y-3">
                {facilityDetails.postpaid === 1 && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="postpaid" id="edit_postpaid" />
                    <Label htmlFor="edit_postpaid">Postpaid</Label>
                  </div>
                )}
                {facilityDetails.prepaid === 1 && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prepaid" id="edit_prepaid" />
                    <Label htmlFor="edit_prepaid">Prepaid</Label>
                  </div>
                )}
                {facilityDetails.pay_on_facility === 1 && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay_on_facility" id="edit_pay_on_facility" />
                    <Label htmlFor="edit_pay_on_facility">Pay on Facility</Label>
                  </div>
                )}
                {facilityDetails.complementary === 1 && (
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="complementary" id="edit_complementary" />
                    <Label htmlFor="edit_complementary">Complementary</Label>
                  </div>
                )}
              </RadioGroup>
            )}
            {!facilityDetails && selectedFacility && (
              <p className="text-gray-500">Please select a facility to see available payment methods</p>
            )}
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
                    classes: { asterisk: "text-red-500" },
                    shrink: true
                  }}
                  sx={fieldStyles}
                  placeholder="Enter reason for complementary booking"
                />
              </div>
            )}
          </div>

          {facilityDetails?.facility_charge && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Charge Details</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#E5E0D3]">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sr No.</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">User Type</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilityDetails.facility_charge.adult_member_charge != null && (
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">1</td>
                        <td className="border border-gray-300 px-4 py-3">Adult Member</td>
                        <td className="border border-gray-300 px-4 py-3">₹{facilityDetails.facility_charge.adult_member_charge.toFixed(2)}</td>
                      </tr>
                    )}
                    {facilityDetails.facility_charge.adult_guest_charge != null && (
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">2</td>
                        <td className="border border-gray-300 px-4 py-3">Adult Guest</td>
                        <td className="border border-gray-300 px-4 py-3">₹{facilityDetails.facility_charge.adult_guest_charge.toFixed(2)}</td>
                      </tr>
                    )}
                    {facilityDetails.facility_charge.full_court_charge != null && (
                      <tr className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">3</td>
                        <td className="border border-gray-300 px-4 py-3">Full Court</td>
                        <td className="border border-gray-300 px-4 py-3">₹{Number(facilityDetails.facility_charge.full_court_charge).toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {facilityDetails && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
              {!selectedUser ? (
                <div className="text-gray-500 text-center py-4">
                  Select a user to view cost summary
                </div>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    const adultMemberCharge = facilityDetails.facility_charge?.adult_member_charge ?? 0;
                    const adultGuestCharge = facilityDetails.facility_charge?.adult_guest_charge ?? 0;
                    const perSlotCharge = facilityDetails.facility_charge?.per_slot_charge ?? 0;
                    const memberRate = (bookingRuleData && typeof bookingRuleData.rate === 'number') ? bookingRuleData.rate : adultMemberCharge;
                    const slotsCount = selectedSlots.length;
                    const hasSlots = slotsCount > 0;
                    const userCharge = userType === 'occupant' ? memberRate : adultGuestCharge;
                    let slotPremiumDetails = [];
                    let totalUserCharge = 0;
                    let totalGuestCharge = 0;
                    if (hasSlots) {
                      selectedSlots.forEach((slotId) => {
                        const slot = slots.find((s) => s.id === slotId);
                        let memberPremium = 0;
                        let guestPremium = 0;
                        let slotPremiumPercent = 0;
                        if (slot && slot.is_premium && slot.premium_percentage) {
                          slotPremiumPercent = slot.premium_percentage;
                          memberPremium = (memberRate * slot.premium_percentage) / 100;
                          guestPremium = (adultGuestCharge * slot.premium_percentage) / 100;
                        }
                        slotPremiumDetails.push({
                          slotLabel: slot ? slot.ampm : '',
                          slotPremiumPercent,
                          memberPremium,
                          guestPremium
                        });
                      });
                      const maxMemberPremium = slotPremiumDetails.reduce((max, s) => Math.max(max, s.memberPremium), 0);
                      const maxGuestPremium = slotPremiumDetails.reduce((max, s) => Math.max(max, s.guestPremium), 0);
                      totalUserCharge = (userType === 'occupant' ? memberRate + maxMemberPremium : adultGuestCharge + maxGuestPremium);
                      totalGuestCharge = isFullCourt
                        ? Number(facilityDetails.facility_charge?.full_court_charge ?? 0) * slotsCount
                        : numberOfGuests * (adultGuestCharge + maxGuestPremium);
                    } else {
                      totalUserCharge = userType === 'occupant' ? memberRate : adultGuestCharge;
                      totalGuestCharge = isFullCourt
                        ? Number(facilityDetails.facility_charge?.full_court_charge ?? 0)
                        : numberOfGuests * adultGuestCharge;
                    }

                    const slotTotal = selectedSlots.length * perSlotCharge;

                    const accessoryTotal = Object.entries(selectedAccessories).reduce((total, [accessoryId, quantity]) => {
                      const accessory = availableAccessories.find(a => a.id === parseInt(accessoryId));
                      return total + ((accessory?.price || 0) * (quantity || 0));
                    }, 0);

                    let subtotalBeforeDiscount = 0;
                    if (userType === 'occupant') {
                      subtotalBeforeDiscount = totalUserCharge + totalGuestCharge + slotTotal + accessoryTotal;
                    } else {
                      subtotalBeforeDiscount = totalGuestCharge + slotTotal + accessoryTotal;
                    }
                    const discountAmount = (subtotalBeforeDiscount * (discountPercentage || 0)) / 100;
                    const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;

                    const gstPercentage = facilityDetails.gst || 0;
                    const sgstPercentage = facilityDetails.sgst || 0;
                    const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
                    const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
                    const totalTax = gstAmount + sgstAmount;
                    const grandTotal = subtotalAfterDiscount + totalTax;

                    const isComplementary = paymentMethod === 'complementary';

                    return (
                      <>
                        {isComplementary ? (
                          <>
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div>
                                <p className="text-sm text-gray-600 italic">This is a complimentary booking</p>
                                <p className="text-lg font-bold mt-2" style={{ color: '#8B4B8C' }}>Grand Total: ₹0</p>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {hasSlots && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200 bg-blue-50">
                                <span className="text-gray-700 font-medium">Number of Slots Selected</span>
                                <span className="font-semibold text-blue-600">{slotsCount}</span>
                              </div>
                            )}

                            {userType === 'occupant' && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div className="flex flex-col gap-1 w-full">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700">Member Charge</span>
                                    <span className="text-sm text-gray-500">(1 x ₹{memberRate.toFixed(2)})</span>
                                  </div>
                                  {/* {hasSlots && (
                                    <div className="flex justify-start">
                                      <table className="text-xs mt-1 mb-1 border border-gray-200" style={{ maxWidth: 450, minWidth: 320 }}>
                                        <thead>
                                          <tr className="bg-gray-50">
                                            <th className="border px-2 py-1 text-left">Slot</th>
                                            <th className="border px-2 py-1 text-left">Premium %</th>
                                            <th className="border px-2 py-1 text-left">Premium Amount</th>
                                            <th className="border px-2 py-1 text-left">Total Charge</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {slotPremiumDetails.map((s, idx) => {
                                            const base = memberRate;
                                            const total = base + s.memberPremium;
                                            return (
                                              <tr key={idx}>
                                                <td className="border px-2 py-1">{s.slotLabel}</td>
                                                <td className="border px-2 py-1">+{s.slotPremiumPercent || 0}%</td>
                                                <td className="border px-2 py-1 text-purple-700">₹{s.memberPremium.toFixed(2)}</td>
                                                <td className="border px-2 py-1 font-semibold">₹{total.toFixed(2)}</td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  )} */}
                                </div>
                                <span className="font-medium">₹{totalUserCharge.toFixed(2)}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <div className="flex flex-col gap-1 w-full">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700">Guest Charge</span>
                                  <div className="flex items-center gap-1">
                                    <TextField
                                      type="number"
                                      size="small"
                                      value={numberOfGuests}
                                      onChange={(e) => {
                                        const val = Math.max(0, parseInt(e.target.value) || 0);
                                        setNumberOfGuests(val > maxPeople ? maxPeople : val);
                                      }}
                                      variant="outlined"
                                      placeholder="No. of guests"
                                      sx={{
                                        width: '100px',
                                        '& .MuiOutlinedInput-root': {
                                          height: '36px',
                                          '& input': {
                                            textAlign: 'right',
                                            padding: '8px 12px'
                                          }
                                        }
                                      }}
                                      inputProps={{ min: 0, step: 1 }}
                                    />
                                    <span className="text-sm text-gray-500">{isFullCourt ? `(Full Court ₹${Number(facilityDetails.facility_charge?.full_court_charge).toFixed(2)} x ${slotsCount} slot${slotsCount > 1 ? 's' : ''})` : `x ₹${adultGuestCharge.toFixed(2)}`}</span>
                                  </div>
                                </div>
                                {userType === 'guest' && Number(facilityDetails.facility_charge?.full_court_charge) > 0 && (
                                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isFullCourt}
                                      onChange={(e) => {
                                        setIsFullCourt(e.target.checked);
                                      }}
                                      className="w-4 h-4"
                                    />
                                    Full Court (₹{Number(facilityDetails.facility_charge?.full_court_charge).toFixed(2)})
                                  </label>
                                )}
                                {/* {hasSlots && (
                                  <div className="flex justify-start">
                                    <table className="text-xs mt-1 mb-1 border border-gray-200" style={{ maxWidth: 450, minWidth: 320 }}>
                                      <thead>
                                        <tr className="bg-gray-50">
                                          <th className="border px-2 py-1 text-left">Slot</th>
                                          <th className="border px-2 py-1 text-left">Premium %</th>
                                          <th className="border px-2 py-1 text-left">Premium Amount</th>
                                          <th className="border px-2 py-1 text-left">Total Charge</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {slotPremiumDetails.map((s, idx) => {
                                          const base = adultGuestCharge;
                                          const total = base + s.guestPremium;
                                          return (
                                            <tr key={idx}>
                                              <td className="border px-2 py-1">{s.slotLabel}</td>
                                              <td className="border px-2 py-1">+{s.slotPremiumPercent || 0}%</td>
                                              <td className="border px-2 py-1 text-blue-700">₹{s.guestPremium.toFixed(2)}</td>
                                              <td className="border px-2 py-1 font-semibold">₹{total.toFixed(2)}</td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </div>
                                )} */}
                              </div>
                              <span className="font-medium">₹{totalGuestCharge.toFixed(2)}</span>
                            </div>

                            {selectedSlots.length > 0 && perSlotCharge > 0 && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700">Slot Charges</span>
                                  <span className="text-sm text-gray-500">({selectedSlots.length} x ₹{perSlotCharge.toFixed(2)})</span>
                                </div>
                                <span className="font-medium">₹{slotTotal.toFixed(2)}</span>
                              </div>
                            )}

                            {Object.keys(selectedAccessories).length > 0 && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700 font-medium">Accessories Total</span>
                                    <div className="text-xs text-gray-500">
                                      ({Object.entries(selectedAccessories).map(([id, qty]) => {
                                        const acc = availableAccessories.find(a => a.id === parseInt(id));
                                        return acc ? `${acc.name} x ${qty}` : '';
                                      }).filter(Boolean).join(', ')})
                                    </div>
                                  </div>
                                </div>
                                <span className="font-medium">₹{accessoryTotal.toFixed(2)}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <span className="text-gray-700 font-medium">Subtotal</span>
                              <span className="font-medium">₹{subtotalBeforeDiscount.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center py-2 border-b border-gray-200">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-700">Discount</span>
                                <div className="flex items-center gap-1">
                                  <TextField
                                    type="number"
                                    size="small"
                                    value={discountPercentage}
                                    onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
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
                                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                                  />
                                  <span className="text-gray-500">%</span>
                                </div>
                              </div>
                              <span className="font-medium"> ₹{discountAmount.toFixed(2)}</span>
                            </div>

                            {discountAmount > 0 && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <span className="text-gray-700 font-medium">Subtotal After Discount</span>
                                <span className="font-medium">₹{subtotalAfterDiscount.toFixed(2)}</span>
                              </div>
                            )}

                            {gstPercentage > 0 && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700">CGST</span>
                                  <span className="text-sm text-gray-500">({gstPercentage}%)</span>
                                </div>
                                <span className="font-medium">₹{gstAmount.toFixed(2)}</span>
                              </div>
                            )}

                            {sgstPercentage > 0 && (
                              <div className="flex justify-between items-center py-2 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-700">SGST</span>
                                  <span className="text-sm text-gray-500">({sgstPercentage}%)</span>
                                </div>
                                <span className="font-medium">₹{sgstAmount.toFixed(2)}</span>
                              </div>
                            )}

                            <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                              <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                              <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{grandTotal.toFixed(2)}</span>
                            </div>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Update'}
            </Button>
          </div>

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

          <Dialog
            open={openCancelPolicy}
            onClose={() => setOpenCancelPolicy(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Cancellation Policy</DialogTitle>
            <DialogContent>
              <div className="space-y-4">
                <div
                  className="prose prose-sm max-w-none quill-content"
                  dangerouslySetInnerHTML={{ __html: (selectedFacility && typeof selectedFacility === 'object' ? selectedFacility.cancellation_policy : null) || (bookingData?.cancellation_policy) || "<p className='text-gray-500'>No cancellation policy provided</p>" }}
                />
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

          <Dialog
            open={openTerms}
            onClose={() => setOpenTerms(false)}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogContent>
              <div className="space-y-4">
                <div
                  className="prose prose-sm max-w-none quill-content"
                  dangerouslySetInnerHTML={{ __html: (selectedFacility && typeof selectedFacility === 'object' ? selectedFacility.terms : null) || (bookingData?.terms) || "<p className='text-gray-500'>No terms and conditions provided</p>" }}
                />
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
    </>
  );
};

export default AmenityBookingEditPage;
