import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryConsumptionDetails } from '@/store/slices/inventoryConsumptionDetailsSlice';
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';

const InventoryConsumptionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { inventory, consumptions, loading, error } = useSelector((state: RootState) => state.inventoryConsumptionDetails);
  
  const [dateRange, setDateRange] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    moveType: '',
    comments: ''
  });
  
  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryConsumptionDetails(id));
    }
  }, [dispatch, id]);

  const handleSubmit = () => {
    console.log('Submitted with date range:', dateRange);
  };

  const handleReset = () => {
    setDateRange('');
  };

  const handleAddConsume = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ quantity: '', moveType: '', comments: '' });
  };

  const handleFormSubmit = () => {
    console.log('Form submitted:', formData);
    handleCloseModal();
  };

  const handleInputChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading consumption data...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-red-500">
                    Error loading data: {error}
                  </TableCell>
                </TableRow>
              ) : consumptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No consumption data available
                  </TableCell>
                </TableRow>
              ) : (
                consumptions.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.opening}</TableCell>
                    <TableCell>
                      <span className={item.consumption_type === 'Consume' ? "text-red-500 font-medium" : "text-green-500 font-medium"}>
                        {item.add_or_consume}
                      </span>
                    </TableCell>
                    <TableCell>{item.closing}</TableCell>
                    <TableCell>{item.consumption_type}</TableCell>
                    <TableCell>{item.comments}</TableCell>
                    <TableCell>{item.consumed_by}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Consume Modal */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <div style={{ minHeight: '500px' }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}>
          Add / Consume
          <IconButton onClick={handleCloseModal}>
            <X className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, minHeight: '400px', pb: 4 }}>
          <div className="space-y-8 py-4">
            <TextField
              label="Enter Quantity"
              placeholder="Enter Quantity"
              value={formData.quantity}
              onChange={handleInputChange('quantity')}
              variant="outlined"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '56px',
                  borderRadius: '8px',
                  fontSize: '16px',
                },
                '& .MuiInputLabel-root': {
                  color: '#9CA3AF',
                  fontSize: '16px',
                  fontWeight: '500',
                  '&.Mui-focused': { color: '#C72030' }
                },
                '& .MuiOutlinedInput-input': {
                  fontSize: '16px',
                  padding: '16px 14px'
                }
              }}
            />

            <FormControl fullWidth variant="outlined">
              <InputLabel shrink={true} sx={{ color: '#9CA3AF', fontSize: '14px', '&.Mui-focused': { color: '#C72030' } }}>
                Select Type
              </InputLabel>
              <Select
                value={formData.moveType}
                onChange={handleInputChange('moveType')}
                label="Select Type"
                displayEmpty
                sx={{
                  height: '48px',
                  borderRadius: '8px',
                  '& .MuiSelect-select': {
                    padding: '12px 14px',
                  }
                }}
              >
                <MenuItem value="">Select a Move Type</MenuItem>
                <MenuItem value="add">Add</MenuItem>
                <MenuItem value="consume">Consume</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Comments"
              placeholder="Enter comments"
              value={formData.comments}
              onChange={handleInputChange('comments')}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              InputLabelProps={{ shrink: true }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputLabel-root': {
                  color: '#9CA3AF',
                  fontSize: '14px',
                  '&.Mui-focused': { color: '#C72030' }
                }
              }}
            />

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleFormSubmit}
                className="bg-[#6B2C91] text-white hover:bg-[#5A2479] rounded-lg px-8 py-3 h-12 font-medium"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default InventoryConsumptionViewPage;