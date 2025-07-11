
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SurveyHeader } from '@/components/survey/SurveyHeader';
import { SectionCard } from '@/components/survey/SectionCard';
import { AssociationSection } from '@/components/survey/AssociationSection';
import { ActionButtons } from '@/components/survey/ActionButtons';
import { Section, Question } from '@/types/survey';

export const AddSurveyPage = () => {
  const navigate = useNavigate();
  const [createTicket, setCreateTicket] = useState(true);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  const [sections, setSections] = useState<Section[]>([
    {
      id: '1',
      title: 'Untitled Section',
      description: 'Description',
      questions: [
        { id: '1', text: 'Question', type: 'Short answer', required: true },
        { id: '2', text: 'Question', type: 'Short answer', required: true }
      ]
    }
  ]);

  const handleSectionChange = (sectionId: string, field: keyof Section, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const handleQuestionChange = (sectionId: string, questionId: string, field: keyof Question, value: any) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.map(q => 
              q.id === questionId ? { ...q, [field]: value } : q
            )
          }
        : section
    ));
  };

  const addQuestion = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: [...section.questions, {
              id: Date.now().toString(),
              text: 'Question',
              type: 'Short answer',
              required: false
            }]
          }
        : section
    ));
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.filter(q => q.id !== questionId)
          }
        : section
    ));
  };

  const duplicateQuestion = (sectionId: string, questionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            questions: section.questions.reduce((acc, q) => {
              acc.push(q);
              if (q.id === questionId) {
                acc.push({
                  ...q,
                  id: Date.now().toString()
                });
              }
              return acc;
            }, [] as Question[])
          }
        : section
    ));
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft...');
    navigate('/maintenance/survey/list');
  };

  const handleSubmit = () => {
    console.log('Submitting survey...');
    navigate('/maintenance/survey/list');
  };

  return (
    <div className="min-h-screen min-w-full bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm">
        <SurveyHeader 
          createTicket={createTicket}
          setCreateTicket={setCreateTicket}
        />

        <div className="p-6">
          {sections.map((section, sectionIndex) => (
            <SectionCard
              key={section.id}
              section={section}
              sectionIndex={sectionIndex}
              totalSections={sections.length}
              onSectionChange={handleSectionChange}
              onQuestionChange={handleQuestionChange}
              onAddQuestion={addQuestion}
              onDuplicateQuestion={duplicateQuestion}
              onDeleteQuestion={deleteQuestion}
            />
          ))}
        </div>

        <AssociationSection
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        <ActionButtons
          onSaveAsDraft={handleSaveAsDraft}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};
