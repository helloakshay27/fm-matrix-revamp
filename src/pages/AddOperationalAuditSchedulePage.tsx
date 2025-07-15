import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { TextField, FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

interface ScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

type Frequency = "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually";

export const AddOperationalAuditSchedulePage = () => {
  const [scheduleName, setScheduleName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>("Daily");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([{ day: '', startTime: '', endTime: '' }]);
  const [selectedAuditors, setSelectedAuditors] = useState<string[]>([]);
  const [availableAuditors, setAvailableAuditors] = useState(['Auditor A', 'Auditor B', 'Auditor C']);
	const [selectedChecklist, setSelectedChecklist] = useState('');
  const [availableChecklists, setAvailableChecklists] = useState(['Checklist A', 'Checklist B', 'Checklist C']);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddScheduleItem = () => {
    setScheduleItems([...scheduleItems, { day: '', startTime: '', endTime: '' }]);
  };

  const handleRemoveScheduleItem = (index: number) => {
    const newScheduleItems = [...scheduleItems];
    newScheduleItems.splice(index, 1);
    setScheduleItems(newScheduleItems);
  };

  const handleScheduleItemChange = (index: number, field: string, value: string) => {
    const newScheduleItems = [...scheduleItems];
    newScheduleItems[index][field] = value;
    setScheduleItems(newScheduleItems);
  };

  const handleAuditorToggle = (auditor: string) => {
    setSelectedAuditors(prev =>
      prev.includes(auditor) ? prev.filter(a => a !== auditor) : [...prev, auditor]
    );
  };

  const handleSubmit = () => {
    // Implement submit logic here
    console.log({
      scheduleName,
      description,
      frequency,
      startDate,
      endDate,
      isRecurring,
      scheduleItems,
      selectedAuditors,
			selectedChecklist
    });
    toast({
      title: "Schedule Added",
      description: "Your schedule has been successfully added.",
    })
    navigate("/setup/operational-audit-schedules");
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mb-1">
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Operational Audit</span>
            </button>
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Add Operational Audit Schedule</h1>
        </div>
      </div>

      <div>
        <Label htmlFor="scheduleName">Schedule Name</Label>
        <Input
          id="scheduleName"
          value={scheduleName}
          onChange={(e) => setScheduleName(e.target.value)}
          placeholder="Enter schedule name"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

      <div>
        <Label>Frequency</Label>
        <RadioGroup defaultValue={frequency} className="flex gap-2" onValueChange={(value) => setFrequency(value as Frequency)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Daily" id="daily" />
            <Label htmlFor="daily">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Weekly" id="weekly" />
            <Label htmlFor="weekly">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Monthly" id="monthly" />
            <Label htmlFor="monthly">Monthly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Quarterly" id="quarterly" />
            <Label htmlFor="quarterly">Quarterly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Annually" id="annually" />
            <Label htmlFor="annually">Annually</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate ? startDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate ? endDate.toISOString().split('T')[0] : ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="recurring"
          checked={isRecurring}
          onCheckedChange={(checked) => setIsRecurring(!!checked)}
        />
        <Label htmlFor="recurring">Is Recurring</Label>
      </div>

      <div>
        <Label>Schedule Items</Label>
        {scheduleItems.map((item, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <Input
              type="text"
              placeholder="Day"
              value={item.day}
              onChange={(e) => handleScheduleItemChange(index, 'day', e.target.value)}
            />
            <Input
              type="time"
              placeholder="Start Time"
              value={item.startTime}
              onChange={(e) => handleScheduleItemChange(index, 'startTime', e.target.value)}
            />
            <Input
              type="time"
              placeholder="End Time"
              value={item.endTime}
              onChange={(e) => handleScheduleItemChange(index, 'endTime', e.target.value)}
            />
            <Button variant="destructive" size="icon" onClick={() => handleRemoveScheduleItem(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button size="sm" onClick={handleAddScheduleItem}>
          <Plus className="w-4 h-4 mr-2" />
          Add Schedule Item
        </Button>
      </div>

      <div>
        <Label>Select Auditors</Label>
        <div className="flex flex-wrap gap-2">
          {availableAuditors.map(auditor => (
            <Button
              key={auditor}
              variant={selectedAuditors.includes(auditor) ? "secondary" : "outline"}
              onClick={() => handleAuditorToggle(auditor)}
            >
              {auditor}
            </Button>
          ))}
        </div>
      </div>

			<div>
				<FormControl fullWidth>
					<InputLabel id="checklist-select-label">Select Checklist</InputLabel>
					<MuiSelect
						labelId="checklist-select-label"
						id="checklist-select"
						value={selectedChecklist}
						label="Select Checklist"
						onChange={(e) => setSelectedChecklist(e.target.value)}
					>
						{availableChecklists.map((checklist) => (
							<MenuItem key={checklist} value={checklist}>
								{checklist}
							</MenuItem>
						))}
					</MuiSelect>
				</FormControl>
			</div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => navigate("/setup/operational-audit-schedules")}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Schedule</Button>
      </div>
    </div>
  );
};
