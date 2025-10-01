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
  active?: boolean;
  status?: string;
  message?: string;
  location?: string;
  snag_checklist: {
    id: number;
    name: string;
    questions_count: number;
    snag_attach?: string;
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
    comments?: string;
    optionId?: number;
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
  const [negativeComments, setNegativeComments] = useState<string>("");
  const [negativeComments1, setNegativeComments1] = useState<string>("");
  const [negativeComments2, setNegativeComments2] = useState<string>("");
  const [negativeComments3, setNegativeComments3] = useState<string>("");

  const [pendingNegativeType, setPendingNegativeType] = useState<
    null | "emoji" | "smiley" | "multiple" | "rating"
  >(null);
  const [pendingNegativeAnswer, setPendingNegativeAnswer] = useState<
    | null
    | { rating: number; emoji: string; label: string }
    | SurveyOption[]
    | number
    | { rating: number; option: SurveyOption }
  >(null);

  console.log("Negative cmnt", negativeComments);
  console.log("Negative cmnt1", negativeComments1);
  console.log("Negative cmnt2", negativeComments2);
  console.log("Negative cmnt3", negativeComments3);

  // Get the appropriate negative comment state based on current question index
  const getCurrentNegativeComments = (): string => {
    switch (currentQuestionIndex) {
      case 0:
        return negativeComments1;
      case 1:
        return negativeComments2;
      case 2:
        return negativeComments3;
      default:
        return negativeComments; // fallback to original for any additional questions
    }
  };

  // Set the appropriate negative comment state based on current question index
  const setCurrentNegativeComments = (value: string): void => {
    switch (currentQuestionIndex) {
      case 0:
        setNegativeComments1(value);
        break;
      case 1:
        setNegativeComments2(value);
        break;
      case 2:
        setNegativeComments3(value);
        break;
      default:
        setNegativeComments(value); // fallback to original for any additional questions
        break;
    }
  };

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
        console.log("Survey data fetched:", data);
        console.log("Survey status:", data.status);
        console.log("Survey active:", data.active);
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
    // For the final "Any additional comments?" page, show 100%
    if (currentQuestionIndex >= totalQuestions) {
      return 100;
    }
    return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
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

  // Handle option selection for multiple choice
  // Auto-progress based on selection (positive/negative)
  const handleOptionSelect = (option: SurveyOption) => {
    setSelectedOptions([option]);

    // Auto-progress after selection
    setTimeout(() => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;

      // Check for negative option (option_type === 'n') from API response
      const hasNegative = option.option_type === "n";
      if (
        hasNegative &&
        currentQuestion.generic_tags &&
        currentQuestion.generic_tags.length > 0
      ) {
        // Negative response - go to generic tags page
        setPendingNegativeType("multiple");
        setPendingNegativeAnswer([option]);
        setShowGenericTags(true);
      } else {
        // Positive response - auto-progress
        // Save with the selected option data - pass option directly to ensure it's included
        const tempAnswerData = {
          qtype: currentQuestion.qtype,
          value: option.qname,
          selectedOptions: [option],
          comments: "",
        };

        // Update answers object
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: tempAnswerData,
        }));

        if (isSingleQuestion) {
          // For single question surveys, submit immediately with answer data
          handleSingleQuestionSubmit(tempAnswerData);
        } else {
          // For multi-question surveys, proceed to next question
          // Data is already saved above, just move to next question
          moveToNextQuestion();
        }
      }
    }, 300); // Small delay for visual feedback
  };

  // Handle rating selection
  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);

    // Auto-progress after selection
    setTimeout(() => {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;

      // Check if any rating option has option_type === 'n' for negative flow
      const hasNegativeOption = currentQuestion.snag_quest_options?.some(
        (option) => option.option_type === "n"
      );

      // For rating questions, check if the selected rating corresponds to a negative option
      // Map rating to option index based on API options count
      const ratingToOptionIndex = Array.from(
        { length: currentQuestion.snag_quest_options?.length || 5 }, 
        (_, index) => ({ rating: index + 1, optionIndex: currentQuestion.snag_quest_options.length - 1 - index })
      );
      
      const selectedOptionMapping = ratingToOptionIndex.find(
        (opt) => opt.rating === rating
      );
      
      const selectedOption = selectedOptionMapping && currentQuestion.snag_quest_options?.[selectedOptionMapping.optionIndex];
      const isNegativeRating = selectedOption?.option_type === "n";

      if (
        isNegativeRating &&
        currentQuestion.generic_tags &&
        currentQuestion.generic_tags.length > 0
      ) {
        // Negative response - go to generic tags page
        setPendingNegativeType("rating");
        // Store both rating and the corresponding option for option_id
        setPendingNegativeAnswer({
          rating,
          option: selectedOption
        });
        setShowGenericTags(true);
      } else {
        // Positive response - auto-progress
        // Save with the rating data
        const answerData = saveCurrentAnswer(rating);

        if (isSingleQuestion) {
          // For single question surveys, submit immediately with answer data
          handleSingleQuestionSubmit(answerData);
        } else {
          // For multi-question surveys, proceed to next question
          // Data is already saved above, just move to next question
          moveToNextQuestion();
        }
      }
    }, 300); // Small delay for visual feedback
  };

  // Handle next for rating (with negative flow)

  // Handle emoji/smiley selection
  const handleEmojiSelect = (rating: number, emoji: string, label: string) => {
    setSelectedRating(rating);
    const currentQuestion = getCurrentQuestion();
    const isSingleQuestion = surveyData!.snag_checklist.questions_count === 1;

    // For emoji/smiley questions, check if the selected rating corresponds to a negative option
    // Map rating to option index based on API options count
    const ratingToOptionIndex = Array.from(
      { length: currentQuestion?.snag_quest_options?.length || 5 }, 
      (_, index) => ({ rating: index + 1, optionIndex: currentQuestion.snag_quest_options.length - 1 - index })
    );
    
    const selectedOptionMapping = ratingToOptionIndex.find(
      (opt) => opt.rating === rating
    );
    
    const selectedOption = selectedOptionMapping && currentQuestion?.snag_quest_options?.[selectedOptionMapping.optionIndex];
    const isNegativeEmoji = selectedOption?.option_type === "n";

    if (
      isNegativeEmoji &&
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
        // Data is already saved above, just move to next question
        moveToNextQuestion();
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
    comments?: string
  ): SurveyAnswers[number] => {
    const currentQuestion = getCurrentQuestion();
    if (!currentQuestion) return { qtype: "", value: "" };

    console.log("=== SAVE CURRENT ANSWER START ===");
    console.log("saveCurrentAnswer called with description:", comments);
    console.log("Current question ID:", currentQuestion.id);

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
        }
        // Always set description, defaulting to empty string
        answerData.comments = comments || "";
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
        }
        // Always set comments, defaulting to empty string
        answerData.comments = comments || "";
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
        // Always set comments, defaulting to empty string
        answerData.comments = comments || "";

        if (answerData.selectedTags && answerData.selectedTags.length > 0) {
          console.log(
            `[${currentQuestion.qtype} Question ${currentQuestion.id}] Saved tags:`,
            answerData.selectedTags.map((t) => t.category_name)
          );
        }
        break;
      }
      default: {
        // Handle text-based questions (input, text, description) and any other types
        answerData.value = currentQuestionValue;
        // Always set description, defaulting to empty string
        answerData.comments = comments || "";
        break;
      }
    }

    console.log("Final answerData before saving:", answerData);
    console.log("Comments in answerData:", answerData.comments);

    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [currentQuestion.id]: answerData,
      };
      console.log("Updated answers state:", newAnswers);
      return newAnswers;
    });

    return answerData;
  };

  // Handle single question submission - ARRAY FORMAT FOR RAILS BACKEND
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

      // Build issues array from selected tags
      const issues =
        currentAnswer.selectedTags?.map((tag) => tag.category_name) || [];

      // Create comprehensive payload with all available fields
      const surveyResponseItem: {
        mapping_id: string;
        question_id: number;
        issues: string[];
        option_id?: number;
        rating?: number;
        emoji?: string;
        label?: string;
        response_text?: string;
        ans_descr?: string;
        level_id?: number;
        comments?: string;
        answer_type?: string;
        answer_mode?: string;
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
            surveyResponseItem.option_id = currentAnswer.selectedOptions[0].id;
          }
          // New fields for multiple choice
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "multiple_choice";
          break;
        case "emoji":
        case "smiley":
          if (currentAnswer.rating !== undefined) {
            surveyResponseItem.rating = currentAnswer.rating;
            surveyResponseItem.level_id = currentAnswer.rating; // New field: level_id
          }
          if (currentAnswer.emoji) {
            surveyResponseItem.emoji = currentAnswer.emoji;
          }
          if (currentAnswer.label) {
            surveyResponseItem.label = currentAnswer.label;
            surveyResponseItem.ans_descr = currentAnswer.label; // New field: ans_descr
          }
          // New fields for emoji/smiley
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "emoji_selection";

          // For emoji/smiley questions, find and add option_id from API response
          if (currentAnswer.rating !== undefined) {
            // Find the corresponding option from API response based on rating
            const questionData = surveyData.snag_checklist.snag_questions.find(
              (q) => q.id === currentQuestion.id
            );
            if (questionData?.snag_quest_options) {
              // Map rating to option based on API structure
              const ratingToOptionMapping = Array.from(
                { length: questionData.snag_quest_options.length }, 
                (_, index) => ({ rating: index + 1, optionIndex: questionData.snag_quest_options.length - 1 - index })
              );
              const mapping = ratingToOptionMapping.find(
                (opt) => opt.rating === currentAnswer.rating
              );
              if (mapping && questionData.snag_quest_options[mapping.optionIndex]) {
                surveyResponseItem.option_id = questionData.snag_quest_options[mapping.optionIndex].id;
              }
            }
          }
          break;

        case "rating":
          if (currentAnswer.rating !== undefined) {
            surveyResponseItem.rating = currentAnswer.rating;
            surveyResponseItem.level_id = currentAnswer.rating; // New field: level_id
          }
          // New fields for rating
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "star_rating";
          surveyResponseItem.ans_descr = `${currentAnswer.rating} star${
            currentAnswer.rating > 1 ? "s" : ""
          }`;

          // Add option_id mapping for rating questions from API response
          if (currentAnswer.optionId) {
            // Use stored option_id from negative flow
            surveyResponseItem.option_id = currentAnswer.optionId;
          } else if (currentAnswer.rating !== undefined) {
            // Fallback to mapping for positive responses
            const questionData = surveyData.snag_checklist.snag_questions.find(
              (q) => q.id === currentQuestion.id
            );
            if (questionData?.snag_quest_options) {
              // Map rating to option based on API structure
              const ratingToOptionMapping = Array.from(
                { length: questionData.snag_quest_options.length }, 
                (_, index) => ({ rating: index + 1, optionIndex: questionData.snag_quest_options.length - 1 - index })
              );
              const mapping = ratingToOptionMapping.find(
                (opt) => opt.rating === currentAnswer.rating
              );
              if (mapping && questionData.snag_quest_options[mapping.optionIndex]) {
                surveyResponseItem.option_id = questionData.snag_quest_options[mapping.optionIndex].id;
              }
            }
          }
          break;

        case "input":
        case "text":
        case "description":
          if (currentAnswer.value && currentAnswer.value.toString().trim()) {
            surveyResponseItem.response_text = currentAnswer.value
              .toString()
              .trim();
          }
          // New fields for text-based inputs
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "text_input";
          break;
      }

      // Add individual question comment if available
      console.log("Current answer for payload building:", currentAnswer);
      console.log("Current answer comments:", currentAnswer.comments);
      if (currentAnswer.comments && currentAnswer.comments.trim()) {
        surveyResponseItem.comments = currentAnswer.comments.trim();
        console.log(
          "Setting comments in payload:",
          currentAnswer.comments.trim()
        );
      } else {
        surveyResponseItem.comments = ""; // Ensure comments field is always present
        console.log("No comments found, setting empty string");
      }

      // Create array format payload
      const payload = {
        survey_response: [surveyResponseItem],
        final_comment: {
          body: "", // Empty for single question surveys
        },
      };

      await surveyApi.submitSurveyResponse(payload);

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

  // Handle single question submission with negative data - ARRAY FORMAT FOR RAILS BACKEND
  const handleSingleQuestionSubmitWithNegativeData = async (
    answerData: SurveyAnswers[number]
  ) => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      const currentQuestion = getCurrentQuestion();
      if (!currentQuestion) return;

      // Build issues array from selected tags
      const issues =
        answerData.selectedTags?.map((tag) => tag.category_name) || [];

      // Create comprehensive payload with all available fields
      const surveyResponseItem: {
        mapping_id: string;
        question_id: number;
        issues: string[];
        option_id?: number;
        rating?: number;
        emoji?: string;
        label?: string;
        response_text?: string;
        ans_descr?: string;
        level_id?: number;
        comments?: string;
        answer_type?: string;
        answer_mode?: string;
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
            surveyResponseItem.option_id = answerData.selectedOptions[0].id;
          }
          // New fields for multiple choice
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "multiple_choice";
          break;

        case "emoji":
        case "smiley":
          if (answerData.rating !== undefined) {
            surveyResponseItem.rating = answerData.rating;
            surveyResponseItem.level_id = answerData.rating; // New field: level_id
          }
          if (answerData.emoji) {
            surveyResponseItem.emoji = answerData.emoji;
          }
          if (answerData.label) {
            surveyResponseItem.label = answerData.label;
            surveyResponseItem.ans_descr = answerData.label; // New field: ans_descr
          }
          // New fields for emoji/smiley
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "emoji_selection";

          // For emoji/smiley questions, find and add option_id from API response
          if (answerData.rating !== undefined) {
            const questionData = surveyData.snag_checklist.snag_questions.find(
              (q) => q.id === currentQuestion.id
            );
            if (questionData?.snag_quest_options) {
              // Map rating to option based on API structure
              const ratingToOptionMapping = Array.from(
                { length: questionData.snag_quest_options.length }, 
                (_, index) => ({ rating: index + 1, optionIndex: questionData.snag_quest_options.length - 1 - index })
              );
              const mapping = ratingToOptionMapping.find(
                (opt) => opt.rating === answerData.rating
              );
              if (mapping && questionData.snag_quest_options[mapping.optionIndex]) {
                surveyResponseItem.option_id = questionData.snag_quest_options[mapping.optionIndex].id;
              }
            }
          }
          break;

        case "rating":
          if (answerData.rating !== undefined) {
            surveyResponseItem.rating = answerData.rating;
            surveyResponseItem.level_id = answerData.rating; // New field: level_id
          }
          // New fields for rating
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "star_rating";
          surveyResponseItem.ans_descr = `${answerData.rating} star${
            answerData.rating > 1 ? "s" : ""
          }`;
          
          // Add option_id for rating questions
          if (answerData.optionId) {
            surveyResponseItem.option_id = answerData.optionId;
          }
          break;

        case "input":
        case "text":
        case "description":
          if (answerData.value && answerData.value.toString().trim()) {
            surveyResponseItem.response_text = answerData.value
              .toString()
              .trim();
          }
          // New fields for text-based inputs
          surveyResponseItem.answer_type = currentQuestion.qtype;
          surveyResponseItem.answer_mode = "text_input";
          break;
      }

      // Add individual question comment if available
      if (answerData.comments && answerData.comments.trim()) {
        surveyResponseItem.comments = answerData.comments.trim();
      } else {
        surveyResponseItem.comments = ""; // Ensure comments field is always present
      }

      // Create array format payload
      const payload = {
        survey_response: [surveyResponseItem],
        final_comment: {
          body: "", // Empty for single question surveys
        },
      };

      await surveyApi.submitSurveyResponse(payload);

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

    // Only save if we don't already have an answer for this question
    const existingAnswer = answers[currentQuestion.id];
    if (!existingAnswer) {
      // Save current answer with proper parameters for emoji/smiley questions
      if (
        currentQuestion.qtype === "emoji" ||
        currentQuestion.qtype === "smiley"
      ) {
        // For emoji/smiley questions, we need to find the emoji and label based on selectedRating
        if (selectedRating !== null) {
          const emojiOptions = getEmojiOptions(currentQuestion);
          const selectedOption = emojiOptions.find(
            (opt) => opt.rating === selectedRating
          );

          if (selectedOption) {
            const savedAnswer = saveCurrentAnswer(
              selectedRating,
              selectedOption.emoji,
              selectedOption.label
            );
          } else {
            console.warn(
              `[${currentQuestion.qtype}] No option found for rating:`,
              selectedRating
            );
            const savedAnswer = saveCurrentAnswer(selectedRating);
          }
        } else {
          console.warn(`[${currentQuestion.qtype}] No rating selected`);
          const savedAnswer = saveCurrentAnswer();
        }
      } else if (currentQuestion.qtype === "rating") {
        // For rating questions, save with the rating

        const savedAnswer = saveCurrentAnswer(selectedRating || undefined);
      } else {
        // For other question types, save normally

        const savedAnswer = saveCurrentAnswer();
      }
    } else {
      console.log(
        `[HandleNextQuestion] Answer already exists, skipping save:`,
        existingAnswer
      );
    }

    // Reset question-specific states
    setCurrentQuestionValue("");
    setSelectedOptions([]);
    setSelectedRating(null);
    setSelectedTags([]);
    setShowGenericTags(false);

    // Move to next question or show final comments
    if (currentQuestionIndex < surveyData!.snag_checklist.questions_count - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // All questions completed, show final comments step
      setCurrentQuestionIndex(surveyData!.snag_checklist.questions_count);
    }
  };

  // Move to next question without re-saving data (used when data is already saved)
  const moveToNextQuestion = () => {
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

  // Move to previous question
  const moveToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Reset current question states
      setCurrentQuestionValue("");
      setSelectedOptions([]);
      setSelectedRating(null);
      setSelectedTags([]);
      setShowGenericTags(false);

      // Move to previous question
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handle survey submission - ARRAY FORMAT FOR ALL QUESTIONS
  const handleSubmitSurvey = async () => {
    if (!surveyData) return;

    setIsSubmitting(true);
    try {
      console.log("=== MULTI-QUESTION SURVEY SUBMISSION ===");
      console.log("All answers in state:", answers);

      // For multi-question surveys, we need to create answers array for each question
      const allAnswers = Object.values(answers);
      console.log("All answers values:", allAnswers);

      if (allAnswers.length === 0) {
        console.error("No answers found for multi-question survey");
        throw new Error("No answers found");
      }

      // Create array of survey responses
      const surveyResponseArray = [];

      // Process each question individually since Rails backend expects array format
      for (const questionId in answers) {
        console.log(`Processing question ID: ${questionId}`);
        const answer = answers[parseInt(questionId)];
        const question = surveyData.snag_checklist.snag_questions.find(
          (q) => q.id === parseInt(questionId)
        );

        console.log(`Found question:`, question);
        console.log(`Answer for question ${questionId}:`, answer);

        if (!question || !answer) {
          console.log(
            `Skipping question ${questionId} - missing question or answer`
          );
          continue;
        }

        const issues =
          answer.selectedTags?.map((tag) => tag.category_name) || [];

        // Create comprehensive payload with all available fields for each question type
        const surveyResponseItem: {
          mapping_id: string;
          question_id: number;
          issues: string[];
          option_id?: number;
          rating?: number;
          emoji?: string;
          label?: string;
          response_text?: string;
          ans_descr?: string;
          level_id?: number;
          comments?: string;
          answer_type?: string;
          answer_mode?: string;
        } = {
          mapping_id: mappingId || "",
          question_id: question.id,
          issues: issues,
        };

        // Include additional fields based on question type and available data
        switch (question.qtype) {
          case "multiple":
            if (answer.selectedOptions && answer.selectedOptions.length > 0) {
              surveyResponseItem.option_id = answer.selectedOptions[0].id;
            }
            // New fields for multiple choice
            surveyResponseItem.answer_type = question.qtype;
            surveyResponseItem.answer_mode = "multiple_choice";
            break;

          case "emoji":
          case "smiley":
            if (answer.rating !== undefined) {
              surveyResponseItem.rating = answer.rating;
              surveyResponseItem.level_id = answer.rating; // New field: level_id
            }
            if (answer.emoji) {
              surveyResponseItem.emoji = answer.emoji;
            }
            if (answer.label) {
              surveyResponseItem.label = answer.label;
              surveyResponseItem.ans_descr = answer.label; // New field: ans_descr
            }
            // New fields for emoji/smiley
            surveyResponseItem.answer_type = question.qtype;
            surveyResponseItem.answer_mode = "emoji_selection";

            // For emoji questions, find and add option_id from API response
            if (answer.rating !== undefined) {
              if (question.snag_quest_options) {
                // Map rating to option based on API structure
                const ratingToOptionMapping = Array.from(
                  { length: question.snag_quest_options.length }, 
                  (_, index) => ({ rating: index + 1, optionIndex: question.snag_quest_options.length - 1 - index })
                );
                const mapping = ratingToOptionMapping.find(
                  (opt) => opt.rating === answer.rating
                );
                if (mapping && question.snag_quest_options[mapping.optionIndex]) {
                  surveyResponseItem.option_id = question.snag_quest_options[mapping.optionIndex].id;
                } else {
                  console.warn(
                    `[Multi-Submit ${question.qtype}] No option_id found for rating:`,
                    answer.rating
                  );
                }
              }
            }
            break;

          case "rating":
            if (answer.rating !== undefined) {
              surveyResponseItem.rating = answer.rating;
              surveyResponseItem.level_id = answer.rating; // New field: level_id
            }
            // New fields for rating
            surveyResponseItem.answer_type = question.qtype;
            surveyResponseItem.answer_mode = "star_rating";
            surveyResponseItem.ans_descr = `${answer.rating} star${
              answer.rating > 1 ? "s" : ""
            }`;

            // Add option_id mapping for rating questions from API response
            if (answer.optionId) {
              // Use stored option_id from negative flow
              surveyResponseItem.option_id = answer.optionId;
            } else if (answer.rating !== undefined) {
              // Fallback to mapping for positive responses
              if (question.snag_quest_options) {
                // Map rating to option based on API structure
                const ratingToOptionMapping = [
                  { rating: 1, optionIndex: 4 }, // 1 star (last option)
                  { rating: 2, optionIndex: 3 }, // 2 stars
                  { rating: 3, optionIndex: 2 }, // 3 stars
                  { rating: 4, optionIndex: 1 }, // 4 stars
                  { rating: 5, optionIndex: 0 }, // 5 stars (first option)
                ];
                const mapping = ratingToOptionMapping.find(
                  (opt) => opt.rating === answer.rating
                );
                if (mapping && question.snag_quest_options[mapping.optionIndex]) {
                  surveyResponseItem.option_id = question.snag_quest_options[mapping.optionIndex].id;
                } else {
                  console.warn(
                    `[Multi-Submit ${question.qtype}] No option_id found for rating:`,
                    answer.rating
                  );
                }
              }
            }
            break;

          case "input":
          case "text":
          case "description":
            if (answer.value && answer.value.toString().trim()) {
              surveyResponseItem.response_text = answer.value.toString().trim();
            }
            // New fields for text-based inputs
            surveyResponseItem.answer_type = question.qtype;
            surveyResponseItem.answer_mode = "text_input";
            break;
        }

        // Add individual question comment if available
        console.log(`[Multi-Submit] Question ${question.id} answer:`, answer);
        console.log(
          `[Multi-Submit] Question ${question.id} comments:`,
          answer.comments
        );
        if (answer.comments && answer.comments.trim()) {
          surveyResponseItem.comments = answer.comments.trim();
          console.log(
            `[Multi-Submit] Setting comments for question ${question.id}:`,
            answer.comments.trim()
          );
        } else {
          surveyResponseItem.comments = ""; // Ensure comments field is always present
          console.log(
            `[Multi-Submit] No comments for question ${question.id}, setting empty string`
          );
        }

        surveyResponseArray.push(surveyResponseItem);
      }

      // Create array format payload
      const payload = {
        survey_response: surveyResponseArray,
        final_comment: {
          body: finalDescription.trim() || "",
        },
      };

      await surveyApi.submitSurveyResponse(payload);

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

  // Get emoji options from API response
  const getEmojiOptions = (question: SurveyQuestion) => {
    if (!question.snag_quest_options || question.snag_quest_options.length === 0) {
      // Fallback to static options if no API options
      return [
        { rating: 5, emoji: "😄", label: "Amazing", optionId: 5 },
        { rating: 4, emoji: "😊", label: "Good", optionId: 4 },
        { rating: 3, emoji: "😐", label: "Okay", optionId: 3 },
        { rating: 2, emoji: "😞", label: "Bad", optionId: 2 },
        { rating: 1, emoji: "😠", label: "Terrible", optionId: 1 },
      ];
    }

    // Map API options to emoji display
    const emojiMapping = [
      { emoji: "😄", label: "Amazing" },
      { emoji: "😊", label: "Good" },
      { emoji: "😐", label: "Okay" },
      { emoji: "😞", label: "Bad" },
      { emoji: "😠", label: "Terrible" },
    ];

    return question.snag_quest_options.map((option, index) => ({
      rating: question.snag_quest_options.length - index, // Reverse order: first option = highest rating
      emoji: emojiMapping[index]?.emoji || "😐",
      label: emojiMapping[index]?.label || option.qname,
      optionId: option.id,
      option: option
    }));
  };

  // Get rating options from API response
  const getRatingOptions = (question: SurveyQuestion) => {
    if (!question.snag_quest_options || question.snag_quest_options.length === 0) {
      // Fallback to 5 stars if no API options
      return [1, 2, 3, 4, 5];
    }

    // Return array of rating numbers based on API options count
    return Array.from({ length: question.snag_quest_options.length }, (_, index) => index + 1);
  };

  // Check if survey is active
  const isSurveyActive = (): boolean => {
    if (!surveyData) return false;

    // Check if status field exists and is "Active" or if active field is true
    if (surveyData.status !== undefined) {
      return surveyData.status.toLowerCase() === "active";
    }

    if (surveyData.active !== undefined) {
      return surveyData.active === true;
    }

    // If neither field exists, assume active (backward compatibility)
    return true;
  };

  // Format location for display
  const getFormattedLocation = (): string => {
    if (!surveyData) return "";

    const locationParts = [
      surveyData.site_name,
      surveyData.building_name,
      surveyData.wing_name,
      surveyData.floor_name,
      surveyData.area_name,
      surveyData.room_name,
    ].filter((part) => part && part.trim() !== "");

    return locationParts.join(" / ");
  };

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

  // Check if survey is inactive and show appropriate message
  if (!isSurveyActive()) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header with Logo */}
        <div className="bg-gray-50 py-4 px-4 text-center">
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              {window.location.origin === "https://oig.gophygital.work" ? (
                <img
                  src="/Without bkg.svg"
                  alt="OIG Logo"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src="/gophygital-logo-min.jpg"
                  alt="Gophygital Logo"
                  className="bg-white rounded"
                  style={{
                    backgroundColor: "#fff",
                    maxWidth: "200%",
                    height: "auto",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-4 py-4 sm:px-6 sm:py-6 overflow-y-auto">
          <div className="flex flex-col items-center justify-center max-w-md mx-auto w-full min-h-full">
            <div className="text-center mb-6">
              <img
                src="/9019830 1.png"
                alt="Survey Illustration"
                className="w-60 h-60 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain mx-auto mb-6"
              />
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-black mb-4 text-center leading-tight">
              {surveyData.survey_title}
            </h1>

            <div className="w-full space-y-4 text-center">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg
                    className="w-12 h-12 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-orange-800 mb-2">
                  Not Active Survey
                </h3>

                <p className="text-sm text-orange-700 mb-4">
                  {surveyData.message || "This survey is currently inactive and not accepting responses."}
                </p>

                <div className="bg-white rounded-lg p-4 border border-orange-100">
                  <p className="text-xs text-gray-600 font-medium mb-1">
                    Location:
                  </p>
                  <p className="text-sm text-gray-800 break-words">
                    {surveyData.location || getFormattedLocation()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 py-3 px-4 text-center">
          <div className="text-xs sm:text-sm text-gray-500">
            Please contact the administrator if you believe this is an error
          </div>
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
            {window.location.origin === "https://oig.gophygital.work" ? (
              <img
                src="/Without bkg.svg"
                alt="OIG Logo"
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src="/gophygital-logo-min.jpg"
                alt="Gophygital Logo"
                className="bg-white rounded"
                style={{
                  backgroundColor: "#fff",
                  maxWidth: "200%",
                  height: "auto",
                }}
              />
            )}
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
          {/* Back button - positioned above survey title */}
          {((currentQuestion &&
            !isLastStep &&
            currentQuestionIndex > 0 &&
            !showGenericTags) ||
            (isLastStep && isMultiQuestion)) && (
            <div className="w-full flex justify-start mb-4">
              <button
                onClick={moveToPreviousQuestion}
                className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            </div>
          )}

          <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-black mb-4 text-center leading-tight">
            {surveyData.survey_title}
          </h1>

          {/* Show image only on first question or single question surveys */}
          {!showGenericTags && (
            <div className="text-center mb-6">
              <img
                src={
                  surveyData?.snag_checklist?.snag_attach || "/9019830 1.png"
                }
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
              {!showGenericTags && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-black mb-2 leading-tight">
                    {currentQuestion.descr}
                  </h3>
                </div>
              )}

              <div className="space-y-4">
                {/* Multiple Choice Question */}
                {currentQuestion.qtype === "multiple" && !showGenericTags && (
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
                        : "Continue"}
                    </button>
                  </>
                )}

                {/* Rating Question */}
                {currentQuestion.qtype === "rating" && !showGenericTags && (
                  <>
                    <div className="flex justify-center items-center space-x-2 sm:space-x-3 mt-20">
                      {getRatingOptions(currentQuestion).map((rating) => (
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
                  </>
                )}

                {/* Emoji/Smiley Question */}
                {(currentQuestion.qtype === "emoji" ||
                  currentQuestion.qtype === "smiley") &&
                  !showGenericTags && (
                    <div className="w-full mt-16">
                      <div className={`grid gap-3 px-2 ${getEmojiOptions(currentQuestion).length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
                        {getEmojiOptions(currentQuestion).map((option) => (
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

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Comments (Optional)
                      </label>
                      <textarea
                        value={getCurrentNegativeComments()}
                        onChange={(e) =>
                          setCurrentNegativeComments(e.target.value)
                        }
                        placeholder="Please describe any specific issues or suggestions..."
                        className="w-full h-20 sm:h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={isSubmitting}
                      />
                    </div>

                    <button
                      onClick={async () => {
                        const isSingleQuestion =
                          surveyData!.snag_checklist.questions_count === 1;

                        // Save answer with tags and description, then proceed
                        let answerData;
                        const currentComments = getCurrentNegativeComments();

                        if (
                          (pendingNegativeType === "emoji" ||
                            pendingNegativeType === "smiley") &&
                          typeof pendingNegativeAnswer === "object" &&
                          pendingNegativeAnswer !== null &&
                          "rating" in pendingNegativeAnswer &&
                          "emoji" in pendingNegativeAnswer
                        ) {
                          // Type guard for emoji/smiley objects
                          const emojiAnswer = pendingNegativeAnswer as { rating: number; emoji: string; label: string };
                          answerData = saveCurrentAnswer(
                            emojiAnswer.rating,
                            emojiAnswer.emoji,
                            emojiAnswer.label,
                            selectedTags,
                            currentComments
                          );
                        } else if (pendingNegativeType === "multiple") {
                          answerData = saveCurrentAnswer(
                            undefined,
                            undefined,
                            undefined,
                            selectedTags,
                            currentComments
                          );
                        } else if (
                          pendingNegativeType === "rating" &&
                          pendingNegativeAnswer &&
                          typeof pendingNegativeAnswer === "object" &&
                          "rating" in pendingNegativeAnswer &&
                          "option" in pendingNegativeAnswer
                        ) {
                          answerData = saveCurrentAnswer(
                            pendingNegativeAnswer.rating,
                            undefined,
                            undefined,
                            selectedTags,
                            currentComments
                          );
                          // Store the option_id for later use in submission
                          if (answerData) {
                            answerData.optionId = pendingNegativeAnswer.option.id;
                          }
                        }

                        // Reset states immediately
                        setShowGenericTags(false);
                        setSelectedTags([]);
                        setCurrentNegativeComments(""); // Reset only current question's comments
                        setPendingNegativeType(null);
                        setPendingNegativeAnswer(null);

                        // For single question negative responses, submit with complete data
                        if (isSingleQuestion && answerData) {
                          handleSingleQuestionSubmitWithNegativeData(
                            answerData
                          );
                        } else {
                          // For multi-question surveys, proceed to next question
                          // Use moveToNextQuestion to avoid re-saving the answer
                          moveToNextQuestion();
                        }
                      }}
                      disabled={
                        selectedTags.length === 0 &&
                        !getCurrentNegativeComments().trim()
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
                        setCurrentNegativeComments(""); // Reset only current question's comments
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
