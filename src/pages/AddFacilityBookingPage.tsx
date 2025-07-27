
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { Label } from '@/components/ui/label';

// import { TextField, MenuItem } from '@mui/material';
// import { CheckCircle, FileText, Shield, ArrowLeft } from 'lucide-react';
// import { useAppDispatch, useAppSelector } from '@/store/hooks';
// import { fetchFMUsers } from '@/store/slices/fmUserSlice';
// import { fetchEntities } from '@/store/slices/entitiesSlice';
// import { fetchFacilitySetups } from '@/store/slices/facilitySetupsSlice';
// import { apiClient } from '@/utils/apiClient';
// import { toast } from 'sonner';

// export const AddFacilityBookingPage = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   // Get FM users from Redux store
//   const { data: fmUsersResponse, loading: fmUsersLoading, error: fmUsersError } = useAppSelector((state) => state.fmUsers);
//   const fmUsers = fmUsersResponse?.fm_users || [];

//   // Get entities from Redux store
//   const { data: entitiesResponse, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
//   const entities = Array.isArray(entitiesResponse?.entities) ? entitiesResponse.entities :
//     Array.isArray(entitiesResponse) ? entitiesResponse : [];

//   // Get facility setups from Redux store
//   const { data: facilitySetupsResponse, loading: facilitySetupsLoading, error: facilitySetupsError } = useAppSelector((state) => state.facilitySetups);
//   const facilities = Array.isArray(facilitySetupsResponse?.facility_setups) ? facilitySetupsResponse.facility_setups :
//     Array.isArray(facilitySetupsResponse) ? facilitySetupsResponse : [];

//   const [userType, setUserType] = useState('occupant');
//   const [selectedUser, setSelectedUser] = useState('');
//   const [selectedFacility, setSelectedFacility] = useState('');
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [comment, setComment] = useState('');
//   const [facilityDetails, setFacilityDetails] = useState<{
//     postpaid: number;
//     prepaid: number;
//     pay_on_facility: number;
//     complementary: number;
//   } | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [slots, setSlots] = useState<Array<{
//     id: number;
//     start_minute: number;
//     end_minute: number;
//     start_hour: number;
//     end_hour: number;
//     ampm: string;
//     wrap_time: number;
//     booked_by: string;
//     formated_start_hour: string;
//     formated_end_hour: string;
//     formated_start_minute: string;
//     formated_end_minute: string;
//   }>>([]);
//   const [selectedSlots, setSelectedSlots] = useState<number[]>([]);

//   // Fetch data on component mount
//   useEffect(() => {
//     dispatch(fetchFMUsers());
//     dispatch(fetchEntities());
//     dispatch(fetchFacilitySetups());
//   }, [dispatch]);

//   // Fetch facility details when facility is selected
//   const fetchFacilityDetails = async (facilityId: string) => {
//     try {
//       const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}.json`);
//       if (response.data && response.data.facility_setup) {
//         setFacilityDetails(response.data.facility_setup);
//         setPaymentMethod(''); // Reset payment method when facility changes
//       }
//     } catch (error) {
//       console.error('Error fetching facility details:', error);
//       setFacilityDetails(null);
//     }
//   };

//   // Handle facility selection change
//   const handleFacilityChange = (facilityId: string) => {
//     setSelectedFacility(facilityId);
//     if (facilityId) {
//       fetchFacilityDetails(facilityId);
//     } else {
//       setFacilityDetails(null);
//       setPaymentMethod('');
//     }
//   };

//   // Fetch available slots
//   const fetchSlots = async (facilityId: string, date: string, userId: string) => {
//     try {
//       // Convert date from YYYY-MM-DD to YYYY/MM/DD format
//       const formattedDate = date.replace(/-/g, '/');
//       const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}/get_schedules.json`, {
//         params: {
//           on_date: formattedDate,
//           user_id: userId
//         }
//       });

//       if (response.data && response.data.slots) {
//         setSlots(response.data.slots);
//         setSelectedSlots([]); // Reset selected slots when new slots are fetched
//       }
//     } catch (error) {
//       console.error('Error fetching slots:', error);
//       setSlots([]);
//     }
//   };

//   // Effect to fetch slots when facility, date, and user are all selected
//   useEffect(() => {
//     if (selectedFacility && selectedDate && selectedUser) {
//       fetchSlots(selectedFacility, selectedDate, selectedUser);
//     } else {
//       setSlots([]);
//       setSelectedSlots([]);
//     }
//   }, [selectedFacility, selectedDate, selectedUser]);

//   // Handle slot selection
//   const handleSlotSelection = (slotId: number) => {
//     setSelectedSlots(prev => {
//       if (prev.includes(slotId)) {
//         return prev.filter(id => id !== slotId);
//       } else {
//         return [...prev, slotId];
//       }
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       // Validate required fields first
//       if (!selectedCompany) {
//         toast.error('Please select a company');
//         return;
//       } else if (!selectedUser) {
//         toast.error('Please select a user');
//         return;
//       } else if (!selectedFacility) {
//         toast.error('Please select a facility');
//         return;
//       } else if (!selectedDate) {
//         toast.error('Please select a date');
//         return;
//       }

//       // Hardcode some values for testing, since localStorage might be empty
//       const selectedSiteId = localStorage.getItem('selectedSiteId') || '7'; // fallback value
//       const userString = localStorage.getItem('user');
//       let userId = '2844'; // fallback value

//       if (userString) {
//         try {
//           const user = JSON.parse(userString);
//           if (user && user.id) {
//             userId = user.id.toString();
//           }
//         } catch (error) {
//           console.error('Error parsing user from localStorage:', error);
//         }
//       }

//       console.log('Using values:', { selectedSiteId, userId });

//       console.log('=== FORM SUBMISSION DEBUG ===');
//       console.log('selectedUser:', selectedUser);
//       console.log('selectedFacility:', selectedFacility);
//       console.log('selectedDate:', selectedDate);
//       console.log('paymentMethod:', paymentMethod);
//       console.log('selectedSlots:', selectedSlots);
//       console.log('userType:', userType);
//       console.log('selectedSiteId:', selectedSiteId);
//       console.log('userId:', userId);

//       // Try JSON payload instead of FormData
//       const payload = {
//         facility_booking: {
//           user_society_type: 'User',
//           resource_type: 'Pms::Site',
//           resource_id: selectedSiteId,
//           book_by_id: selectedSlots[0], // Use first selected slot ID instead of user ID
//           book_by: 'slot',
//           facility_id: selectedFacility,
//           startdate: selectedDate.replace(/-/g, '/'),
//           comment: comment || '',
//           payment_method: paymentMethod,
//           selected_slots: selectedSlots
//         },
//         on_behalf_of: userType === 'occupant' ? 'occupant-user' : 'fm-user',
//         occupant_user_id: userType === 'occupant' ? selectedUser : '',
//         fm_user_id: userType === 'fm' ? selectedUser : ''
//       };

//       console.log('Payload being sent:', JSON.stringify(payload, null, 2));
//       console.log('About to submit to API...');

//       // Submit the booking with JSON payload
//       const response = await apiClient.post('/pms/admin/facility_bookings.json', payload, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       console.log('Response received:', response.status, response.data);

//       if (response.status === 200 || response.status === 201) {
//         console.log('Booking created successfully:', response.data);
//         toast.success('Booking created successfully!');
//         navigate('/vas/booking/list');
//       }
//     } catch (error: any) {
//       console.error('Error creating facility booking:', error);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//       }
//       toast.error('Error creating booking. Please check the console for details.');
//     }
//   };

//   const handleBackToList = () => {
//     navigate('/vas/booking/list');
//   };

//   const fieldStyles = {
//     '& .MuiOutlinedInput-root': {
//       borderRadius: '0.375rem',
//       backgroundColor: 'white',
//       height: {
//         xs: '36px',
//         sm: '45px'
//       },
//       '& fieldset': {
//         borderColor: '#d1d5db',
//       },
//       '&:hover fieldset': {
//         borderColor: '#9ca3af',
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: '#3b82f6',
//       },
//     },
//     '& .MuiInputLabel-root': {
//       '&.Mui-focused': {
//         color: '#3b82f6',
//       },
//     },
//   };

//   return (
//     <div className="p-6 mx-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center gap-2 text-sm text-gray-600 mb-2 cursor-pointer">
//           <button
//             onClick={handleBackToList}
//             className="flex items-center gap-1 hover:text-gray-800 transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span>Back</span>
//           </button>
//         </div>
//         <div className="flex items-center gap-3 mb-6">
//           <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C72030' }}>
//             <CheckCircle className="text-white w-5 h-5" />
//           </div>
//           <h1 className="text-xl font-semibold" style={{ color: '#C72030' }}>Facility Booking</h1>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
//         {/* User Type Selection */}
//         <div>
//           <RadioGroup value={userType} onValueChange={setUserType} className="flex gap-6">
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="occupant" id="occupant" />
//               <Label htmlFor="occupant">Occupant User</Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="fm" id="fm" />
//               <Label htmlFor="fm">FM User</Label>
//             </div>
//           </RadioGroup>
//         </div>

//         {/* Form Fields Row */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="space-y-2">
//             <TextField
//               select
//               label="Company*"
//               value={selectedCompany}
//               onChange={(e) => setSelectedCompany(e.target.value)}
//               variant="outlined"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               sx={fieldStyles}
//               disabled={entitiesLoading}
//               helperText={entitiesError ? "Error loading companies" : ""}
//               error={!!entitiesError}
//             >
//               {entitiesLoading && (
//                 <MenuItem value="" disabled>
//                   Loading companies...
//                 </MenuItem>
//               )}
//               {!entitiesLoading && !entitiesError && entities.length === 0 && (
//                 <MenuItem value="" disabled>
//                   No companies available
//                 </MenuItem>
//               )}
//               {entities.map((entity) => (
//                 <MenuItem key={entity.id} value={entity.id.toString()}>
//                   {entity.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </div>

//           {/* User Selection */}
//           <div className="space-y-2">
//             <TextField
//               select
//               label="User*"
//               value={selectedUser}
//               onChange={(e) => setSelectedUser(e.target.value)}
//               variant="outlined"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               sx={fieldStyles}
//               disabled={fmUsersLoading}
//               helperText={fmUsersError ? "Error loading users" : ""}
//               error={!!fmUsersError}
//             >
//               {fmUsersLoading && (
//                 <MenuItem value="" disabled>
//                   Loading users...
//                 </MenuItem>
//               )}
//               {!fmUsersLoading && !fmUsersError && fmUsers.length === 0 && (
//                 <MenuItem value="" disabled>
//                   No users available
//                 </MenuItem>
//               )}
//               {fmUsers.map((user) => (
//                 <MenuItem key={user.id} value={user.id.toString()}>
//                   {user.firstname} {user.lastname}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </div>

//           {/* Facility Selection */}
//           <div className="space-y-2">
//             <TextField
//               select
//               label="Facility*"
//               value={selectedFacility}
//               onChange={(e) => handleFacilityChange(e.target.value)}
//               variant="outlined"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               sx={fieldStyles}
//               disabled={facilitySetupsLoading}
//               helperText={facilitySetupsError ? "Error loading facilities" : ""}
//               error={!!facilitySetupsError}
//             >
//               {facilitySetupsLoading && (
//                 <MenuItem value="" disabled>
//                   Loading facilities...
//                 </MenuItem>
//               )}
//               {!facilitySetupsLoading && !facilitySetupsError && facilities.length === 0 && (
//                 <MenuItem value="" disabled>
//                   No facilities available
//                 </MenuItem>
//               )}
//               {facilities.map((facility) => (
//                 <MenuItem key={facility.id} value={facility.id.toString()}>
//                   {facility.fac_name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </div>

//           {/* Date Selection */}
//           <div className="space-y-2">
//             <TextField
//               type="date"
//               label="Date*"
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//               variant="outlined"
//               fullWidth
//               InputLabelProps={{ shrink: true }}
//               sx={fieldStyles}
//             />
//           </div>
//         </div>

//         {/* Comment */}
//         <div className="space-y-2">
//           <TextField
//             label="Comment"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             variant="outlined"
//             fullWidth
//             multiline
//             rows={4}
//             InputLabelProps={{ shrink: true }}
//             sx={{
//               ...fieldStyles,
//               '& .MuiOutlinedInput-root': {
//                 ...fieldStyles['& .MuiOutlinedInput-root'],
//                 height: 'auto',
//               },
//             }}
//           />
//         </div>

//         {/* Select Slot Section */}
//         <div>
//           <h2 className="text-lg font-semibold mb-4">Select Slot</h2>
//           {slots.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
//               {slots.map((slot) => (
//                 <div key={slot.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
//                   <input
//                     type="checkbox"
//                     id={`slot-${slot.id}`}
//                     checked={selectedSlots.includes(slot.id)}
//                     onChange={() => handleSlotSelection(slot.id)}
//                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                   <Label
//                     htmlFor={`slot-${slot.id}`}
//                     className="cursor-pointer text-sm font-medium"
//                   >
//                     {slot.ampm}
//                   </Label>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">
//               {selectedFacility && selectedDate && selectedUser
//                 ? "No slots available for the selected date"
//                 : "Please select facility, date, and user to see available slots"
//               }
//             </p>
//           )}
//         </div>

//         {/* Payment Method Section */}
//         <div>
//           <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
//           {facilityDetails && (
//             <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
//               {facilityDetails.postpaid === 1 && (
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="postpaid" id="postpaid" />
//                   <Label htmlFor="postpaid">Postpaid</Label>
//                 </div>
//               )}
//               {facilityDetails.prepaid === 1 && (
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="prepaid" id="prepaid" />
//                   <Label htmlFor="prepaid">Prepaid</Label>
//                 </div>
//               )}
//               {facilityDetails.pay_on_facility === 1 && (
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="pay_on_facility" id="pay_on_facility" />
//                   <Label htmlFor="pay_on_facility">Pay on Facility</Label>
//                 </div>
//               )}
//               {facilityDetails.complementary === 1 && (
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="complementary" id="complementary" />
//                   <Label htmlFor="complementary">Complementary</Label>
//                 </div>
//               )}
//             </RadioGroup>
//           )}
//           {!facilityDetails && selectedFacility && (
//             <p className="text-gray-500">Please select a facility to see available payment methods</p>
//           )}
//         </div>

//         {/* Submit Button */}
//         <div className="flex justify-center">
//           <Button
//             type="submit"
//             className="bg-[#8B4B8C] hover:bg-[#7A3F7B] text-white px-8 py-2"
//           >
//             Submit
//           </Button>
//         </div>

//         {/* Footer Links */}
//         <div className="space-y-2 text-sm">
//           <div className="flex items-center gap-2 cursor-pointer hover:underline" style={{ color: '#C72030' }}>
//             <FileText className="w-4 h-4" />
//             Cancellation Policy
//           </div>
//           <div className="flex items-center gap-2 cursor-pointer hover:underline" style={{ color: '#C72030' }}>
//             <Shield className="w-4 h-4" />
//             Terms & Conditions
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextField, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CheckCircle, FileText, Shield, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchFMUsers } from '@/store/slices/fmUserSlice';
import { fetchEntities } from '@/store/slices/entitiesSlice';
import { fetchFacilitySetups } from '@/store/slices/facilitySetupsSlice';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

export const AddFacilityBookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get FM users from Redux store
  const { data: fmUsersResponse, loading: fmUsersLoading, error: fmUsersError } = useAppSelector((state) => state.fmUsers);
  const fmUsers = fmUsersResponse?.fm_users || [];

  // Get entities from Redux store
  const { data: entitiesResponse, loading: entitiesLoading, error: entitiesError } = useAppSelector((state) => state.entities);
  const entities = Array.isArray(entitiesResponse?.entities) ? entitiesResponse.entities :
    Array.isArray(entitiesResponse) ? entitiesResponse : [];

  // Get facility setups from Redux store
  const { data: facilitySetupsResponse, loading: facilitySetupsLoading, error: facilitySetupsError } = useAppSelector((state) => state.facilitySetups);
  const facilities = Array.isArray(facilitySetupsResponse?.facility_setups) ? facilitySetupsResponse.facility_setups :
    Array.isArray(facilitySetupsResponse) ? facilitySetupsResponse : [];

  const [userType, setUserType] = useState('occupant');
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
  }>>([]);
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [openCancelPolicy, setOpenCancelPolicy] = useState(false);
  const [openTerms, setOpenTerms] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchFMUsers());
    dispatch(fetchEntities());
    dispatch(fetchFacilitySetups());
  }, [dispatch]);

  // Fetch facility details when facility is selected
  const fetchFacilityDetails = async (facilityId: string) => {
    try {
      const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}.json`);
      if (response.data && response.data.facility_setup) {
        setFacilityDetails(response.data.facility_setup);
        setPaymentMethod(''); // Reset payment method when facility changes
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

  const fetchSlots = async (facilityId: string, date: string, userId: string) => {
    try {
      // Convert date from YYYY-MM-DD to YYYY/MM/DD format
      const formattedDate = date.replace(/-/g, '/');
      const response = await apiClient.get(`/pms/admin/facility_setups/${facilityId}/get_schedules.json`, {
        params: {
          on_date: formattedDate,
          user_id: userId
        }
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

  // Effect to fetch slots when facility, date, and user are all selected
  useEffect(() => {
    if (selectedFacility && selectedDate && selectedUser) {
      fetchSlots(selectedFacility.id, selectedDate, selectedUser);
    } else {
      setSlots([]);
      setSelectedSlots([]);
    }
  }, [selectedFacility, selectedDate, selectedUser]);

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

      console.log('Using values:', { selectedSiteId, userId });
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('selectedUser:', selectedUser);
      console.log('selectedFacility:', selectedFacility);
      console.log('selectedDate:', selectedDate);
      console.log('paymentMethod:', paymentMethod);
      console.log('selectedSlots:', selectedSlots);
      console.log('userType:', userType);
      console.log('selectedSiteId:', selectedSiteId);
      console.log('userId:', userId);

      const payload = {
        facility_booking: {
          user_society_type: 'User',
          resource_type: 'Pms::Site',
          resource_id: selectedSiteId,
          book_by_id: selectedSlots[0],
          book_by: 'slot',
          facility_id: selectedFacility.id,
          startdate: selectedDate.replace(/-/g, '/'),
          comment: comment || '',
          payment_method: paymentMethod,
          selected_slots: selectedSlots
        },
        on_behalf_of: userType === 'occupant' ? 'occupant-user' : 'fm-user',
        occupant_user_id: userType === 'occupant' ? selectedUser : '',
        fm_user_id: userType === 'fm' ? selectedUser : ''
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
        console.log('Booking created successfully:', response.data);
        toast.error('Booking created successfully!');
        navigate('/vas/booking/list');
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
    navigate('/vas/booking/list');
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
              <RadioGroupItem value="occupant" id="occupant" />
              <Label htmlFor="occupant">Occupant User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fm" id="fm" />
              <Label htmlFor="fm">FM User</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Form Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <TextField
              select
              label="Company"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              disabled={entitiesLoading}
              helperText={entitiesError ? "Error loading companies" : ""}
              error={!!entitiesError}
            >
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

          {/* User Selection */}
          <div className="space-y-2">
            <TextField
              select
              label="User"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              disabled={fmUsersLoading}
              helperText={fmUsersError ? "Error loading users" : ""}
              error={!!fmUsersError}
            >
              {fmUsersLoading && (
                <MenuItem value="" disabled>
                  Loading users...
                </MenuItem>
              )}
              {!fmUsersLoading && !fmUsersError && fmUsers.length === 0 && (
                <MenuItem value="" disabled>
                  No users available
                </MenuItem>
              )}
              {fmUsers.map((user) => (
                <MenuItem key={user.id} value={user.id.toString()}>
                  {user.firstname} {user.lastname}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Facility Selection */}
          <div className="space-y-2">
            <TextField
              select
              label="Facility"
              value={selectedFacility}
              onChange={(e) => handleFacilityChange(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
              disabled={facilitySetupsLoading}
              helperText={facilitySetupsError ? "Error loading facilities" : ""}
              error={!!facilitySetupsError}
            >
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
                  {facility.fac_name}
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
              InputLabelProps={{ shrink: true }}
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
              ...fieldStyles,
              '& .MuiOutlinedInput-root': {
                ...fieldStyles['& .MuiOutlinedInput-root'],
                height: 'auto',
              },
            }}
          />
        </div>

        {/* Select Slot Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Select Slot</h2>
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
                    className="cursor-pointer text-sm font-medium"
                  >
                    {slot.ampm}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              {selectedFacility && selectedDate && selectedUser
                ? "No slots available for the selected date"
                : "Please select facility, date, and user to see available slots"
              }
            </p>
          )}
        </div>

        {/* Payment Method Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
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
        </div>

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
              {/* <p>Our cancellation policy is designed to ensure fair usage of our facilities:</p>
              <ul className="list-disc pl-5">
                <li>Cancellations made at least 24 hours in advance will receive a full refund.</li>
                <li>Cancellations made within 24 hours of the booking time may incur a 50% charge.</li>
                <li>No-shows or cancellations within 2 hours of the booking time will be charged the full amount.</li>
                <li>Complementary bookings may be cancelled without charge, subject to availability.</li>
              </ul>
              <p>Please contact our support team for any cancellation requests or inquiries.</p> */}

              {
                selectedFacility.cancellation_policy
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
              {/* <p>By using our facility booking system, you agree to the following terms:</p>
              <ul className="list-disc pl-5">
                <li>All bookings are subject to availability and confirmation.</li>
                <li>Users must adhere to facility usage guidelines and safety protocols.</li>
                <li>The management reserves the right to cancel or modify bookings in case of unforeseen circumstances.</li>
                <li>Users are responsible for any damage caused to the facilities during their booking.</li>
                <li>Payment terms must be adhered to as per the selected payment method.</li>
              </ul>
              <p>For a complete list of terms, please contact our administration office.</p> */}
              {
                selectedFacility.terms
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