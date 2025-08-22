

import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

type Entry = {
  id: number;
  value: string;
};

export const MultipleUserDeletePage = () => {
  const [entries, setEntries] = useState<Entry[]>([{ id: 1, value: '' }]);

  const handleChange = (id: number, value: string) => {
    setEntries(prev => prev.map(e => (e.id === id ? { ...e, value } : e)));
  };

  const handleAddField = () => {
    setEntries(prev => [
      ...prev,
      { id: prev.length ? prev[prev.length - 1].id + 1 : 1, value: '' },
    ]);
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  } as const;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleRemoveField = (id: number) => {
    setEntries(prev => {
      if (prev.length === 1) {
        // keep at least one field; just clear it
        return [{ ...prev[0], value: '' }];
      }
      return prev.filter(e => e.id !== id);
    });
  };

  const handleSubmit = () => {
    const values = entries.map(e => e.value.trim()).filter(Boolean);
    if (values.length === 0) return;
    setPendingIds(values);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setSubmitting(true);
      // TODO: integrate API. For now, just log identifiers
      console.log('Confirm deleting identifiers:', pendingIds);
  // Reset inputs and state after success
  setEntries([{ id: 1, value: '' }]);
  setPendingIds([]);
  setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">MULTIPLE USER DELETION</h1>
        <p className="text-sm text-gray-600 mt-1">
          Enter one or more Email addresses or Mobile numbers. Click "Add Field" to add more.
        </p>
      </div>

      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-[#C72030] text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            IDENTIFIERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entries.map((entry, idx) => (
              <TextField
                key={entry.id}
                label={
                  <>
                    Email or Mobile Number {entries.length > 1 ? `#${idx + 1}` : ''}
                  </>
                }
                placeholder="Enter Email or Mobile Number"
                value={entry.value}
                onChange={(e) => handleChange(entry.id, e.target.value)}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } as any }}
                InputProps={{
                  sx: fieldStyles,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveField(entry.id)}
                        aria-label="remove field"
                      >
                        <X className="w-4 h-4" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleAddField}
              className="text-[#C72030] border-[#C72030] bg-[#f6f4ee] hover:bg-[#f6f4ee]/80"
            >
              Add Field
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={handleSubmit}
          style={{ backgroundColor: '#C72030' }}
          className="text-white hover:bg-[#C72030]/90 flex items-center"
          disabled={!entries.some(e => e.value.trim() !== '')}
        >
          Submit
        </Button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <div className="p-4 space-y-3 text-sm max-h-[60vh] overflow-auto">
              <p>You are about to delete the following identifiers:</p>
              <ul className="list-disc pl-5 space-y-1">
                {pendingIds.map((idVal, i) => (
                  <li key={`${idVal}-${i}`} className="break-all">{idVal}</li>
                ))}
              </ul>
              <p className="text-red-600">This action cannot be undone.</p>
            </div>
            <div className="p-4 flex justify-end gap-2 border-t">
              <Button variant="outline" onClick={() => setConfirmOpen(false)} disabled={submitting}>No</Button>
              <Button className="bg-[#C72030] text-white hover:bg-[#C72030]/90" onClick={handleConfirmDelete} disabled={submitting}>
                {submitting ? 'Deleting...' : 'Yes, Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleUserDeletePage;
