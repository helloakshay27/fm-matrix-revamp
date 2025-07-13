
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { QuestionCard } from './QuestionCard';
import { Section, Question } from '@/types/survey';

interface SectionCardProps {
  section: Section;
  sectionIndex: number;
  totalSections: number;
  onSectionChange: (sectionId: string, field: keyof Section, value: any) => void;
  onQuestionChange: (sectionId: string, questionId: string, field: keyof Question, value: any) => void;
  onAddQuestion: (sectionId: string) => void;
  onDuplicateQuestion: (sectionId: string, questionId: string) => void;
  onDeleteQuestion: (sectionId: string, questionId: string) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  sectionIndex,
  totalSections,
  onSectionChange,
  onQuestionChange,
  onAddQuestion,
  onDuplicateQuestion,
  onDeleteQuestion
}) => {
  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium whitespace-nowrap">
          Section {sectionIndex + 1} of {totalSections}
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <Input
          value={section.title}
          onChange={(e) => onSectionChange(section.id, 'title', e.target.value)}
          className="text-xl font-semibold border-none p-0 focus-visible:ring-0 bg-transparent mb-3 text-black"
          placeholder="Untitled Section"
        />
        <Textarea
          value={section.description}
          onChange={(e) => onSectionChange(section.id, 'description', e.target.value)}
          className="border-none p-0 focus-visible:ring-0 bg-transparent resize-none text-gray-600 text-base"
          placeholder="Description"
          rows={1}
        />
      </div>

      {/* Questions */}
      {section.questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          onQuestionChange={(questionId, field, value) => 
            onQuestionChange(section.id, questionId, field, value)
          }
          onDuplicate={(questionId) => onDuplicateQuestion(section.id, questionId)}
          onDelete={(questionId) => onDeleteQuestion(section.id, questionId)}
        />
      ))}
      
      {/* Add Question Button */}
      <Button
        variant="ghost"
        onClick={() => onAddQuestion(section.id)}
        className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 hover:border-gray-400"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};
