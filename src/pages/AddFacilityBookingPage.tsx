
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TextField, MenuItem } from '@mui/material';
import { CheckCircle, FileText, Shield } from 'lucide-react';

export const AddFacilityBookingPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('occupant');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      userType,
      selectedUser,
      selectedFacility,
      selectedCompany,
      selectedDate,
      comment
    });
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
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>Booking</span>
          <span>&gt;</span>
          <span>Add Facility Booking</span>
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
            >
              <MenuItem value="user1">User 1</MenuItem>
              <MenuItem value="user2">User 2</MenuItem>
              <MenuItem value="user3">User 3</MenuItem>
            </TextField>
          </div>

          {/* Facility Selection */}
          <div className="space-y-2">
            <TextField
              select
              label="Facility"
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={fieldStyles}
            >
              <MenuItem value="meeting-room">Meeting Room</MenuItem>
              <MenuItem value="conference-hall">Conference Hall</MenuItem>
              <MenuItem value="board-room">Board Room</MenuItem>
            </TextField>
          </div>

          {/* Company Selection */}
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
            >
              <MenuItem value="lockated-ho">Lockated HO</MenuItem>
              <MenuItem value="company-a">Company A</MenuItem>
              <MenuItem value="company-b">Company B</MenuItem>
              <MenuItem value="company-c">Company C</MenuItem>
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
          {/* Add slot selection logic here */}
        </div>

        {/* Payment Method Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          {/* Add payment method selection here */}
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

        {/* Footer Links */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 cursor-pointer hover:underline" style={{ color: '#C72030' }}>
            <FileText className="w-4 h-4" />
            Cancellation Policy
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:underline" style={{ color: '#C72030' }}>
            <Shield className="w-4 h-4" />
            Terms & Conditions
          </div>
        </div>
      </form>
    </div>
  );
};
