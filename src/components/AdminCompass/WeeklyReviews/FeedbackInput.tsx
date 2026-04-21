import { Star, Send } from 'lucide-react';

interface FeedbackInputProps {
    userId: number;
    feedbackText: string;
    score: number;
    isLoading: boolean;
    onFeedbackChange: (text: string) => void;
    onScoreChange: (score: number) => void;
    onSubmit: () => void;
}

export const FeedbackInput = ({
    userId,
    feedbackText,
    score,
    isLoading,
    onFeedbackChange,
    onScoreChange,
    onSubmit,
}: FeedbackInputProps) => {
    return (
        <div className="flex-[1.5] flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden h-10 shadow-sm px-3">
            <input
                type="text"
                placeholder="Feedback..."
                value={feedbackText}
                onChange={(e) => onFeedbackChange(e.target.value)}
                className="flex-1 text-xs h-full focus:outline-none placeholder:text-gray-400"
            />
            <div className="flex items-center gap-0.5 px-2 border-r border-gray-100 h-6 mr-2">
                {[1, 2, 3, 4, 5].map((star) => {
                    return (
                        <button
                            key={star}
                            onClick={() => onScoreChange(star)}
                            className="cursor-pointer transition-transform hover:scale-110"
                            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                            <Star
                                className={`w-3.5 h-3.5 ${star <= score ? 'fill-yellow-400 text-yellow-400' : 'text-yellow-100'
                                    }`}
                            />
                        </button>
                    );
                })}
            </div>
            <button
                onClick={onSubmit}
                disabled={isLoading}
                className="w-7 h-7 flex items-center justify-center bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};
