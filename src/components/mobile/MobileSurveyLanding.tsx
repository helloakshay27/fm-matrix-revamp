import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { surveyApi } from "@/services/surveyApi";
import baseClient from "@/utils/withoutTokenBase";

interface GenericTag {
  id: number;
  category_name: string;
  category_type: string;
  tag_type: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  icons: {
    id: number;
    file_name: string;
    content_type: string;
    file_size: number;
    updated_at: string;
    url: string;
  }[];
}

interface SurveyQuestion {
  id: number;
  qtype: string;
  descr: string;
  checklist_id: number;
  img_mandatory: boolean;
  quest_mandatory: boolean;
  snag_quest_options: SurveyOption[];
  generic_tags?: GenericTag[];
}

interface SurveyOption {
  id: number;
  qname: string;
  option_type: string;
}

interface SurveyMapping {
  id: number;
  survey_id: number;
  survey_title: string;
  site_name: string;
  building_name: string;
  wing_name: string;
  floor_name: string;
  area_name: string;
  room_name: string | null;
  snag_checklist: {
    id: number;
    name: string;
    questions_count: number;
    snag_questions: SurveyQuestion[];
  };
}

interface SurveyAnswers {
  [questionId: number]: {
    qtype: string;
    value: string | number | SurveyOption[];
    rating?: number;
    emoji?: string;
    label?: string;
    selectedTags?: GenericTag[];
    selectedOptions?: SurveyOption[];
    description?: string;
  };
}

export const MobileSurveyLanding: React.FC = () => {
  const navigate = useNavigate();
  const { mappingId } = useParams<{ mappingId: string }>();
  
  // Loading and data states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<SurveyMapping | null>(null);
  
  // Survey flow states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [finalDescription, setFinalDescription] = useState<string>('');
  
  // Question-specific states
  const [currentQuestionValue, setCurrentQuestionValue] = useState<string>('');
  const [selectedOptions, setSelectedOptions] = useState<SurveyOption[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<GenericTag[]>([]);
  const [showGenericTags, setShowGenericTags] = useState(false);
  const [pendingNegativeType, setPendingNegativeType] = useState<null | 'emoji' | 'multiple' | 'rating'>(null);
  const [pendingNegativeAnswer, setPendingNegativeAnswer] = useState<
    null | { rating: number; emoji: string; label: string } | SurveyOption[] | number
  >(null);

  // Fetch survey data
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!mappingId) return;
      
      try {
        setIsLoading(true);
        const response = await baseClient.get(`survey_mappings/${mappingId}/survey.json`);
        const data = response.data;
        setSurveyData(data);
      } catch (error) {
        console.error('Failed to fetch survey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [mappingId]);
  // Get current question
  const getCurrentQuestion = (): SurveyQuestion | null => {
    if (!surveyData || currentQuestionIndex >= surveyData.snag_checklist.snag_questions.length) {
      return null;
    }
    return surveyData.snag_checklist.snag_questions[currentQuestionIndex];
  };

  // Calculate progress percentage
  const getProgressPercentage = (): number => {
    if (!surveyData) return 0;
    const totalQuestions = surveyData.snag_checklist.questions_count;
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  };

  // Check if current answer is valid
  const isCurrentAnswerValid = (): boolean => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return true;

    switch (currentQuestion.qtype) {
      case 'multiple':
        return selectedOptions.length > 0;
      case 'input':
      case 'description':
        return currentQuestionValue.trim() !== '';
      case 'rating':
        return selectedRating !== null;
      case 'emoji':
        return selectedRating !== null;
      default:
        return true;
    }
  };


  // Handle option selection for multiple choice
  // Make multiple choice single-selectable (radio behavior)
  const handleOptionSelect = (option: SurveyOption) => {
    setSelectedOptions([option]);
  };

  // Handle next for multiple choice (with negative flow)
  const handleMultipleNext = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;
    
    // Check for negative option (option_type === 'n')
    const hasNegative = selectedOptions.some(opt => opt.option_type === 'n');
    if (hasNegative && currentQuestion.generic_tags && currentQuestion.generic_tags.length > 0) {
      setPendingNegativeType('multiple');
      setPendingNegativeAnswer(selectedOptions);
      setShowGenericTags(true);
    } else {
      const answerData = saveCurrentAnswer();
      
      if (isSingleQuestion) {
        // For single question surveys, submit immediately with answer data
        handleSingleQuestionSubmit(answerData);
      } else {
        // For multi-question surveys, proceed to next question
        handleNextQuestion();
      }
    }
  };


  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
  };

  // Handle next for rating (with negative flow)
  const handleRatingNext = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;
    
    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;
    
    if (selectedRating !== null && selectedRating <= 3 && currentQuestion.generic_tags && currentQuestion.generic_tags.length > 0) {
      setPendingNegativeType('rating');
      setPendingNegativeAnswer(selectedRating);
      setShowGenericTags(true);
    } else {
      const answerData = saveCurrentAnswer();
      
      if (isSingleQuestion) {
        // For single question surveys, submit immediately with answer data
        handleSingleQuestionSubmit(answerData);
      } else {
        // For multi-question surveys, proceed to next question
        handleNextQuestion();
      }
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (rating: number, emoji: string, label: string) => {
    setSelectedRating(rating);
    const currentQuestion = getCurrentQuestion();
    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;
    
    if (rating <= 3 && currentQuestion?.generic_tags && currentQuestion.generic_tags.length > 0) {
      setPendingNegativeType('emoji');
      setPendingNegativeAnswer({ rating, emoji, label });
      setShowGenericTags(true);
    } else {
      // For good ratings or no tags
      const answerData = saveCurrentAnswer(rating, emoji, label);
      
      if (isSingleQuestion) {
        // For single question surveys, submit immediately with answer data
        handleSingleQuestionSubmit(answerData);
      } else {
        // For multi-question surveys, proceed to next question
        handleNextQuestion();
      }
    }
  };

  // Handle generic tag selection
  const handleGenericTagClick = (tag: GenericTag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(selectedTag => selectedTag.id === tag.id);
      if (isSelected) {
        return prev.filter(selectedTag => selectedTag.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Save current answer
  const saveCurrentAnswer = (rating?: number, emoji?: string, label?: string, tags?: GenericTag[], description?: string): SurveyAnswers[number] => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return { qtype: '', value: '' };

    const answerData: SurveyAnswers[number] = {
      qtype: currentQuestion.qtype,
      value: currentQuestionValue
    };

    switch (currentQuestion.qtype) {
      case 'multiple':
        answerData.selectedOptions = selectedOptions;
        answerData.value = selectedOptions.map(opt => opt.qname).join(', ');
        if (tags && tags.length > 0) answerData.selectedTags = tags;
        if (description) answerData.description = description;
        break;
      case 'rating':
        answerData.rating = selectedRating;
        answerData.value = selectedRating;
        if (tags && tags.length > 0) answerData.selectedTags = tags;
        if (description) answerData.description = description;
        break;
      case 'emoji':
        answerData.rating = rating || selectedRating;
        answerData.emoji = emoji;
        answerData.label = label;
        answerData.selectedTags = tags || selectedTags;
        answerData.value = emoji && label ? `${emoji} ${label}` : (emoji || label || 'Good');
        if (description) answerData.description = description;
        break;
    }

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerData
    }));

    return answerData;
  };

  // Handle single question submission
  const handleSingleQuestionSubmit = async (answerOverride?: SurveyAnswers[number]) => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      // Use the provided answer override or get from state
      const currentAnswer = answerOverride || answers[currentQuestion.id];
      if (!currentAnswer) {
        console.error('No current answer found for question:', currentQuestion.id);
        return;
      }

      console.log('Current answer for single question:', currentAnswer);

      // Build issues array from selected tags
      const issues = currentAnswer.selectedTags?.map(tag => tag.category_name) || [];

      // Create the base survey response payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const surveyResponse: any = {
        mapping_id: mappingId || '',
        qtype: currentQuestion.qtype,
        value: typeof currentAnswer.value === 'object' ? 
               (Array.isArray(currentAnswer.value) ? currentAnswer.value.map(opt => opt.qname).join(', ') : String(currentAnswer.value)) : 
               currentAnswer.value,
        issues: issues,
        description: currentAnswer.description || finalDescription || undefined,
        question_id: currentQuestion.id
      };

      // Add question-specific fields
      if (currentQuestion.qtype === 'multiple') {
        surveyResponse.selectedOptions = currentAnswer.selectedOptions;
        surveyResponse.option_id = currentAnswer.selectedOptions?.[0]?.id;
      } else if (currentQuestion.qtype === 'emoji') {
        surveyResponse.rating = currentAnswer.rating || 5;
        surveyResponse.emoji = currentAnswer.emoji || "�";
        surveyResponse.label = currentAnswer.label || "Good";
      } else if (currentQuestion.qtype === 'rating') {
        surveyResponse.rating = currentAnswer.rating || 5;
      }

      // For input/description questions without rating, only add rating if there are issues
      if ((currentQuestion.qtype === 'input' || currentQuestion.qtype === 'description')) {
        if (issues.length > 0) {
          surveyResponse.rating = 2;
        } else {
          surveyResponse.rating = 5;
        }
      }

      // For multiple choice, add rating based on option type only if there are issues
      if (currentQuestion.qtype === 'multiple') {
        const hasNegative = currentAnswer.selectedOptions?.some(opt => opt.option_type === 'n');
        if (hasNegative || issues.length > 0) {
          surveyResponse.rating = 2;
        } else {
          surveyResponse.rating = 5;
        }
      }
      
      console.log('Submitting single question survey:', surveyResponse);
      
      await surveyApi.submitSurveyResponse({
        survey_response: surveyResponse,
      });
      
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: true
        },
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: false
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle next question
  const handleNextQuestion = () => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return;

    // Save current answer
    saveCurrentAnswer();

    // Reset question-specific states
    setCurrentQuestionValue('');
    setSelectedOptions([]);
    setSelectedRating(null);
    setSelectedTags([]);
    setShowGenericTags(false);

    // Move to next question or show final description
    if (currentQuestionIndex < surveyData!.snag_checklist.questions_count - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions completed, show final description step
      setCurrentQuestionIndex(surveyData!.snag_checklist.questions_count);
    }
  };

  // Handle survey submission
  const handleSubmitSurvey = async () => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      console.log('=== MULTI-QUESTION SURVEY SUBMISSION ===');
      console.log('All answers before processing:', answers);
      
      // For multi-question surveys, we need to aggregate the responses
      const allAnswers = Object.values(answers);
      console.log('Processed all answers:', allAnswers);
      
      if (allAnswers.length === 0) {
        console.error('No answers found for multi-question survey');
        throw new Error('No answers found');
      }
      
      // Calculate overall rating (average of all ratings, default to 5 if no ratings)
      const ratings = allAnswers
        .filter(answer => answer.rating !== undefined && answer.rating !== null)
        .map(answer => answer.rating!);
      const overallRating = ratings.length > 0 
        ? Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length)
        : 5;
      
      console.log('Calculated overall rating:', overallRating, 'from ratings:', ratings);

      // Get the most recent emoji/label or default
      const emojiAnswer = allAnswers.find(answer => answer.emoji);
      const emoji = emojiAnswer?.emoji || "😄";
      const label = emojiAnswer?.label || "Good";
      
      console.log('Selected emoji/label:', { emoji, label, emojiAnswer });

      // Aggregate all issues/tags
      const allIssues: string[] = [];
      allAnswers.forEach(answer => {
        if (answer.selectedTags) {
          answer.selectedTags.forEach(tag => {
            if (!allIssues.includes(tag.category_name)) {
              allIssues.push(tag.category_name);
            }
          });
        }
      });
      
      console.log('Aggregated issues:', allIssues);

      // Get the last question/option IDs for reference
      const lastAnswer = allAnswers[allAnswers.length - 1];
      const lastQuestion = surveyData.snag_checklist.snag_questions[surveyData.snag_checklist.snag_questions.length - 1];
      
      console.log('Last answer:', lastAnswer);
      console.log('Last question:', lastQuestion);

      // Create the survey response payload matching the API structure
      const surveyResponse = {
        mapping_id: mappingId || '',
        rating: overallRating,
        emoji: emoji,
        label: label,
        issues: allIssues,
        description: finalDescription || undefined,
        option_id: lastAnswer?.selectedOptions?.[0]?.id,
        question_id: lastQuestion?.id
      };
      
      console.log('Final survey response payload for multi-question:', surveyResponse);
      
      await surveyApi.submitSurveyResponse({
        survey_response: surveyResponse,
      });
      
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: true
        },
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: false
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Static emoji options
  const getStaticEmojiOptions = () => [
    { rating: 5, emoji: "😄", label: "Amazing" },
    { rating: 4, emoji: "😊", label: "Good" },
    { rating: 3, emoji: "😐", label: "Okay" },
    { rating: 2, emoji: "😞", label: "Bad" },
    { rating: 1, emoji: "😠", label: "Terrible" }
  ];

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!surveyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Survey not found.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  const isMultiQuestion = surveyData.snag_checklist.questions_count > 1;
  const isLastStep = currentQuestionIndex >= surveyData.snag_checklist.questions_count;

  return (
  <div className="min-h-screen flex flex-col" style={{ background: 'url(/9019830 1.png) center top/cover no-repeat, #f9fafb' }}>
      {/* Header with Logo */}
      <div className="bg-white py-8 px-4 text-center">
        <div className="flex justify-center items-center mb-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <img
              src="/Without bkg.svg"
              alt="OIG Logo"
              className="w-24 h-24 object-contain"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar for Multi-Question Surveys */}
      {isMultiQuestion && (
        <div className="bg-white px-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {Math.min(currentQuestionIndex + 1, surveyData.snag_checklist.questions_count)} of {surveyData.snag_checklist.questions_count}
            </span>
            <span className="text-sm text-gray-600">{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
          <h1 className="text-2xl font-medium text-black mb-4">{surveyData.survey_title}</h1>

        {/* Show image only on first question or single question surveys */}
        {!showGenericTags && (
          <div className="text-center mb-8">
            <img
              src="/9019830 1.png"
              alt="Survey Illustration"
              className="w-full max-w-xs md:max-w-md h-auto object-contain mx-auto"
              style={{ aspectRatio: '1/1.1' }}
            />
          </div>
        )}

        {/* Show Final Description Step */}
        {isLastStep && isMultiQuestion && (
          <div className="w-full max-w-sm">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-black mb-2">
                Any additional comments?
              </h3>
              <p className="text-sm text-gray-600">
                Share any additional feedback or suggestions (optional)
              </p>
            </div>

            <div className="mb-6">
              <textarea
                value={finalDescription}
                onChange={(e) => setFinalDescription(e.target.value)}
                placeholder="Please share your thoughts..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <button
              onClick={handleSubmitSurvey}
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                'Submit Survey'
              )}
            </button>
          </div>
        )}

        {/* Show Current Question */}
        {currentQuestion && !isLastStep && (
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-black mb-2">
                {currentQuestion.descr}
              </h3>
            </div>

            {/* Multiple Choice Question */}
            {currentQuestion.qtype === 'multiple' && !showGenericTags && (
              <>
                <div className="space-y-3 mb-6">
                  {currentQuestion.snag_quest_options.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        selectedOptions.some(opt => opt.id === option.id)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.qname}</span>
                        {selectedOptions.some(opt => opt.id === option.id) && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleMultipleNext}
                  disabled={!isCurrentAnswerValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {surveyData!.snag_checklist.questions_count === 1 ? 'Submit Survey' : (currentQuestionIndex < surveyData.snag_checklist.questions_count - 1 ? 'Next Question' : 'Continue')}
                </button>
              </>
            )}

            {/* Input Question */}
            {currentQuestion.qtype === 'input' && (
              <>
                <div className="mb-6">
                  <input
                    type="text"
                    value={currentQuestionValue}
                    onChange={(e) => setCurrentQuestionValue(e.target.value)}
                    placeholder="Enter your answer..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={async () => {
                    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;
                    
                    // Save current answer first
                    const answerData = saveCurrentAnswer();
                    
                    if (isSingleQuestion) {
                      // Submit immediately with answer data
                      handleSingleQuestionSubmit(answerData);
                    } else {
                      handleNextQuestion();
                    }
                  }}
                  disabled={!isCurrentAnswerValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {surveyData!.snag_checklist.questions_count === 1 ? 'Submit Survey' : (currentQuestionIndex < surveyData.snag_checklist.questions_count - 1 ? 'Next Question' : 'Continue')}
                </button>
              </>
            )}

            {/* Description Question */}
            {currentQuestion.qtype === 'description' && (
              <>
                <div className="mb-6">
                  <textarea
                    value={currentQuestionValue}
                    onChange={(e) => setCurrentQuestionValue(e.target.value)}
                    placeholder="Enter your description..."
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={async () => {
                    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;
                    
                    // Save current answer first
                    const answerData = saveCurrentAnswer();
                    
                    if (isSingleQuestion) {
                      // Submit immediately with answer data
                      handleSingleQuestionSubmit(answerData);
                    } else {
                      handleNextQuestion();
                    }
                  }}
                  disabled={!isCurrentAnswerValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {surveyData!.snag_checklist.questions_count === 1 ? 'Submit Survey' : (currentQuestionIndex < surveyData.snag_checklist.questions_count - 1 ? 'Next Question' : 'Continue')}
                </button>
              </>
            )}

            {/* Rating Question */}
            {currentQuestion.qtype === 'rating' && !showGenericTags && (
              <>
                <div className="flex justify-center space-x-2 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingSelect(rating)}
                      className={`w-12 h-12 rounded-full transition-all ${
                        selectedRating !== null && rating <= selectedRating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>

                {selectedRating && (
                  <div className="text-center mb-6">
                    <span className="text-lg font-medium text-gray-700">
                      {selectedRating} star{selectedRating > 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleRatingNext}
                  disabled={!isCurrentAnswerValid()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {surveyData!.snag_checklist.questions_count === 1 ? 'Submit Survey' : (currentQuestionIndex < surveyData.snag_checklist.questions_count - 1 ? 'Next Question' : 'Continue')}
                </button>
              </>
            )}

            {/* Emoji Question */}
            {currentQuestion.qtype === 'emoji' && !showGenericTags && (
              <>
                <div className="grid grid-cols-5 gap-4 px-4 mb-6">
                  {getStaticEmojiOptions().map((option) => (
                    <button
                      key={option.rating}
                      onClick={() => handleEmojiSelect(option.rating, option.emoji, option.label)}
                      className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="text-3xl mb-1">{option.emoji}</span>
                      <span className="text-xs text-gray-600 text-center">{option.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Generic Tags for Negative (Emoji, Multiple, Rating) */}
            {showGenericTags && (
              <>
                <div className="text-center mb-6">
                  <h4 className="text-md font-semibold text-black mb-2">
                    What specifically needs improvement?
                  </h4>
                  {selectedTags.length > 0 && (
                    <p className="text-sm text-blue-600">
                      {selectedTags.length} item{selectedTags.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {getCurrentQuestion()?.generic_tags?.map((tag) => {
                    const isSelected = selectedTags.some(selectedTag => selectedTag.id === tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => handleGenericTagClick(tag)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="mb-2">
                          {tag.icons && tag.icons.length > 0 ? (
                            <img
                              src={tag.icons[0].url}
                              alt={tag.category_name}
                              className="w-12 h-12 mx-auto object-contain"
                            />
                          ) : (
                            <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-2xl">🏷️</span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {tag.category_name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Description Field */}
                <div className="px-4 mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    value={finalDescription}
                    onChange={(e) => setFinalDescription(e.target.value)}
                    placeholder="Please describe any specific issues or suggestions..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  onClick={async () => {
                    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;
                    
                    // Save answer with tags and description, then proceed
                    let answerData;
                    if (pendingNegativeType === 'emoji' && typeof pendingNegativeAnswer === 'object' && pendingNegativeAnswer !== null && 'rating' in pendingNegativeAnswer) {
                      answerData = saveCurrentAnswer(
                        pendingNegativeAnswer.rating,
                        pendingNegativeAnswer.emoji,
                        pendingNegativeAnswer.label,
                        selectedTags,
                        finalDescription
                      );
                    } else if (pendingNegativeType === 'multiple') {
                      answerData = saveCurrentAnswer(
                        undefined,
                        undefined,
                        undefined,
                        selectedTags,
                        finalDescription
                      );
                    } else if (pendingNegativeType === 'rating' && typeof pendingNegativeAnswer === 'number') {
                      answerData = saveCurrentAnswer(
                        pendingNegativeAnswer,
                        undefined,
                        undefined,
                        selectedTags,
                        finalDescription
                      );
                    }
                    
                    // Reset states immediately
                    setShowGenericTags(false);
                    setSelectedTags([]);
                    setFinalDescription('');
                    setPendingNegativeType(null);
                    setPendingNegativeAnswer(null);
                    
                    // Proceed immediately
                    if (isSingleQuestion) {
                      // For single question surveys, submit immediately
                      handleSingleQuestionSubmit(answerData);
                    } else {
                      // For multi-question surveys, proceed to next question
                      handleNextQuestion();
                    }
                  }}
                  disabled={selectedTags.length === 0 && !finalDescription.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    surveyData!.snag_checklist.questions_count === 1 ? 'Submit Survey' : (currentQuestionIndex < surveyData.snag_checklist.questions_count - 1 ? 'Next Question' : 'Continue')
                  )}
                </button>

                <button
                  onClick={() => {
                    setShowGenericTags(false);
                    setSelectedTags([]);
                    setFinalDescription('');
                    setPendingNegativeType(null);
                    setPendingNegativeAnswer(null);
                  }}
                  className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 text-sm"
                >
                  ← Back
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm space-y-1">
        <div>{surveyData.site_name} - {surveyData.area_name}</div>
      </div>
    </div>
  );
};
