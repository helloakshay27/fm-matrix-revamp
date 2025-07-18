
import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ScheduleFormStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const ScheduleFormStepper = ({ steps, currentStep, onStepClick }: ScheduleFormStepperProps) => {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            className={`flex items-center cursor-pointer ${
              step.active ? 'text-[#C72030]' : step.completed ? 'text-green-600' : 'text-gray-400'
            }`}
            onClick={() => onStepClick(step.id)}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mr-3 ${
              step.active 
                ? 'border-[#C72030] bg-[#C72030] text-white' 
                : step.completed 
                  ? 'border-green-600 bg-green-600 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {step.completed ? (
                <Check className="w-4 h-4" />
              ) : (
                <span className="text-sm font-medium">{step.id}</span>
              )}
            </div>
            <span className="text-sm font-medium hidden sm:block">{step.title}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              steps[index + 1].completed || steps[index + 1].active ? 'bg-[#C72030]' : 'bg-gray-300'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
