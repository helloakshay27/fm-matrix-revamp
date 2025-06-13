
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface EventsFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventsFilterModal: React.FC<EventsFilterModalProps> = ({ isOpen, onClose }) => {
  const [filters, setFilters] = useState({
    title: '',
    eventType: '',
    status: '',
    createdBy: '',
    startDate: '',
    endDate: '',
    showExpired: false,
    hasAttachments: false
  });

  const handleFilterChange = (field: string, value: string | boolean) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    console.log('Applied filters:', filters);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters({
      title: '',
      eventType: '',
      status: '',
      createdBy: '',
      startDate: '',
      endDate: '',
      showExpired: false,
      hasAttachments: false
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Events</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Title Filter */}
          <div className="space-y-2">
            <Label htmlFor="titleFilter">Event Title</Label>
            <Input
              id="titleFilter"
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              placeholder="Search by title"
            />
          </div>

          {/* Event Type Filter */}
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select onValueChange={(value) => handleFilterChange('eventType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Corporate">Corporate</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Created By Filter */}
          <div className="space-y-2">
            <Label htmlFor="createdByFilter">Created By</Label>
            <Input
              id="createdByFilter"
              value={filters.createdBy}
              onChange={(e) => handleFilterChange('createdBy', e.target.value)}
              placeholder="Search by creator"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDateFilter">Start Date</Label>
              <Input
                id="startDateFilter"
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDateFilter">End Date</Label>
              <Input
                id="endDateFilter"
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Checkbox Filters */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showExpired"
                checked={filters.showExpired}
                onCheckedChange={(checked) => handleFilterChange('showExpired', checked as boolean)}
              />
              <Label htmlFor="showExpired">Show expired events only</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasAttachments"
                checked={filters.hasAttachments}
                onCheckedChange={(checked) => handleFilterChange('hasAttachments', checked as boolean)}
              />
              <Label htmlFor="hasAttachments">Has attachments</Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={handleClearFilters}>
            Clear All
          </Button>
          <Button onClick={handleApplyFilters} className="bg-purple-600 hover:bg-purple-700">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
