import React from "react";

interface ProgressBarProps {
    currentQuestionIndex: number;
    totalQuestions: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentQuestionIndex,
    totalQuestions,
}) => {
    const getProgressPercentage = (): number => {
        if (currentQuestionIndex >= totalQuestions) {
            return 100;
        }
        return Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
    };

    return (
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
            />
        </div>
    );
};
