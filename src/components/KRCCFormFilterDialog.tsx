
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button } from '@/components/ui/button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { X } from 'lucide-react';
// Date picker imports commented out per request to hide start/end date temporarily
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface KRCCFormFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const KRCCFormFilterDialog = ({ isOpen, onClose, onApplyFilters }: KRCCFormFilterDialogProps) => {
  // const [startDate, setStartDate] = useState<Date | undefined>(); // commented out
  // const [endDate, setEndDate] = useState<Date | undefined>(); // commented out
  const [email, setEmail] = useState('');
  const [circle, setCircle] = useState('');
  const [circles, setCircles] = useState<string[]>([]);
  const [circlesLoading, setCirclesLoading] = useState(false);
  const [circlesError, setCirclesError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const emailProvided = email.trim().length > 0;

  // Fetch circles from API when dialog opens
  useEffect(() => {
    const fetchCircles = async () => {
      const baseUrl = localStorage.getItem('baseUrl');
      const token = localStorage.getItem('token');
      const companyId = localStorage.getItem('selectedCompanyId');
      if (!isOpen) return;
      if (!baseUrl || !token) {
        setCirclesError('Missing base URL or token');
        return;
      }
      if (!companyId) {
        setCirclesError('Missing company id');
        return;
      }
      setCirclesLoading(true);
      setCirclesError(null);
      try {
        const url = `https://${baseUrl}/pms/users/get_circles.json?company_id=${encodeURIComponent(companyId)}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error(`Failed (${res.status})`);
        const data = await res.json();
        // Attempt to derive circles array from common shapes
        let fetched: string[] = [];
        if (Array.isArray(data)) {
          fetched = data.map((c: any) => c?.name || c?.circle || String(c));
        } else if (Array.isArray(data?.circles)) {
          fetched = data.circles.map((c: any) => c?.name || c?.circle || String(c));
        } else if (data?.data && Array.isArray(data.data)) {
          fetched = data.data.map((c: any) => c?.name || c?.circle || String(c));
        } else {
          // Fallback: treat object keys as circle names
            fetched = Object.keys(data || {});
        }
        fetched = fetched.filter(Boolean);
        setCircles(fetched);
      } catch (e: any) {
        console.error('Circle fetch error:', e);
        setCirclesError(e.message || 'Failed to load circles');
      } finally {
        setCirclesLoading(false);
      }
    };
    fetchCircles();
  }, [isOpen]);

  const handleSubmit = () => {
    const filters = {
      // startDate,
      // endDate,
      email,
      circle
    };
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
  // setStartDate(undefined);
  // setEndDate(undefined);
  setEmail('');
  setCircle('');
  setCirclesError(null);
  // Propagate empty filters to parent so the main table resets
  onApplyFilters({ email: '', circle: '' });
  };

  const handleExport = async () => {
    const baseUrl = localStorage.getItem('baseUrl');
    const token = localStorage.getItem('token');
    if (!baseUrl || !token) {
      console.error('Missing base URL or token for export');
      return;
    }
    // Decide term: prioritize email else circle (as API OR param covers both fields)
    const termRaw = (email || circle || '').trim();
    if (!termRaw) {
      // If no filter term, avoid exporting entire dataset per requirement
      console.warn('No filter applied; export skipped to avoid full dataset export');
      return;
    }
    const emailMatch = termRaw.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const term = emailMatch ? emailMatch[0] : termRaw; // sanitize
    const url = `https://${baseUrl}/krcc_forms.xlsx?approval=yes&q[user_email_or_user_lock_user_permissions_circle_name_cont]=${encodeURIComponent(term)}&export=true`;
    try {
      setExporting(true);
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`Export failed (${res.status})`);
      const blob = await res.blob();
      if (blob.size === 0) throw new Error('Empty export file');
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'krcc_forms_filtered.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (e) {
      console.error('KRCC export error:', e);
    } finally {
      setExporting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600, fontSize: '1.125rem' }}>
        FILTER BY
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="h-6 w-6 p-0 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogTitle>
      <DialogContent dividers>
        {/* Date range picker section commented out per request */}
        {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
          <div className="space-y-4">
            {/* <div className="grid grid-cols-2 gap-4">
              <div>
                <DatePicker
                  label="Start Date"
                  value={startDate || null}
                  onChange={(date) => setStartDate(date ?? undefined)}
                  slotProps={{ textField: { fullWidth: true, size: 'small', margin: 'dense' } }}
                />
              </div>
              <div>
                <DatePicker
                  label="End Date"
                  value={endDate || null}
                  onChange={(date) => setEndDate(date ?? undefined)}
                  slotProps={{ textField: { fullWidth: true, size: 'small', margin: 'dense' } }}
                />
              </div>
            </div> */}
            {/* ...existing code... */}
            <div>
              <TextField
                label={<span>Email <span style={{ color: '#C72030' }}>*</span></span>}
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                size="small"
                margin="dense"
              />
            </div>
            {/* <div>
              <FormControl fullWidth size="small" margin="dense">
                <InputLabel id="circle-label">Circle</InputLabel>
                <Select
                  labelId="circle-label"
                  value={circle}
                  label="Circle"
                  onChange={(e) => setCircle(e.target.value)}
                  disabled={circlesLoading || (!!circlesError && circles.length === 0)}
                >
                  <MenuItem value="">-- Select Circle --</MenuItem>
                  {circlesLoading && <MenuItem disabled value="__loading">Loading...</MenuItem>}
                  {circlesError && !circlesLoading && circles.length === 0 && (
                    <MenuItem disabled value="__error">Failed to load circles</MenuItem>
                  )}
                  {circles.map(c => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {circlesError && (
                <div className="text-xs text-red-600 mt-1">{circlesError}</div>
              )}
            </div> */}
          </div>
        {/* </LocalizationProvider> */}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 2 }}>
        <Button 
          onClick={handleSubmit}
          className="flex-1 text-white cursor-pointer"
          style={{ backgroundColor: '#C72030' }}
          disabled={!emailProvided}
        >
          Submit
        </Button>
        <Button 
          onClick={handleExport}
          className="flex-1 text-white cursor-pointer disabled:opacity-60"
          style={{ backgroundColor: '#C72030' }}
          disabled={exporting || !emailProvided}
        >
          {exporting ? 'Exporting...' : 'Export'}
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline"
          className="flex-1 cursor-pointer"
          disabled={!emailProvided}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};
