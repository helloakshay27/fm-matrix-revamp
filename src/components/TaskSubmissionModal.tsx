import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Camera, Edit, User, FileText } from 'lucide-react';
import { TaskSubmissionSuccessModal } from './TaskSubmissionSuccessModal';
import { useToast } from '@/hooks/use-toast';
import { 
  TextField, 
  FormControl, 
  InputLabel, 
  Select as MuiSelect, 
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Box,
  Typography
} from '@mui/material';

interface TaskSubmissionStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface ChecklistItem {
  id: string;
  question: string;
  type: 'radio' | 'checkbox' | 'text';
  required: boolean;
  options?: string[];
  value?: any;
  comment?: string;
  attachment?: File | null;
}

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskTitle: string;
  taskId: string;
  checklist?: ChecklistItem[];
  onSubmit: (data: any) => void;
}

export const TaskSubmissionModal: React.FC<TaskSubmissionModalProps> = ({
  isOpen,
  onClose,
  taskTitle,
  taskId,
  checklist = [],
  onSubmit
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // File upload refs
  const beforePhotoRef = useRef<HTMLInputElement>(null);
  const afterPhotoRef = useRef<HTMLInputElement>(null);
  const attachmentRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Form data state
  const [formData, setFormData] = useState({
    beforePhoto: null as File | null,
    beforePhotoName: '',
    afterPhoto: null as File | null,
    afterPhotoName: '',
    checklist: checklist.reduce((acc, item) => {
      acc[item.id] = {
        value: item.type === 'checkbox' ? [] : '',
        comment: '',
        attachment: null
      };
      return acc;
    }, {} as { [key: string]: { value: any; comment: string; attachment: File | null } })
  });

  // Default checklist for demo (can be removed when real data is passed)
  const defaultChecklist: ChecklistItem[] = [
    {
      id: '1',
      question: 'Power On light of Office',
      type: 'radio',
      required: true,
      options: ['Yes', 'No', 'N/A']
    },
    {
      id: '2',
      question: 'Power On light of Office',
      type: 'radio',
      required: true,
      options: ['Yes', 'No', 'N/A']
    },
    {
      id: '3',
      question: 'Power On light of Office',
      type: 'radio',
      required: true,
      options: ['Yes', 'No', 'N/A']
    }
  ];

  const actualChecklist = checklist.length > 0 ? checklist : defaultChecklist;

  const steps: TaskSubmissionStep[] = [
    { id: 1, title: 'Before Photo', completed: completedSteps.includes(1), active: currentStep === 1 },
    { id: 2, title: 'Checkpoints', completed: completedSteps.includes(2), active: currentStep === 2 },
    { id: 3, title: 'After Photo', completed: completedSteps.includes(3), active: currentStep === 3 }
  ];

  const handleFileUpload = (type: 'before' | 'after', file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    if (type === 'before') {
      setFormData(prev => ({
        ...prev,
        beforePhoto: file,
        beforePhotoName: file?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        afterPhoto: file,
        afterPhotoName: file?.name || ''
      }));
    }
  };

  const handleChecklistChange = (itemId: string, field: 'value' | 'comment' | 'attachment', value: any) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [itemId]: {
          ...prev.checklist[itemId],
          [field]: value
        }
      }
    }));
  };

  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.beforePhoto) {
          toast({
            title: "Photo Required",
            description: "Please add a photograph before starting work.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        // Validate checklist items
        for (const item of actualChecklist) {
          if (item.required) {
            const answer = formData.checklist[item.id]?.value;
            if (!answer || (Array.isArray(answer) && answer.length === 0)) {
              toast({
                title: "Required Field",
                description: `Please answer: ${item.question}`,
                variant: "destructive"
              });
              return false;
            }
          }
        }
        break;
      case 3:
        if (!formData.afterPhoto) {
          toast({
            title: "Photo Required",
            description: "Please add a photograph after work.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      return;
    }

    // Mark final step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    // Prepare submission data
    const submissionData = {
      taskId,
      beforePhoto: formData.beforePhoto,
      afterPhoto: formData.afterPhoto,
      checklist: actualChecklist.map(item => ({
        id: item.id,
        question: item.question,
        answer: formData.checklist[item.id]?.value,
        comment: formData.checklist[item.id]?.comment,
        attachment: formData.checklist[item.id]?.attachment
      })),
      completedAt: new Date().toISOString()
    };

    onSubmit(submissionData);
    setShowSuccessModal(true);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Before Photo
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600 mb-4">
                Add Photograph before starting work.
              </Typography>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Typography variant="body2" className="font-medium mb-2">
                      Info
                    </Typography>
                    
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <strong>Attach Before Photograph</strong>
                      </div>
                      
                      {formData.beforePhoto ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <img 
                              src={URL.createObjectURL(formData.beforePhoto)}
                              alt="Before"
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <Typography variant="body2" className="font-medium">
                                Before
                              </Typography>
                              <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                <InputLabel>Name</InputLabel>
                                <MuiSelect
                                  value={formData.beforePhotoName || 'Enter Your Name'}
                                  onChange={(e) => setFormData(prev => ({ ...prev, beforePhotoName: e.target.value }))}
                                  label="Name"
                                >
                                  <MenuItem value="Abdul Ghaffar">Abdul Ghaffar</MenuItem>
                                  <MenuItem value="Enter Your Name">Enter Your Name</MenuItem>
                                </MuiSelect>
                              </FormControl>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                          onClick={() => beforePhotoRef.current?.click()}
                        >
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <Typography variant="body2" className="text-gray-600">
                            Upload Files
                          </Typography>
                        </div>
                      )}
                      
                      <input
                        ref={beforePhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('before', e.target.files?.[0] || null)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2: // Checkpoints
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600 mb-4">
                Complete the checklist below.
              </Typography>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="body1" className="font-medium">
                        Male Washroom Cleaning Checklists
                      </Typography>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {actualChecklist.map((item, index) => (
                        <div key={item.id} className="space-y-3">
                          <Typography variant="body2" className="font-medium">
                            {index + 1}. {item.question}
                          </Typography>
                          
                          {item.type === 'radio' && (
                            <RadioGroup
                              value={formData.checklist[item.id]?.value || ''}
                              onChange={(e) => handleChecklistChange(item.id, 'value', e.target.value)}
                            >
                              {item.options?.map((option) => (
                                <FormControlLabel
                                  key={option}
                                  value={option}
                                  control={<Radio sx={{ color: '#C72030', '&.Mui-checked': { color: '#C72030' } }} />}
                                  label={option}
                                />
                              ))}
                            </RadioGroup>
                          )}

                          <TextField
                            placeholder="Add your comment..."
                            fullWidth
                            multiline
                            minRows={2}
                            variant="outlined"
                            value={formData.checklist[item.id]?.comment || ''}
                            onChange={(e) => handleChecklistChange(item.id, 'comment', e.target.value)}
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white'
                              }
                            }}
                          />

                          {formData.checklist[item.id]?.attachment && (
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <img 
                                src={URL.createObjectURL(formData.checklist[item.id].attachment)}
                                alt="Attachment"
                                className="w-12 h-12 object-cover rounded"
                              />
                              <Typography variant="caption" className="flex-1">
                                {formData.checklist[item.id].attachment.name}
                              </Typography>
                            </div>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  handleChecklistChange(item.id, 'attachment', file);
                                }
                              };
                              input.click();
                            }}
                          >
                            Add Attachment
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // After Photo
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Typography variant="body2" className="text-gray-600 mb-4">
                Add Photograph After work.
              </Typography>
            </div>

            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Typography variant="body2" className="font-medium mb-4">
                      Info
                    </Typography>
                    
                    <div className="space-y-4">
                      {/* Show Before Photo */}
                      <div className="space-y-2">
                        <Typography variant="body2" className="font-medium">Before</Typography>
                        {formData.beforePhoto && (
                          <div className="flex items-center gap-3">
                            <img 
                              src={URL.createObjectURL(formData.beforePhoto)}
                              alt="Before"
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                              <Typography variant="body2" className="font-medium">Before</Typography>
                              <Typography variant="caption" className="text-gray-600">
                                {formData.beforePhotoName || 'Abdul Ghaffar'}
                              </Typography>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* After Photo Section */}
                      <div className="space-y-2">
                        <Typography variant="body2" className="font-medium">After</Typography>
                        {formData.afterPhoto ? (
                          <div className="flex items-center gap-3">
                            <img 
                              src={URL.createObjectURL(formData.afterPhoto)}
                              alt="After"
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div>
                              <Typography variant="body2" className="font-medium">After</Typography>
                              <Typography variant="caption" className="text-gray-600">
                                {formData.afterPhotoName || formData.beforePhotoName || 'Abdul Ghaffar'}
                              </Typography>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="text-sm text-gray-600">
                              <strong>Attach After Photograph</strong>
                            </div>
                            <div 
                              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors"
                              onClick={() => afterPhotoRef.current?.click()}
                            >
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <Typography variant="body2" className="text-gray-600">
                                Upload Files
                              </Typography>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <input
                        ref={afterPhotoRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload('after', e.target.files?.[0] || null)}
                      />

                      {/* Preview Button */}
                      {formData.beforePhoto && formData.afterPhoto && (
                        <Button
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Checklist Summary */}
            <Card className="border border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="body1" className="font-medium">
                        Male Washroom Cleaning Checklists
                      </Typography>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {actualChecklist.map((item, index) => {
                        const answer = formData.checklist[item.id]?.value;
                        const comment = formData.checklist[item.id]?.comment;
                        const attachment = formData.checklist[item.id]?.attachment;
                        
                        return (
                          <div key={item.id} className="space-y-2">
                            <Typography variant="body2" className="font-medium">
                              {index + 1}. {item.question}
                            </Typography>
                            
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                answer === 'Yes' ? 'bg-green-500' : answer === 'No' ? 'bg-red-500' : 'bg-gray-400'
                              }`}>
                                <span className="text-white text-xs">●</span>
                              </div>
                              <Typography variant="body2" className="text-gray-700">
                                {answer || 'Not answered'}
                              </Typography>
                            </div>

                            {comment && (
                              <Typography variant="body2" className="text-gray-600 ml-6">
                                Comment: {comment}
                              </Typography>
                            )}

                            {attachment && (
                              <div className="ml-6">
                                <img 
                                  src={URL.createObjectURL(attachment)}
                                  alt="Attachment"
                                  className="w-16 h-16 object-cover rounded"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <DialogTitle className="text-xl font-bold text-gray-900 uppercase">
              {taskTitle || 'MALE WASHROOM CLEANING'}
            </DialogTitle>
          </div>
          <button
            onClick={onClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>

        {/* Step Progress Indicator */}
        <div className="py-6">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step.completed ? 'bg-red-600 text-white' : 
                        step.active ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}
                    `}>
                      {step.id}
                    </div>
                    <Typography variant="caption" className={`mt-2 text-center ${
                      step.active ? 'text-red-600 font-medium' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </Typography>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-300"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handlePrevious}
                  className="border-red-600 text-red-600 hover:bg-red-50"
                >
                  Back
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={onClose}
              >
                Save to draft
              </Button>
              
              {currentStep < 3 ? (
                <Button 
                  onClick={handleNext}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Proceed to Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Submit Task
                </Button>
              )}
            </div>
          </div>

          {/* Progress Text */}
          <div className="text-center mt-4">
            <Typography variant="body2" className="text-gray-600">
              You've completed {completedSteps.length} out of 3 steps.
            </Typography>
          </div>
        </div>
      </DialogContent>
      
      {/* Success Modal */}
      <TaskSubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
        onViewDetails={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />
    </Dialog>
  );
};
