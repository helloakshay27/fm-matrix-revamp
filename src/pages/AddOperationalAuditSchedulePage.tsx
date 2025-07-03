import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

const fieldStyles = {
  height: { xs: 28, sm: 36, md: 45 },
  '& .MuiInputBase-input, & .MuiSelect-select': {
    padding: { xs: '8px', sm: '10px', md: '12px' },
  },
};

interface TaskSection {
  id: string;
  group: string;
  subGroup: string;
  task: string;
  inputType: string;
  mandatory: boolean;
  reading: boolean;
  helpText: string;
  weightageValue: string;
  failing: boolean;
}

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createNew, setCreateNew] = useState(false);
  const [createTicket, setCreateTicket] = useState(false);
  const [weightage, setWeightage] = useState(false);
  
  const [taskSections, setTaskSections] = useState<TaskSection[]>([
    {
      id: '1', group: '', subGroup: '', task: '', inputType: '',
      mandatory: false, reading: false, helpText: '', weightageValue: '', failing: false
    }
  ]);

  const [formData, setFormData] = useState({
    template: '', ticketLevel: 'Question Level', assignedTo: '', ticketCategory: '',
    activityName: '', description: '', checklistType: 'Individual', asset: '', assignTo: '',
    scanType: '', planDuration: '', priority: '', emailTriggerRule: '', supervisors: '',
    category: '', submissionTime: '', graceTime: '', lockOverdueTask: '', frequency: '',
    startFrom: '', endAt: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTaskSectionChange = (sectionId: string, field: keyof TaskSection, value: any) => {
    setTaskSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    );
  };

  const handleAddSection = () => {
    const newSection: TaskSection = {
      id: Date.now().toString(), group: '', subGroup: '', task: '', inputType: '',
      mandatory: false, reading: false, helpText: '', weightageValue: '', failing: false
    };
    setTaskSections(prev => [...prev, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (taskSections.length > 1) {
      setTaskSections(prev => prev.filter(section => section.id !== sectionId));
    }
  };

  const handleSubmit = () => {
    console.log('Submitting operational audit schedule data:', { formData, taskSections });
    toast({ title: "Success", description: "Operational audit schedule saved successfully!" });
    navigate('/maintenance/audit/operational');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <div className="text-sm text-gray-600 mb-1">Operational Audit</div>
          <h1 className="text-xl sm:text-2xl font-bold">Add Operational Audit Schedule</h1>
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <Switch checked={createNew} onCheckedChange={setCreateNew} id="create-new" />
          <Label htmlFor="create-new">Create New</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={createTicket} onCheckedChange={setCreateTicket} id="create-ticket" />
          <Label htmlFor="create-ticket">Create Ticket</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={weightage} onCheckedChange={setWeightage} id="weightage" />
          <Label htmlFor="weightage">Weightage</Label>
        </div>
      </div>

      {/* Responsive Sections for CreateNew and CreateTicket */}
      {createNew && (
        <Card><CardContent className="pt-6">
          <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
            <InputLabel id="template-label" shrink>Select from the existing Template</InputLabel>
            <MuiSelect
              labelId="template-label"
              label="Select from the existing Template"
              displayEmpty
              value={formData.template}
              onChange={(e) => handleInputChange('template', e.target.value)}
              sx={fieldStyles}
            >
              <MenuItem value=""><em>Select from the existing Template</em></MenuItem>
              <MenuItem value="template1">Template 1</MenuItem>
              <MenuItem value="template2">Template 2</MenuItem>
              <MenuItem value="template3">Template 3</MenuItem>
              <MenuItem value="custom">Custom Template</MenuItem>
            </MuiSelect>
          </FormControl>
        </CardContent></Card>
      )}

      {createTicket && (
        <Card><CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {["Checklist Level", "Question Level"].map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <input
                    type="radio" id={level} name="ticketLevel" value={level}
                    checked={formData.ticketLevel === level}
                    onChange={(e) => handleInputChange('ticketLevel', e.target.value)}
                  />
                  <Label htmlFor={level}>{level}</Label>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['assignedTo', 'ticketCategory'].map((field, i) => (
                <FormControl key={field} fullWidth variant="outlined" sx={{ mt: 1 }}>
                  <InputLabel id={`${field}-label`} shrink>{`Select ${field === 'assignedTo' ? 'Assigned To' : 'Category'}`}</InputLabel>
                  <MuiSelect
                    labelId={`${field}-label`}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    displayEmpty
                    sx={fieldStyles}
                  >
                    <MenuItem value=""><em>Select {field}</em></MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="supervisor">Supervisor</MenuItem>
                    <MenuItem value="technician">Technician</MenuItem>
                  </MuiSelect>
                </FormControl>
              ))}
            </div>
          </div>
        </CardContent></Card>
      )}

      {/* More responsive fields and cards continue here, just repeat this approach */}

      <div className="flex justify-end gap-4 flex-wrap">
        <Button variant="outline" onClick={() => navigate('/maintenance/audit/operational')}>Cancel</Button>
        <Button onClick={handleSubmit} style={{ backgroundColor: '#C72030' }} className="text-white">
          Save Schedule
        </Button>
      </div>
    </div>
  );
};
