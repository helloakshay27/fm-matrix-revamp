import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { surveyApi } from "@/services/surveyApi";
import baseClient from "@/utils/withoutTokenBase";

interface SurveyQuestion {
  id: number;
  qtype: string;
  descr: string;
  checklist_id: number;
  img_mandatory: boolean;
  quest_mandatory: boolean;
  snag_quest_options: SurveyOption[];
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
    snag_questions: SurveyQuestion[];
  };
}

export const MobileSurveyLanding: React.FC = () => {
  const navigate = useNavigate();
  const { mappingId } = useParams<{ mappingId: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<SurveyMapping | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<SurveyQuestion | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, SurveyOption>>({});

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!mappingId) return;
      
      try {
        setIsLoading(true);
        const response = await baseClient.get(`survey_mappings/${mappingId}/survey.json`);
        const data = response.data;
        setSurveyData(data);
        
        // Set the first question as current question (support all question types)
        const firstQuestion = data.snag_checklist.snag_questions[0];
        setCurrentQuestion(firstQuestion || null);
        setCurrentQuestionIndex(0);
      } catch (error) {
        console.error('Failed to fetch survey data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [mappingId]);
  // Function to get emoji and label for different option types
  const getEmojiForOption = (option: SurveyOption, qtype: string) => {
    if (qtype === 'smiley') {
      const ratingNum = parseInt(option.qname);
      switch (ratingNum) {
        case 5: return { emoji: "😄", label: "Amazing" };
        case 4: return { emoji: "😊", label: "Good" };
        case 3: return { emoji: "😐", label: "Okay" };
        case 2: return { emoji: "😞", label: "Bad" };
        case 1: return { emoji: "😠", label: "Terrible" };
        default: return { emoji: "😐", label: "Okay" };
      }
    } else if (qtype === 'multiple') {
      // Handle Yes/No and other multiple choice options
      if (option.qname.toLowerCase() === 'yes') {
        return { emoji: "✅", label: "Yes" };
      } else if (option.qname.toLowerCase() === 'no') {
        return { emoji: "❌", label: "No" };
      } else if (option.option_type === 'p') {
        return { emoji: "👍", label: option.qname };
      } else if (option.option_type === 'n') {
        return { emoji: "👎", label: option.qname };
      } else {
        return { emoji: "◯", label: option.qname };
      }
    }
    
    // Default fallback
    return { emoji: "◯", label: option.qname };
  };

  const handleOptionClick = async (option: SurveyOption) => {
    const emojiData = getEmojiForOption(option, currentQuestion?.qtype || 'multiple');
    
    // Store the answer
    const newAnswers = {
      ...answers,
      [currentQuestion!.id]: option
    };
    setAnswers(newAnswers);

    const optionState = {
      optionId: option.id,
      option: option,
      emoji: emojiData.emoji,
      label: emojiData.label,
    };

    // Check if this is the last question
    const isLastQuestion = currentQuestionIndex === surveyData!.snag_checklist.snag_questions.length - 1;
    
    if (isLastQuestion) {
      // If it's the last question, submit all answers
      setIsSubmitting(true);
      try {
        // Submit survey response with all answers
        await surveyApi.submitSurveyResponse({
          survey_response: {
            mapping_id: mappingId!,
            rating: option.option_type === 'p' ? 5 : (option.qname.toLowerCase() === 'yes' ? 5 : 3),
            emoji: emojiData.emoji,
            label: emojiData.label,
            issues: [],
            description: undefined,
            option_id: option.id,
            question_id: currentQuestion?.id
          },
        });

        navigate(`/mobile/survey/${mappingId}/thank-you`, {
          state: {
            ...optionState,
            submittedFeedback: true,
            totalQuestions: surveyData!.snag_checklist.snag_questions.length
          },
        });
      } catch (error) {
        console.error("Failed to submit survey:", error);
        navigate(`/mobile/survey/${mappingId}/thank-you`, {
          state: {
            ...optionState,
            submittedFeedback: false,
            totalQuestions: surveyData!.snag_checklist.snag_questions.length
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(surveyData!.snag_checklist.snag_questions[nextIndex]);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setCurrentQuestion(surveyData!.snag_checklist.snag_questions[prevIndex]);
    }
  };

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

  if (!surveyData || !currentQuestion) {
    return (    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Survey not found or no questions available.</p>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Lockated Logo */}
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
        {/* <h1 className="text-2xl font-bold text-black mb-2">OIG</h1> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">
            We would love to see your
            <br />
            feedback!
          </h2>
        </div>

        {/* Illustration */}
        <div className="mb-5 px-4">
          <div className="w-24 h-42 mx-auto relative">
            {/* Phone illustration with feedback bubbles */}
            {/* <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">📱</div>
                <div className="text-sm text-gray-600">Feedback System</div>
              </div>
            </div> */}

            {/* Floating feedback elements */}
            {/* <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-2">
              <div className="flex">
                <span className="text-orange-400 text-sm">⭐⭐⭐⭐</span>
              </div>
            </div> */}

            {/* <div className="absolute -bottom-2 -left-4 bg-white rounded-lg shadow-lg p-2">
              <div className="flex">
                <span className="text-orange-400 text-sm">⭐⭐⭐</span>
              </div>
            </div> */}

            {/* Character illustration */}
            {/* <div className="absolute -right-8 bottom-0">
              <div className="w-12 h-16 bg-orange-400 rounded-full"></div>
            </div> */}
          </div>
        </div>
        <div>{surveyData.survey_title}</div>

        {/* Progress Indicator */}
        <div className="w-full max-w-sm mx-auto mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {surveyData.snag_checklist.snag_questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / surveyData.snag_checklist.snag_questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / surveyData.snag_checklist.snag_questions.length) * 100}%`
              }}
            ></div>
          </div>
        </div>


        {/* Rating Question */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-black mb-2">
            {currentQuestion.descr}
          </h3>
          {currentQuestion.quest_mandatory && (
            <p className="text-sm text-red-500">* Required</p>
          )}
        </div>

        {isSubmitting && (
          <div className="text-center mb-6">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600 mt-2">Submitting...</p>
          </div>
        )}

        {/* Options */}
        <div className="w-full max-w-sm mt-2">
          {currentQuestion.qtype === 'smiley' ? (
            <div className="grid grid-cols-5 gap-4 px-4">
              {currentQuestion.snag_quest_options
                .sort((a, b) => parseInt(b.qname) - parseInt(a.qname)) // Sort in descending order (5 to 1)
                .map((option) => {
                  const emojiData = getEmojiForOption(option, currentQuestion.qtype);
                  const isSelected = answers[currentQuestion.id]?.id === option.id;
                  return (
                    <button
                      key={option.id}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-100' 
                          : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onClick={() => handleOptionClick(option)}
                      disabled={isSubmitting}
                    >
                      <div className="text-4xl mb-2">{emojiData.emoji}</div>
                      <div className="text-xs text-gray-600 text-center leading-tight">
                        {emojiData.label}
                      </div>
                    </button>
                  );
                })}
            </div>
          ) : (
            <div className="space-y-3 px-4">
              {currentQuestion.snag_quest_options.map((option) => {
                const emojiData = getEmojiForOption(option, currentQuestion.qtype);
                const isSelected = answers[currentQuestion.id]?.id === option.id;
                return (
                  <button
                    key={option.id}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-100' 
                        : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                    onClick={() => handleOptionClick(option)}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{emojiData.emoji}</div>
                      <div className="text-lg font-medium text-gray-800">
                        {emojiData.label}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-blue-600">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center w-full max-w-sm mt-8 px-4">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Previous</span>
          </button>
          
          <div className="text-sm text-gray-500">
            {currentQuestionIndex === surveyData.snag_checklist.snag_questions.length - 1 ? 
              'Last Question' : 
              `${surveyData.snag_checklist.snag_questions.length - currentQuestionIndex - 1} remaining`
            }
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-gray-500 text-sm space-y-1">
        <div>{surveyData.site_name} - {surveyData.area_name}</div>
        <div>Survey ID: {mappingId}</div>
      </div>
    </div>
  );
};
