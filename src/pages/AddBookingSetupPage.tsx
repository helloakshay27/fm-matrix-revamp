import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import { TextField, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Custom theme for MUI components
const muiTheme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '16px',
        },
      },
      defaultProps: {
        shrink: true,
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            height: '36px',
            '@media (min-width: 768px)': {
              height: '45px',
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '8px 14px',
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
        },
      },
      defaultProps: {
        InputLabelProps: {
          shrink: true,
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            height: '36px',
            '@media (min-width: 768px)': {
              height: '45px',
            },
          },
          '& .MuiSelect-select': {
            padding: '8px 14px',
            '@media (min-width: 768px)': {
              padding: '12px 14px',
            },
          },
        },
      },
    },
  },
});

export const AddBookingSetupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    facilityName: '',
    isBookable: true,
    isRequest: false,
    active: 'Select',
    department: 'Select Department',
    appKey: '',
    postpaid: false,
    prepaid: false,
    payOnFacility: false,
    complimentary: false,
    gstPercentage: '0.0',
    sgstPercentage: '',
    perSlotCharge: '0.0',
    bookingAllowedBefore: { day: 'd', hour: 'h', minute: 'm' },
    advanceBooking: { day: 'd', hour: 'h', minute: 'm' },
    canCancelBefore: { day: 'd', hour: 'h', minute: 'm' },
    allowMultipleSlots: false,
    facilityBookedTimes: '',
    termsConditions: '',
    cancellationText: '',
    amenities: {
      tv: false,
      whiteboard: false,
      casting: false,
      smartPenForTV: false,
      wirelessCharging: false,
      meetingRoomInventory: false
    },
    seaterInfo: 'Select a seater',
    floorInfo: 'Select a floor',
    sharedContentInfo: 'Text content will appear on meeting room share icon in Application'
  });

  const [slots, setSlots] = useState([
    {
      startTime: { hour: '00', minute: '00' },
      breakTimeStart: { hour: '00', minute: '00' },
      breakTimeEnd: { hour: '00', minute: '00' },
      endTime: { hour: '00', minute: '00' },
      concurrentSlots: '',
      slotBy: '15 Minutes',
      wrapTime: ''
    }
  ]);

  const handleSave = () => {
    console.log('Saving booking setup:', formData);
    navigate('/settings/vas/booking/setup');
  };

  const handleClose = () => {
    navigate('/settings/vas/booking/setup');
  };

  const addSlot = () => {
    setSlots([...slots, {
      startTime: { hour: '00', minute: '00' },
      breakTimeStart: { hour: '00', minute: '00' },
      breakTimeEnd: { hour: '00', minute: '00' },
      endTime: { hour: '00', minute: '00' },
      concurrentSlots: '',
      slotBy: '15 Minutes',
      wrapTime: ''
    }]);
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-lg shadow-sm max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b bg-gray-50">
            <div>
              <p className="text-sm text-gray-600 mb-1">Settings &gt; Value Added Services &gt; Booking &gt; Setup &gt; Add</p>
              <h2 className="text-xl font-bold text-gray-800">NEW BOOKING SETUP</h2>
            </div>
            <Button variant="ghost" onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField
                label="Facility Name*"
                placeholder="Enter Facility Name"
                value={formData.facilityName}
                onChange={(e) => setFormData({ ...formData, facilityName: e.target.value })}
                variant="outlined"
              />
              <FormControl>
                <InputLabel>Active*</InputLabel>
                <Select
                  value={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.value })}
                  label="Active*"
                >
                  <MenuItem value="Select">Select</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
              <FormControl>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  label="Department"
                >
                  <MenuItem value="Select Department">Select Department</MenuItem>
                  <MenuItem value="IT">IT</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Radio Buttons */}
            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="bookable"
                  name="type"
                  checked={formData.isBookable}
                  onChange={() => setFormData({ ...formData, isBookable: true, isRequest: false })}
                  className="text-blue-600"
                />
                <label htmlFor="bookable">Bookable</label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="request"
                  name="type"
                  checked={formData.isRequest}
                  onChange={() => setFormData({ ...formData, isBookable: false, isRequest: true })}
                  className="text-blue-600"
                />
                <label htmlFor="request">Request</label>
              </div>
            </div>

            {/* Configure App Key */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CONFIGURE APP KEY</h3>
              </div>
              <TextField
                label="App Key"
                placeholder="Enter Alphanumeric Key"
                value={formData.appKey}
                onChange={(e) => setFormData({ ...formData, appKey: e.target.value })}
                variant="outlined"
              />
            </div>

            {/* Configure Payment */}
            <div className="border border-[#C72030]/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[#C72030] rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                <h3 className="text-lg font-semibold text-[#C72030]">CONFIGURE PAYMENT</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="postpaid"
                    checked={formData.postpaid}
                    onCheckedChange={(checked) => setFormData({ ...formData, postpaid: !!checked })}
                  />
                  <label htmlFor="postpaid">Postpaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prepaid"
                    checked={formData.prepaid}
                    onCheckedChange={(checked) => setFormData({ ...formData, prepaid: !!checked })}
                  />
                  <label htmlFor="prepaid">Prepaid</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="payOnFacility"
                    checked={formData.payOnFacility}
                    onCheckedChange={(checked) => setFormData({ ...formData, payOnFacility: !!checked })}
                  />
                  <label htmlFor="payOnFacility">Pay on Facility</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="complimentary"
                    checked={formData.complimentary}
                    onCheckedChange={(checked) => setFormData({ ...formData, complimentary: !!checked })}
                  />
                  <label htmlFor="complimentary">Complimentary</label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="SGST(%)"
                  value={formData.sgstPercentage}
                  onChange={(e) => setFormData({ ...formData, sgstPercentage: e.target.value })}
                  variant="outlined"
                />
                <TextField
                  label="GST(%)"
                  value={formData.gstPercentage}
                  onChange={(e) => setFormData({ ...formData, gstPercentage: e.target.value })}
                  variant="outlined"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t">
              <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white">
                Save
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};