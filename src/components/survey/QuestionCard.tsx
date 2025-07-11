
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash2, Eye, Minus, AlignLeft, Circle, Square, ChevronDown, Upload, BarChart3, Star, Grid3X3, CalendarIcon, Clock, Plus, Menu, MoreHorizontal } from 'lucide-react';
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
    <div className="flex mb-4">
      {/* Left Sidebar with Icons */}
      <div className="flex flex-col items-center bg-white border border-gray-200 rounded-l-lg py-2 px-1 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-gray-100 rounded"
        >
          <Plus className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-gray-100 rounded"
        >
          <Menu className="w-4 h-4 text-gray-600" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0 hover:bg-gray-100 rounded"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-600" />
        </Button>
      </div>

      {/* Main Question Card */}
      <div className="flex-1 border-t border-r border-b border-gray-200 rounded-r-lg bg-white">
        {/* Question Header */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1 mr-4 relative">
              <Input
                value={question.text}
                onChange={(e) => onQuestionChange(question.id, 'text', e.target.value)}
                className="border-none p-0 focus-visible:ring-0 bg-transparent font-medium text-base pb-2 w-full"
                placeholder="Question"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600"></div>
            </div>
            
            <div className="flex items-center gap-2">
              <Select 
                value={question.type} 
                onValueChange={(value) => onQuestionChange(question.id, 'type', value)}
              >
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
            </div>
          </div>
        </div>
        
        {/* Question Content - Dynamic */}
        <QuestionContent questionType={question.type} />
        
        {/* Question Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(question.id)}
              className="p-2 hover:bg-gray-200"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(question.id)}
              className="p-2 hover:bg-gray-200"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-gray-200"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Required</span>
            <div className="relative">
              {question.required ? (
                <div className="w-10 h-6 bg-red-600 rounded-full relative cursor-pointer flex items-center"
                     onClick={() => onQuestionChange(question.id, 'required', false)}>
                  <div className="w-4 h-4 bg-white rounded-full absolute right-1 transition-all duration-200"></div>
                </div>
              ) : (
                <div className="w-10 h-6 bg-gray-300 rounded-full relative cursor-pointer flex items-center"
                     onClick={() => onQuestionChange(question.id, 'required', true)}>
                  <div className="w-4 h-4 bg-white rounded-full absolute left-1 transition-all duration-200"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
