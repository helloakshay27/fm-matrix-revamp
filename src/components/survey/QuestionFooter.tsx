
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Eye } from 'lucide-react';
import { Question } from '@/types/survey';

interface QuestionFooterProps {
  question: Question;
  onQuestionChange: (questionId: string, field: keyof Question, value: any) => void;
  onDuplicate: (questionId: string) => void;
  onDelete: (questionId: string) => void;
}

export const QuestionFooter: React.FC<QuestionFooterProps> = ({
  question,
  onQuestionChange,
  onDuplicate,
  onDelete
}) => {
  return (
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
  );
};
