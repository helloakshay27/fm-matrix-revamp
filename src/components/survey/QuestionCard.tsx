
import React from 'react';
import { QuestionContent } from '@/components/QuestionContent';
import { QuestionHeader } from './QuestionHeader';
import { QuestionFooter } from './QuestionFooter';
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
    <div className="border border-gray-200 rounded-lg mb-4 bg-white">
      <QuestionHeader
        question={question}
        onQuestionChange={onQuestionChange}
      />
      
      <QuestionContent questionType={question.type} />
      
      <QuestionFooter
        question={question}
        onQuestionChange={onQuestionChange}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
    </div>
  );
};
