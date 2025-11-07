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
import { fetchActiveFacilities } from '@/store/slices/facilitySetupsSlice';
import { fetchOccupantUsers } from '@/store/slices/occupantUsersSlice';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

export const AddFacilityBookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: fmUsersResponse, loading: fmUsersLoading, error: fmUsersError } = useAppSelector((state) => state.fmUsers);
  const fmUsers = fmUsersResponse?.users || [];

  const occupantUsersState = useAppSelector((state) => state.occupantUsers);
  const occupantUsers = occupantUsersState?.users?.transformedUsers || [];
  const occupantUsersLoading = occupantUsersState?.loading;
  const occupantUsersError = occupantUsersState?.error;

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
    if (userType === 'occupant') {
      dispatch(fetchOccupantUsers({ page: 1, perPage: 100 }));
      dispatch(fetchEntities());
    } else {
      dispatch(fetchFMUsers());
    }
    dispatch(fetchActiveFacilities({ baseUrl: localStorage.getItem('baseUrl'), token: localStorage.getItem('token') }));
  }, [dispatch, userType]);

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
          selected_slots: selectedSlots,
          entity_id: selectedCompany,
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
              <Label htmlFor="fm">FM User</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occupant" id="occupant" />
              <Label htmlFor="occupant">Occupant User</Label>
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

          {/* User Selection - occupant or fm users */}
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
              disabled={userType === 'occupant' ? occupantUsersLoading : fmUsersLoading}
              helperText={userType === 'occupant' ? (occupantUsersError ? "Error loading users" : "") : (fmUsersError ? "Error loading users" : "")}
              error={userType === 'occupant' ? !!occupantUsersError : !!fmUsersError}
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