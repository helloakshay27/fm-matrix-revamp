import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'sonner';

const InventoryConsumptionViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const searchParams = new URLSearchParams(location.search);
  const startDate = searchParams.get('start_date') || '';
  const endDate = searchParams.get('end_date') || '';

  const { inventory, consumptions, loading, error } = useSelector(
    (state: RootState) => state.inventoryConsumptionDetails
  );

  const [dateRange, setDateRange] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quantity: '',
    moveType: '',
    comments: '',
  });

  // Check if all required fields are filled
  const isFormValid = formData.quantity !== '' && formData.moveType !== '';

  useEffect(() => {
    if (id && startDate && endDate) {
      dispatch(fetchInventoryConsumptionDetails({
        id,
        start_date: startDate,
        end_date: endDate,
      }));
    }
  }, [dispatch, id, startDate, endDate]);

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
    setIsSubmitting(false);
  };

  const handleFormSubmit = async () => {
    if (!id || !isFormValid) return;

    setIsSubmitting(true);

    // Ensure we have a valid date range (fallback: current month start -> today)
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const fallbackStart = `${yyyy}-${mm}-01`;
    const fallbackEnd = `${yyyy}-${mm}-${dd}`;
    const effectiveStart = startDate || fallbackStart;
    const effectiveEnd = endDate || fallbackEnd;

    const payload = {
      resource_id: String(id),
      move_type: String(formData.moveType),
      quantity: String(formData.quantity),
      comments: formData.comments,
    };

    console.log('Payload (POST direct):', payload);

    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token) throw new Error('Missing baseUrl/token');

      await axios.post(`https://${baseUrl}/pms/inventories/new_inventory_consumption_addition.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });

      console.log('Refetching details with range:', { effectiveStart, effectiveEnd });
      await dispatch(
        fetchInventoryConsumptionDetails({ id, start_date: effectiveStart, end_date: effectiveEnd })
      ).unwrap();
      toast.success('Successfully submitted');
      handleCloseModal();
    } catch (err: any) {
      console.error('Submit error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      if (err.response?.status === 500) {
        toast.error('Server error occurred. Please try again later or contact support.');
      } else if (err.response?.status === 404) {
        toast.error('Resource not found. Please check the request and try again.');
      } else {
        toast.error(
          err.response?.data?.message || err.message || 'An unexpected error occurred. Please try again.'
        );
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    const value = field === 'moveType' ? Number(event.target.value) : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate('/maintenance/inventory-consumption');
  };

  return (
    <div className="p-6 space-y-6">
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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="text-lg font-semibold text-gray-800">
          Inventory Name: <span className="text-gray-900 font-bold">{inventory?.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleAddConsume}
              className="bg-[#22C55E] text-white hover:bg-[#16A34A] rounded-lg px-6 py-3 h-12 font-medium"
            >
              Add/Consume
            </Button>
          </div>
        </div>
      </div>

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
                      <span
                        className={
                          item.consumption_type === 'Consume'
                            ? 'text-red-500 font-medium'
                            : 'text-green-500 font-medium'
                        }
                      >
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

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
        <div style={{ minHeight: '500px' }}>
          <DialogTitle
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2 }}
          >
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
                    '&.Mui-focused': { color: '#C72030' },
                  },
                  '& .MuiOutlinedInput-input': {
                    fontSize: '16px',
                    padding: '16px 14px',
                  },
                }}
              />

              <FormControl fullWidth variant="outlined">
                <InputLabel
                  shrink={true}
                  sx={{
                    color: '#9CA3AF',
                    fontSize: '14px',
                    '&.Mui-focused': { color: '#C72030' },
                  }}
                >
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
                    },
                  }}
                >
                  <MenuItem value="">Select a Move Type</MenuItem>
                  <MenuItem value={1}>Add</MenuItem>
                  <MenuItem value={2}>Consume</MenuItem>
                  <MenuItem value={3}>Breakage</MenuItem>
                  <MenuItem value={4}>Spillage</MenuItem>
                  <MenuItem value={5}>Lost</MenuItem>
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
                    '&.Mui-focused': { color: '#C72030' },
                  },
                }}
              />

              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleFormSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="bg-[#6B2C91] text-white hover:bg-[#5A2479] rounded-lg px-8 py-3 h-12 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={20} className="text-white" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
                  )}
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