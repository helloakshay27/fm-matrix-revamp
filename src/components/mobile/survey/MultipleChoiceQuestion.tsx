import React from "react";
import { SurveyOption } from "./types";

interface MultipleChoiceQuestionProps {
    options: SurveyOption[];
    selectedOptions: SurveyOption[];
    onOptionSelect: (option: SurveyOption) => void;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
    options,
    selectedOptions,
    onOptionSelect,
}) => {
    return (
        <div className="space-y-4">
            {options.map((option) => (
                <button
                    type="button"
                    key={option.id}
                    onClick={() => onOptionSelect(option)}
                    className={`w-full p-3 sm:p-4 rounded-[0.20rem] border-2 text-left transition-all ${selectedOptions.some((opt) => opt.id === option.id)
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white hover:border-black/30"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="font-medium text-sm sm:text-base">
                            {option.qname}
                        </span>
                        {selectedOptions.some((opt) => opt.id === option.id) && (
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
    );
};
