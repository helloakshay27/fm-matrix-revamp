import React from "react";
import { GenericTag } from "./types";

interface GenericTagsSelectorProps {
    tags: GenericTag[];
    selectedTags: GenericTag[];
    onTagClick: (tag: GenericTag) => void;
    comments: string;
    onCommentsChange: (value: string) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isSingleQuestion: boolean;
    currentQuestionIndex: number;
    totalQuestions: number;
}

export const GenericTagsSelector: React.FC<GenericTagsSelectorProps> = ({
    tags,
    selectedTags,
    onTagClick,
    comments,
    onCommentsChange,
    onSubmit,
    isSubmitting,
    isSingleQuestion,
    currentQuestionIndex,
    totalQuestions,
}) => {
    return (
        <>
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-1.5 xs:p-2 sm:p-3 shadow-lg relative">
                {/* Grid Layout - 2x2 for first 4, then repeat */}
                <div className="overflow-x-auto pb-1.5 xs:pb-2 -mx-1 sm:-mx-0">
                    {(() => {
                        const itemsPerPage = 4;
                        // Split tags into pages of 4 items each
                        const pages = Array.from(
                            { length: Math.ceil(tags.length / itemsPerPage) },
                            (_, pageIdx) =>
                                tags.slice(
                                    pageIdx * itemsPerPage,
                                    (pageIdx + 1) * itemsPerPage
                                )
                        );
                        return (
                            <div className="flex flex-row gap-1.5 xs:gap-2 sm:gap-3 px-0.5 xs:px-1 sm:px-0">
                                {pages.map((pageTags, pageIdx) => (
                                    <div
                                        key={pageIdx}
                                        className="flex flex-col gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0 w-full"
                                    >
                                        {/* First row: items 0,1 */}
                                        <div className="flex flex-row gap-1.5 xs:gap-2 sm:gap-3">
                                            {[0, 1].map((slotIdx) => {
                                                const tag = pageTags[slotIdx];
                                                return tag ? (
                                                    <button
                                                        type="button"
                                                        key={tag.id}
                                                        onClick={() => onTagClick(tag)}
                                                        className={`flex-1 flex flex-col items-center justify-center p-1 xs:p-1.5 sm:p-2 rounded-[0.20rem] text-center transition-all border-2 ${selectedTags.some(
                                                            (selectedTag) => selectedTag.id === tag.id
                                                        )
                                                                ? "border-blue-500 bg-gray-300"
                                                                : "border-white/5"
                                                            }`}
                                                    >
                                                        <div
                                                            className="w-[80%] xs:w-[85%] sm:w-full mb-0.5 xs:mb-0.5 sm:mb-1"
                                                            style={{ aspectRatio: "16/9" }}
                                                        >
                                                            {tag.icons && tag.icons.length > 0 ? (
                                                                <img
                                                                    src={tag.icons[0].url}
                                                                    alt={tag.category_name}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                                    <span className="text-sm xs:text-base sm:text-xl">
                                                                        🏷️
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-700 leading-tight break-words w-full px-0.5">
                                                            {tag.category_name}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <div
                                                        key={`empty-row1-${pageIdx}-${slotIdx}`}
                                                        className="flex-1"
                                                    />
                                                );
                                            })}
                                        </div>
                                        {/* Second row: items 2,3 */}
                                        <div className="flex flex-row gap-1.5 xs:gap-2 sm:gap-3">
                                            {[2, 3].map((slotIdx) => {
                                                const tag = pageTags[slotIdx];
                                                return tag ? (
                                                    <button
                                                        type="button"
                                                        key={tag.id}
                                                        onClick={() => onTagClick(tag)}
                                                        className={`flex-1 flex flex-col items-center justify-center p-1 xs:p-1.5 sm:p-2 rounded-[0.20rem] text-center transition-all border-2 ${selectedTags.some(
                                                            (selectedTag) => selectedTag.id === tag.id
                                                        )
                                                                ? "border-blue-500 bg-gray-300"
                                                                : "border-white/5"
                                                            }`}
                                                    >
                                                        <div
                                                            className="w-[80%] xs:w-[85%] sm:w-full mb-0.5 xs:mb-0.5 sm:mb-1"
                                                            style={{ aspectRatio: "16/9" }}
                                                        >
                                                            {tag.icons && tag.icons.length > 0 ? (
                                                                <img
                                                                    src={tag.icons[0].url}
                                                                    alt={tag.category_name}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                                    <span className="text-sm xs:text-base sm:text-xl">
                                                                        🏷️
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-gray-700 leading-tight break-words w-full px-0.5">
                                                            {tag.category_name}
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <div
                                                        key={`empty-row2-${pageIdx}-${slotIdx}`}
                                                        className="flex-1"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Description Field */}
            <div>
                <label className="block text-[9px] xs:text-[10px] sm:text-xs font-medium text-white/90 mb-1 xs:mb-1 sm:mb-2">
                    Comments (Optional)
                </label>
                <textarea
                    value={comments}
                    onChange={(e) => onCommentsChange(e.target.value)}
                    placeholder="Please describe any specific issues or suggestions..."
                    className="w-full h-12 xs:h-14 sm:h-16 p-1.5 xs:p-2 border border-blue-300 rounded-[0.20rem] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-[9px] xs:text-[10px] sm:text-xs"
                    disabled={isSubmitting}
                />
            </div>

            <button
                type="button"
                onClick={onSubmit}
                disabled={selectedTags.length === 0 && !comments.trim()}
                className="w-full bg-black/90 hover:bg-black/100 disabled:bg-black/50 text-white/100 py-2 xs:py-2.5 px-3 xs:px-4 rounded-lg text-xs xs:text-sm font-medium transition-colors disabled:cursor-not-allowed"
            >
                {isSubmitting ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3.5 xs:h-4 w-3.5 xs:w-4 border-b-2 border-white mr-2"></div>
                        <span className="text-xs xs:text-sm">Submitting...</span>
                    </div>
                ) : isSingleQuestion ? (
                    "Submit Survey"
                ) : currentQuestionIndex < totalQuestions - 1 ? (
                    "Next Question"
                ) : (
                    "Continue"
                )}
            </button>
        </>
    );
};
