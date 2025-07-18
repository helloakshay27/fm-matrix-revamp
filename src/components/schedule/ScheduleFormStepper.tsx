import React from 'react';
import { Box, Stepper, Step, StepLabel, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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

const CustomStepper = styled(Stepper)(({ theme }) => ({
  '& .MuiStepConnector-root': {
    top: 22,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  '& .MuiStepConnector-line': {
    height: 2,
    backgroundColor: '#E5E7EB',
    border: 0,
  },
  '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
    backgroundColor: '#C72030',
  },
  '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
    backgroundColor: '#C72030',
  },
}));

const StepIconRoot = styled('div')<{ ownerState: { completed: boolean; active: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: ownerState.completed || ownerState.active ? '#C72030' : '#E5E7EB',
    zIndex: 1,
    color: ownerState.completed || ownerState.active ? '#fff' : '#6B7280',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  }),
);

function CustomStepIcon(props: any) {
  const { active, completed, className, icon } = props;

  return (
    <StepIconRoot ownerState={{ completed, active }} className={className}>
      {icon}
    </StepIconRoot>
  );
}

export const ScheduleFormStepper = ({ steps, currentStep, onStepClick }: ScheduleFormStepperProps) => {
  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <CustomStepper 
        activeStep={currentStep - 1} 
        alternativeLabel
        connector={<div />}
      >
        {steps.map((step, index) => (
          <Step key={step.id} completed={step.completed}>
            <StepLabel 
              StepIconComponent={CustomStepIcon}
              onClick={() => onStepClick(step.id)}
              sx={{ cursor: 'pointer' }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: step.active ? '#C72030' : step.completed ? '#059669' : '#6B7280',
                  fontWeight: step.active ? 600 : 500,
                  fontSize: '12px',
                  mt: 1
                }}
              >
                {step.title}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </CustomStepper>
      
      {/* Progress indicator */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2" color="textSecondary">
          You've completed {steps.filter(s => s.completed).length} out of {steps.length} steps
        </Typography>
      </Box>
    </Box>
  );
};