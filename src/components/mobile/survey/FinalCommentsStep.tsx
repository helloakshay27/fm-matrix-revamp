import React from "react";

interface FinalCommentsStepProps {
    finalDescription: string;
    onDescriptionChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
}

export const FinalCommentsStep: React.FC<FinalCommentsStepProps> = ({
    finalDescription,
    onDescriptionChange,
    onSubmit,
    isSubmitting,
}) => {
    return (
        <div className="w-full space-y-4">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white/100 mb-2">
                    Any additional comments?
                </h3>
                <p className="text-sm text-white/90">
                    Share any additional feedback or suggestions (optional)
                </p>
            </div>
            <div>
                <textarea
                    value={finalDescription}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Please share your thoughts..."
                    className="w-full h-24 sm:h-32 p-3 sm:p-4 border border-gray-300 rounded-[0.20rem] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    disabled={isSubmitting}
                />
            </div>

            <button
                type="button"
                onClick={onSubmit}
                disabled={isSubmitting}
                className="w-full bg-black/90 hover:bg-black/100 disabled:bg-black/50 text-white py-3 px-4 rounded[0.20rem] font-medium transition-colors disabled:cursor-not-allowed"
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
    );
};
