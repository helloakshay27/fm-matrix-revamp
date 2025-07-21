import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const InventoryConsumptionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [dateRange, setDateRange] = useState('');
  
  // Sample consumption history data - in real app this would come from API based on inventory ID
  const [consumptionHistory] = useState([
    {
      id: 1,
      inventory: 'Handwash',
      date: '15/04/2024',
      opening: '1.0',
      addConsume: '1.0',
      closing: '0.0',
      consumptionType: 'Consume',
      comments: 'Testing',
      consumedBy: 'Abdul A',
      isConsume: true
    },
    {
      id: 2,
      inventory: 'Handwash',
      date: '15/04/2024',
      opening: '2.0',
      addConsume: '1.0',
      closing: '1.0',
      consumptionType: 'Consume',
      comments: 'For washroom',
      consumedBy: 'Shubh Jhaveri',
      isConsume: true
    },
    {
      id: 3,
      inventory: 'Handwash',
      date: '23/01/2024',
      opening: '5.0',
      addConsume: '3.0',
      closing: '2.0',
      consumptionType: 'Consume',
      comments: '-',
      consumedBy: 'Abdul A',
      isConsume: true
    },
    {
      id: 4,
      inventory: 'Handwash',
      date: '31/08/2021',
      opening: '3.0',
      addConsume: '2.0',
      closing: '5.0',
      consumptionType: '-',
      comments: '-',
      consumedBy: 'Mukesh Dabhi',
      isConsume: false
    },
    {
      id: 5,
      inventory: 'Handwash',
      date: '23/08/2021',
      opening: '4.0',
      addConsume: '1.0',
      closing: '3.0',
      consumptionType: 'Consume',
      comments: '-',
      consumedBy: 'Mukesh Dabhi',
      isConsume: true
    },
    {
      id: 6,
      inventory: 'Handwash',
      date: '19/08/2021',
      opening: '3.0',
      addConsume: '1.0',
      closing: '4.0',
      consumptionType: '-',
      comments: 'Gents toilet',
      consumedBy: 'Mukesh Dabhi',
      isConsume: false
    }
  ]);

  const handleSubmit = () => {
    console.log('Submitted with date range:', dateRange);
  };

  const handleReset = () => {
    setDateRange('');
  };

  const handleAddConsume = () => {
    console.log('Navigate to Add/Consume page');
  };

  const handleBack = () => {
    navigate('/maintenance/inventory-consumption');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
      </div>


      {/* Controls */}
      <div className="flex items-center gap-4">
        <TextField
          label="Select Date Range"
          placeholder="Select Date Range"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          variant="outlined"
          sx={{
            width: '300px',
            '& .MuiOutlinedInput-root': {
              height: '48px',
              borderRadius: '8px',
              '& fieldset': { borderColor: '#D1D5DB' },
              '&:hover fieldset': { borderColor: '#9CA3AF' },
              '&.Mui-focused fieldset': { borderColor: '#C72030' },
            },
            '& .MuiInputLabel-root': {
              color: '#9CA3AF',
              fontSize: '14px',
              '&.Mui-focused': { color: '#C72030' }
            }
          }}
          InputProps={{
            endAdornment: <Calendar className="w-4 h-4 text-gray-400" />
          }}
        />
        
        <Button
          onClick={handleSubmit}
          className="bg-[#6B2C91] text-white hover:bg-[#5A2479] rounded-lg px-6 py-3 h-12 font-medium"
        >
          Submit
        </Button>
        
        <Button
          onClick={handleReset}
          variant="outline"
          className="border border-gray-400 text-gray-700 hover:bg-gray-50 rounded-lg px-6 py-3 h-12 font-medium"
        >
          Reset
        </Button>
        
        <Button
          onClick={handleAddConsume}
          className="bg-[#22C55E] text-white hover:bg-[#16A34A] rounded-lg px-6 py-3 h-12 font-medium"
        >
          Add/Consume
        </Button>
      </div>

      {/* Consumption History Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold text-gray-900">Inventory</TableHead>
                <TableHead className="font-semibold text-gray-900">Date</TableHead>
                <TableHead className="font-semibold text-gray-900">Opening</TableHead>
                <TableHead className="font-semibold text-gray-900">Add / Consume</TableHead>
                <TableHead className="font-semibold text-gray-900">Closing</TableHead>
                <TableHead className="font-semibold text-gray-900">Consumption Type</TableHead>
                <TableHead className="font-semibold text-gray-900">Comments</TableHead>
                <TableHead className="font-semibold text-gray-900">Consumed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumptionHistory.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.inventory}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.opening}</TableCell>
                  <TableCell>
                    <span className={item.isConsume ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                      {item.addConsume}
                    </span>
                  </TableCell>
                  <TableCell>{item.closing}</TableCell>
                  <TableCell>{item.consumptionType}</TableCell>
                  <TableCell>{item.comments}</TableCell>
                  <TableCell>{item.consumedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryConsumptionViewPage;