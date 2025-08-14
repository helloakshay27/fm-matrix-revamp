import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { Button } from '@/components/ui/button';
import Stack from '@mui/material/Stack';
import { X } from 'lucide-react';

interface MSafeFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: { name: string; email: string; mobile: string }) => void;
}

export const MSafeFilterDialog = ({ isOpen, onClose, onApplyFilters }: MSafeFilterDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSubmit = () => {
    const filters = { name, email, mobile };
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMobile('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 20, borderBottom: '1px solid #eee', pb: 1.5 }}>
        Filter
        <IconButton onClick={onClose} size="small">
          <X className="w-4 h-4" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            variant="outlined"
            size="small"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(name) || undefined }}
          />
          <TextField
            label="Email"
            variant="outlined"
            size="small"
            value={email}
            onChange={e => setEmail(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(email) || undefined }}
          />
          <TextField
            label="Mobile Number"
            variant="outlined"
            size="small"
            value={mobile}
            onChange={e => setMobile(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: Boolean(mobile) || undefined }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0 }}>
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};