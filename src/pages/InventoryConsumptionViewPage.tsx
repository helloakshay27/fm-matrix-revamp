import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, X } from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store/store';
import { fetchInventoryConsumptionDetails } from '@/store/slices/inventoryConsumptionDetailsSlice';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
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
  const [errors, setErrors] = useState<{ quantity: string; moveType: string }>({ quantity: '', moveType: '' });

  // Map backend error verbiage to friendly messages
  const mapBackendError = (raw: any): string => {
    let msg = '';
    if (!raw) return msg;
    if (Array.isArray(raw)) msg = raw.join(', ');
    else if (typeof raw === 'object') {
      try { msg = (Object.values(raw) as any[]).flat().join(', '); }
      catch { msg = JSON.stringify(raw); }
    } else if (typeof raw === 'string') {
      msg = raw;
    }
    const normalized = msg.replace(/\s+/g, ' ').trim();
    // Specific remap requested by product
    if (/difference\s+quantity\s+is\s+invalid/i.test(normalized)) {
      return 'Quantity exceeds available stock';
    }
    return normalized || '';
  };

  // EnhancedTable: columns config
  const columns = useMemo(
    () => [
      { key: 'date', label: 'Date', sortable: true },
      { key: 'opening', label: 'Opening', sortable: true },
      { key: 'add_or_consume', label: 'Add / Consume', sortable: true },
      { key: 'closing', label: 'Closing', sortable: true },
      { key: 'consumption_type', label: 'Consumption Type', sortable: true },
      { key: 'comments', label: 'Comments', sortable: false },
      { key: 'consumed_by', label: 'Consumed By', sortable: true },
    ],
    []
  );

  // Helpers: sanitize and validate integer-only quantity
  const sanitizeIntegerInput = (val: string) => val.replace(/[^0-9]/g, '');
  const validateQuantity = (raw: string): string => {
    if (raw === '') return '';
    const n = parseInt(raw, 10);
    if (!Number.isFinite(n)) return 'Invalid quantity';
    if (n < 0) return 'Invalid quantity';
    if (n === 0) return 'Quantity must be greater than 0';
    return '';
  };

  // Check if all required fields are filled and valid
  const isFormValid =
    formData.quantity !== '' &&
    errors.quantity === '' &&
    formData.moveType !== '' &&
    errors.moveType === '';

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
  setErrors({ quantity: '', moveType: '' });
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

    // Final defensive validation
    const qtyInt = parseInt(formData.quantity, 10);
    if (!Number.isFinite(qtyInt) || qtyInt < 0) {
      toast.error('Invalid quantity');
      setIsSubmitting(false);
      return;
    }
    if (qtyInt === 0) {
      toast.error('Quantity must be greater than 0');
      setIsSubmitting(false);
      return;
    }
    if (formData.moveType === '') {
      toast.error('Select a move type');
      setIsSubmitting(false);
      return;
    }

    const payload = {
      resource_id: String(id),
      move_type: String(formData.moveType),
      quantity: String(qtyInt),
      comments: formData.comments,
    };

    console.log('Payload (POST direct):', payload);

    try {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      if (!baseUrl || !token) throw new Error('Missing baseUrl/token');

      const resp = await axios.post(`https://${baseUrl}/pms/inventories/new_inventory_consumption_addition.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });

      // Backend may return 200 with success:false and an errors field
      if (resp?.data && resp.data.success === false) {
        const rawErrors = resp.data.errors || resp.data.message || resp.data.error;
        const msg = mapBackendError(rawErrors);
        toast.error(msg || 'Submission failed');
        // Keep modal open so user can adjust values
        setIsSubmitting(false);
        return;
      }

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
        const apiMsg = mapBackendError(
          err.response?.data?.errors || err.response?.data?.message || err.response?.data?.error || err.message
        );
        toast.error(apiMsg || 'An unexpected error occurred. Please try again.');
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string) => (event: any) => {
    // Do NOT coerce moveType to Number; keep '' when placeholder selected
    let value = event.target.value;
    // Special handling for quantity: enforce integer-only input
    if (field === 'quantity') {
      value = sanitizeIntegerInput(String(value));
      const err = validateQuantity(String(value));
      setErrors((prev) => ({ ...prev, quantity: err }));
    }
    if (field === 'moveType') {
      const err = value === '' ? 'Select a move type' : '';
      setErrors((prev) => ({ ...prev, moveType: err }));
    }
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBack = () => {
    navigate('/maintenance/inventory-consumption');
  };

  // Render cell content for EnhancedTable
  const renderCell = useCallback(
    (item: any, columnKey: string) => {
      switch (columnKey) {
        case 'date':
          return item?.date || '-';
        case 'opening':
          return item?.opening ?? '-';
        case 'add_or_consume': {
          const type = String(item?.consumption_type || '').toLowerCase();
          const isNegative = ['consume', 'lost', 'breakage', 'spillage'].includes(type);
          return (
            <span className={isNegative ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
              {item?.add_or_consume ?? '-'}
            </span>
          );
        }
        case 'closing':
          return item?.closing ?? '-';
        case 'consumption_type':
          return item?.consumption_type || '-';
        case 'comments':
          return item?.comments || '-';
        case 'consumed_by':
          return item?.consumed_by || '-';
        default:
          return '-';
      }
    },
    []
  );

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

      {error ? (
        <div className="text-center py-8 text-red-500">Error loading data: {error}</div>
      ) : (
        <EnhancedTable
          data={consumptions}
          columns={columns}
          renderCell={renderCell}
          storageKey="inventory-consumptions-table"
          loading={loading}
          enableExport={false}
          hideTableExport
          hideTableSearch
          hideColumnsButton
          pagination={false}
          getItemId={(item) => (item as any)?.id?.toString?.() ?? ''}
          emptyMessage="No consumption data available"
        />
      )}

      <Dialog
        open={isModalOpen}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') return;
          handleCloseModal();
        }}
        disableEscapeKeyDown
        maxWidth="md"
        fullWidth
      >
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
            <div className="space-y-4 py-4">
              <TextField
                label="Enter Quantity"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                variant="outlined"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                  sx: {
                    '& .MuiFormLabel-asterisk': {
                      color: '#C72030',
                    },
                  },
                }}
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
                type="text"
                inputMode="numeric"
                inputProps={{ pattern: '[0-9]*', inputMode: 'numeric' }}
                onKeyDown={(e) => {
                  const invalid = ['e', 'E', '+', '-', '.'];
                  if (invalid.includes(e.key)) e.preventDefault();
                }}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity || ' '}
              />

              <FormControl fullWidth variant="outlined" error={Boolean(errors.moveType)} required>
                <InputLabel
                  shrink={true}
                  required
                  sx={{
                    color: '#9CA3AF',
                    fontSize: '14px',
                    '& .MuiFormLabel-asterisk': { color: '#C72030' },
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
                <FormHelperText>{errors.moveType || ' '}</FormHelperText>
              </FormControl>

              <TextField
                label={
                  <span style={{ fontSize: '16px' }}>
                    Comments <span style={{ color: 'red' }}>*</span>
                  </span>
                }
                placeholder="Enter Comments"
                value={formData.comments}
                onChange={handleInputChange('comments')}
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9CA3AF',
                    fontSize: '16px',
                    '&.Mui-focused': { color: '#C72030' },
                  },
                  // Match provided behavior: directly style the inner textarea
                  '& textarea': {
                    width: '100% !important',
                    resize: 'both',
                    overflow: 'auto',
                    boxSizing: 'border-box',
                    border: '1px solid #c4c4c4',
                    display: 'block',
                    bgcolor: 'transparent',
                  },
                  // Hide the hidden autosize textarea (if present)
                  "& textarea[aria-hidden='true']": {
                    display: 'none !important',
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