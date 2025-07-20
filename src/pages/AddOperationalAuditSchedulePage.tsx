import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { ScheduleFormStepper } from '@/components/schedule/ScheduleFormStepper';
import { BasicConfigurationStep } from '@/components/schedule/BasicConfigurationStep';
import { ScheduleSetupStep } from '@/components/schedule/ScheduleSetupStep';
import { QuestionSetupStep } from '@/components/schedule/QuestionSetupStep';
import { TimeSetupStep } from '@/components/schedule/TimeSetupStep';
import { MappingStep } from '@/components/schedule/MappingStep';

const steps = [
  { id: 1, title: 'Basic Configuration', completed: false, active: true },
  { id: 2, title: 'Schedule Setup', completed: false, active: false },
  { id: 3, title: 'Question Setup', completed: false, active: false },
  { id: 4, title: 'Time Setup', completed: false, active: false },
  { id: 5, title: 'Asset Mapping', completed: false, active: false }
];

interface MappingRow {
  id: string;
  asset: string;
  readingEBKVAH: string;
  readingDGKVAH: string;
  voltage: string;
  current: string;
  kW: string;
  pF: string;
  thdI: string;
}

export const AddOperationalAuditSchedulePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formSteps, setFormSteps] = useState(steps);
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});
  
  // Form data states
  const [basicConfig, setBasicConfig] = useState({
    activityType: '',
    activityName: '',
    description: '',
    attachment: null
  });

  const [scheduleSetup, setScheduleSetup] = useState({
    checklistType: '',
    assetType: '',
    assetGroup: '',
    branch: '',
    department: '',
    location: ''
  });

  const [questionSetup, setQuestionSetup] = useState({
    sections: []
  });

  const [timeSetup, setTimeSetup] = useState({
    timeSlots: {
      hours: { mode: 'specific' as 'specific' | 'range', specific: [] as number[], range: { start: 0, end: 23 } },
      minutes: { mode: 'specific' as 'specific' | 'range', specific: [] as number[], range: { start: 0, end: 59 } },
      days: { mode: 'weekdays' as 'weekdays' | 'dates', weekdays: [] as string[], dates: [] as number[] },
      months: { mode: 'specific' as 'specific' | 'range', specific: [] as number[], range: { start: 0, end: 11 } }
    },
    selectedDays: [] as number[],
    selectedMonths: [] as number[]
  });

  const [mapping, setMapping] = useState({
    mappings: [] as MappingRow[]
  });

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
    updateStepStates(stepId);
  };

  const updateStepStates = (activeStep: number) => {
    const updatedSteps = formSteps.map(step => ({
      ...step,
      active: step.id === activeStep,
      completed: step.id < activeStep
    }));
    setFormSteps(updatedSteps);
  };

  const handleBasicConfigChange = (field: string, value: any) => {
    setBasicConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleSetupChange = (field: string, value: any) => {
    setScheduleSetup(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSetupChange = (field: string, value: any) => {
    setTimeSetup(prev => ({ ...prev, [field]: value }));
  };

  const toggleSectionCollapse = (sectionId: number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateStepStates(nextStep);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      updateStepStates(prevStep);
    }
  };

  const handleSubmit = () => {
    console.log('Form submitted:', { basicConfig, scheduleSetup, mapping });
    toast({
      title: "Schedule Added",
      description: "Your operational audit schedule has been successfully created.",
    });
    navigate("/setup/operational-audit-schedules");
  };

  const handleBack = () => {
    navigate("/setup/operational-audit-schedules");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Operational Audit</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Add Operational Audit Schedule</h1>
        </div>

        {/* Stepper */}
        <ScheduleFormStepper 
          steps={formSteps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Basic Configuration */}
          <BasicConfigurationStep
            data={basicConfig}
            onChange={handleBasicConfigChange}
            isCompleted={currentStep > 1}
            isCollapsed={currentStep > 1 && collapsedSections[1]}
            onToggleCollapse={currentStep > 1 ? () => toggleSectionCollapse(1) : undefined}
          />

          {/* Schedule Setup */}
          {currentStep >= 2 && (
            <ScheduleSetupStep
              data={scheduleSetup}
              onChange={handleScheduleSetupChange}
              isCompleted={currentStep > 2}
              isCollapsed={currentStep > 2 && collapsedSections[2]}
              onToggleCollapse={currentStep > 2 ? () => toggleSectionCollapse(2) : undefined}
            />
          )}

          {/* Question Setup */}
          {currentStep >= 3 && (
            <QuestionSetupStep
              data={questionSetup}
              onChange={(field, value) => setQuestionSetup(prev => ({ ...prev, [field]: value }))}
              isCompleted={currentStep > 3}
              isCollapsed={currentStep > 3 && collapsedSections[3]}
              onToggleCollapse={currentStep > 3 ? () => toggleSectionCollapse(3) : undefined}
            />
          )}

          {/* Time Setup */}
          {currentStep >= 4 && (
            <TimeSetupStep
              data={timeSetup}
              onChange={handleTimeSetupChange}
              isCompleted={currentStep > 4}
              isCollapsed={currentStep > 4 && collapsedSections[4]}
              onToggleCollapse={currentStep > 4 ? () => toggleSectionCollapse(4) : undefined}
            />
          )}

          {/* Asset Mapping */}
          {currentStep >= 5 && (
            <MappingStep
              data={mapping}
              onChange={(field, value) => setMapping(prev => ({ ...prev, [field]: value }))}
              isCompleted={false}
              isCollapsed={false}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-4">
            <Button variant="ghost" onClick={handleBack}>
              Cancel
            </Button>
            {currentStep === 5 ? (
              <Button onClick={handleSubmit} className="bg-[#C72030] hover:bg-[#C72030]/90">
                Submit Schedule
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-[#C72030] hover:bg-[#C72030]/90">
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
