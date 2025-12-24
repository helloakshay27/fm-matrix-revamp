import React from "react";

interface EmojiOption {
    rating: number;
    emoji: string;
    label: string;
    optionId: number;
}

interface EmojiRatingQuestionProps {
    emojiOptions: EmojiOption[];
    selectedRating: number | null;
    onEmojiSelect: (rating: number, emoji: string, label: string) => void;
}

export const EmojiRatingQuestion: React.FC<EmojiRatingQuestionProps> = ({
    emojiOptions,
    selectedRating,
    onEmojiSelect,
}) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center gap-3 sm:gap-4 bg-black/60 rounded-[0.20rem]">
                {emojiOptions.map((option) => (
                    <button
                        type="button"
                        key={option.rating}
                        onClick={() =>
                            onEmojiSelect(option.rating, option.emoji, option.label)
                        }
                        className={`flex flex-col rounded-[0.20rem] items-center justify-center p-2 sm:p-3 transition-all flex-1 min-w-0 ${selectedRating === option.rating
                                ? "bg-blue-500/40 border-2 border-blue-400 shadow-md"
                                : "hover:bg-white/10 border-2 border-transparent"
                            }`}
                    >
                        <span className="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">
                            {option.emoji}
                        </span>
                        <span className="text-xs sm:text-sm text-white/90 text-center leading-tight break-words font-medium">
                            {option.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
