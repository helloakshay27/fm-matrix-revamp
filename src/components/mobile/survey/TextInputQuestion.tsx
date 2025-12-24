import React from "react";

interface TextInputQuestionProps {
    questionType: "input" | "input_box" | "text" | "description";
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isValid: boolean;
    isSingleQuestion: boolean;
}

export const TextInputQuestion: React.FC<TextInputQuestionProps> = ({
    questionType,
    value,
    onChange,
    onSubmit,
    isValid,
    isSingleQuestion,
}) => {
    const getPlaceholder = () => {
        switch (questionType) {
            case "input":
                return "Enter your answer...";
            case "input_box":
                return "Enter your response...";
            case "text":
                return "Please enter your comments...";
            case "description":
                return "Enter your description...";
            default:
                return "Enter your answer...";
        }
    };

    return (
        <>
            <div className="mt-14">
                {questionType === "input" || questionType === "input_box" ? (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                ) : (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={getPlaceholder()}
                        className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                )}
            </div>

            <button
                type="button"
                onClick={onSubmit}
                disabled={!isValid}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
                {isSingleQuestion ? "Submit Survey" : "Continue"}
            </button>
        </>
    );
};
