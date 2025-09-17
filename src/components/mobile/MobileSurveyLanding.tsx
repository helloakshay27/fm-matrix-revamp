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
  const [finalDescription, setFinalDescription] = useState<string>("");

  // Question-specific states
  const [currentQuestionValue, setCurrentQuestionValue] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<SurveyOption[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<GenericTag[]>([]);
  const [showGenericTags, setShowGenericTags] = useState(false);
  const [pendingNegativeType, setPendingNegativeType] = useState<
    null | "emoji" | "smiley" | "multiple" | "rating"
  >(null);
  const [pendingNegativeAnswer, setPendingNegativeAnswer] = useState<
    | null
    | { rating: number; emoji: string; label: string }
    | SurveyOption[]
    | number
  >(null);

  // Fetch survey data
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!mappingId) return;

      try {
        setIsLoading(true);
        const response = await baseClient.get(
          `survey_mappings/${mappingId}/survey.json`
        );
        const data = response.data;
        setSurveyData(data);
      } catch (error) {
        console.error("Failed to fetch survey data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveyData();
  }, [mappingId]);

  // Get current question
  const getCurrentQuestion = (): SurveyQuestion | null => {
    if (
      !surveyData ||
      currentQuestionIndex >= surveyData.snag_checklist.snag_questions.length
    ) {
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
      case "multiple":
        return selectedOptions.length > 0;
      case "input":
      case "text":
      case "description":
        return currentQuestionValue.trim() !== "";
      case "rating":
        return selectedRating !== null;
      case "emoji":
      case "smiley":
        return selectedRating !== null;
      default:
        return true;
    }
  };

  // Check if survey has text-based questions (text, input, description)
  const hasTextBasedQuestions = (): boolean => {
    if (!surveyData) return false;
    return surveyData.snag_checklist.snag_questions.some(
      (question) => 
        question.qtype === "text" || 
        question.qtype === "input" || 
        question.qtype === "description"
    );
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
    const hasNegative = selectedOptions.some((opt) => opt.option_type === "n");
    if (
      hasNegative &&
      currentQuestion.generic_tags &&
      currentQuestion.generic_tags.length > 0
    ) {
      setPendingNegativeType("multiple");
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

    if (
      selectedRating !== null &&
      selectedRating <= 3 &&
      currentQuestion.generic_tags &&
      currentQuestion.generic_tags.length > 0
    ) {
      setPendingNegativeType("rating");
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

  // Handle emoji/smiley selection
  const handleEmojiSelect = (rating: number, emoji: string, label: string) => {
    setSelectedRating(rating);
    const currentQuestion = getCurrentQuestion();
    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;

    if (
      rating <= 3 &&
      currentQuestion?.generic_tags &&
      currentQuestion.generic_tags.length > 0
    ) {
      setPendingNegativeType(currentQuestion.qtype as "emoji" | "smiley");
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
    setSelectedTags((prev) => {
      const isSelected = prev.some((selectedTag) => selectedTag.id === tag.id);
      if (isSelected) {
        return prev.filter((selectedTag) => selectedTag.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };

  // Save current answer
  const saveCurrentAnswer = (
    rating?: number,
    emoji?: string,
    label?: string,
    tags?: GenericTag[],
    description?: string
  ): SurveyAnswers[number] => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return { qtype: "", value: "" };

    const answerData: SurveyAnswers[number] = {
      qtype: currentQuestion.qtype,
      value: currentQuestionValue,
    };

    switch (currentQuestion.qtype) {
      case "multiple": {
        answerData.selectedOptions = selectedOptions;
        answerData.value = selectedOptions.map((opt) => opt.qname).join(", ");
        // Use provided tags parameter or current selectedTags state
        const multipleTags =
          tags || (selectedTags.length > 0 ? selectedTags : undefined);
        if (multipleTags && multipleTags.length > 0) {
          answerData.selectedTags = multipleTags;
          console.log(
            `[Multiple Question ${currentQuestion.id}] Saved tags:`,
            multipleTags.map((t) => t.category_name)
          );
        }
        if (description) answerData.description = description;
        break;
      }
      case "rating": {
        answerData.rating = rating || selectedRating;
        answerData.value = rating || selectedRating;
        // Use provided tags parameter or current selectedTags state
        const ratingTags =
          tags || (selectedTags.length > 0 ? selectedTags : undefined);
        if (ratingTags && ratingTags.length > 0) {
          answerData.selectedTags = ratingTags;
          console.log(
            `[Rating Question ${currentQuestion.id}] Saved tags:`,
            ratingTags.map((t) => t.category_name)
          );
        }
        if (description) answerData.description = description;
        break;
      }
      case "emoji":
      case "smiley": {
        answerData.rating = rating || selectedRating;
        answerData.emoji = emoji;
        answerData.label = label;
        // Use provided tags parameter or current selectedTags state
        answerData.selectedTags = tags || selectedTags;
        answerData.value =
          emoji && label ? `${emoji} ${label}` : emoji || label || "Good";
        if (description) answerData.description = description;
        if (answerData.selectedTags && answerData.selectedTags.length > 0) {
          console.log(
            `[${currentQuestion.qtype} Question ${currentQuestion.id}] Saved tags:`,
            answerData.selectedTags.map((t) => t.category_name)
          );
        }
        break;
      }
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerData,
    }));

    return answerData;
  };

  // Handle single question submission - COMPREHENSIVE FOR RAILS BACKEND
  const handleSingleQuestionSubmit = async (
    answerOverride?: SurveyAnswers[number]
  ) => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      // Use the provided answer override or get from state
      const currentAnswer = answerOverride || answers[currentQuestion.id];
      if (!currentAnswer) {
        console.error(
          "No current answer found for question:",
          currentQuestion.id
        );
        return;
      }

      console.log("Current answer for single question:", currentAnswer);

      // Build issues array from selected tags
      const issues =
        currentAnswer.selectedTags?.map((tag) => tag.category_name) || [];

      // Create comprehensive payload with all available fields
      const surveyResponse: {
        mapping_id: string;
        question_id: number;
        issues: string[];
        option_id?: number;
        rating?: number;
        emoji?: string;
        label?: string;
        response_text?: string;
        description?: string;
        final_description?: string;
      } = {
        mapping_id: mappingId || "",
        question_id: currentQuestion.id,
        issues: issues,
      };

      // Include additional fields based on question type and available data
      switch (currentQuestion.qtype) {
        case "multiple":
          if (
            currentAnswer.selectedOptions &&
            currentAnswer.selectedOptions.length > 0
          ) {
            surveyResponse.option_id = currentAnswer.selectedOptions[0].id;
          }
          break;

        case "emoji":
        case "smiley":
          if (currentAnswer.rating !== undefined) {
            surveyResponse.rating = currentAnswer.rating;
          }
          if (currentAnswer.emoji) {
            surveyResponse.emoji = currentAnswer.emoji;
          }
          if (currentAnswer.label) {
            surveyResponse.label = currentAnswer.label;
          }
          break;

        case "rating":
          if (currentAnswer.rating !== undefined) {
            surveyResponse.rating = currentAnswer.rating;
          }
          break;

        case "input":
        case "text":
        case "description":
          if (currentAnswer.value && currentAnswer.value.toString().trim()) {
            surveyResponse.response_text = currentAnswer.value
              .toString()
              .trim();
          }
          break;
      }

      // Add description if available
      if (currentAnswer.description && currentAnswer.description.trim()) {
        surveyResponse.description = currentAnswer.description.trim();
      }

      console.log("Submitting single question survey:", surveyResponse);

      await surveyApi.submitSurveyResponse({
        survey_response: surveyResponse,
      });

      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: true,
        },
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: false,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle single question submission with negative data - COMPREHENSIVE FOR RAILS BACKEND
  const handleSingleQuestionSubmitWithNegativeData = async (
    answerData: SurveyAnswers[number]
  ) => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      console.log("Submitting single question with negative data:", answerData);

      // Build issues array from selected tags
      const issues =
        answerData.selectedTags?.map((tag) => tag.category_name) || [];

      // Create comprehensive payload with all available fields
      const surveyResponse: {
        mapping_id: string;
        question_id: number;
        issues: string[];
        option_id?: number;
        rating?: number;
        emoji?: string;
        label?: string;
        response_text?: string;
        description?: string;
        final_description?: string;
      } = {
        mapping_id: mappingId || "",
        question_id: currentQuestion.id,
        issues: issues,
      };

      // Include additional fields based on question type and available data
      switch (currentQuestion.qtype) {
        case "multiple":
          if (
            answerData.selectedOptions &&
            answerData.selectedOptions.length > 0
          ) {
            surveyResponse.option_id = answerData.selectedOptions[0].id;
          }
          break;

        case "emoji":
        case "smiley":
          if (answerData.rating !== undefined) {
            surveyResponse.rating = answerData.rating;
          }
          if (answerData.emoji) {
            surveyResponse.emoji = answerData.emoji;
          }
          if (answerData.label) {
            surveyResponse.label = answerData.label;
          }
          break;

        case "rating":
          if (answerData.rating !== undefined) {
            surveyResponse.rating = answerData.rating;
          }
          break;

        case "input":
        case "text":
        case "description":
          if (answerData.value && answerData.value.toString().trim()) {
            surveyResponse.response_text = answerData.value.toString().trim();
          }
          break;
      }

      // Add description if available
      if (answerData.description && answerData.description.trim()) {
        surveyResponse.description = answerData.description.trim();
      }

      console.log(
        "Submitting single question survey with negative response:",
        surveyResponse
      );

      await surveyApi.submitSurveyResponse({
        survey_response: surveyResponse,
      });

      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: true,
        },
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: false,
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
    setCurrentQuestionValue("");
    setSelectedOptions([]);
    setSelectedRating(null);
    setSelectedTags([]);
    setShowGenericTags(false);

    // Move to next question or show final description
    if (currentQuestionIndex < surveyData!.snag_checklist.questions_count - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All questions completed, show final description step
      setCurrentQuestionIndex(surveyData!.snag_checklist.questions_count);
    }
  };

  // Handle survey submission - SUBMIT EACH QUESTION INDIVIDUALLY
  const handleSubmitSurvey = async () => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      console.log("=== MULTI-QUESTION SURVEY SUBMISSION ===");
      console.log("All answers before processing:", answers);

      // For multi-question surveys, we need to create answers array for each question
      const allAnswers = Object.values(answers);
      console.log("Processed all answers:", allAnswers);

      if (allAnswers.length === 0) {
        console.error("No answers found for multi-question survey");
        throw new Error("No answers found");
      }

      // Submit each question individually since Rails backend expects single questions
      for (const questionId in answers) {
        const answer = answers[parseInt(questionId)];
        const question = surveyData.snag_checklist.snag_questions.find(
          (q) => q.id === parseInt(questionId)
        );

        if (!question || !answer) continue;

        const issues =
          answer.selectedTags?.map((tag) => tag.category_name) || [];

        // Create comprehensive payload with all available fields for each question type
        const surveyResponse: {
          mapping_id: string;
          question_id: number;
          issues: string[];
          option_id?: number;
          rating?: number;
          emoji?: string;
          label?: string;
          response_text?: string;
          description?: string;
          final_description?: string;
        } = {
          mapping_id: mappingId || "",
          question_id: question.id,
          issues: issues,
        };

        // Include additional fields based on question type and available data
        switch (question.qtype) {
          case "multiple":
            if (answer.selectedOptions && answer.selectedOptions.length > 0) {
              surveyResponse.option_id = answer.selectedOptions[0].id;
            }
            break;

          case "emoji":
          case "smiley":
            if (answer.rating !== undefined) {
              surveyResponse.rating = answer.rating;
            }
            if (answer.emoji) {
              surveyResponse.emoji = answer.emoji;
            }
            if (answer.label) {
              surveyResponse.label = answer.label;
            }
            break;

          case "rating":
            if (answer.rating !== undefined) {
              surveyResponse.rating = answer.rating;
            }
            break;

          case "input":
          case "text":
          case "description":
            if (answer.value && answer.value.toString().trim()) {
              surveyResponse.response_text = answer.value.toString().trim();
            }
            break;
        }

        // Add description if available
        if (answer.description && answer.description.trim()) {
          surveyResponse.description = answer.description.trim();
        }

        // Add final description if this is the last question and we have it
        if (
          finalDescription.trim() &&
          parseInt(questionId) ===
            surveyData.snag_checklist.snag_questions[
              surveyData.snag_checklist.snag_questions.length - 1
            ].id
        ) {
          surveyResponse.final_description = finalDescription.trim();
        }

        console.log(`Submitting question ${question.id}:`, surveyResponse);

        // Submit each question individually
        await surveyApi.submitSurveyResponse({
          survey_response: surveyResponse,
        });
      }

      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: true,
        },
      });
    } catch (error) {
      console.error("Failed to submit survey:", error);
      navigate(`/mobile/survey/${mappingId}/thank-you`, {
        state: {
          submittedFeedback: false,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Static emoji/smiley options for emoji and smiley question types
  const getStaticEmojiOptions = () => [
    { rating: 5, emoji: "😄", label: "Amazing" },
    { rating: 4, emoji: "😊", label: "Good" },
    { rating: 3, emoji: "😐", label: "Okay" },
    { rating: 2, emoji: "😞", label: "Bad" },
    { rating: 1, emoji: "😠", label: "Terrible" },
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
  const isLastStep =
    currentQuestionIndex >= surveyData.snag_checklist.questions_count;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header with Logo */}
      <div className="bg-gray-50 py-4 px-4 text-center">
        <div className="flex justify-center items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <img
              src="/Without bkg.svg"
              alt="OIG Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Progress Bar for Multi-Question Surveys */}
      {isMultiQuestion && (
        <div className="bg-white px-4 sm:px-6 pb-3 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-600">
              Question{" "}
              {Math.min(
                currentQuestionIndex + 1,
                surveyData.snag_checklist.questions_count
              )}{" "}
              of {surveyData.snag_checklist.questions_count}
            </span>
            <span className="text-xs sm:text-sm text-gray-600">
              {getProgressPercentage()}%
            </span>
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
      <div className="flex-1 flex flex-col px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full min-h-full">
          <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-black mb-4 text-center leading-tight">
            {surveyData.survey_title}
          </h1>

          {/* Show image only on first question or single question surveys */}
          {!showGenericTags && (
            <div className="text-center mb-6">
              <img
                src="/9019830 1.png"
                alt="Survey Illustration"
                className="w-60 h-60 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain mx-auto"
              />
            </div>
          )}

          {/* Show Final Description Step */}
          {isLastStep && isMultiQuestion && (
            <div className="w-full space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2">
                  Any additional comments?
                </h3>
                <p className="text-sm text-gray-600">
                  Share any additional feedback or suggestions (optional)
                </p>
              </div>

              <div>
                <textarea
                  value={finalDescription}
                  onChange={(e) => setFinalDescription(e.target.value)}
                  placeholder="Please share your thoughts..."
                  className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                  "Submit Survey"
                )}
              </button>
            </div>
          )}

          {/* Show Current Question */}
          {currentQuestion && !isLastStep && (
            <div className="w-full space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-black mb-2 leading-tight">
                  {currentQuestion.descr}
                </h3>
              </div>

              <div className="space-y-4">
                {/* Multiple Choice Question */}
                {currentQuestion.qtype === "multiple" && !showGenericTags && (
                  <>
                    <div className="space-y-3 mt-10">
                      {currentQuestion.snag_quest_options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${
                            selectedOptions.some((opt) => opt.id === option.id)
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm sm:text-base">
                              {option.qname}
                            </span>
                            {selectedOptions.some(
                              (opt) => opt.id === option.id
                            ) && (
                              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
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
                      {surveyData!.snag_checklist.questions_count === 1
                        ? "Submit Survey"
                        : currentQuestionIndex <
                          surveyData.snag_checklist.questions_count - 1
                        ? "Next Question"
                        : "Continue"}
                    </button>
                  </>
                )}

                {/* Input Question */}
                {currentQuestion.qtype === "input" && (
                  <>
                    <div className="mt-16">
                      <input
                        type="text"
                        value={currentQuestionValue}
                        onChange={(e) =>
                          setCurrentQuestionValue(e.target.value)
                        }
                        placeholder="Enter your answer..."
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        const isSingleQuestion =
                          surveyData!.snag_checklist.questions_count === 1;

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
                      {surveyData!.snag_checklist.questions_count === 1
                        ? "Submit Survey"
                        : currentQuestionIndex <
                          surveyData.snag_checklist.questions_count - 1
                        ? "Next Question"
                        : "Continue"}
                    </button>
                  </>
                )}

                {/* Text Question */}
                {currentQuestion.qtype === "text" && (
                  <>
                    <div className="mt-14">
                      <textarea
                        value={currentQuestionValue}
                        onChange={(e) =>
                          setCurrentQuestionValue(e.target.value)
                        }
                        placeholder="Please enter your comments..."
                        className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        const isSingleQuestion =
                          surveyData!.snag_checklist.questions_count === 1;

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
                      {surveyData!.snag_checklist.questions_count === 1
                        ? "Submit Survey"
                        : currentQuestionIndex <
                          surveyData.snag_checklist.questions_count - 1
                        ? "Next Question"
                        : "Continue"}
                    </button>
                  </>
                )}

                {/* Description Question */}
                {currentQuestion.qtype === "description" && (
                  <>
                    <div className="mt-14">
                      <textarea
                        value={currentQuestionValue}
                        onChange={(e) =>
                          setCurrentQuestionValue(e.target.value)
                        }
                        placeholder="Enter your description..."
                        className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        const isSingleQuestion =
                          surveyData!.snag_checklist.questions_count === 1;

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
                      {surveyData!.snag_checklist.questions_count === 1
                        ? "Submit Survey"
                        : currentQuestionIndex <
                          surveyData.snag_checklist.questions_count - 1
                        ? "Next Question"
                        : "Continue"}
                    </button>
                  </>
                )}

                {/* Rating Question */}
                {currentQuestion.qtype === "rating" && !showGenericTags && (
                  <>
                    <div className="flex justify-center items-center space-x-2 sm:space-x-3 mt-20">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingSelect(rating)}
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all ${
                            selectedRating !== null && rating <= selectedRating
                              ? "text-yellow-500"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        >
                          <svg
                            className="w-full h-full"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>

                    {selectedRating && (
                      <div className="text-center">
                        <span className="text-base sm:text-lg font-medium text-gray-700">
                          {selectedRating} star{selectedRating > 1 ? "s" : ""}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={handleRatingNext}
                      disabled={!isCurrentAnswerValid()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      {surveyData!.snag_checklist.questions_count === 1
                        ? "Submit Survey"
                        : currentQuestionIndex <
                          surveyData.snag_checklist.questions_count - 1
                        ? "Next Question"
                        : "Continue"}
                    </button>
                  </>
                )}

                {/* Emoji/Smiley Question */}
                {(currentQuestion.qtype === "emoji" ||
                  currentQuestion.qtype === "smiley") &&
                  !showGenericTags && (
                    <div className="w-full mt-16">
                      <div className="grid grid-cols-5 gap-3 px-2">
                        {getStaticEmojiOptions().map((option) => (
                          <button
                            key={option.rating}
                            onClick={() =>
                              handleEmojiSelect(
                                option.rating,
                                option.emoji,
                                option.label
                              )
                            }
                            className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[90px]"
                          >
                            <span className="text-3xl mb-2">
                              {option.emoji}
                            </span>
                            <span className="text-xs text-gray-600 text-center leading-tight">
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Generic Tags for Negative (Emoji, Smiley, Multiple, Rating) */}
                {showGenericTags && (
                  <>
                    <div className="text-center">
                      <h4 className="text-lg font-semibold text-black mb-2">
                        What specifically needs improvement?
                      </h4>
                      {selectedTags.length > 0 && (
                        <p className="text-sm text-blue-600">
                          {selectedTags.length} item
                          {selectedTags.length > 1 ? "s" : ""} selected
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      {getCurrentQuestion()?.generic_tags?.map((tag) => {
                        const isSelected = selectedTags.some(
                          (selectedTag) => selectedTag.id === tag.id
                        );
                        return (
                          <button
                            key={tag.id}
                            onClick={() => handleGenericTagClick(tag)}
                            className={`p-3 sm:p-4 rounded-lg border-2 text-center transition-all ${
                              isSelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <div className="mb-2">
                              {tag.icons && tag.icons.length > 0 ? (
                                <img
                                  src={tag.icons[0].url}
                                  alt={tag.category_name}
                                  className="w-10 h-10 sm:w-12 sm:h-12 mx-auto object-contain"
                                />
                              ) : (
                                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-lg sm:text-2xl">
                                    🏷️
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">
                              {tag.category_name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Description Field - Only show for emoji, multiple, and rating question types AND if survey doesn't have text-based questions */}
                    {(pendingNegativeType === "emoji" || 
                      pendingNegativeType === "smiley" || 
                      pendingNegativeType === "multiple" || 
                      pendingNegativeType === "rating") && 
                      !hasTextBasedQuestions() && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Comments (Optional)
                        </label>
                        <textarea
                          value={finalDescription}
                          onChange={(e) => setFinalDescription(e.target.value)}
                          placeholder="Please describe any specific issues or suggestions..."
                          className="w-full h-20 sm:h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                    )}

                    <button
                      onClick={async () => {
                        const isSingleQuestion =
                          surveyData!.snag_checklist.questions_count === 1;

                        // Save answer with tags and description, then proceed
                        let answerData;
                        if (
                          (pendingNegativeType === "emoji" ||
                            pendingNegativeType === "smiley") &&
                          typeof pendingNegativeAnswer === "object" &&
                          pendingNegativeAnswer !== null &&
                          "rating" in pendingNegativeAnswer
                        ) {
                          answerData = saveCurrentAnswer(
                            pendingNegativeAnswer.rating,
                            pendingNegativeAnswer.emoji,
                            pendingNegativeAnswer.label,
                            selectedTags,
                            finalDescription
                          );
                        } else if (pendingNegativeType === "multiple") {
                          answerData = saveCurrentAnswer(
                            undefined,
                            undefined,
                            undefined,
                            selectedTags,
                            finalDescription
                          );
                        } else if (
                          pendingNegativeType === "rating" &&
                          typeof pendingNegativeAnswer === "number"
                        ) {
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
                        setFinalDescription("");
                        setPendingNegativeType(null);
                        setPendingNegativeAnswer(null);

                        // For single question negative responses, submit with complete data
                        if (isSingleQuestion && answerData) {
                          handleSingleQuestionSubmitWithNegativeData(
                            answerData
                          );
                        } else {
                          // For multi-question surveys, proceed to next question
                          handleNextQuestion();
                        }
                      }}
                      disabled={
                        selectedTags.length === 0 && 
                        (pendingNegativeType === "emoji" || 
                         pendingNegativeType === "smiley" || 
                         pendingNegativeType === "multiple" || 
                         pendingNegativeType === "rating") && 
                        !hasTextBasedQuestions() &&
                        !finalDescription.trim()
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : surveyData!.snag_checklist.questions_count === 1 ? (
                        "Submit Survey"
                      ) : currentQuestionIndex <
                        surveyData.snag_checklist.questions_count - 1 ? (
                        "Next Question"
                      ) : (
                        "Continue"
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowGenericTags(false);
                        setSelectedTags([]);
                        setFinalDescription("");
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
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-white border-t border-gray-200 py-3 px-4 text-center">
        <div className="text-xs sm:text-sm text-gray-500">
          {surveyData.site_name} - {surveyData.area_name}
        </div>
      </div> */}
    </div>
  );
};

export default MobileSurveyLanding;
