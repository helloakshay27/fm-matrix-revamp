import React from "react";
import { SurveyQuestion, SurveyOption, SurveyAnswers } from "./types";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { StarRatingQuestion } from "./StarRatingQuestion";
import { EmojiRatingQuestion } from "./EmojiRatingQuestion";
import { getEmojiOptions, getRatingOptions } from "./surveyUtils";

interface FormViewAllQuestionsProps {
    questions: SurveyQuestion[];
    answers: SurveyAnswers;
    onAnswerChange: (questionId: number, answerData: any) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    finalComment: string;
    onFinalCommentChange: (comment: string) => void;
}

export const FormViewAllQuestions: React.FC<FormViewAllQuestionsProps> = ({
    questions,
    answers,
    onAnswerChange,
    onSubmit,
    isSubmitting,
    finalComment,
    onFinalCommentChange,
}) => {
    const handleMultipleChoice = (questionId: number, option: SurveyOption) => {
        onAnswerChange(questionId, {
            qtype: "multiple",
            value: option.qname,
            selectedOptions: [option],
            comments: "",
        });
    };

    const handleRatingSelect = (questionId: number, rating: number, question: SurveyQuestion) => {
        onAnswerChange(questionId, {
            qtype: "rating",
            rating: rating,
            value: rating,
            comments: "",
        });
    };

    const handleEmojiSelect = (
        questionId: number,
        rating: number,
        emoji: string,
        label: string
    ) => {
        onAnswerChange(questionId, {
            qtype: "emoji",
            rating: rating,
            emoji: emoji,
            label: label,
            value: `${emoji} ${label}`,
            comments: "",
        });
    };

    const handleTextChange = (questionId: number, value: string, qtype: string) => {
        onAnswerChange(questionId, {
            qtype: qtype,
            value: value,
            comments: "",
        });
    };

    const isFormValid = () => {
        // Check if all mandatory questions are answered
        return questions.every((question) => {
            if (!question.quest_mandatory) return true;
            const answer = answers[question.id];
            if (!answer) return false;

            switch (question.qtype) {
                case "multiple":
                    return answer.selectedOptions && answer.selectedOptions.length > 0;
                case "input":
                case "input_box":
                case "text":
                case "description":
                    return answer.value && answer.value.toString().trim() !== "";
                case "rating":
                case "emoji":
                case "smiley":
                    return answer.rating !== null && answer.rating !== undefined;
                default:
                    return true;
            }
        });
    };

    return (
        <div className="w-full space-y-6">
            {questions.map((question, index) => {
                const answer = answers[question.id];

                return (
                    <div
                        key={question.id}
                        className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md"
                    >
                        {/* Question Header */}
                        <div className="mb-4">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-semibold text-gray-800 flex-1">
                                    {index + 1}. {question.descr}
                                    {question.quest_mandatory && (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                </h3>
                            </div>
                        </div>

                        {/* Question Content */}
                        <div className="space-y-3">
                            {/* Multiple Choice */}
                            {question.qtype === "multiple" && (
                                <MultipleChoiceQuestion
                                    options={question.snag_quest_options}
                                    selectedOptions={answer?.selectedOptions || []}
                                    onOptionSelect={(option) => handleMultipleChoice(question.id, option)}
                                />
                            )}

                            {/* Rating */}
                            {question.qtype === "rating" && (
                                <StarRatingQuestion
                                    ratingOptions={getRatingOptions(question)}
                                    selectedRating={answer?.rating ?? null}
                                    onRatingSelect={(rating) => handleRatingSelect(question.id, rating, question)}
                                />
                            )}

                            {/* Emoji/Smiley */}
                            {(question.qtype === "emoji" || question.qtype === "smiley") && (
                                <EmojiRatingQuestion
                                    emojiOptions={getEmojiOptions(question)}
                                    selectedRating={answer?.rating ?? null}
                                    onEmojiSelect={(rating, emoji, label) =>
                                        handleEmojiSelect(question.id, rating, emoji, label)
                                    }
                                />
                            )}

                            {/* Input */}
                            {question.qtype === "input" && (
                                <input
                                    type="text"
                                    value={answer?.value?.toString() || ""}
                                    onChange={(e) => handleTextChange(question.id, e.target.value, "input")}
                                    placeholder="Enter your answer..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            )}

                            {/* Input Box - New Type */}
                            {question.qtype === "input_box" && (
                                <input
                                    type="text"
                                    value={answer?.value?.toString() || ""}
                                    onChange={(e) => handleTextChange(question.id, e.target.value, "input_box")}
                                    placeholder="Enter your response..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            )}

                            {/* Text */}
                            {question.qtype === "text" && (
                                <textarea
                                    value={answer?.value?.toString() || ""}
                                    onChange={(e) => handleTextChange(question.id, e.target.value, "text")}
                                    placeholder="Please enter your comments..."
                                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            )}

                            {/* Description */}
                            {question.qtype === "description" && (
                                <textarea
                                    value={answer?.value?.toString() || ""}
                                    onChange={(e) =>
                                        handleTextChange(question.id, e.target.value, "description")
                                    }
                                    placeholder="Enter your description..."
                                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Final Comments Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-md">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Additional Comments (Optional)
                    </h3>
                    <p className="text-sm text-gray-600">
                        Share any additional feedback or suggestions
                    </p>
                </div>
                <textarea
                    value={finalComment}
                    onChange={(e) => onFinalCommentChange(e.target.value)}
                    placeholder="Please share your thoughts..."
                    className="w-full h-24 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={!isFormValid() || isSubmitting}
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
        </div>
    );
};
