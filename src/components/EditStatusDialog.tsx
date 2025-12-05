
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import ReactSelect from 'react-select';
import { apiClient } from '@/utils/apiClient';
import { toast } from 'sonner';

interface EditStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaintId?: number;
  currentStatusId?: number;
  currentStatus?: string;
  onSuccess?: () => void;
}

interface Status {
  id: number;
  name: string;
  color_code: string;
  fixed_state: string;
  active: number;
}

interface CommunicationTemplate {
  id: number;
  identifier: string;
  identifier_action: string;
  body: string;
  resource_id: number;
  resource_type: string;
  active: boolean;
}

interface Complaint {
  id: number;
  complaint_status_id: number;
  issue_status: string;
  rca_template_ids?: number[];
  corrective_action_template_ids?: number[];
  preventive_action_template_ids?: number[];
  asset_service?: string;
  asset_or_service_id?: number;
  reopen_status?: boolean;
}

export const EditStatusDialog = ({ 
  open, 
  onOpenChange, 
  complaintId,
  currentStatusId,
  currentStatus,
  onSuccess 
}: EditStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [communicationTemplates, setCommunicationTemplates] = useState<CommunicationTemplate[]>([]);
  const [rcaTemplateIds, setRcaTemplateIds] = useState<number[]>([]);
  const [correctiveActionTemplateIds, setCorrectiveActionTemplateIds] = useState<number[]>([]);
  const [preventiveActionTemplateIds, setPreventiveActionTemplateIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [ticketData, setTicketData] = useState<Complaint | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await apiClient.get('/pms/admin/complaint_statuses.json');
        setStatuses(response.data || []);
      } catch (error) {
        console.error('Failed to fetch statuses:', error);
        toast.error("Failed to fetch status options");
      }
    };

    const fetchCommunicationTemplates = async () => {
      try {
        const response = await apiClient.get('/communication_templates.json');
        setCommunicationTemplates(response.data || []);
      } catch (error) {
        console.error('Failed to fetch communication templates:', error);
        toast.error("Failed to fetch templates");
      }
    };

    const fetchTicketData = async () => {
      if (!complaintId) return;
      
      try {
        const response = await apiClient.get(`/pms/admin/complaints/${complaintId}.json`);
        const data = response.data;
        setTicketData(data);
        
        // Pre-populate template IDs if they exist, otherwise set empty arrays
        if (data.rca_template_ids && Array.isArray(data.rca_template_ids)) {
          setRcaTemplateIds(data.rca_template_ids);
        } else {
          setRcaTemplateIds([]);
        }
        if (data.corrective_action_template_ids && Array.isArray(data.corrective_action_template_ids)) {
          setCorrectiveActionTemplateIds(data.corrective_action_template_ids);
        } else {
          setCorrectiveActionTemplateIds([]);
        }
        if (data.preventive_action_template_ids && Array.isArray(data.preventive_action_template_ids)) {
          setPreventiveActionTemplateIds(data.preventive_action_template_ids);
        } else {
          setPreventiveActionTemplateIds([]);
        }
      } catch (error) {
        console.error('Failed to fetch ticket data:', error);
        toast.error("Failed to fetch ticket data");
      }
    };

    if (open) {
      // Reset state when dialog opens with new complaint
      setRcaTemplateIds([]);
      setCorrectiveActionTemplateIds([]);
      setPreventiveActionTemplateIds([]);
      setSelectedStatus('');
      
      fetchStatuses();
      fetchCommunicationTemplates();
      fetchTicketData();
      // Set initial status if provided
      if (currentStatusId) {
        setSelectedStatus(currentStatusId.toString());
      }
    }
  }, [open, currentStatusId, complaintId]);

  const handleApply = async () => {
    if (!complaintId || !selectedStatus) {
      toast.error("Please select a status");
      return;
    }

    setLoading(true);
    try {
      // Create FormData to match TicketDetailsPage format exactly
      const formDataToSend = new FormData();
      formDataToSend.append('complaint_log[complaint_id]', complaintId.toString());
      
      // Add issue_status
      formDataToSend.append('issue_status', selectedStatus);
      
      // Add template IDs using the exact format from TicketDetailsPage
      rcaTemplateIds.forEach(templateId => {
        formDataToSend.append('root_cause[template_ids][]', String(templateId));
      });
      
      preventiveActionTemplateIds.forEach(templateId => {
        formDataToSend.append('preventive_action[template_ids][]', String(templateId));
      });
      
      correctiveActionTemplateIds.forEach(templateId => {
        formDataToSend.append('corrective_action[template_ids][]', String(templateId));
      });

      // Add asset_id and service_id based on current ticket's association
      if (ticketData?.asset_service === 'Asset' && ticketData?.asset_or_service_id) {
        formDataToSend.append('asset_id', ticketData.asset_or_service_id.toString());
        formDataToSend.append('service_id', '');
      } else if (ticketData?.asset_service === 'Service' && ticketData?.asset_or_service_id) {
        formDataToSend.append('asset_id', '');
        formDataToSend.append('service_id', ticketData.asset_or_service_id.toString());
      } else {
        formDataToSend.append('asset_id', '');
        formDataToSend.append('service_id', '');
      }

      // Use apiClient.post with FormData (apiClient handles authorization header)
      const loadingToastId = toast.loading("Updating status...");
      
      await apiClient.post('/complaint_logs.json', formDataToSend);

      toast.dismiss(loadingToastId);
      toast.success("Status updated successfully!");

      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedStatus('');
    setRcaTemplateIds([]);
    setCorrectiveActionTemplateIds([]);
    setPreventiveActionTemplateIds([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="relative">
          <DialogTitle>Edit Status</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-6 w-6 p-0 hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status" className="text-sm font-medium">
              Status
            </Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses
                  .filter((status) => {
                    // If ticket's reopen_status is false, hide statuses with fixed_state "reopen"
                    if (ticketData?.reopen_status === false && status.fixed_state === 'reopen') {
                      return false;
                    }
                    return true;
                  })
                  .map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rootCause" className="text-sm font-medium">
                Root Cause Analysis
              </Label>
              <ReactSelect
                isMulti
                value={communicationTemplates
                  .filter(template => 
                    rcaTemplateIds.includes(template.id) && 
                    template.identifier === "Root Cause Analysis" &&
                    template.active === true
                  )
                  .map(t => ({ value: t.id, label: t.identifier_action }))}
                onChange={(selected) => {
                  setRcaTemplateIds(selected ? selected.map((s) => s.value as number) : []);
                }}
                options={communicationTemplates
                  .filter(template => 
                    template.identifier === "Root Cause Analysis" && 
                    template.active === true
                  )
                  .map(t => ({ value: t.id, label: t.identifier_action }))}
                placeholder="Select Root Cause Analysis"
                className="mt-1"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    minHeight: "44px",
                    borderColor: state.isFocused ? "#C72030" : "#dcdcdc",
                    boxShadow: "none",
                    fontSize: "14px",
                    "&:hover": { borderColor: "#C72030" },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>
            <div>
              <Label htmlFor="correctiveAction" className="text-sm font-medium">
                Corrective Action
              </Label>
              <ReactSelect
                isMulti
                value={communicationTemplates
                  .filter(template => 
                    correctiveActionTemplateIds.includes(template.id) && 
                    template.identifier === "Corrective Action" &&
                    template.active === true
                  )
                  .map(t => ({ value: t.id, label: t.identifier_action }))}
                onChange={(selected) => {
                  setCorrectiveActionTemplateIds(selected ? selected.map((s) => s.value as number) : []);
                }}
                options={communicationTemplates
                  .filter(template => 
                    template.identifier === "Corrective Action" && 
                    template.active === true
                  )
                  .map(t => ({ value: t.id, label: t.identifier_action }))}
                placeholder="Select Corrective Action"
                className="mt-1"
                styles={{
                  control: (provided, state) => ({
                    ...provided,
                    minHeight: "44px",
                    borderColor: state.isFocused ? "#C72030" : "#dcdcdc",
                    boxShadow: "none",
                    fontSize: "14px",
                    "&:hover": { borderColor: "#C72030" },
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999,
                  }),
                }}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preventiveAction" className="text-sm font-medium">
              Preventive Action
            </Label>
            <ReactSelect
              isMulti
              value={communicationTemplates
                .filter(template => 
                  preventiveActionTemplateIds.includes(template.id) && 
                  template.identifier === "Preventive Action" &&
                  template.active === true
                )
                .map(t => ({ value: t.id, label: t.identifier_action }))}
              onChange={(selected) => {
                setPreventiveActionTemplateIds(selected ? selected.map((s) => s.value as number) : []);
              }}
              options={communicationTemplates
                .filter(template => 
                  template.identifier === "Preventive Action" && 
                  template.active === true
                )
                .map(t => ({ value: t.id, label: t.identifier_action }))}
              placeholder="Select Preventive Action"
              className="mt-1"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  minHeight: "44px",
                  borderColor: state.isFocused ? "#C72030" : "#dcdcdc",
                  boxShadow: "none",
                  fontSize: "14px",
                  "&:hover": { borderColor: "#C72030" },
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                }),
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleApply}
              className="bg-[#8B4B8C] hover:bg-[#7A427B] text-white flex-1"
            >
              Apply
            </Button>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
