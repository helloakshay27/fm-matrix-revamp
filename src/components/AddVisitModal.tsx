import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchAMCDetails } from '@/store/slices/amcDetailsSlice';

interface AddVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  amcId: string;
}

interface AMCDetailsData {
  id: number;
  asset_id: number | null;
  amc_vendor_name: string | null;
  amc_vendor_mobile: string | null;
  amc_vendor_email: string | null;
  amc_contract: string | null;
  amc_invoice: string | null;
  amc_cost: number;
  amc_start_date: string;
  amc_end_date: string;
  amc_first_service: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  payment_term: string;
  no_of_visits: number;
  remarks: string;
}

interface Technician {
  id: number;
  name: string;
  email: string;
}

interface AmcVisitLog {
  id: number;
  visit_number: number;
  visit_date: string;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  asset_period: string;
  technician: Technician | null;
}

interface AMCDetailsDataWithVisits extends AMCDetailsData {
  amc_visit_logs: AmcVisitLog[];
}

export const AddVisitModal = ({ isOpen, onClose, amcId }: AddVisitModalProps) => {
  const baseUrl = localStorage.getItem('baseUrl');
  const token = localStorage.getItem('token');
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    vendor: '',
    startDate: '',
    technician: '',
    remarks: '',
  });

  const [users, setUsers] = useState([]);
  const [attachment, setAttachment] = useState<File | null>(null);

  const { data: amcData, loading, error } = useAppSelector(
    (state) => state.amcDetails as {
      data: AMCDetailsDataWithVisits;
      loading: boolean;
      error: any;
    }
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `https://${baseUrl}/pms/users/get_escalate_to_users.json`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data.users);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('pms_asset_amc[amc_visit_logs_attributes][0][visit_number]', formData.vendor);
    form.append('pms_asset_amc[amc_visit_logs_attributes][0][technician_id]', formData.technician);
    form.append('pms_asset_amc[amc_visit_logs_attributes][0][visit_date]', formData.startDate);
    form.append('pms_asset_amc[amc_visit_logs_attributes][0][remarks]', formData.remarks);

    if (attachment) {
      form.append('pms_asset_amc[amc_visit_logs_attributes][0][document]', attachment);
    }

    try {
      await axios.patch(
        `https://${baseUrl}/pms/asset_amcs/${amcId}.json`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success('Visit added successfully');
      setFormData({ vendor: '', startDate: '', technician: '', remarks: '' });
      setAttachment(null);
      dispatch(fetchAMCDetails(amcId));
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add visit');
    }
  };

  const fieldStyles = {
    height: { xs: 28, sm: 36, md: 45 },
    '& .MuiInputBase-input, & .MuiSelect-select': {
      padding: { xs: '8px', sm: '10px', md: '12px' },
    },
  };

  const handleClose = () => {
    setFormData({ vendor: '', startDate: '', technician: '', remarks: '' });
    setAttachment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-[#1a1a1a]">ADD VISIT</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
  <TextField
    required
    label="Visit Number"
    placeholder="Enter Visit Number"
    name="vendor"
    value={formData.vendor}
    onChange={(e) => handleInputChange('vendor', e.target.value)}
    fullWidth
    variant="outlined"
    InputLabelProps={{ shrink: true }}
  />

  <TextField
    label="Start Date"
    type="date"
    name="startDate"
    value={formData.startDate}
    onChange={(e) => handleInputChange('startDate', e.target.value)}
    fullWidth
    variant="outlined"
    InputLabelProps={{ shrink: true }}
  />

  <FormControl fullWidth variant="outlined">
    <InputLabel id="technician-label" shrink>
      Technician
    </InputLabel>
    <Select
      labelId="technician-label"
      name="technician"
      value={formData.technician || ''}
      onChange={(e) => handleInputChange('technician', e.target.value)}
      label="Technician"
      displayEmpty
      notched
    >
      <MenuItem value="" disabled>
        <em>Select Technician</em>
      </MenuItem>
      {users?.map((user: any) => (
        <MenuItem key={user.id} value={user.id}>
          {user.full_name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>

  <TextField
    label="Remarks"
    placeholder="Enter remarks"
    name="remarks"
    value={formData.remarks}
    onChange={(e) => handleInputChange('remarks', e.target.value)}
    fullWidth
    variant="outlined"
    multiline
    rows={3}
    InputLabelProps={{ shrink: true }}
  />

  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700" htmlFor="attachment">
      Attachment
    </label>
    <input
      id="attachment"
      type="file"
      name="attachment"
      onChange={(e) => setAttachment(e.target.files?.[0] || null)}
      className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-[#C72030]"
    />
  </div>

  <div className="flex justify-center pt-4">
    <Button
      type="submit"
      style={{ backgroundColor: '#C72030' }}
      className="text-white hover:bg-[#C72030]/90 px-8 py-2 rounded-md"
    >
      Submit
    </Button>
  </div>
</form>

      </div>
    </div>
  );
};
