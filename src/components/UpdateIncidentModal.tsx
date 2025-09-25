
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import { X } from 'lucide-react';
import { toast } from 'sonner';

// MUI field styles
const fieldStyles = {
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: '12px',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    '& fieldset': {
      borderColor: '#e5e7eb',
    },
    '&:hover fieldset': {
      borderColor: '#9ca3af',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#C72030',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#6b7280',
    '&.Mui-focused': {
      color: '#C72030',
    },
  },
};

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      zIndex: 9999,
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  MenuListProps: {
    style: {
      padding: 0,
    },
  },
  anchorOrigin: {
    vertical: 'bottom' as const,
    horizontal: 'left' as const,
  },
  transformOrigin: {
    vertical: 'top' as const,
    horizontal: 'left' as const,
  },
};

interface UpdateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incidentId: string;
}

interface IncidenceStatus {
  id: number;
  name: string;
}

export const UpdateIncidentModal: React.FC<UpdateIncidentModalProps> = ({
  isOpen,
  onClose,
  incidentId
}) => {
  const [updateData, setUpdateData] = useState({
    status: '',
    comment: '',
    rca: '',
    correctiveAction: '',
    preventiveAction: ''
  });
  const [incidenceStatuses, setIncidenceStatuses] = useState<IncidenceStatus[]>([]);
  const [loading, setLoading] = useState(false);

  // Get baseUrl and token from localStorage
  const getApiConfig = () => {
    let baseUrl = localStorage.getItem('baseUrl') || '';
    const token = localStorage.getItem('token') || '';
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = 'https://' + baseUrl.replace(/^\/+/, '');
    }
    return { baseUrl, token };
  };

  const fetchIncidenceStatuses = async () => {
    try {
      setLoading(true);
      const { baseUrl, token } = getApiConfig();

      const response = await fetch(`${baseUrl}/pms/incidence_tags.json`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        const statuses = result.data
          .filter((item: any) => item.tag_type === 'IncidenceStatus')
          .map(({ id, name }: { id: number; name: string }) => ({ id, name }));
        setIncidenceStatuses(statuses);
      } else {
        console.error('Failed to fetch incidence statuses');
      }
    } catch (error) {
      console.error('Error fetching incidence statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchIncidenceStatuses();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setUpdateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    // Check if status is "Closed" and validate required fields
    const selectedStatus = incidenceStatuses.find(status => status.id.toString() === updateData.status);
    const isClosedStatus = selectedStatus?.name?.toLowerCase() === 'closed';

    if (isClosedStatus) {
      if (!updateData.rca.trim()) {
        toast.error('RCA is required when closing an incident');
        return;
      }
      if (!updateData.correctiveAction.trim()) {
        toast.error('Corrective action is required when closing an incident');
        return;
      }
      if (!updateData.preventiveAction.trim()) {
        toast.error('Preventive action is required when closing an incident');
        return;
      }
    }

    // Make API call for any status update
    try {
      setLoading(true);
      const { baseUrl, token } = getApiConfig();

      // Base payload for all status updates
      const payload: any = {
        cusdirect: `/pms/incidents/${incidentId}`,
        about: "Pms::Incident",
        about_id: parseInt(incidentId),
        current_status: selectedStatus?.name || updateData.status,
        comment: updateData.comment
      };

      // Only add incident object for "Closed" status
      if (isClosedStatus) {
        payload.incident = {
          rca: updateData.rca,
          corrective_action: updateData.correctiveAction,
          preventive_action: updateData.preventiveAction
        };
      }

      const response = await fetch(`${baseUrl}/pms_incidents_create_osr_log.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Incident updated successfully:', result);
        toast.success(`Incident ${isClosedStatus ? 'closed' : 'updated'} successfully`);
        onClose();
      } else {
        console.error('Failed to update incident');
        toast.error('Failed to update incident. Please try again.');
      }
    } catch (error) {
      console.error('Error updating incident:', error);
      toast.error('Error occurred while updating incident. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Update Status</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <FormControl fullWidth variant="outlined" sx={fieldStyles}>
              <InputLabel shrink>Status</InputLabel>
              <Select
                label="Status"
                value={updateData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                disabled={loading}
                displayEmpty
                MenuProps={menuProps}
              >
                <MenuItem value="">
                  <em>{loading ? "Loading statuses..." : "Select Status"}</em>
                </MenuItem>
                {incidenceStatuses.map((status) => (
                  <MenuItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="space-y-2">
            <TextField
              label="Comment"
              value={updateData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              placeholder="Message"
              InputLabelProps={{
                shrink: true
              }}
              sx={fieldStyles}
            />
          </div>

          {/* Show additional fields only when status is "Closed" */}
          {(() => {
            const selectedStatus = incidenceStatuses.find(status => status.id.toString() === updateData.status);
            return selectedStatus?.name?.toLowerCase() === 'closed';
          })() && (
              <>
                <div className="space-y-2">
                  <TextField
                    label="RCA *"
                    value={updateData.rca}
                    onChange={(e) => handleInputChange('rca', e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Enter RCA details"
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={fieldStyles}
                  />
                </div>

                <div className="space-y-2">
                  <TextField
                    label="Corrective action *"
                    value={updateData.correctiveAction}
                    onChange={(e) => handleInputChange('correctiveAction', e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Enter corrective action"
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={fieldStyles}
                  />
                </div>

                <div className="space-y-2">
                  <TextField
                    label="Preventive action *"
                    value={updateData.preventiveAction}
                    onChange={(e) => handleInputChange('preventiveAction', e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Enter preventive action"
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={fieldStyles}
                  />
                </div>
              </>
            )}

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleUpdate}
              disabled={loading}
              style={{ backgroundColor: '#C72030' }}
              className="text-white hover:opacity-90 px-8 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
