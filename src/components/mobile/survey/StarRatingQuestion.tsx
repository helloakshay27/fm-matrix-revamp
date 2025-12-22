import React from "react";

interface StarRatingQuestionProps {
    ratingOptions: number[];
    selectedRating: number | null;
    onRatingSelect: (rating: number) => void;
}

export const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
    ratingOptions,
    selectedRating,
    onRatingSelect,
}) => {
    return (
        <>
            <div className="flex justify-center items-center space-x-2 sm:space-x-3">
                {ratingOptions.map((rating) => (
                    <button
                        type="button"
                        key={rating}
                        onClick={() => onRatingSelect(rating)}
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full transition-all ${selectedRating !== null && rating <= selectedRating
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
    );
};
