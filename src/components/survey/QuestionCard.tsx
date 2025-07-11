
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash2, Eye, Minus, AlignLeft, Circle, Square, ChevronDown, Upload, BarChart3, Star, Grid3X3, CalendarIcon, Clock } from 'lucide-react';
import { QuestionContent } from '@/components/QuestionContent';
import { Question } from '@/types/survey';

interface QuestionCardProps {
  question: Question;
  onQuestionChange: (questionId: string, field: keyof Question, value: any) => void;
  onDuplicate: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onQuestionChange,
  onDuplicate,
  onDelete
}) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      {/* Question Header */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Input
            value={question.text}
            onChange={(e) => onQuestionChange(question.id, 'text', e.target.value)}
            className="border-none p-0 focus-visible:ring-0 bg-transparent font-medium"
            placeholder="Question"
          />
          
          <div className="flex items-center gap-2">
            <Select 
              value={question.type} 
              onValueChange={(value) => onQuestionChange(question.id, 'type', value)}
            >
              <SelectTrigger className="w-48 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
          </div>
        </div>
      </div>
      
      {/* Question Content - Dynamic */}
      <QuestionContent questionType={question.type} />
      
      {/* Question Footer */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(question.id)}
            className="p-2"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(question.id)}
            className="p-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Required</span>
          <div className="relative">
            {question.required ? (
              <div className="w-6 h-3 bg-red-600 rounded-full relative cursor-pointer"
                   onClick={() => onQuestionChange(question.id, 'required', false)}>
                <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 right-0.5"></div>
              </div>
            ) : (
              <div className="w-6 h-3 bg-gray-300 rounded-full relative cursor-pointer"
                   onClick={() => onQuestionChange(question.id, 'required', true)}>
                <div className="w-2 h-2 bg-white rounded-full absolute top-0.5 left-0.5"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
