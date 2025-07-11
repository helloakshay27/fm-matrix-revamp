
import React from 'react';
import { Input } from '@/components/ui/input';
import { QuestionTypeSelector } from './QuestionTypeSelector';
import { Question } from '@/types/survey';

interface QuestionHeaderProps {
  question: Question;
  onQuestionChange: (questionId: string, field: keyof Question, value: any) => void;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  question,
  onQuestionChange
}) => {
  return (
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
          <QuestionTypeSelector
            questionType={question.type}
            onTypeChange={(value) => onQuestionChange(question.id, 'type', value)}
          />
        </div>
      </div>
    </div>
  );
};
