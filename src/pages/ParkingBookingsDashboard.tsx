
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

const ParkingBookingsDashboard = () => {
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [parkingSlot, setParkingSlot] = useState('');
  const navigate = useNavigate();

  const handleBuildingChange = (event: SelectChangeEvent) => {
    setBuilding(event.target.value);
  };

  const handleFloorChange = (event: SelectChangeEvent) => {
    setFloor(event.target.value);
  };

  const handleParkingSlotChange = (event: SelectChangeEvent) => {
    setParkingSlot(event.target.value);
  };

  const handleSubmit = () => {
    console.log('Parking booking submitted:', {
      building,
      floor,
      parkingSlot
    });
  };

  return (
    <div className="p-6 space-y-6 min-h-screen bg-white">
      <div className="flex items-center mb-6">
        <Button onClick={() => navigate('/vas/parking')} variant="ghost" className="mr-4 p-2 hover:bg-[#C72030]/10">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-[#C72030]">Parking</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-[#C72030] mb-6">Parking Create</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="building-label" sx={{ color: '#C72030', '&.Mui-focused': { color: '#C72030' } }}>
                  Building
                </InputLabel>
                <Select
                  labelId="building-label"
                  id="building"
                  value={building}
                  label="Building"
                  onChange={handleBuildingChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="building1">Building 1</MenuItem>
                  <MenuItem value="building2">Building 2</MenuItem>
                  <MenuItem value="building3">Building 3</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="floor-label" sx={{ color: '#C72030', '&.Mui-focused': { color: '#C72030' } }}>
                  Floor
                </InputLabel>
                <Select
                  labelId="floor-label"
                  id="floor"
                  value={floor}
                  label="Floor"
                  onChange={handleFloorChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="ground">Ground Floor</MenuItem>
                  <MenuItem value="first">First Floor</MenuItem>
                  <MenuItem value="second">Second Floor</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div>
              <FormControl fullWidth size="small">
                <InputLabel id="parking-slot-label" sx={{ color: '#C72030', '&.Mui-focused': { color: '#C72030' } }}>
                  Parking Slot
                </InputLabel>
                <Select
                  labelId="parking-slot-label"
                  id="parkingSlot"
                  value={parkingSlot}
                  label="Parking Slot"
                  onChange={handleParkingSlotChange}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#C72030',
                    },
                  }}
                >
                  <MenuItem value="slot1">A-001</MenuItem>
                  <MenuItem value="slot2">A-002</MenuItem>
                  <MenuItem value="slot3">B-001</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className="flex justify-start">
              <Button onClick={handleSubmit} className="bg-[#C72030] hover:bg-[#C72030]/90 text-white px-8 py-2 rounded-none border-none shadow-none">
                Submit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingBookingsDashboard;
