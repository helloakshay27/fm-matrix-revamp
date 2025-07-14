
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Minus, AlignLeft, Circle, Square, ChevronDown, Upload, BarChart3, Star, Grid3X3, CalendarIcon, Clock } from 'lucide-react';

interface QuestionTypeSelectorProps {
  questionType: string;
  onTypeChange: (value: string) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  questionType,
  onTypeChange
}) => {
  return (
    <Select value={questionType} onValueChange={onTypeChange}>
      <SelectTrigger className="w-48 h-10 border border-gray-300">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
        <SelectItem value="Short answer">
          <div className="flex items-center gap-2">
            <Minus className="w-4 h-4" />
            Short answer
          </div>
        </SelectItem>
        <SelectItem value="Paragraph">
          <div className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4" />
            Paragraph
          </div>
        </SelectItem>
        <SelectItem value="Multiple choice">
          <div className="flex items-center gap-2">
            <Circle className="w-4 h-4" />
            Multiple choice
          </div>
        </SelectItem>
        <SelectItem value="Checkboxes">
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            Checkboxes
          </div>
        </SelectItem>
        <SelectItem value="Dropdown">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4" />
            Dropdown
          </div>
        </SelectItem>
        <SelectItem value="File Upload">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            File Upload
          </div>
        </SelectItem>
        <SelectItem value="Linear scale">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Linear scale
          </div>
        </SelectItem>
        <SelectItem value="Rating">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Rating
          </div>
        </SelectItem>
        <SelectItem value="Multiple choice grid">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Multiple choice grid
          </div>
        </SelectItem>
        <SelectItem value="Tick box grid">
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            Tick box grid
          </div>
        </SelectItem>
        <SelectItem value="Date">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Date
          </div>
        </SelectItem>
        <SelectItem value="Time">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
