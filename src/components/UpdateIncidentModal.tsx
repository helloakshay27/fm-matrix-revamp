
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';

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
        alert('RCA is required when closing an incident');
        return;
      }
      if (!updateData.correctiveAction.trim()) {
        alert('Corrective action is required when closing an incident');
        return;
      }
      if (!updateData.preventiveAction.trim()) {
        alert('Preventive action is required when closing an incident');
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
        alert(`Incident ${isClosedStatus ? 'closed' : 'updated'} successfully`);
        onClose();
      } else {
        console.error('Failed to update incident');
        alert('Failed to update incident. Please try again.');
      }
    } catch (error) {
      console.error('Error updating incident:', error);
      alert('Error occurred while updating incident. Please try again.');
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
            <Label>Status</Label>
            <Select
              value={updateData.status}
              onValueChange={(value) => handleInputChange('status', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading statuses..." : "Select Status"} />
              </SelectTrigger>
              <SelectContent>
                {incidenceStatuses.map((status) => (
                  <SelectItem key={status.id} value={status.id.toString()}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Comment</Label>
            <Textarea
              value={updateData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              placeholder="Message"
              className="min-h-[100px]"
            />
          </div>

          {/* Show additional fields only when status is "Closed" */}
          {(() => {
            const selectedStatus = incidenceStatuses.find(status => status.id.toString() === updateData.status);
            return selectedStatus?.name?.toLowerCase() === 'closed';
          })() && (
              <>
                <div className="space-y-2">
                  <Label>
                    RCA <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={updateData.rca}
                    onChange={(e) => handleInputChange('rca', e.target.value)}
                    placeholder="Enter RCA details"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Corrective action <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={updateData.correctiveAction}
                    onChange={(e) => handleInputChange('correctiveAction', e.target.value)}
                    placeholder="Enter corrective action"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Preventive action <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    value={updateData.preventiveAction}
                    onChange={(e) => handleInputChange('preventiveAction', e.target.value)}
                    placeholder="Enter preventive action"
                    className="min-h-[80px]"
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
