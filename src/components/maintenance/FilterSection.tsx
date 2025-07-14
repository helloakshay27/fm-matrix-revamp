
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Download } from 'lucide-react';

interface FilterSectionProps {
  dateFrom: string;
  dateTo: string;
  searchTaskId: string;
  searchChecklist: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onSearchTaskIdChange: (value: string) => void;
  onSearchChecklistChange: (value: string) => void;
  onShowAdvancedFilter: () => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  dateFrom,
  dateTo,
  searchTaskId,
  searchChecklist,
  onDateFromChange,
  onDateToChange,
  onSearchTaskIdChange,
  onSearchChecklistChange,
  onShowAdvancedFilter
}) => {
  return (
    <>
      {/* Date Range */}
      <div className="flex gap-3 mb-6">
        <Input 
          type="date" 
          value={dateFrom.split('/').reverse().join('-')}
          onChange={(e) => onDateFromChange(e.target.value.split('-').reverse().join('/'))}
          className="w-40"
        />
        <Input 
          type="date" 
          value={dateTo.split('/').reverse().join('-')}
          onChange={(e) => onDateToChange(e.target.value.split('-').reverse().join('/'))}
          className="w-40"
        />
        <Button className="bg-green-600 hover:bg-green-700 text-white">Apply</Button>
        <Button variant="outline">Reset</Button>
      </div>

      {/* Search and Actions */}
      <div className="flex gap-3 mb-6">
        <Button 
          variant="outline" 
          className="border-[#8B4513] text-[#8B4513]"
          onClick={onShowAdvancedFilter}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <Input 
          placeholder="Search with Task ID" 
          value={searchTaskId}
          onChange={(e) => onSearchTaskIdChange(e.target.value)}
          className="max-w-xs" 
        />
        <Input 
          placeholder="Search using checklist name or assigned to" 
          value={searchChecklist}
          onChange={(e) => onSearchChecklistChange(e.target.value)}
          className="max-w-xs" 
        />
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">Go</Button>
        <Button className="bg-[#8B4513] hover:bg-[#7A3F12] text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </>
  );
};
