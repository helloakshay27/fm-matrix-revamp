import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import axios from 'axios';
import { useAppDispatch } from '@/store/hooks';
import { toast } from 'sonner';

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  amcId: string;
}

export const AddVisitModal = ({ isOpen, onClose, amcId }: AddVisitModalProps) => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    vendor: '',
    startDate: '',
    technician: '',
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/pms/users/get_escalate_to_users.json`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [baseUrl, token]);

  // Early return after hooks
  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      pms_asset_amc: {
        amc_visit_logs_attributes: [
          {
            visit_number: formData.vendor,
            technician_id: formData.technician,
            visit_date: formData.startDate,
          },
        ],
      },
    };

    axios
      .patch(`${baseUrl}/pms/asset_amcs/${amcId}.json`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success('Visit added successfully');
        onClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Responsive styles for TextField
  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">ADD VISIT</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <TextField
                required
                label="Vendor"
                placeholder="Enter Visit Number"
                name="vendor"
                value={formData.vendor}
                onChange={(e) => handleInputChange('vendor', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            <div>
              <TextField
                label="Start Date"
                placeholder="Select Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  sx: fieldStyles,
                }}
              />
            </div>

            <div>
              <FormControl fullWidth>
                <InputLabel shrink>Type</InputLabel>
                <Select
                  name="technician"
                  value={formData.technician}
                  onChange={(e) => handleInputChange('technician', e.target.value)}
                  displayEmpty
                  variant="outlined"
                  sx={fieldStyles}
                >
                  <MenuItem value="" disabled>
                    Select Type
                  </MenuItem>
                  {users?.map((user: any) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.full_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              type="submit"
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:bg-[#C72030]/90 px-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};