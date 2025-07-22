import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Box,
  Collapse,
  IconButton,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Edit,
  Check,
  Add,
  Delete,
  DragIndicator
} from '@mui/icons-material';

interface Question {
  id: string;
  text: string;
  type: 'text' | 'checkbox' | 'radio' | 'number';
}

interface Section {
  id: string;
  title: string;
  questions: Question[];
}

interface QuestionSetupStepProps {
  data: {
    sections: Section[];
  };
  onChange: (field: string, value: any) => void;
  isCompleted?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  errors?: Record<string, string>;
}

export const QuestionSetupStep = ({
  data,
  onChange,
  isCompleted = false,
  isCollapsed = false,
  onToggleCollapse,
  errors = {}
}: QuestionSetupStepProps) => {
  const [expandedSection, setExpandedSection] = useState<string | false>(false);

  const addSection = () => {
    const newSection: Section = {
      id: `section_${Date.now()}`,
      title: 'New Section',
      questions: []
    };
    onChange('sections', [...(data.sections || []), newSection]);
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      text: 'New Question',
      type: 'text'
    };

    const updatedSections = (data.sections || []).map(section =>
      section.id === sectionId
        ? { ...section, questions: [...section.questions, newQuestion] }
        : section
    );
    onChange('sections', updatedSections);
  };

  const updateSection = (sectionId: string, title: string) => {
    const updatedSections = (data.sections || []).map(section =>
      section.id === sectionId
        ? { ...section, title }
        : section
    );
    onChange('sections', updatedSections);
  };

  const deleteSection = (sectionId: string) => {
    const updatedSections = (data.sections || []).filter(section => section.id !== sectionId);
    onChange('sections', updatedSections);
  };

  const updateQuestion = (sectionId: string, questionId: string, text: string) => {
    const updatedSections = (data.sections || []).map(section =>
      section.id === sectionId
        ? {
          ...section,
          questions: section.questions.map(q =>
            q.id === questionId ? { ...q, text } : q
          )
        }
        : section
    );
    onChange('sections', updatedSections);
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = (data.sections || []).map(section =>
      section.id === sectionId
        ? {
          ...section,
          questions: section.questions.filter(q => q.id !== questionId)
        }
        : section
    );
    onChange('sections', updatedSections);
  };

  // Collapsed view
  if (isCompleted && isCollapsed) {
    const totalQuestions = (data.sections || []).reduce((acc, section) => acc + section.questions.length, 0);

    return (
      <Card sx={{ mb: 2, border: '1px solid #E5E7EB' }}>
        <CardHeader
          sx={{
            pb: 2,
            '& .MuiCardHeader-content': { flex: '1 1 auto' },
            '& .MuiCardHeader-action': { mt: 0, mr: 0 }
          }}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Check sx={{ color: '#059669', fontSize: 20 }} />
              <Typography variant="h6" sx={{ color: '#059669', fontSize: '16px', fontWeight: 600 }}>
                Question Setup
              </Typography>
            </Box>
          }
          subheader={
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={`${(data.sections || []).length} sections`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`${totalQuestions} questions`}
                size="small"
                variant="outlined"
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={onToggleCollapse}
                sx={{
                  color: '#C72030',
                  textTransform: 'none',
                  fontSize: '12px'
                }}
              >
                Edit
              </Button>
              <IconButton onClick={onToggleCollapse} size="small">
                <ExpandMore />
              </IconButton>
            </Box>
          }
        />
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2, border: isCompleted ? '1px solid #059669' : '1px solid #E5E7EB' }}>
      <CardHeader
        sx={{
          pb: 1,
          '& .MuiCardHeader-content': { flex: '1 1 auto' },
          '& .MuiCardHeader-action': { mt: 0, mr: 0 }
        }}
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isCompleted && <Check sx={{ color: '#059669', fontSize: 20 }} />}
            <Typography
              variant="h6"
              sx={{
                color: isCompleted ? '#059669' : '#111827',
                fontSize: '16px',
                fontWeight: 600
              }}
            >
              Question Setup
            </Typography>
          </Box>
        }
        action={
          isCompleted && onToggleCollapse && (
            <IconButton onClick={onToggleCollapse} size="small">
              <ExpandLess />
            </IconButton>
          )
        }
      />

      <Collapse in={!isCollapsed || !isCompleted} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={addSection}
              sx={{
                borderColor: '#C72030',
                color: '#C72030',
                '&:hover': {
                  borderColor: '#C72030',
                  backgroundColor: 'rgba(199, 32, 48, 0.04)',
                },
              }}
            >
              Section
            </Button>
          </Box>

          {(data.sections || []).map((section, sectionIndex) => (
            <Accordion
              key={section.id}
              expanded={expandedSection === section.id}
              onChange={(_, isExpanded) => setExpandedSection(isExpanded ? section.id : false)}
              sx={{ mb: 2, border: '1px solid #E5E7EB', boxShadow: 'none' }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <DragIndicator sx={{ color: '#9CA3AF', cursor: 'grab' }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {section.questions.length} questions
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    sx={{ color: '#EF4444' }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </AccordionSummary>

              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ width: '100%' }}>
                    <TextField
                      fullWidth
                      label="Section Title"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': {
                            borderColor: '#C72030',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#C72030',
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ width: '100%' }}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Questions
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<Add />}
                        onClick={() => addQuestion(section.id)}
                        sx={{
                          color: '#C72030',
                          textTransform: 'none',
                        }}
                      >
                        Add Question
                      </Button>
                    </Box>

                    <List>
                      {section.questions.map((question, questionIndex) => (
                        <ListItem key={question.id} sx={{ px: 0 }}>
                          <DragIndicator sx={{ color: '#9CA3AF', cursor: 'grab', mr: 1 }} />
                          <ListItemText
                            primary={
                              <TextField
                                fullWidth
                                size="small"
                                value={question.text}
                                onChange={(e) => updateQuestion(section.id, question.id, e.target.value)}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                      borderColor: '#C72030',
                                    },
                                  },
                                }}
                              />
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton
                              size="small"
                              onClick={() => deleteQuestion(section.id, question.id)}
                              sx={{ color: '#EF4444' }}
                            >
                              <Delete />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          {(data.sections || []).length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4, color: '#9CA3AF' }}>
              <Typography>No sections added yet. Click "Add Section" to get started.</Typography>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};