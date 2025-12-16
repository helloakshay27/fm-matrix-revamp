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
  const [selectedGuest, setSelectedGuest] = useState('');

  console.log(occupantUsersState)

  const { data: entitiesResponse, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const entities = Array.isArray(entitiesResponse?.entities) ? entitiesResponse.entities :
    Array.isArray(entitiesResponse) ? entitiesResponse : [];

  const { data: facilitySetupsResponse, loading: facilitySetupsLoading, error: facilitySetupsError } = useAppSelector((state) => state.fetchActiveFacilities);
  const facilities = Array.isArray(facilitySetupsResponse?.facility_setups) ? facilitySetupsResponse.facility_setups :
    Array.isArray(facilitySetupsResponse) ? facilitySetupsResponse : [];

  const [userType, setUserType] = useState('fm');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
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
    };
    gst?: number;
    sgst?: number;
  } | null>(null);
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
  const [openCancelPolicy, setOpenCancelPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);
  const [complementaryReason, setComplementaryReason] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
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

  // Fetch data on component mount
  useEffect(() => {
    if (userType === 'occupant') {
      dispatch(fetchOccupantUsers({ page: 1, perPage: 100 }));
      dispatch(fetchEntities());
    } else if (userType === 'guest') {
      fetchGuestUsers();
    } else {
      dispatch(fetchFMUsers());
    }
    dispatch(fetchActiveFacilities({ baseUrl: localStorage.getItem('baseUrl'), token: localStorage.getItem('token') }));
  }, [dispatch, userType]);

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

      // Call amenity booking API for members
      // if (userType === 'occupant' && userId && facilityId) {
      //   try {
      //     const token = localStorage.getItem('token');
      //     const amenityResponse = await apiClient.get('/club_members/amenity_booking_by_club_plan', {
      //       params: {
      //         user_id: userId,
      //         facility_setup_id: facilityId
      //       },
      //       headers: {
      //         'Authorization': `Bearer ${token}`
      //       }
      //     });
      //     console.log('Amenity Booking by Club Plan Response:', amenityResponse.data);
      //   } catch (amenityError) {
      //     console.error('Error fetching amenity booking by club plan:', amenityError);
      //   }
      // }
    } catch (error) {
      console.error('Error fetching slots:', error);
      setSlots([]);
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

  // Call amenity booking API when member user type is selected with user and facility
  useEffect(() => {
    console.log('=== Amenity API Check ===');
    console.log('userType:', userType, '| Is occupant?', userType === 'occupant');
    console.log('selectedUser:', selectedUser, '| Is truthy?', !!selectedUser);
    console.log('selectedFacility:', selectedFacility, '| Is truthy?', !!selectedFacility);
    console.log('All conditions met?', userType === 'occupant' && !!selectedUser && !!selectedFacility);
    console.log('========================');
     const token= localStorage.getItem('token') 
     console.log('Token for Amenity API:', token);
    if (userType === 'occupant' && selectedUser && selectedFacility) {
      const fetchAmenityBooking = async () => {
        try {
          const facilityId = typeof selectedFacility === 'object' ? selectedFacility.id : selectedFacility;
          
          console.log('✅ Calling amenity API with:', {
            user_id: selectedUser,
            facility_setup_id: facilityId
          });
          
          const amenityResponse = await apiClient.get('/club_members/amenity_booking_by_club_plan', {
            params: {
              user_id: selectedUser,
              facility_setup_id: facilityId
            },
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            }
          });
          
          console.log('Amenity Booking by Club Plan Response:', amenityResponse.data);
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

  // Auto-select slot from URL parameter when slots are loaded
  useEffect(() => {
    if (urlSlotTime && slots.length > 0 && selectedSlots.length === 0) {
      // Decode the URL slot time (e.g., "9:00AM - 9:15AM")
      const decodedSlotTime = decodeURIComponent(urlSlotTime);
      
      // Find the slot that matches the clicked time
      // The slot.ampm format is like "09:00 AM to 09:15 AM"
      // The URL format is like "9:00AM - 9:15AM"
      const matchingSlot = slots.find(slot => {
        // Normalize both formats for comparison
        const slotTimeNormalized = slot.ampm
          .replace(/\s+/g, '') // Remove all spaces
          .replace('to', '-')  // Replace 'to' with '-'
          .toLowerCase();
        
        const urlTimeNormalized = decodedSlotTime
          .replace(/\s+/g, '') // Remove all spaces
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
        return [...prev, slotId];
      }
    });
  };

  // Handle people table changes
  const handlePeopleTableChange = (index: number, field: 'role' | 'user' | 'level', value: string) => {
    setPeopleTable(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // If role is changed and it matches the pre-selected user, auto-select that user
      if (field === 'role' && selectedUser) {
        // Check if the selected user exists in the users for this role
        const roleUsers = getUsersForRole(value);
        const userExists = roleUsers.some((u: any) => u.id.toString() === selectedUser.toString());
        
        if (userExists) {
          updated[index].user = selectedUser;
        } else {
          updated[index].user = ''; // Reset user if not found in role users
        }
      } else if (field === 'role' && !selectedUser && value === 'guest' && selectedGuest) {
        // Special case for guest when no selectedUser but selectedGuest exists
        updated[index].user = selectedGuest;
      } else if (field === 'role' && !selectedUser) {
        updated[index].user = ''; // Reset user if no pre-selection
      }
      
      return updated;
    });
  };

  // Get users based on role
  const getUsersForRole = (role: string) => {
    if (!role) return [];
    
    switch (role) {
      case 'staff':
        console.log('Staff users:', fmUsers);
        return fmUsers || [];
      case 'member':
        console.log('Member users:', occupantUsers);
        return occupantUsers || [];
      case 'guest':
        console.log('Guest users:', guestUsers);
        return guestUsers || [];
      default:
        return [];
    }
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
      
      // Calculate cost summary
      const staffMemberCount = peopleTable.filter(row => (row.role === 'staff' || row.role === 'member') && row.user).length;
      const guestCount = peopleTable.filter(row => row.role === 'guest' && row.user).length;
      
      const adultMemberCharge = facilityDetails?.facility_charge?.adult_member_charge || 0;
      const adultGuestCharge = facilityDetails?.facility_charge?.adult_guest_charge || 0;
      const perSlotCharge = facilityDetails?.facility_charge?.per_slot_charge || 0;
      
      const memberCharges = staffMemberCount * adultMemberCharge;
      const guestCharges = guestCount * adultGuestCharge;
      const slotCharges = selectedSlots.length * perSlotCharge;
      
      const subtotalBeforeDiscount = memberCharges + guestCharges + slotCharges;
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
          // Calculate individual charge based on role
          let totalCharge = 0;
          if (row.role === 'staff' || row.role === 'member') {
            totalCharge = adultMemberCharge;
          } else if (row.role === 'guest') {
            totalCharge = adultGuestCharge;
          }
          
          return {
            user_id: parseInt(row.user),
            oftype: row.level, // 'primary' or 'secondary'
            total_charge: totalCharge
          };
        });
      
      const payload = {
        facility_booking: {
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
          entity_id: selectedCompany,
          member_charges: memberCharges,
          guest_charges: guestCharges,
          discount: discountAmount,
          gst: gstAmount,
          sgst: sgstAmount,
          sub_total: subtotalAfterDiscount,
          amount_full: amountFull,
          booked_members_attributes: bookedMembersAttributes,
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

      console.log('Response received:', response.status, response.data);

      if (response.status === 200 || response.status === 201) {
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
              <RadioGroupItem value="fm" id="fm" />
              <Label htmlFor="fm">Staff</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occupant" id="occupant" />
              <Label htmlFor="occupant">Members</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="guest" id="guest" />
              <Label htmlFor="guest">Guest</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Form Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Client Dropdown - only for occupant users */}
          {userType === 'occupant' && (
            <div className="space-y-2">
              <TextField
                select
                label="Client"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                SelectProps={{ displayEmpty: true }}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={fieldStyles}
                disabled={entitiesLoading}
                helperText={entitiesError ? "Error loading companies" : ""}
                error={!!entitiesError}
              >
                <MenuItem value="" disabled>
                  <em>
                    Select Client
                  </em>
                </MenuItem>
                {entitiesLoading && (
                  <MenuItem value="" disabled>
                    Loading companies...
                  </MenuItem>
                )}
                {!entitiesLoading && !entitiesError && entities.length === 0 && (
                  <MenuItem value="" disabled>
                    No companies available
                  </MenuItem>
                )}
                {entities.map((entity) => (
                  <MenuItem key={entity.id} value={entity.id.toString()}>
                    {entity.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          )}

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
              disabled={userType === 'occupant' ? occupantUsersLoading : userType === 'guest' ? guestUsersLoading : fmUsersLoading}
              helperText={userType === 'occupant' ? (occupantUsersError ? "Error loading users" : "") : userType === 'guest' ? (guestUsersError ? "Error loading guest users" : "") : (fmUsersError ? "Error loading users" : "")}
              error={userType === 'occupant' ? !!occupantUsersError : userType === 'guest' ? !!guestUsersError : !!fmUsersError}
            >
              <MenuItem value="" disabled>
                <em>
                  Select User
                </em>
              </MenuItem>
              {userType === 'occupant' && occupantUsersLoading && (
                <MenuItem value="" disabled>
                  Loading users...
                </MenuItem>
              )}
              {userType === 'occupant' && !occupantUsersLoading && !occupantUsersError && occupantUsers.length === 0 && (
                <MenuItem value="" disabled>
                  No users available
                </MenuItem>
              )}
              {userType === 'occupant' && occupantUsers.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  {user.name}
                </MenuItem>
              ))}

              {userType === 'guest' && guestUsersLoading && (
                <MenuItem value="" disabled>
                  Loading guest users...
                </MenuItem>
              )}
              {userType === 'guest' && !guestUsersLoading && !guestUsersError && guestUsers.length === 0 && (
                <MenuItem value="" disabled>
                  No guest users available
                </MenuItem>
              )}
              {userType === 'guest' && guestUsers.map((guest) => (
                <MenuItem key={guest.id} value={guest.id.toString()}>
                  {guest.firstname} {guest.lastname}
                </MenuItem>
              ))}

              {userType === 'fm' && fmUsersLoading && (
                <MenuItem value="" disabled>
                  Loading users...
                </MenuItem>
              )}
              {userType === 'fm' && !fmUsersLoading && !fmUsersError && fmUsers.length === 0 && (
                <MenuItem value="" disabled>
                  No users available
                </MenuItem>
              )}
              {userType === 'fm' && fmUsers.map((user) => (
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
              required
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
              {slots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    id={`slot-${slot.id}`}
                    checked={selectedSlots.includes(slot.id)}
                    onChange={() => handleSlotSelection(slot.id)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label
                    htmlFor={`slot-${slot.id}`}
                    className="cursor-pointer text-sm font-medium flex items-center gap-2"
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
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {selectedFacility && selectedDate
                ? "No slots available for the selected date"
                : "Please select facility and date to see available slots"
              }
            </p>
          )}
        </div>

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

        {/* People Table Section */}
        {facilityDetails && peopleTable.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Invited User</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#E5E0D3]">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sr No.</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Role</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">User</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {peopleTable.map((row, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">{row.srNo}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <TextField
                          select
                          size="small"
                          value={row.role}
                          onChange={(e) => handlePeopleTableChange(index, 'role', e.target.value)}
                          fullWidth
                          variant="outlined"
                        >
                          <MenuItem value="">Select Role</MenuItem>
                          <MenuItem value="staff">Staff</MenuItem>
                          <MenuItem value="member">Member</MenuItem>
                          <MenuItem value="guest">Guest</MenuItem>
                        </TextField>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <TextField
                          select
                          size="small"
                          value={row.user}
                          onChange={(e) => handlePeopleTableChange(index, 'user', e.target.value)}
                          fullWidth
                          variant="outlined"
                          disabled={!row.role}
                          SelectProps={{
                            displayEmpty: true,
                          }}
                        >
                          <MenuItem value="">
                            {!row.role 
                              ? 'Select Role First' 
                              : (row.role === 'staff' && fmUsersLoading) ||
                                (row.role === 'member' && occupantUsersLoading) ||
                                (row.role === 'guest' && guestUsersLoading)
                              ? 'Loading users...'
                              : 'Select User'
                            }
                          </MenuItem>
                          {row.role && getUsersForRole(row.role).map((user: any) => (
                            <MenuItem key={user.id} value={user.id}>
                              {row.role === 'staff' 
                                ? user.full_name 
                                : row.role === 'member' 
                                  ? user.name 
                                  : row.role === 'guest' 
                                    ? `${user.firstname || ''} ${user.lastname || ''}`.trim() 
                                    : user.name || user.username || `User ${user.id}`
                              }
                            </MenuItem>
                          ))}
                        </TextField>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <TextField
                          select
                          size="small"
                          value={row.level}
                          onChange={(e) => handlePeopleTableChange(index, 'level', e.target.value)}
                          fullWidth
                          variant="outlined"
                          disabled
                          // sx={{
                          //   '& .MuiInputBase-input.Mui-disabled': {
                          //     WebkitTextFillColor: 'rgba(0, 0, 0, 0.87)',
                          //     color: 'rgba(0, 0, 0, 0.87)'
                          //   }
                          // }}
                        >
                          <MenuItem value="primary">Primary</MenuItem>
                          <MenuItem value="secondary">Secondary</MenuItem>
                        </TextField>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
         )} 

        {/* Cost Summary Section */}
        {facilityDetails && peopleTable.length > 0 && peopleTable.some(row => row.role && row.user) && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Cost Summary</h2>
            <div className="space-y-3">
              {/* Calculate costs based on roles */}
              {(() => {
                const staffMemberCount = peopleTable.filter(row => (row.role === 'staff' || row.role === 'member') && row.user).length;
                const guestCount = peopleTable.filter(row => row.role === 'guest' && row.user).length;
                
                const adultMemberCharge = facilityDetails.facility_charge?.adult_member_charge || 0;
                const adultGuestCharge = facilityDetails.facility_charge?.adult_guest_charge || 0;
                const perSlotCharge = facilityDetails.facility_charge?.per_slot_charge || 0;
                
                const staffMemberTotal = staffMemberCount * adultMemberCharge;
                const guestTotal = guestCount * adultGuestCharge;
                const slotTotal = selectedSlots.length * perSlotCharge;
                
                const subtotalBeforeDiscount = staffMemberTotal + guestTotal + slotTotal;
                const discountAmount = (subtotalBeforeDiscount * (discountPercentage || 0)) / 100;
                const subtotalAfterDiscount = subtotalBeforeDiscount - discountAmount;
                
                const gstPercentage = facilityDetails.gst || 0;
                const sgstPercentage = facilityDetails.sgst || 0;
                const gstAmount = (subtotalAfterDiscount * gstPercentage) / 100;
                const sgstAmount = (subtotalAfterDiscount * sgstPercentage) / 100;
                const totalTax = gstAmount + sgstAmount;
                const grandTotal = subtotalAfterDiscount + totalTax;

                return (
                  <>
                    {/* Staff/Member Charges */}
                    {staffMemberCount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">Staff/Member Charges</span>
                          <span className="text-sm text-gray-500">({staffMemberCount} x ₹{adultMemberCharge.toFixed(2)})</span>
                        </div>
                        <span className="font-medium">₹{staffMemberTotal.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Guest Charges */}
                    {guestCount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">Guest Charges</span>
                          <span className="text-sm text-gray-500">({guestCount} x ₹{adultGuestCharge.toFixed(2)})</span>
                        </div>
                        <span className="font-medium">₹{guestTotal.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Slot Charges */}
                    {selectedSlots.length > 0 && perSlotCharge > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">Slot Charges</span>
                          <span className="text-sm text-gray-500">({selectedSlots.length} x ₹{perSlotCharge.toFixed(2)})</span>
                        </div>
                        <span className="font-medium">₹{slotTotal.toFixed(2)}</span>
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
                            inputProps={{
                              min: 0,
                              max: 100,
                              step: 0.1
                            }}
                          />
                          <span className="text-gray-500">%</span>
                        </div>
                      </div>
                      <span className="font-medium">- ₹{discountAmount.toFixed(2)}</span>
                    </div>

                    {/* Subtotal After Discount */}
                    {discountAmount > 0 && (
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

                    {/* Total Tax */}
                    {/* {totalTax > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-700 font-medium">Total Tax</span>
                        <span className="font-medium">₹{totalTax.toFixed(2)}</span>
                      </div>
                    )} */}

                    {/* Grand Total */}
                    <div className="flex justify-between items-center py-3 bg-[#8B4B8C] bg-opacity-10 px-4 rounded-lg mt-2">
                      <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>Grand Total</span>
                      <span className="text-lg font-bold" style={{ color: '#8B4B8C' }}>₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}
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