import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, ChevronDown } from 'lucide-react';

interface SurveySelectorProps {
  onSelectionChange: (selectedSections: string[]) => void;
}

export const SurveySelector: React.FC<SurveySelectorProps> = ({ onSelectionChange }) => {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'overview',
    'statusWise',
    'typeWise',
    'recentSurveys'
  ]);

  const sections = [
    { id: 'overview', label: 'Survey Overview', description: 'Summary statistics and metrics' },
    { id: 'statusWise', label: 'Status Distribution', description: 'Survey status breakdown' },
    { id: 'typeWise', label: 'Type Distribution', description: 'Survey type analysis' },
    { id: 'recentSurveys', label: 'Recent Surveys', description: 'Latest survey activities' }
  ];

  const handleSectionToggle = (sectionId: string) => {
    const newSelectedSections = selectedSections.includes(sectionId)
      ? selectedSections.filter(id => id !== sectionId)
      : [...selectedSections, sectionId];
    
    setSelectedSections(newSelectedSections);
    onSelectionChange(newSelectedSections);
  };

  const selectedCount = selectedSections.length;
  const totalCount = sections.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">
            View ({selectedCount}/{totalCount})
          </span>
          <span className="sm:hidden">
            {selectedCount}/{totalCount}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="end">
        <DropdownMenuLabel className="font-semibold text-[#C72030]">
          Survey Analytics Sections
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {sections.map((section) => (
          <DropdownMenuCheckboxItem
            key={section.id}
            checked={selectedSections.includes(section.id)}
            onCheckedChange={() => handleSectionToggle(section.id)}
            className="flex flex-col items-start space-y-1 py-3"
          >
            <div className="font-medium">{section.label}</div>
            <div className="text-sm text-gray-500">{section.description}</div>
          </DropdownMenuCheckboxItem>
        ))}
        
        <DropdownMenuSeparator />
        
        {/* Quick Actions */}
        <div className="flex gap-2 p-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allSectionIds = sections.map(s => s.id);
              setSelectedSections(allSectionIds);
              onSelectionChange(allSectionIds);
            }}
            className="flex-1 h-8 text-xs"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSections([]);
              onSelectionChange([]);
            }}
            className="flex-1 h-8 text-xs"
          >
            Clear All
          </Button>
        </div>
        
        {selectedCount === 0 && (
          <div className="p-2 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded mx-2 mb-2">
            ⚠️ No sections selected. Analytics dashboard will be empty.
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
