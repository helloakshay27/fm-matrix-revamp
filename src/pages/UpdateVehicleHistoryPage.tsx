import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, TextField } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface LtmRecordState {
  record?: {
    id: string | number;
    odo_start?: number;
    odo_end?: number;
    total_distance?: number;
    reimbursable_kms?: number;
    fuel_amount?: number;
    toll_amount?: number;
    total_amount?: number;
  };
}

const numberOrEmpty = (v: any) => (v === null || v === undefined ? '' : String(v));

const UpdateVehicleHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LtmRecordState };

  const initial = useMemo(() => ({
    odo_start: state?.record?.odo_start ?? '',
    odo_end: state?.record?.odo_end ?? '',
    total_distance: state?.record?.total_distance ?? '',
    reimbursable_kms: state?.record?.reimbursable_kms ?? '',
    fuel_amount: state?.record?.fuel_amount ?? '',
    toll_amount: state?.record?.toll_amount ?? '',
    total_amount: state?.record?.total_amount ?? '',
  }), [state]);

  const [form, setForm] = useState<Record<string, string | number>>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!String(form.odo_start).trim()) e.odo_start = 'Required';
    return e;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;
    // TODO: integrate API call here
    navigate(-1);
  };

  // Adopt field heights/paddings similar to AddServicePage
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  } as const;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-100 mr-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">UPDATE VEHICLE HISTORY</h1>
      </div>

      <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
        <CardHeader className='bg-[#F6F4EE] mb-4'>
          <CardTitle className="text-lg text-black flex items-center">
            <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm mr-2">1</span>
            UPDATE VEHICLE HISTORY
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Box component="form" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextField
                
                fullWidth
                type="number"
                label={
                  <>Odometer Start Reading<span style={{ color: '#C72030' }}>*</span></>
                }
                placeholder="Enter Odometer Start Reading"
                value={numberOrEmpty(form.odo_start)}
                onChange={onChange('odo_start')}
                error={!!errors.odo_start}
                helperText={errors.odo_start}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                fullWidth
                type="number"
                label="Odometer End Reading"
                placeholder="Enter Odometer End Reading"
                value={numberOrEmpty(form.odo_end)}
                onChange={onChange('odo_end')}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                fullWidth
                type="number"
                label="Total Distance"
                placeholder="Enter Total Distance"
                value={numberOrEmpty(form.total_distance)}
                onChange={onChange('total_distance')}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                fullWidth
                type="number"
                label="Reimbursable Kms"
                placeholder="Enter Reimbursable Kms"
                value={numberOrEmpty(form.reimbursable_kms)}
                onChange={onChange('reimbursable_kms')}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                fullWidth
                type="number"
                label="Fuel Amount"
                placeholder="Enter Fuel Amount"
                value={numberOrEmpty(form.fuel_amount)}
                onChange={onChange('fuel_amount')}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
              <TextField
                fullWidth
                type="number"
                label="Toll Amount"
                placeholder="Enter Toll Amount"
                value={numberOrEmpty(form.toll_amount)}
                onChange={onChange('toll_amount')}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />

              <TextField
                fullWidth
                type="number"
                label="Total Amount"
                placeholder="Enter Total Amount"
                value={numberOrEmpty(form.total_amount)}
                onChange={onChange('total_amount')}
                slotProps={{ inputLabel: { shrink: true } }}
                InputProps={{ sx: fieldStyles }}
              />
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-[#5B2D66] text-[#5B2D66]"
                type="button"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#5B2D66] text-white hover:bg-[#5B2D66]/90"
              >
                Update
              </Button>
            </div>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateVehicleHistoryPage;
